use casedb;

/* RESET ALLOCATION */
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS  resetAllocation(allocR INTEGER)
BEGIN
	DELETE FROM AllocSpace WHERE allocRound = allocR;
	DELETE FROM AllocSubjectSuitableSpace WHERE allocRound = allocR;
	UPDATE AllocSubject SET isAllocated = 0, priority = null, cantAllocate = 0 WHERE allocRound = allocR;
END; //

DELIMITER ;