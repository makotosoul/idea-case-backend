# Vaatimukset / tarve
SELECT n.requirementId,
    p.programId,
    p.name AS "Pääaine",
    p.practiceHours AS "Harjoitustuntien määrä",
    e.name AS "Varusteen nimi",
    e.quantity AS "Varustuksen määrä",
    r.requiredSquareMeter AS "Tilan tarve (m2)",
    c.participants AS "Osallistuja määrä",
    su.name AS "Aine",
    su.groupType AS "Ryhmä tyyppi",
    su.subjectType AS "Opetus tyyppi",
    su.studyTime AS "Opetuksen kesto",
    su.duration AS "Opetuksen määrä"
FROM Need n
    INNER JOIN Requirement r USING (requirementId)
    INNER JOIN Equipment e USING (equipmentId)
    INNER JOIN Program p USING (programId)
    INNER JOIN Class c USING (classId)
    INNER JOIN Subject su USING (subjectId);

# Laskennan jälkeen
SELECT c.participants AS "Osallistuja määrä",
    su.name AS "Aine",
    su.groupType AS "Ryhmä tyyppi",
    su.subjectType AS "Opetus tyyppi",
    su.studyTime AS "Opetuksen kesto",
    su.duration AS "Opetuksen määrä",
    s.roomNumber AS "Huone",
    s.name AS "Huoneen nimi"
FROM Class c
    INNER JOIN Subject su USING (subjectId)
    INNER JOIN Space s USING (spaceId);