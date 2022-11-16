DROP PROCEDURE IF EXISTS startAllocation;

DELIMITER //

CREATE OR REPLACE PROCEDURE startAllocation(allocRouId INT)
BEGIN
	DECLARE finished INTEGER DEFAULT 0; -- Marker for loop
	DECLARE priorityNum INTEGER DEFAULT 1; -- Subject prioritynumber
	DECLARE subId	INTEGER DEFAULT 0; -- SubjectId
   
	-- Cursor for subject loop / SELECT priority order 
	DECLARE subjects CURSOR FOR 
		SELECT allSub.subjectId 
       	FROM AllocSubject allSub 
        LEFT JOIN SubjectEquipment sub_eqp ON allSub.subjectId = sub_eqp.subjectId
        WHERE allSub.allocRound = allocRouId 
        GROUP BY allSub.subjectId 
        ORDER BY sub_eqp.priority DESC;
       
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = 1;
	OPEN subjects;

	SET priorityNum = 1;

	subjectLoop : LOOP
		FETCH subjects INTO subId;
		IF finished = 1 THEN LEAVE subjectLoop;
		END IF;
		-- SET priorityNumber
		UPDATE AllocSubject SET priority = priorityNum WHERE subjectId = subId AND allocRound = allocRouId;
		SET priorityNum = priorityNum +1;
		-- SET Suitable rooms
	    INSERT INTO AllocSubjectSuitableSpace (allocRound, subjectId, spaceId, missingItems)
		SELECT allocRouId, subId, sp.id, getMissingItemAmount(subId, sp.id) AS "missingItems"
		FROM Space sp
		WHERE sp.personLimit >= (SELECT groupSize FROM Subject WHERE id=subId)
		AND sp.area >= (SELECT s.area FROM Subject s WHERE id=subId)
		AND sp.spaceTypeId = (SELECT s.spaceTypeId FROM Subject s WHERE id=subId)
		AND sp.inUse=1
		;
		-- SET cantAllocate or Insert subject to spaces
        CALL allocateSpace(allocRouId, subId);

	
	END LOOP subjectLoop;
	
	CLOSE subjects;

		
END; //
DELIMITER ;

CALL resetAllocation(10002);
CALL startAllocation(10002);