DROP PROCEDURE IF EXISTS startAllocation;

DELIMITER //

CREATE OR REPLACE PROCEDURE startAllocation(allocRouId INT)
BEGIN
	DECLARE finished INTEGER DEFAULT 0;
	DECLARE priorityNum INTEGER DEFAULT 1;
	DECLARE subId	INTEGER DEFAULT 0;
    DECLARE spaceTo INTEGER DEFAULT NULL;

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

	test : LOOP
		FETCH subjects INTO subId;
		IF finished = 1 THEN LEAVE test;
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

        SET spaceTo = (SELECT ass.spaceId
        FROM AllocSubjectSuitableSpace ass
        LEFT JOIN Space sp ON ass.spaceId = sp.id
        LEFT JOIN AllocSpace al_sp ON ass.spaceId = al_sp.spaceId
        WHERE al_sp.allocRound = allocRouId 
        AND ass.subjectId = subId
        AND ass.missingItems = 0
        GROUP BY sp.id
        ORDER BY sp.area, sp.personLimit ASC
        LIMIT 1)
	;

        IF spaceTo IS NULL THEN
            SELECT spaceTo;
            UPDATE AllocSubject SET cantAllocate = 1;
            ELSE
            SELECT spaceTo;
        END IF;

	
	END LOOP test;
	
	CLOSE subjects;

		
END; //
DELIMITER ;

CALL resetAllocation(10003);
CALL startAllocation(10003);