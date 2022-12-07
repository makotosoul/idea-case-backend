/* Listaa opetukset, joita ei voi allokoida, parametrit: AllocRoundId*/
SELECT all_sub.subjectId, s.name, s.groupSize, s.area, st.name AS "spaceType"
FROM AllocSubject all_sub
JOIN Subject s ON all_sub.subjectId = s.id
JOIN SpaceType st ON s.spaceTypeId = st.id
WHERE cantAllocate = 1
AND allocRound = 10004;

/* Kaikki huoneet, jotka tarkistetaan yksittäiselle subjectille, parametrit: Subject.id */
SELECT 
s.id, 
s.name, 
s.area,
getMissingItemAmount(4020, s.id) AS "missingItems",
IF(s.area >= (SELECT area FROM Subject WHERE id = 4020), TRUE, FALSE) AS areaOk, 
s.personLimit,
IF(s.personLimit >= (SELECT groupSize FROM Subject WHERE id = 4020), TRUE, FALSE) AS personLimitOk, 
s.inUse,
st.name,
IF(st.id = (SELECT spaceTypeId FROM Subject WHERE id = 4020), TRUE, FALSE) AS spaceTypeOk
FROM Space s
LEFT JOIN SpaceEquipment se ON s.id = se.spaceId
LEFT JOIN SpaceType st ON s.spaceTypeId = st.id
GROUP BY s.id
ORDER BY FIELD(st.id, (SELECT spaceTypeId FROM Subject WHERE id = 4020)) DESC,
missingItems,
personLimitOk DESC,
areaOk DESC 
;

/* Puuttuvat varusteet - parametrit: Subject.id ja Space.id */

SELECT equipmentId, e.name FROM SubjectEquipment sub_eq
JOIN Equipment e ON sub_eq.equipmentId = e.id 
WHERE subjectId = 4020
    EXCEPT 
SELECT equipmentId, e2.name FROM SpaceEquipment sp_eq
JOIN Equipment e2 ON sp_eq.equipmentId = e2.id
	WHERE spaceId = 1080
