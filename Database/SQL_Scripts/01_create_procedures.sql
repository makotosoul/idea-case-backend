use casedb;

/* PROCEDURES */


/* space allocation*/
DELIMITER //

CREATE PROCEDURE allocateSpace(allocRouId INT, subId INT, logId INT) 
BEGIN
	DECLARE spaceTo INTEGER DEFAULT NULL;
	DECLARE i INTEGER DEFAULT 0; -- loop index
	DECLARE sessions INTEGER DEFAULT 0; -- Total session amount = groupCount * sessionCount
	DECLARE allocated INTEGER DEFAULT 0; -- How many sessions added to AllocSpace
	DECLARE sessionSeconds INTEGER DEFAULT 0; -- How many seconds each session lasts
	DECLARE suitableSpaces BOOLEAN DEFAULT TRUE; -- If can't allocate set false
	DECLARE loopOn BOOLEAN DEFAULT TRUE; -- while loop condition

	SET sessions := (SELECT groupCount * sessionCount FROM Subject WHERE id = subId); -- total amount of sessions in subject
   	SET allocated := 0; -- How many sessions allocated
   	SET sessionSeconds := (SELECT TIME_TO_SEC(sessionLength) FROM Subject WHERE id = subId); -- Session length in seconds
	
	SET spaceTo := ( -- to check if subject can be allocated
        	SELECT ass.spaceId FROM AllocSubjectSuitableSpace ass
        	WHERE ass.missingItems = 0 AND ass.subjectId = subId AND ass.allocRound = allocRouId 
 			LIMIT 1);
 		
	IF spaceTo IS NULL THEN -- If can't find suitable spaces
		SET suitableSpaces := FALSE;
   	ELSE -- Find for each session space with free time
   		SET i := 0;
   		WHILE loopOn DO -- Try add all sessions to the space	
   			SET spaceTo := (SELECT sp.id FROM AllocSubjectSuitableSpace ass
							LEFT JOIN Space sp ON ass.spaceId = sp.id
							WHERE ass.subjectId = subId AND ass.missingItems = 0 AND ass.allocRound = allocRouId
							GROUP BY sp.id
							HAVING 
							((SELECT TIME_TO_SEC(TIMEDIFF(availableTo, availableFrom)) *5 FROM Space WHERE id = sp.id) - 
								(SELECT IFNULL(SUM(TIME_TO_SEC(totalTime)), 0) FROM AllocSpace WHERE allocRound = allocRouId AND spaceId = sp.id)
								>
								(sessionSeconds * (sessions - i - allocated)))
							ORDER BY sp.personLimit ASC, sp.area ASC
							LIMIT 1);
			
			IF spaceTo IS NULL THEN -- If can't find space with freetime for specific amount sessions
				SET i := i+1;
				IF i = sessions - allocated THEN -- If checked all 
					SET loopOn = FALSE;
				END IF;
			ELSE -- if can find space with freetime for specific amount sessions
			INSERT INTO AllocSpace
					(subjectId, allocRound, spaceId, totalTime) 
				VALUES 
					(subId, allocRouId, spaceTo, SEC_TO_TIME((sessionSeconds * (sessions - i - allocated))))
				ON DUPLICATE KEY UPDATE totalTime = ADDTIME(totalTime, (SEC_TO_TIME(sessionSeconds * (sessions - i - allocated))));
				-- LOG HERE
				CALL LogAllocation(logId, "Space-allocation", "OK", CONCAT("Subject : ", subId, " - Allocate ", sessions - i - allocated, " of ", sessions, " sessions to space: ", spaceTo));
				SET allocated := allocated + (sessions - i - allocated);
				SET i := 0;
				IF allocated = sessions THEN
					SET loopOn = FALSE;
				END IF;
			END IF;
   		END WHILE;
   END IF;
   
   IF sessions = allocated THEN -- If all sessions allocated
   	UPDATE AllocSubject SET isAllocated = 1 WHERE subjectId = subId AND allocRound = allocRouId;
   ELSEIF suitableSpaces = FALSE THEN -- if can't find any suitable space for the subject
   	UPDATE AllocSubject SET cantAllocate = 1 WHERE subjectId = subId AND allocRound = allocRouId;
   	-- LOG HERE
    CALL LogAllocation(logId, "Space-allocation", "Warning", CONCAT("Subject : ", subId, " - Can't find suitable spaces" ));
   ELSEIF allocated = 0 AND suitableSpaces = TRUE THEN -- if can't find any space with free time, add all sessions to same space with most freetime
   		SET spaceTo := (
   			SELECT alpa.spaceId
			FROM AllocSubjectSuitableSpace alpa
			LEFT JOIN Space spa ON alpa.spaceId = spa.id
			WHERE alpa.subjectId = subId
			AND alpa.missingItems = 0
			AND alpa.allocRound = allocRouId
			GROUP BY alpa.spaceId 
			ORDER BY ((TIME_TO_SEC(TIMEDIFF(spa.availableTO, spa.availableFrom)) *5) - 
			(SELECT IFNULL((SUM(TIME_TO_SEC(totalTime))), 0) FROM AllocSpace WHERE allocRound = allocRouId AND spaceId = alpa.spaceId)) DESC
			LIMIT 1
		);		
   		INSERT INTO AllocSpace (subjectId, allocRound, spaceId, totalTime) 
   			VALUES (subId, allocRouId, spaceTo, SEC_TO_TIME(sessionSeconds * sessions)); 
   		UPDATE AllocSubject SET isAllocated = 1 WHERE subjectId = subId AND allocRound = allocRouId;
   		-- LOG HERE
		CALL LogAllocation(logId, "Space-allocation", "Warning", CONCAT("Subject : ", subId, " - Allocate ", sessions, " of ", sessions, " sessions to space: ", spaceTo, " - All suitable spaces are full."));
   	 
   	ELSEIF allocated < sessions AND suitableSpaces = TRUE THEN -- if there is free time for some of the sessions but not all, add rest to same space than others
   		SET spaceTo := (SELECT spaceId FROM AllocSpace WHERE subjectId = subId AND allocRound = allocRouId ORDER BY totalTime ASC LIMIT 1);
		
		UPDATE AllocSpace SET totalTime=ADDTIME(totalTime,(SEC_TO_TIME(sessionSeconds * (sessions - allocated))))
		WHERE subjectId=subID AND spaceId = spaceTO AND allocRound = allocRouId;
		UPDATE AllocSubject SET isAllocated = 1 WHERE subjectId = subId AND allocRound = allocRouId;
		-- LOG HERE
		CALL LogAllocation(logId, "Space-allocation", "Warning", CONCAT("Subject : ", subId, " - Add ", sessions - allocated, " to space: ", spaceTo, " - All suitable spaces are full"));
   	END IF;
