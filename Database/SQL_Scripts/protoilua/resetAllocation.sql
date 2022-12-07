/* --- Procedure: RESET ALLOCATION --- */
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS  resetAllocation(allocR INTEGER)
BEGIN
	
	-- Handler for the error
	DECLARE processBusy CONDITION FOR SQLSTATE '50000';
	DECLARE EXIT HANDLER FOR processBusy
	BEGIN
		GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
		SET @full_error = CONCAT("Error: ", @errno, " (", @sqlstate, "): ", @text);
		RESIGNAL SET MESSAGE_TEXT = @full_error;
	END;
	-- Raise error if allocation in progress.
	SET @procedure_active = (SELECT processOn FROM AllocRound WHERE id = allocR);
	IF @procedure_active = 1 THEN
		SET @message_text = CONCAT("The allocation with allocRound:", allocR, " is currently in progress.");
		SIGNAL processBusy SET MESSAGE_TEXT = @message_text, MYSQL_ERRNO = 1192;
	END IF;
	
	-- Delete all allocation data and reset variables
	DELETE FROM AllocSpace WHERE allocRound = allocR;
	DELETE FROM AllocSubjectSuitableSpace WHERE allocRound = allocR;
    IF (allocR = 10004) THEN
        DELETE FROM AllocSubject WHERE allocRound = 10004;
    ELSE 
	    UPDATE AllocSubject SET isAllocated = 0, priority = null, cantAllocate = 0 WHERE allocRound = allocR;
    END IF;
    UPDATE AllocRound SET isAllocated = 0 WHERE id = allocR;
END; //

DELIMITER ;