/* INSERT WITH SubjectEquipment priority > Globalsettings.X */ 

INSERT INTO AllocSubject(subjectId, priority, allocRound)
SELECT Subject.id, 1, 10001
FROM Subject JOIN SubjectEquipment ON Subject.id=SubjectEquipment.subjectId
LEFT JOIN AllocSubject as al ON Subject.id=al.subjectId 
WHERE SubjectEquipment.priority >= (SELECT numberValue FROM GlobalSetting)
AND al.allocRound IS NULL
ORDER BY SubjectEquipment.priority DESC;