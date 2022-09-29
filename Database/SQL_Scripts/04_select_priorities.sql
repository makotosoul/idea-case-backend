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