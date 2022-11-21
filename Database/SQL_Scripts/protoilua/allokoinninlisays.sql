DROP PROCEDURE IF EXISTS startAllocation;

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
END; //
DELIMITER ;

CALL resetAllocation(10003);
CALL startAllocation(10003);