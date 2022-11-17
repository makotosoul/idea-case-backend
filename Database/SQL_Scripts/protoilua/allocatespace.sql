DELIMITER //

CREATE PROCEDURE allocateSpace(allocRouId INT, subId INT) 
BEGIN
	DECLARE spaceTo INTEGER DEFAULT NULL;
	DECLARE i INTEGER DEFAULT 0; -- loop index
	DECLARE sessions INTEGER DEFAULT 0; -- Total session amount = groupCount * sessionCount
	DECLARE allocated INTEGER DEFAULT 0; -- How many sessions added to AllocSpace
	DECLARE sessionSeconds INTEGER DEFAULT 0; -- How many seconds each session lasts
	DECLARE noSuitableSpace BOOLEAN DEFAULT TRUE; -- If can't allocate set false
	DECLARE loopOn BOOLEAN DEFAULT TRUE;

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
   		WHILE loopOn DO -- Try add all subject sessions to spaces	
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
   ELSEIF noSuitableSpace = FALSE THEN -- if can't find any suitable space for the subject
   	UPDATE AllocSubject SET cantAllocate = 1 WHERE subjectId = subId AND allocRound = allocRouId;
   ELSEIF allocated = 0 AND noSuitableSpace = TRUE THEN -- if can't find any space with free time, add all sessions to same space with most freetime
   SET spaceTo := (SELECT spa.id
					FROM AllocSubjectSuitableSpace suitspace
					LEFT JOIN Space spa ON suitspace.spaceId = spa.id
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
   		SET spaceTo := (SELECT spaceId FROM AllocSpace WHERE subjectId = subId AND allocRound = allocRouId ORDER BY totalTime ASC LIMIT 1);
		
		UPDATE AllocSpace SET totalTime=ADDTIME(totalTime,(SEC_TO_TIME(sessionSeconds * (sessions - allocated))))
		WHERE subjectId=subID AND spaceId = spaceTO AND allocRound = allocRouId;
   	
		UPDATE AllocSubject SET isAllocated = 1 WHERE subjectId = subId AND allocRound = allocRouId;
			
   	END IF;

END; //

DELIMITER ;
