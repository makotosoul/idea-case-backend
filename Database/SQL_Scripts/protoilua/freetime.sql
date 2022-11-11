-- Käytettävät tunnit tilassa
SELECT 
TIME_TO_SEC(TIMEDIFF(sp.availableTO, sp.availableFrom)) *5  AS "availableHours"
FROM
Space sp

-- Allokoidut tunnit
SELECT sp.id, (TIME_TO_SEC(TIMEDIFF(sp.availableTO, sp.availableFrom)) *5) - IFNULL((SUM(TIME_TO_SEC(as2.totalTime))), 0) AS "freeTime"

    FROM AllocSpace as2
    LEFT JOIN Space sp ON as2.spaceId = sp.id
    WHERE as2.allocRound = 10002
    GROUP BY sp.id

-- Etsii sopivat tilat ja siihen myös tiloissa vapaana olevan ajan. HUOM. ei toimi ilman WHERE subjectId = ?
SELECT ass.*, (TIME_TO_SEC(TIMEDIFF(sp.availableTO, sp.availableFrom)) *5) - IFNULL((SUM(TIME_TO_SEC(al_sp.totalTime))), 0) AS "freeTime"
FROM AllocSubjectSuitableSpace ass
LEFT JOIN Space sp ON ass.spaceId = sp.id
LEFT JOIN AllocSpace al_sp ON ass.spaceId = al_sp.spaceId
WHERE al_sp.allocRound = 10002 
AND ass.subjectId = 4003
AND ass.missingItems = 0
GROUP BY sp.id
ORDER BY (TIME_TO_SEC(TIMEDIFF(sp.availableTO, sp.availableFrom)) *5) - IFNULL((SUM(TIME_TO_SEC(al_sp.totalTime))), 0) DESC
LIMIT 1
;

-- Hakee sopivan 
SELECT ass.spaceId
FROM AllocSubjectSuitableSpace ass
LEFT JOIN Space sp ON ass.spaceId = sp.id
LEFT JOIN AllocSpace al_sp ON ass.spaceId = al_sp.spaceId
WHERE al_sp.allocRound = 10002 
AND ass.subjectId = 4003
AND ass.missingItems = 0
GROUP BY sp.id
ORDER BY (TIME_TO_SEC(TIMEDIFF(sp.availableTO, sp.availableFrom)) *5) - IFNULL((SUM(TIME_TO_SEC(al_sp.totalTime))), 0) DESC
LIMIT 1
;

