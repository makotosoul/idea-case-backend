DELIMITER //

CREATE OR REPLACE PROCEDURE startAllocation(allocRouId INT)
BEGIN
	DECLARE finished INTEGER DEFAULT 0; -- Marker for loop
	DECLARE subId	INTEGER DEFAULT 0; -- SubjectId
	DECLARE logId	INTEGER DEFAULT NULL;
	DECLARE errors	INTEGER DEFAULT 0;
	DECLARE debug	INTEGER DEFAULT 0;
   	
	-- Cursor for subject loop / SELECT priority order 
	DECLARE subjects CURSOR FOR 
		SELECT allSub.subjectId 
       	FROM AllocSubject allSub 
        WHERE allSub.allocRound = allocRouId 
        ORDER BY priority ASC;
       
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = 1;

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

	CALL LogAllocation(logId, "Allocation", "Start", CONCAT("Start allocation. AllocRound: ", allocRouId));

	CALL prioritizeSubjects(allocRouId, 1, logId); -- sub_eq.prior >= X ORDER BY sub_eq.prior DESC, groupSize ASC
	CALL prioritizeSubjects(allocRouId, 2, logId); -- sub_eq.prior < X ORDER BY sub_eq.prior DESC, groupSize ASC
	CALL prioritizeSubjects(allocRouId, 3, logId); -- without equipments ORDER BY groupSize ASC
	
	OPEN subjects;

	subjectLoop : LOOP
		FETCH subjects INTO subId;
		IF finished = 1 THEN LEAVE subjectLoop;
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

		
END; //
DELIMITER ;