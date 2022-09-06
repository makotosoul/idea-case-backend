
INSERT INTO Program (programId, name, participants, numberOfGroups, practiceHours)
VALUES (21, "Piano pääinstrumenttina", 45, 3, 550);
INSERT INTO Program ( name, participants, numberOfGroups, practiceHours)
VALUES ("Kirkkomusiikki", 30, 2, 405);
INSERT INTO Program ( name, participants, numberOfGroups, practiceHours)
VALUES ("Kitara pääinstrumenttina", 45, 3, 405);


INSERT INTO Subject (subjectId, name, groupType, maxParticipants, subjectType, studyTime, duration)
VALUES (211, "Historia", "Ryhmäopetus", 20, "Teoria", 90, "3x viikossa" );
INSERT INTO Subject ( name, groupType, maxParticipants, subjectType, studyTime, duration)
VALUES ("Urkujen musiikkitunti", "Yksilöopetus", 2, "Musiikki opetus", 60, "2x viikossa" );


INSERT INTO Space (spaceId, roomNumber, name, size, capacity)
VALUES (1, 301, "Teorialuokka", "55m2", 30);
INSERT INTO Space (roomNumber, name, size, capacity)
VALUES (440, "Organo sali", "175m2", 140);


INSERT INTO Equipment (equipmentId, name, movable, quantity, spaceId)
VALUES (1, "Tuolit ja pöydät", 0, 30, 1);
INSERT INTO Equipment (name, movable, quantity, spaceId)
VALUES ("Urku", 0, 3, 2);


INSERT INTO Class (classId, participants, subjectId)
VALUES (2111, 15, 211, 1);
INSERT INTO Class (participants, subjectId, spaceId)
VALUES (2, 212, 2);
INSERT INTO Class (participants, subjectId, spaceId)
VALUES (15, 211, 1);
INSERT INTO Class (participants, subjectId, spaceId)
VALUES (15, 211, NULL);



INSERT INTO Participant (participantId, programId, classId)
VALUES (1, 21, 2111);
INSERT INTO Participant ( programId, classId)
VALUES (22, 2112);
INSERT INTO Participant ( programId, classId)
VALUES (23, 2115);


INSERT INTO Requirement (requirementId, requiredSquareMeter, classId, programId)
VALUES (1, 55, 2111, 21);

INSERT INTO Requirement (classId, programId)
VALUES (2112, 22);

INSERT INTO Requirement ( requiredSquareMeter, classId, programId)
VALUES (55, 2115, 23);

INSERT INTO Need (equipmentId, requirementId)
VALUES (1,1);

INSERT INTO Need (equipmentId, requirementId)
VALUES (2,2);

INSERT INTO Need (equipmentId, requirementId)
VALUES (1,5);

