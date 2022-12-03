DELIMITER //

CREATE OR REPLACE PROCEDURE startAllocation(allocRouId INT)
BEGIN
	DECLARE finished INTEGER DEFAULT 0; -- Marker for loop
	DECLARE subId	INTEGER DEFAULT 0; -- SubjectId
	DECLARE logId	INTEGER DEFAULT 0;
	DECLARE errors	INTEGER DEFAULT 0;
	DECLARE debug	INTEGER DEFAULT 0;
   	
	-- Cursor for subject loop / SELECT priority order 
	DECLARE subjects CURSOR FOR 
		SELECT allSub.subjectId 
       	FROM AllocSubject allSub 
        WHERE allSub.allocRound = allocRouId 
        ORDER BY priority ASC;
       
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = 1;

	DECLARE CONTINUE HANDLER FOR SQLWARNING 
		CALL LogAllocation(logId, "Allocation", "Warning", "Some Warning");

	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
		BEGIN
			SET errors := errors +1;
			GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
			SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
			CALL LogAllocation(logId, "Allocation", "Error", (SELECT @full_error));
		END;
	
	SET debug := (SELECT numberValue FROM GlobalSetting WHERE name='allocation-debug');


	/* ONLY FOR DEMO PURPOSES */
	IF (allocRouID = 10004) THEN
		INSERT INTO AllocSubject(subjectId, allocRound)
		SELECT id, 10004 FROM Subject;
	END IF;
	/* DEMO PART ENDS */

	IF debug = 1 THEN
		INSERT INTO log_list(log_type) VALUES (1); -- START LOG
		SET logId := (SELECT LAST_INSERT_ID()); -- SET log id number for the list
	END IF;

	CALL LogAllocation(logId, "Allocation", "Start", CONCAT("Start allocation with AllocRound: ", allocRouId));
	CALL LogAllocation(logId, "Allocation", "Info", "Start Prioritioze subjects");

	CALL prioritizeSubjects(allocRouId, 1); -- sub_eq.prior >= X ORDER BY sub_eq.prior DESC, groupSize ASC
	CALL prioritizeSubjects(allocRouId, 2); -- sub_eq.prior < X ORDER BY sub_eq.prior DESC, groupSize ASC
	CALL prioritizeSubjects(allocRouId, 3); -- without equipments ORDER BY groupSize ASC
	
	CALL LogAllocation(logId, "Allocation", "Info", "End Prioritioze subjects");

	OPEN subjects;

	subjectLoop : LOOP
		FETCH subjects INTO subId;
		IF finished = 1 THEN LEAVE subjectLoop;
		END IF;
		
		CALL LogAllocation(logId, "Allocation", "Info", CONCAT("SubjectId: ", subId, " - Start processing"));

		-- SET Suitable rooms for the subject
		CALL LogAllocation(logId, "Allocation", "Info", CONCAT("SubjectId: ", subId, " - Search all suitable spaces"));
	    CALL setSuitableRooms(allocRouId, subId);
		-- SET cantAllocate or Insert subject to spaces
	   	CALL LogAllocation(logId, "Allocation", "Info", CONCAT("SubjectId: ", subId, " - Start inserting spaces"));
        CALL allocateSpace(allocRouId, subId);
       	
       CALL LogAllocation(logId, "Allocation", "Info", CONCAT("SubjectId: ", subId, " - End processing"));

	END LOOP subjectLoop;

	CLOSE subjects;

	UPDATE AllocRound SET isAllocated = 1 WHERE id = allocRouId;
	CALL LogAllocation(logId, "Allocation", "End", CONCAT("End allocation - Errors: ", (SELECT errors)));

		
END; //
DELIMITER ;