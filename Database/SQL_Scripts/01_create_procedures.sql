use casedb;

/* PROCEDURES */


/*space allocation*/
DELIMITER //

CREATE PROCEDURE allocateSpace(allocRouId INT, subId INT) 
BEGIN
	DECLARE spaceTo INTEGER DEFAULT NULL;
	DECLARE i INTEGER DEFAULT 0; -- loop index
	DECLARE sessions INTEGER DEFAULT 0; -- Total session amount = groupCount * sessionCount
	DECLARE allocated INTEGER DEFAULT 0; -- How many sessions added to AllocSpace
	DECLARE sessionSeconds INTEGER DEFAULT 0; -- How many seconds each session lasts
	DECLARE noSuitableSpace BOOLEAN DEFAULT TRUE; -- If can't allocate set false

	SET sessions := (SELECT groupCount * sessionCount FROM Subject WHERE id = subId);
   	SET allocated := 0; -- How many sessions allocated
   	SET sessionSeconds := (SELECT TIME_TO_SEC(sessionLength) FROM Subject WHERE id = subId);
	
	SET spaceTo := ( -- Help to check if subject can be allocated
        	SELECT ass.spaceId FROM AllocSubjectSuitableSpace ass
        	WHERE ass.missingItems = 0 AND ass.subjectId = subId AND ass.allocRound = allocRouId 
 			LIMIT 1);
 		
	IF spaceTo IS NULL THEN -- If can't find suitable spaces
		SET noSuitableSpace := FALSE;
   	ELSE -- Find for each session space with free time
   		SET i := 0;
   		WHILE (allocated < sessions) OR (i < sessions - allocated) DO -- Try add all subject sessions to spaces	
   			SET spaceTo := (
   				SELECT sp.id FROM AllocSubjectSuitableSpace ass
				LEFT JOIN Space sp ON ass.spaceId = sp.id
				LEFT JOIN AllocSpace al_sp ON ass.spaceId = al_sp.spaceId 
				WHERE ass.subjectId = subId AND ass.missingItems = 0
				GROUP BY sp.id
				HAVING 
				(SELECT TIME_TO_SEC(TIMEDIFF(availableTo, availableFrom)) *5 FROM Space WHERE id = sp.id) - IFNULL(SUM(TIME_TO_SEC(al_sp.totalTime)), 0)  
				>
				(sessionSeconds * (sessions - i - allocated))
				ORDER BY sp.personLimit ASC, sp.area ASC
				LIMIT 1);
			
			IF spaceTo IS NULL THEN -- If can't find space with freetime for specific amount sessions
				SET i := i+1;
			ELSE -- if can find space with freetime for specific amount sessions
				INSERT INTO AllocSpace
					(subjectId, allocRound, spaceId, totalTime) 
				VALUES 
					(subId, allocRouId, spaceTo, SEC_TO_TIME((sessionSeconds * (sessions - i - allocated))))
				ON DUPLICATE KEY UPDATE totalTime = totalTime + SEC_TO_TIME(sessionSeconds * (sessions - i - allocated));
				
				SET i := 0;
				SET allocated := allocated + (sessions - i - allocated);
			END IF;
   			
   		END WHILE;
   
   END IF;
   
   IF sessions = allocated THEN -- If all sessions allocated
   	UPDATE AllocSubject SET isAllocated = 1 WHERE subjectId = subId AND allocRound = allocRouId;
   ELSEIF noSuitableSpace = FALSE THEN -- if can't find any suitable space for the subject
   	UPDATE AllocSubject SET cantAllocate = 1 WHERE subjectId = subId AND allocRound = allocRouId;
   ELSEIF allocated = 0 AND noSuitableSpace = TRUE THEN -- if can't find any space with free time, add all sessions to same space with most freetime
   	SET spaceTo := (SELECT spa.id
					FROM AllocSubjectSuitableSpace suitspace
					LEFT JOIN Space spa ON suitspace.spaceId = sp.id
					LEFT JOIN AllocSpace allspa ON suitspace.spaceId = allspa.spaceId
					WHERE suitspace.subjectId = subId
					AND suitspace.missingItems = 0
					AND suitspace.allocRound = allocRouId
					GROUP BY suitspace.spaceId 
					ORDER BY (TIME_TO_SEC(TIMEDIFF(spa.availableTO, spa.availableFrom)) *5) - IFNULL((SUM(TIME_TO_SEC(allspa.totalTime))), 0) DESC
					LIMIT 1);
				
   	INSERT INTO AllocSpace (subjectId, allocRound, spaceId, totalTime) 
   		VALUES (subId, allocRouId, spaceTo, SEC_TO_TIME(sessionSeconds * sessions)); -- NOT TESTED - NO ENOUGH TEST DATA ATM
   
   	ELSE -- when there is no enough freetime for all sessions in spaces, add rest to same space with others
   		SET spaceTo := (SELECT * FROM
						AllocSpace
						WHERE subjectId = subId
						AND allocRound = allocRouId
						ORDER BY totalTime DESC);
		
		UPDATE AllocSpace SET totalTime=totalTime + (SEC_TO_TIME(sessionSeconds * (sessions - allocated))) 
		WHERE subjectId=subID AND spaceId = spaceTO AND allocRound = allocRouId;
   	
		UPDATE AllocSubject SET isAllocated = 1 WHERE subjectId = subId AND allocRound = allocRouId;
			
   	END IF;

END; //

DELIMITER ;

/* Reset allocation */
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

 