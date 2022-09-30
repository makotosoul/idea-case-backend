/* Subject no allocated in current season */ 
SELECT Subject.id, Subject.name, al.allocRound 
FROM Subject 
LEFT JOIN AllocSubject as al ON Subject.id=al.subjectId 
WHERE al.allocRound != 10001 or al.allocRound IS NULL;

/* SubjectEquipment priority > Globalsettings.X */ 
SELECT Subject.id, Subject.name, SubjectEquipment.priority 
FROM Subject JOIN SubjectEquipment ON Subject.id=SubjectEquipment.subjectId 
WHERE SubjectEquipment.priority >= (SELECT numberValue FROM GlobalSetting)
ORDER BY SubjectEquipment.priority DESC;

/* Subject Type equals to single practice */ 

SELECT Subject.id, Subject.name, SubjectEquipment.priority 
FROM Subject JOIN SubjectEquipment ON Subject.id=SubjectEquipment.subjectId 
WHERE Subject.subjectTypeId=802 
ORDER BY SubjectEquipment.priority DESC;

/* Subject type equals to group practice */

SELECT Subject.id, Subject.name, SubjectEquipment.priority 
FROM Subject 
JOIN SubjectEquipment ON Subject.id=SubjectEquipment.subjectId 
WHERE Subject.subjectTypeId=804 
ORDER BY SubjectEquipment.priority DESC;

/* Subject type equals to theory with subjectEquipment priorities */
SELECT Subject.id, Subject.name FROM Subject 
JOIN SubjectEquipment ON Subject.id=SubjectEquipment.subjectId 
WHERE Subject.subjectTypeId=801 
ORDER BY SubjectEquipment.priority DESC;

/* Theory subject without requirements */ 
SELECT Subject.id, Subject.name FROM Subject 
LEFT JOIN SubjectEquipment 
ON Subject.id=SubjectEquipment.subjectId 
WHERE SubjectEquipment.subjectId IS NULL 
AND Subject.subjectTypeId=801;


/* SUBJECT SELECTS  */

/* space in use */
SELECT * FROM Space
WHERE inUse=1;

/* Space preserved to program or null */
SELECT id, name, area, people_capasity 
FROM Space 
LEFT JOIN SpaceDepartment as sd ON Space.id=sd.spaceId 
    WHERE sd.spaceId IS NULL OR id=1001 
ORDER BY sd.spaceId DESC, people_capasity ASC, area ASC;

/* People_capasity >= groupSize */ 
SELECT id, people_capasity, area 
FROM Space 
WHERE people_capasity >= (SELECT groupSize FROM Subject WHERE id=4002);

/* Enuff roomspace */
SELECT id, people_capasity, area 
FROM Space 
WHERE area >= (SELECT area FROM Subject WHERE id=4003);