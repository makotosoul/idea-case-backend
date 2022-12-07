DELIMITER //

CREATE OR REPLACE PROCEDURE startAllocation(allocRouId INT)
BEGIN
	DECLARE finished INTEGER DEFAULT 0; -- Marker for loop
	DECLARE subId	INTEGER DEFAULT 0; -- SubjectId
	DECLARE logId	INTEGER DEFAULT NULL;
	DECLARE errors	INTEGER DEFAULT 0;
	DECLARE debug	INTEGER DEFAULT 0;
	DECLARE abort_round	BOOLEAN DEFAULT FALSE;

	-- Error Handling declarations
    DECLARE processBusy CONDITION FOR SQLSTATE '50000';
    DECLARE alreadyAllocated CONDITION FOR SQLSTATE '50001';
	DECLARE abortAllocation	CONDITION FOR SQLSTATE '50002';
   
	-- Cursor for subject loop / SELECT priority order 
	DECLARE subjects CURSOR FOR 
		SELECT allSub.subjectId 
       	FROM AllocSubject allSub 
        WHERE allSub.allocRound = allocRouId 
        ORDER BY priority ASC;
              
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = 1;
	
	-- IF Procedure already running or allocRound allocated exit procedure
	DECLARE EXIT HANDLER FOR processBusy, alreadyAllocated, abortAllocation
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
	-- IF Allocation already running with allocRound id raise error 
	SET @procedure_active = (SELECT processOn FROM AllocRound WHERE id = allocRouId);
	IF @procedure_active = 1 THEN
		SET @message_text = CONCAT("The allocation with allocRound:", allocRouId, " is already running.");
		SIGNAL processBusy SET MESSAGE_TEXT = @message_text, MYSQL_ERRNO = 1192;
	END IF;
	-- SET that procedure running
	UPDATE AllocRound SET processOn = 1 WHERE id = allocRouId;
	
	/* ONLY FOR DEMO PURPOSES */
	IF (allocRouID = 10004) THEN
		INSERT INTO AllocSubject(subjectId, allocRound)
		SELECT id, 10004 FROM Subject;
	END IF;
	/* DEMO PART ENDS */

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