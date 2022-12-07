DROP PROCEDURE IF EXISTS allocateSpace;

DELIMITER //

CREATE PROCEDURE allocateSpace(allocRouId INT, subId INT, logId INT) 
BEGIN
	DECLARE spaceTo INTEGER DEFAULT NULL;
	DECLARE i INTEGER DEFAULT 0; -- loop index
	DECLARE sessions INTEGER DEFAULT 0; -- Total session amount = groupCount * sessionCount
	DECLARE allocated INTEGER DEFAULT 0; -- How many sessions added to AllocSpace
	DECLARE sessionSeconds INTEGER DEFAULT 0; -- How many seconds each session lasts
	DECLARE suitableSpaces BOOLEAN DEFAULT TRUE; -- If can't allocate set false
	DECLARE loopOn BOOLEAN DEFAULT TRUE; -- while loop condition

	SET sessions := (SELECT groupCount * sessionCount FROM Subject WHERE id = subId); -- total amount of sessions in subject
   	SET allocated := 0; -- How many sessions allocated
   	SET sessionSeconds := (SELECT TIME_TO_SEC(sessionLength) FROM Subject WHERE id = subId); -- Session length in seconds
	
	SET spaceTo := ( -- to check if subject can be allocated
        	SELECT ass.spaceId FROM AllocSubjectSuitableSpace ass
        	WHERE ass.missingItems = 0 AND ass.subjectId = subId AND ass.allocRound = allocRouId 
 			LIMIT 1);
 		
	IF spaceTo IS NULL THEN -- If can't find suitable spaces
		SET suitableSpaces := FALSE;
   	ELSE -- Find for each session space with free time
   		SET i := 0;
   		WHILE loopOn DO -- Try add all sessions to the space	
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
				IF i = sessions - allocated THEN -- If checked all 
					SET loopOn = FALSE;
				END IF;
			ELSE -- if can find space with freetime for specific amount sessions
			INSERT INTO AllocSpace
					(subjectId, allocRound, spaceId, totalTime) 
				VALUES 
					(subId, allocRouId, spaceTo, SEC_TO_TIME((sessionSeconds * (sessions - i - allocated))))
				ON DUPLICATE KEY UPDATE totalTime = ADDTIME(totalTime, (SEC_TO_TIME(sessionSeconds * (sessions - i - allocated))));
				-- LOG HERE
				CALL LogAllocation(logId, "Space-allocation", "OK", CONCAT("Subject : ", subId, " - Allocate ", sessions - i - allocated, " of ", sessions, " sessions to space: ", spaceTo));
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
   	-- LOG HERE
    CALL LogAllocation(logId, "Space-allocation", "Warning", CONCAT("Subject : ", subId, " - Can't find suitable spaces" ));
   ELSEIF allocated = 0 AND suitableSpaces = TRUE THEN -- if can't find any space with free time, add all sessions to same space with most freetime
   		SET spaceTo := (
   			SELECT alpa.spaceId
			FROM AllocSubjectSuitableSpace alpa
			LEFT JOIN Space spa ON alpa.spaceId = spa.id
			WHERE alpa.subjectId = subId
			AND alpa.missingItems = 0
			AND alpa.allocRound = allocRouId
			GROUP BY alpa.spaceId 
			ORDER BY ((TIME_TO_SEC(TIMEDIFF(spa.availableTO, spa.availableFrom)) *5) - 
			(SELECT IFNULL((SUM(TIME_TO_SEC(totalTime))), 0) FROM AllocSpace WHERE allocRound = allocRouId AND spaceId = alpa.spaceId)) DESC
			LIMIT 1
		);		
   		INSERT INTO AllocSpace (subjectId, allocRound, spaceId, totalTime) 
   			VALUES (subId, allocRouId, spaceTo, SEC_TO_TIME(sessionSeconds * sessions)); 
   		UPDATE AllocSubject SET isAllocated = 1 WHERE subjectId = subId AND allocRound = allocRouId;
   		-- LOG HERE
		CALL LogAllocation(logId, "Space-allocation", "Warning", CONCAT("Subject : ", subId, " - Allocate ", sessions, " of ", sessions, " sessions to space: ", spaceTo, " - All suitable spaces are full."));
   	 
   	ELSEIF allocated < sessions AND suitableSpaces = TRUE THEN -- if there is free time for some of the sessions but not all, add rest to same space than others
   		SET spaceTo := (SELECT spaceId FROM AllocSpace WHERE subjectId = subId AND allocRound = allocRouId ORDER BY totalTime ASC LIMIT 1);
		
		UPDATE AllocSpace SET totalTime=ADDTIME(totalTime,(SEC_TO_TIME(sessionSeconds * (sessions - allocated))))
		WHERE subjectId=subID AND spaceId = spaceTO AND allocRound = allocRouId;
		UPDATE AllocSubject SET isAllocated = 1 WHERE subjectId = subId AND allocRound = allocRouId;
		-- LOG HERE
		CALL LogAllocation(logId, "Space-allocation", "Warning", CONCAT("Subject : ", subId, " - Add ", sessions - allocated, " to space: ", spaceTo, " - All suitable spaces are full"));
   	END IF;
END; //

DELIMITER ;