END; //

DELIMITER ;

/* --- Procedure: PRIORITIZE SUBJECTS -  ALLOCATION --- */

DELIMITER //
CREATE OR REPLACE PROCEDURE prioritizeSubjects(allocRoundId INT, priority_option INT, logId INT)
BEGIN 
	DECLARE priorityNow INTEGER;

	SET priorityNow = (SELECT IFNULL(MAX(priority),0) FROM AllocSubject WHERE allocRound = allocRoundId);

	IF priority_option = 1 THEN -- subject_equipment.priority >= X
		INSERT INTO AllocSubject (subjectId, allocRound, priority)
			SELECT allSub.subjectId, allSub.allocRound, ROW_NUMBER() OVER (ORDER BY MAX(sub_eqp.priority) DESC, Subject.groupSize ASC) + priorityNow as "row"
    		FROM AllocSubject allSub 
    		LEFT JOIN SubjectEquipment sub_eqp ON allSub.subjectId = sub_eqp.subjectId
    		JOIN Subject ON allSub.subjectId = Subject.id
    		WHERE allSub.allocRound = allocRoundId AND allSub.priority IS NULL
    		AND (sub_eqp.priority) >= (SELECT numberValue FROM GlobalSetting gs WHERE name="x")
    		GROUP BY allSub.subjectId 
		ON DUPLICATE KEY UPDATE priority = VALUES(priority);
	ELSEIF priority_option = 2 THEN -- subject_equipment.priority < X
		INSERT INTO AllocSubject (subjectId, allocRound, priority)
			SELECT allSub.subjectId, allSub.allocRound, ROW_NUMBER() OVER (ORDER BY MAX(sub_eqp.priority) DESC, Subject.groupSize ASC) + priorityNow as "row"
       		FROM AllocSubject allSub 
        	LEFT JOIN SubjectEquipment sub_eqp ON allSub.subjectId = sub_eqp.subjectId
        	JOIN Subject ON allSub.subjectId = Subject.id
        	WHERE allSub.allocRound = allocRoundId
        	AND allSub.priority IS NULL
        	AND (sub_eqp.priority) < (SELECT numberValue FROM GlobalSetting gs WHERE name="x")
        	GROUP BY allSub.subjectId 
        	ORDER BY sub_eqp.priority DESC
        ON DUPLICATE KEY UPDATE priority = VALUES(priority);
    ELSEIF priority_option = 3 THEN -- all others (subjects without equipment)
    	INSERT INTO AllocSubject (subjectId, allocRound, priority)
    		SELECT AllocSubject.subjectId, AllocSubject.allocRound, ROW_NUMBER() OVER (ORDER BY Subject.groupSize ASC) + priorityNow as "row" 
			FROM AllocSubject
			LEFT JOIN Subject ON AllocSubject.subjectId = Subject.id
			WHERE priority IS NULL
			AND allocRound = allocRoundId
		ON DUPLICATE KEY UPDATE priority = VALUES(priority);
	END IF;

	CALL LogAllocation(logId, "Prioritization", "OK", CONCAT("Priority option: ", priority_option, " completed."));

