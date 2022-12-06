DELIMITER //
CREATE PROCEDURE IF NOT EXISTS LogAllocation(logId INT, stage VARCHAR(255), status VARCHAR(255), msg VARCHAR(16000))
BEGIN
	DECLARE debug INTEGER;

	SET debug := (SELECT numberValue FROM GlobalSetting WHERE name='allocation-debug');
	
	IF debug = 1 AND logId IS NOT NULL AND logId != 0 THEN
		INSERT INTO log_event(log_id, stage, status, information) VALUES(logId, stage, status, msg);
	END IF;
END; //

DELIMITER ;