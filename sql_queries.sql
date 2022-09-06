CREATE TABLE Program (
programId INT NOT NULL AUTO_INCREMENT,
name VARCHAR(40) NOT NULL,
participants INT(4),
numberOfGroups INT(2),
practiceHours INT(4),
PRIMARY KEY (programId)
);

INSERT INTO Program (programId, name, participants, numberOfGroups, practiceHours)
VALUES (21, "Piano pääinstrumenttina", 45, 3, 550);
INSERT INTO Program ( name, participants, numberOfGroups, practiceHours)
VALUES ("Kirkkomusiikki", 30, 2, 405);
INSERT INTO Program ( name, participants, numberOfGroups, practiceHours)
VALUES ("Kitara pääinstrumenttina", 45, 3, 405);

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

INSERT INTO Subject (subjectId, name, groupType, maxParticipants, subjectType, studyTime, duration)
VALUES (211, "Historia", "Ryhmäopetus", 20, "Teoria", 90, "3x viikossa" );
INSERT INTO Subject ( name, groupType, maxParticipants, subjectType, studyTime, duration)
VALUES ("Urkujen musiikkitunti", "Yksilöopetus", 2, "Musiikki opetus", 60, "2x viikossa" );

CREATE TABLE Space (
spaceId INT NOT NULL AUTO_INCREMENT,
roomNumber INT,
name VARCHAR(40),
size CHAR(5),
capacity INT(3),
PRIMARY KEY (spaceId)
);

INSERT INTO Space (spaceId, roomNumber, name, size, capacity)
VALUES (1, 301, "Teorialuokka", "55m2", 30);
INSERT INTO Space (roomNumber, name, size, capacity)
VALUES (440, "Organo sali", "175m2", 140);

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

INSERT INTO Equipment (equipmentId, name, movable, quantity, spaceId)
VALUES (1, "Tuolit ja pöydät", 0, 30, 1);
INSERT INTO Equipment (name, movable, quantity, spaceId)
VALUES ("Urku", 0, 3, 2);

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

INSERT INTO Class (classId, participants, subjectId)
VALUES (2111, 15, 211, 1);
INSERT INTO Class (participants, subjectId, spaceId)
VALUES (2, 212, 2);
INSERT INTO Class (participants, subjectId, spaceId)
VALUES (15, 211, 1);
INSERT INTO Class (participants, subjectId, spaceId)
VALUES (15, 211, NULL);


CREATE TABLE Participant (
participantId INT NOT NULL AUTO_INCREMENT,
programId INT, 
classId INT,
PRIMARY KEY (participantId),
FOREIGN KEY (programId) REFERENCES Program(programId),
FOREIGN KEY (classId) REFERENCES Class(classId)
);

INSERT INTO Participant (participantId, programId, classId)
VALUES (1, 21, 2111);
INSERT INTO Participant ( programId, classId)
VALUES (22, 2112);
INSERT INTO Participant ( programId, classId)
VALUES (23, 2115);

CREATE TABLE Requirement (
requirementId INT NOT NULL AUTO_INCREMENT,
requiredSquareMeter INT(5),
classId INT,
programId INT,
PRIMARY KEY (requirementId),
FOREIGN KEY (classId) REFERENCES Class(classId),
FOREIGN KEY (programId) REFERENCES Program(programId)
);

INSERT INTO Requirement (requirementId, requiredSquareMeter, classId, programId)
VALUES (1, 55, 2111, 21);

INSERT INTO Requirement (classId, programId)
VALUES (2112, 22);

INSERT INTO Requirement ( requiredSquareMeter, classId, programId)
VALUES (55, 2115, 23);

CREATE TABLE Need (
equipmentId INT,
requirementId INT,
PRIMARY KEY (equipmentId, requirementId),
FOREIGN KEY (equipmentId) REFERENCES Equipment(equipmentId),
FOREIGN KEY (requirementId) REFERENCES Requirement(requirementId)
);

INSERT INTO Need (equipmentId, requirementId)
VALUES (1,1);

INSERT INTO Need (equipmentId, requirementId)
VALUES (2,2);

INSERT INTO Need (equipmentId, requirementId)
VALUES (1,5);

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