END; //

DELIMITER ;

/* --- Procedure: RESET ALLOCATION --- */
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS  resetAllocation(allocR INTEGER)
BEGIN
	
	-- Handler for the error
	DECLARE processBusy CONDITION FOR SQLSTATE '50000';
	DECLARE EXIT HANDLER FOR processBusy
	BEGIN
		GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
		SET @full_error = CONCAT("Error: ", @errno, " (", @sqlstate, "): ", @text);
		RESIGNAL SET MESSAGE_TEXT = @full_error;
	END;
	-- Raise error if allocation in progress.
	SET @procedure_active = (SELECT processOn FROM AllocRound WHERE id = allocR);
	IF @procedure_active = 1 THEN
		SET @message_text = CONCAT("The allocation with allocRound:", allocR, " is currently in progress.");
		SIGNAL processBusy SET MESSAGE_TEXT = @message_text, MYSQL_ERRNO = 1192;
	END IF;
	
	-- Delete all allocation data and reset variables
	DELETE FROM AllocSpace WHERE allocRound = allocR;
	DELETE FROM AllocSubjectSuitableSpace WHERE allocRound = allocR;
    IF (allocR = 10004) THEN
        DELETE FROM AllocSubject WHERE allocRound = 10004;
    ELSE 
	    UPDATE AllocSubject SET isAllocated = 0, priority = null, cantAllocate = 0 WHERE allocRound = allocR;
    END IF;
    UPDATE AllocRound SET isAllocated = 0, requireReset = FALSE WHERE id = allocR;
END; //

DELIMITER ;


/* --- Procedure: START ALLOCATION --- */
DELIMITER //

