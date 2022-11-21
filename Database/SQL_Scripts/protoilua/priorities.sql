/* 
Kaikki musiikkiluokkiin menevät, joissa max(equipment.priority) >= X ja sisältää pakollisia varusteita ORDER BY MAX(equipment.priority) DESC, GroupSize ASC
Kaikki musiikkiluokkiin menevät, joissa max(equipment.priority) >= X ORDER BY MAX(equipment.priority) DESC, GroupSize ASC
Kaikki luentoluokkiin menevät, joissa max(equipment.priority) >= X ja sisältää pakollisia varusteita ja sisältää varusteita joita ei voi siirtää ORDER BY MAX(equipment.priority) DESC, GroupSize ASC
Kaikki luentoluokkiin menevät, joissa max(equipment.priority) >= X ja sisältää pakollisia varusteita ORDER BY MAX(equipment.priority) DESC, GroupSize ASC
Kaikki luentoluokkiin menevät, joissa max(equipment.priority) >= X ORDER BY MAX(equipment.priority) DESC, GroupSize ASC
Kaikki muut, joissa max(equipment.priority) >= x ORDER BY MAX(equipment.priority) DESC, groupSize ASC
Kaikki, muut joissa max(equipment.priority) < x ORDER BY MAX(equipment.priority) DESC, groupSize ASC
Kaikki joissa ei ole varusteissa ORDER BY groupSize ASC
Kaikki loput (just WHERE isAllocated = 0) MAX(Equipment.priority DESC), ORDER BY groupSize ASC
*/

SELECT * FROM AllocSubject as2 WHERE allocRound = 10002;
-- Alempaan voi vain lisätä:
-- AND Subject.spaceTypeId = 5001, jos haluaa tilatyypin mukaan 

-- sub_eq.priority >= X ORDERED BY sub_eq.priorty DESC, Subject.groupSize ASC
SELECT allSub.subjectId, allSub.allocRound, ROW_NUMBER() OVER (ORDER BY MAX(sub_eqp.priority) DESC, Subject.groupSize ASC) as "row"
       	FROM AllocSubject allSub 
        LEFT JOIN SubjectEquipment sub_eqp ON allSub.subjectId = sub_eqp.subjectId
        LEFT JOIN Subject ON allSub.subjectId = Subject.id
        WHERE allSub.allocRound = 10002
        AND isAllocated = 0
        AND (sub_eqp.priority) >= (SELECT numberValue FROM GlobalSetting gs WHERE name="x")
        GROUP BY allSub.subjectId 
        ORDER BY sub_eqp.priority DESC;
       
-- sub_eq.priority < X ORDERED BY sub_eq.priorty DESC, Subject.groupSize ASC
SELECT allSub.subjectId, allSub.allocRound, ROW_NUMBER() OVER (ORDER BY MAX(sub_eqp.priority) DESC, Subject.groupSize ASC) as "row"
       	FROM AllocSubject allSub 
        LEFT JOIN SubjectEquipment sub_eqp ON allSub.subjectId = sub_eqp.subjectId
        LEFT JOIN Subject ON allSub.subjectId = Subject.id
        WHERE allSub.allocRound = 10002
        AND isAllocated = 0
        AND (sub_eqp.priority) < (SELECT numberValue FROM GlobalSetting gs WHERE name="x")
        GROUP BY allSub.subjectId 
        ORDER BY sub_eqp.priority DESC;

-- Kaikki muut ORDER BY subject.groupSize ASC
SELECT AllocSubject.subjectId, AllocSubject.allocRound, ROW_NUMBER() OVER (ORDER BY Subject.groupSize ASC) as "row" 
FROM AllocSubject
LEFT JOIN Subject ON AllocSubject.subjectId = Subject.id
WHERE isAllocated = 0
AND allocRound = 10002;
      