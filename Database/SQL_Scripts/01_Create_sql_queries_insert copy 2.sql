CREATE TABLE Program (
programId INT NOT NULL AUTO_INCREMENT,
name VARCHAR(40) NOT NULL,
participants INT(4),
numberOfGroups INT(2),
practiceHours INT(4),
PRIMARY KEY (programId)
);


CREATE TABLE Subject (
subjectId INT NOT NULL AUTO_INCREMENT,
name VARCHAR(40),
groupType VARCHAR(40),
maxParticipants INT(3),
subjectType VARCHAR(40),
studyTime INT(3),
duration VARCHAR(15),
PRIMARY KEY (subjectId)
);


CREATE TABLE Space (
spaceId INT NOT NULL AUTO_INCREMENT,
roomNumber INT,
name VARCHAR(40),
size CHAR(5),
capacity INT(3),
PRIMARY KEY (spaceId)
);


CREATE TABLE Equipment (
equipmentId INT NOT NULL AUTO_INCREMENT,
name VARCHAR(40),
movable BOOLEAN,
intendedUse VARCHAR(40),
quantity INT(3),
spaceId INT,
PRIMARY KEY (equipmentId),
FOREIGN KEY (spaceId) REFERENCES Space(spaceId)
);


CREATE TABLE Class (
classId INT NOT NULL AUTO_INCREMENT,
participants INT(2),
start DATETIME(6),
end DATETIME(6),
subjectId INT,
spaceId INT,
PRIMARY KEY (classId),
FOREIGN KEY (subjectId) REFERENCES Subject(subjectId),
FOREIGN KEY (spaceId) REFERENCES Space(spaceId)
);



CREATE TABLE Participant (
participantId INT NOT NULL AUTO_INCREMENT,
programId INT, 
classId INT,
PRIMARY KEY (participantId),
FOREIGN KEY (programId) REFERENCES Program(programId),
FOREIGN KEY (classId) REFERENCES Class(classId)
);


CREATE TABLE Requirement (
requirementId INT NOT NULL AUTO_INCREMENT,
requiredSquareMeter INT(5),
classId INT,
programId INT,
PRIMARY KEY (requirementId),
FOREIGN KEY (classId) REFERENCES Class(classId),
FOREIGN KEY (programId) REFERENCES Program(programId)
);



CREATE TABLE Need (
equipmentId INT,
requirementId INT,
PRIMARY KEY (equipmentId, requirementId),
FOREIGN KEY (equipmentId) REFERENCES Equipment(equipmentId),
FOREIGN KEY (requirementId) REFERENCES Requirement(requirementId)
);


# Vaatimukset / tarve
SELECT n.requirementId, p.programId, p.name AS "Pääaine", p.practiceHours AS "Harjoitustuntien määrä", e.name AS "Varusteen nimi", e.quantity AS "Varustuksen määrä",r.requiredSquareMeter AS "Tilan tarve (m2)", c.participants AS "Osallistuja määrä", 
su.name AS "Aine", su.groupType AS "Ryhmä tyyppi", su.subjectType AS "Opetus tyyppi", su.studyTime AS "Opetuksen kesto", su.duration AS "Opetuksen määrä"
FROM Need n
INNER JOIN Requirement r USING (requirementId)
INNER JOIN Equipment e USING (equipmentId)
INNER JOIN Program p USING (programId)
INNER JOIN Class c USING (classId)
INNER JOIN Subject su USING (subjectId);

# Laskennan jälkeen
SELECT c.participants AS "Osallistuja määrä", 
su.name AS "Aine", su.groupType AS "Ryhmä tyyppi", su.subjectType AS "Opetus tyyppi", su.studyTime AS "Opetuksen kesto", su.duration AS "Opetuksen määrä", s.roomNumber AS "Huone", s.name AS "Huoneen nimi"
FROM Class c
INNER JOIN Subject su USING (subjectId)
INNER JOIN Space s USING (spaceId);