CREATE OR REPLACE PROCEDURE startAllocation(allocRouId INT)
BEGIN
	DECLARE finished INTEGER DEFAULT 0; -- Marker for loop
	DECLARE subId	INTEGER DEFAULT 0; -- SubjectId
	DECLARE logId	INTEGER DEFAULT NULL;
	DECLARE errors	INTEGER DEFAULT 0;
	DECLARE debug	INTEGER DEFAULT 0;
	DECLARE abort_round	BOOLEAN DEFAULT FALSE;
	DECLARE reset_required	BOOLEAN DEFAULT FALSE;
	DECLARE procedure_active	BOOLEAN DEFAULT FALSE;

	-- Error Handling declarations
    DECLARE processBusy CONDITION FOR SQLSTATE '50000';
    DECLARE alreadyAllocated CONDITION FOR SQLSTATE '50001';
	DECLARE abortAllocation	CONDITION FOR SQLSTATE '50002';
	DECLARE require_reset	CONDITION FOR SQLSTATE '50003';   

	-- Cursor for subject loop / SELECT priority order 
	DECLARE subjects CURSOR FOR 
		SELECT allSub.subjectId 
       	FROM AllocSubject allSub 
        WHERE allSub.allocRound = allocRouId 
        ORDER BY priority ASC;
              
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = 1;
	
	-- IF Procedure already running, is already allocated, or user tell to abort the process
	DECLARE EXIT HANDLER FOR processBusy, alreadyAllocated, abortAllocation, require_reset
	BEGIN
		GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
		SET @full_error = CONCAT("Error: ", @errno, " (", @sqlstate, "): ", @text);
		CALL LogAllocation(logId, "Allocation", "Error", (SELECT @full_error));
		UPDATE AllocRound SET abortProcess = 0, processOn = 0 WHERE id = allocRouId;	
		RESIGNAL SET MESSAGE_TEXT = @full_error;
	END;
	
	-- IF ANY ERROR HAPPEN INSERT IT TO DEBUG LOG
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
		BEGIN
			SET errors := errors +1;
			GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
			SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
			CALL LogAllocation(logId, "Allocation", "Error", (SELECT @full_error));
		END;
	
	-- IF debug mode on, start logging.
	SET debug := (SELECT numberValue FROM GlobalSetting WHERE name='allocation-debug');
	IF debug = 1 THEN
		INSERT INTO log_list(log_type) VALUES (1); -- START LOG
		SET logId := (SELECT LAST_INSERT_ID()); -- SET log id number for the list
	END IF;

	CALL LogAllocation(logId, "Allocation", "Start", CONCAT("Start allocation. AllocRound: ", allocRouId));

	-- IF allocRound already allocated raise error
	SET @is_allocated = (SELECT isAllocated FROM AllocRound WHERE id = allocRouId);
	IF @is_allocated = 1 THEN
		SET @message_text = CONCAT("The allocRound: ", allocRouId, " is already allocated.");
		SIGNAL alreadyAllocated SET MESSAGE_TEXT = @message_text, MYSQL_ERRNO = 1192;
	END IF;
	-- IF AllocRound require reset before allocation
	SET reset_required = (SELECT requireReset FROM AllocRound WHERE id = allocRouId);
	IF reset_required = TRUE THEN
		SET @message_text = CONCAT("The allocRound: ", allocRouId, " require reset before allocation.");
		SIGNAL require_reset SET MESSAGE_TEXT = @message_text, MYSQL_ERRNO = 1192;
	END IF;
	-- IF Allocation already running with allocRound id raise error 
	SET procedure_active = (SELECT processOn FROM AllocRound WHERE id = allocRouId);
	IF procedure_active = 1 THEN
		SET @message_text = CONCAT("The allocation with allocRound:", allocRouId, " is already running.");
		SIGNAL processBusy SET MESSAGE_TEXT = @message_text, MYSQL_ERRNO = 1192;
	END IF;
	-- SET procedure running
	UPDATE AllocRound SET processOn = 1 WHERE id = allocRouId;
	
	/* ONLY FOR DEMO PURPOSES */
	IF (allocRouID = 10004) THEN
		INSERT INTO AllocSubject(subjectId, allocRound)
		SELECT id, 10004 FROM Subject;
	END IF;
	/* DEMO PART ENDS */

	UPDATE AllocRound SET requireReset = TRUE WHERE id = allocRouId;

	CALL prioritizeSubjects(allocRouId, 1, logId); -- sub_eq.prior >= X ORDER BY sub_eq.prior DESC, groupSize ASC
	CALL prioritizeSubjects(allocRouId, 2, logId); -- sub_eq.prior < X ORDER BY sub_eq.prior DESC, groupSize ASC
	CALL prioritizeSubjects(allocRouId, 3, logId); -- without equipments ORDER BY groupSize ASC
	
	OPEN subjects;

	subjectLoop : LOOP
		FETCH subjects INTO subId;
		IF finished = 1 THEN LEAVE subjectLoop;
		END IF;
	
		-- IF user tells abort the process.
		SET abort_round := (SELECT abortProcess FROM AllocRound WHERE id = allocRouId);
		IF abort_round = 1 THEN
			SET @message_text = CONCAT("The allocation been terminated by user. AllocRoundId: ", allocRouId, ".");
			SIGNAL abortAllocation SET MESSAGE_TEXT = @message_text, MYSQL_ERRNO = 1192;
		END IF;
	
		-- SET Suitable rooms for the subject
		CALL LogAllocation(logId, "Allocation", "Info", CONCAT("SubjectId: ", subId, " - Search for suitable spaces"));
	    CALL setSuitableRooms(allocRouId, subId);
		-- SET cantAllocate or Insert subject to spaces
        CALL allocateSpace(allocRouId, subId, logId);
       	
	END LOOP subjectLoop;

	CLOSE subjects;

	UPDATE AllocRound SET isAllocated = 1 WHERE id = allocRouId;
	CALL LogAllocation(logId, "Allocation", "End", CONCAT("Errors: ", (SELECT errors)));

	UPDATE AllocRound SET processOn = 0 WHERE id = allocRouId;

