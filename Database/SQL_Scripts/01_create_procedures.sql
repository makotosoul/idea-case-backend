use casedb;

/* PROCEDURES */


/* space allocation*/
DELIMITER //

CREATE PROCEDURE allocateSpace(allocRouId INT, subId INT) 
BEGIN
	DECLARE spaceTo INTEGER DEFAULT NULL;
	DECLARE i INTEGER DEFAULT 0; -- loop index
	DECLARE sessions INTEGER DEFAULT 0; -- Total session amount = groupCount * sessionCount
	DECLARE allocated INTEGER DEFAULT 0; -- How many sessions added to AllocSpace
	DECLARE sessionSeconds INTEGER DEFAULT 0; -- How many seconds each session lasts
	DECLARE suitableSpaces BOOLEAN DEFAULT TRUE; -- If can't allocate set false
	DECLARE loopOn BOOLEAN DEFAULT TRUE;

	SET sessions := (SELECT groupCount * sessionCount FROM Subject WHERE id = subId);
   	SET allocated := 0; -- How many sessions allocated
   	SET sessionSeconds := (SELECT TIME_TO_SEC(sessionLength) FROM Subject WHERE id = subId);
	
	SET spaceTo := ( -- Help to check if subject can be allocated
        	SELECT ass.spaceId FROM AllocSubjectSuitableSpace ass
        	WHERE ass.missingItems = 0 AND ass.subjectId = subId AND ass.allocRound = allocRouId 
 			LIMIT 1);
 		
	IF spaceTo IS NULL THEN -- If can't find suitable spaces
		SET suitableSpaces := FALSE;
   	ELSE -- Find for each session space with free time
   		SET i := 0;
   		WHILE loopOn DO -- Try add all subject sessions to spaces	
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
				IF i = sessions - allocated THEN
					SET loopOn = FALSE;
				END IF;
			ELSE -- if can find space with freetime for specific amount sessions
			INSERT INTO AllocSpace
					(subjectId, allocRound, spaceId, totalTime) 
				VALUES 
					(subId, allocRouId, spaceTo, SEC_TO_TIME((sessionSeconds * (sessions - i - allocated))))
				ON DUPLICATE KEY UPDATE totalTime = totalTime + SEC_TO_TIME(sessionSeconds * (sessions - i - allocated));
				
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
     
   ELSEIF allocated = 0 AND suitableSpaces = TRUE THEN -- if can't find any space with free time, add all sessions to same space with most freetime
   		SET spaceTo := (SELECT alpa.spaceId
		FROM AllocSubjectSuitableSpace alpa
		LEFT JOIN Space spa ON alpa.spaceId = spa.id
		WHERE alpa.subjectId = subId
		AND alpa.missingItems = 0
		AND alpa.allocRound = allocRouId
		GROUP BY alpa.spaceId 
		ORDER BY ((TIME_TO_SEC(TIMEDIFF(spa.availableTO, spa.availableFrom)) *5) - 
		(SELECT IFNULL((SUM(TIME_TO_SEC(totalTime))), 0) FROM AllocSpace WHERE allocRound = allocRouId AND spaceId = alpa.spaceId)) DESC
		LIMIT 1);
				
   		INSERT INTO AllocSpace (subjectId, allocRound, spaceId, totalTime) 
   		VALUES (subId, allocRouId, spaceTo, SEC_TO_TIME(sessionSeconds * sessions)); 
   		UPDATE AllocSubject SET isAllocated = 1 WHERE subjectId = subId AND allocRound = allocRouId;
	
   	 
   	ELSEIF allocated < sessions AND suitableSpaces = TRUE THEN -- if there is free time for some of the sessions but not all, add rest to same space than others
   		SET spaceTo := (SELECT spaceId FROM AllocSpace WHERE subjectId = subId AND allocRound = allocRouId ORDER BY totalTime ASC LIMIT 1);
		
		UPDATE AllocSpace SET totalTime=ADDTIME(totalTime,(SEC_TO_TIME(sessionSeconds * (sessions - allocated))))
		WHERE subjectId=subID AND spaceId = spaceTO AND allocRound = allocRouId;
		UPDATE AllocSubject SET isAllocated = 1 WHERE subjectId = subId AND allocRound = allocRouId;
   	END IF;
END; //

DELIMITER ;

/* --- Procedure: PRIORITIZE SUBJECTS -  ALLOCATION --- */

DELIMITER //
CREATE OR REPLACE PROCEDURE prioritizeSubjects(allocRoundId INT, priority_option INT)
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
END; //

DELIMITER ;



/* --- Procedure: RESET ALLOCATION --- */
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS  resetAllocation(allocR INTEGER)
BEGIN
	DELETE FROM AllocSpace WHERE allocRound = allocR;
	DELETE FROM AllocSubjectSuitableSpace WHERE allocRound = allocR;
    IF (allocR = 10004) THEN
        DELETE FROM AllocSubject WHERE allocRound = 10004;
    ELSE 
	    UPDATE AllocSubject SET isAllocated = 0, priority = null, cantAllocate = 0 WHERE allocRound = allocR;
    END IF;
    UPDATE AllocRound SET isAllocated = 0 WHERE id = allocR;
END; //

DELIMITER ;


/* --- Procedure: START ALLOCATION --- */
DELIMITER //

CREATE OR REPLACE PROCEDURE startAllocation(allocRouId INT)
BEGIN
	DECLARE finished INTEGER DEFAULT 0; -- Marker for loop
	DECLARE subId	INTEGER DEFAULT 0; -- SubjectId
   	
	-- Cursor for subject loop / SELECT priority order 
	DECLARE subjects CURSOR FOR 
		SELECT allSub.subjectId 
       	FROM AllocSubject allSub 
        WHERE allSub.allocRound = allocRouId 
        ORDER BY priority ASC;
       
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = 1;

	/* ONLY FOR DEMO PURPOSES */
	IF (allocRouID = 10004) THEN
		INSERT INTO AllocSubject(subjectId, allocRound)
		SELECT id, 10004 FROM Subject;
	END IF;
	/* DEMO PART ENDS */

	CALL prioritizeSubjects(allocRouId, 1); -- sub_eq.prior >= X ORDER BY sub_eq.prior DESC, groupSize ASC
	CALL prioritizeSubjects(allocRouId, 2); -- sub_eq.prior < X ORDER BY sub_eq.prior DESC, groupSize ASC
	CALL prioritizeSubjects(allocRouId, 3); -- without equipments ORDER BY groupSize ASC

	OPEN subjects;

	subjectLoop : LOOP
		FETCH subjects INTO subId;
		IF finished = 1 THEN LEAVE subjectLoop;
		END IF;
		-- SET Suitable rooms for the subject
	    CALL setSuitableRooms(allocRouId, subId);
		-- SET cantAllocate or Insert subject to spaces
        CALL allocateSpace(allocRouId, subId);
	END LOOP subjectLoop;

	CLOSE subjects;

	UPDATE AllocRound SET isAllocated = 1 WHERE id = allocRouId;
		
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

 