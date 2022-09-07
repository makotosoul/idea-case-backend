CREATE TABLE Program (
    programId INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    participants INT(4),
    numberOfGroups INT(2),
    practiceHours INT(4),
    PRIMARY KEY (programId)
);

CREATE TABLE Subject (
    subjectId INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(60),
    groupType VARCHAR(60),
    maxParticipants INT(3),
    subjectType VARCHAR(60),
    studyTime INT(3),
    duration VARCHAR(15),
    PRIMARY KEY (subjectId)
);

CREATE TABLE Space (
    spaceId INT NOT NULL AUTO_INCREMENT,
    roomNumber INT,
    name VARCHAR(60),
    size CHAR(5),
    capacity INT(3),
    PRIMARY KEY (spaceId)
);

CREATE TABLE Equipment (
    equipmentId INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(60),
    movable BOOLEAN,
    intendedUse VARCHAR(60),
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