END; //
DELIMITER ;

/* --- Procedure: SET SUITABLE ROOMS -  ALLOCATION --- */
DELIMITER //

CREATE OR REPLACE PROCEDURE setSuitableRooms(allocRouId INT, subId INT)
BEGIN 
	INSERT INTO AllocSubjectSuitableSpace (allocRound, subjectId, spaceId, missingItems)
		SELECT allocRouId, subId, sp.id, getMissingItemAmount(subId, sp.id) AS "missingItems"
		FROM Space sp
		WHERE sp.personLimit >= (SELECT groupSize FROM Subject WHERE id=subId)
		AND sp.area >= (SELECT s.area FROM Subject s WHERE id=subId)
		AND sp.spaceTypeId = (SELECT s.spaceTypeId FROM Subject s WHERE id=subId)
		AND sp.inUse=1
		;
END; //

DELIMITER ;

/* --- PROCEDURE: Abort Allocation --- */
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS abortAllocation(allocR INT)
BEGIN
	DECLARE inProgress BOOLEAN DEFAULT FALSE;
	
	-- CHECK IF Allocation is active
	SET inProgress := (SELECT processOn FROM AllocRound WHERE id = allocR);
	-- IF in process tell to stop
	IF inProgress = TRUE THEN
		UPDATE AllocRound SET abortProcess = 1 WHERE id = allocR;
	END IF;
	
END; $$

DELIMITER ;

/* ------------------------------------------------------ */
/* FUNCTIONS */

/* get missing equipment(subject) amount in space */
DELIMITER //
CREATE FUNCTION IF NOT EXISTS getMissingItemAmount(subId INT, spaId INT) RETURNS INT
NOT DETERMINISTIC
BEGIN
RETURN (SELECT COUNT(*)
        FROM
    (SELECT equipmentId  FROM SubjectEquipment
    WHERE subjectId = subId
    EXCEPT 
    SELECT equipmentId FROM SpaceEquipment
    WHERE spaceId = spaId) a
);
END; //
DELIMITER ;