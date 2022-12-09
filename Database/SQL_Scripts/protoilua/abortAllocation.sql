DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS abortAllocation(allocR INT)
BEGIN
	DECLARE inProgress BOOLEAN DEFAULT FALSE;
	
	-- CHECK IF Allocation is active
	SET inProgress := (SELECT processOn FROM AllocRound WHERE id = allocR);
	-- IF in process tell to stop
	IF inProgress = TRUE THEN
		UPDATE AllocRound SET abortProcess = 1 WHERE id = allocR;
	END IF;
	
END; $$

DELIMITER ;