/* --- Procedure: RESET ALLOCATION --- */
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS  resetAllocation(allocR INTEGER)
BEGIN
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