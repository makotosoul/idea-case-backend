DELIMITER //
CREATE OR REPLACE PROCEDURE prioritizeSubjects(allocRoundId INT, priority_option INT)
BEGIN 
	DECLARE priorityNow INTEGER;

	SET priorityNow = (SELECT IFNULL(MAX(priority),0) FROM AllocSubject WHERE allocRound = allocRoundId);

	IF priority_option = 1 THEN -- subject_equipment.priority >= X
		INSERT INTO AllocSubject (subjectId, allocRound, priority)
			SELECT allSub.subjectId, allSub.allocRound, ROW_NUMBER() OVER (ORDER BY MAX(sub_eqp.priority) DESC, Subject.groupSize ASC) + priorityNow as "row"
    		FROM AllocSubject allSub 
    		LEFT JOIN SubjectEquipment sub_eqp ON allSub.subjectId = sub_eqp.subjectId
    		JOIN Subject ON allSub.subjectId = Subject.id
    		WHERE allSub.allocRound = allocRoundId AND allSub.priority IS NULL
    		AND (sub_eqp.priority) >= (SELECT numberValue FROM GlobalSetting gs WHERE name="x")
    		GROUP BY allSub.subjectId 
		ON DUPLICATE KEY UPDATE priority = VALUES(priority);
	ELSEIF priority_option = 2 THEN -- subject_equipment.priority < X
		INSERT INTO AllocSubject (subjectId, allocRound, priority)
			SELECT allSub.subjectId, allSub.allocRound, ROW_NUMBER() OVER (ORDER BY MAX(sub_eqp.priority) DESC, Subject.groupSize ASC) + priorityNow as "row"
       		FROM AllocSubject allSub 
        	LEFT JOIN SubjectEquipment sub_eqp ON allSub.subjectId = sub_eqp.subjectId
        	JOIN Subject ON allSub.subjectId = Subject.id
        	WHERE allSub.allocRound = allocRoundId
        	AND allSub.priority IS NULL
        	AND (sub_eqp.priority) < (SELECT numberValue FROM GlobalSetting gs WHERE name="x")
        	GROUP BY allSub.subjectId 
        	ORDER BY sub_eqp.priority DESC
        ON DUPLICATE KEY UPDATE priority = VALUES(priority);
    ELSEIF priority_option = 3 THEN -- all others (subjects without equipment)
    	INSERT INTO AllocSubject (subjectId, allocRound, priority)
    		SELECT AllocSubject.subjectId, AllocSubject.allocRound, ROW_NUMBER() OVER (ORDER BY Subject.groupSize ASC) + priorityNow as "row" 
			FROM AllocSubject
			LEFT JOIN Subject ON AllocSubject.subjectId = Subject.id
			WHERE priority IS NULL
			AND allocRound = allocRoundId
		ON DUPLICATE KEY UPDATE priority = VALUES(priority);
	END IF;
END; //

DELIMITER ;