use casedb;

/* PROCEDURES */

/* Reset allocation */
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS  resetAllocation(allocR INTEGER)
BEGIN
	DELETE FROM AllocSpace WHERE allocRound = allocR;
	DELETE FROM AllocSubjectSuitableSpace WHERE allocRound = allocR;
	UPDATE AllocSubject SET isAllocated = 0, priority = null, cantAllocate = 0 WHERE allocRound = allocR;
END; //

DELIMITER ;

/* allocation */ 
DELIMITER //

CREATE OR REPLACE PROCEDURE startAllocation(allocRouId INT)
BEGIN
	DECLARE finished INTEGER DEFAULT 0;
	DECLARE priorityNum INTEGER DEFAULT 1;
	DECLARE subId	INTEGER DEFAULT 0;

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
	
	END LOOP test;
	
	CLOSE subjects;

		
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

 