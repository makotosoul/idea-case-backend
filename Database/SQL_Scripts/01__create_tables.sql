USE casedb;

/* --- 01 CREATE TABLES --- */

CREATE TABLE IF NOT EXISTS GlobalSetting (
    id          INTEGER        NOT NULL AUTO_INCREMENT,
    name        VARCHAR(255)   UNIQUE NOT NULL,
    description VARCHAR(16000),
    numberValue INTEGER,
    textValue   VARCHAR(255),
    
    PRIMARY KEY (id)
)   ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS Department (
    id          INTEGER         NOT NULL AUTO_INCREMENT,
    name        VARCHAR(255)    UNIQUE NOT NULL,
    description VARCHAR(16000)  ,

    PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `User` (
    id          INTEGER         NOT NULL AUTO_INCREMENT,
    email       VARCHAR(255)    UNIQUE NOT NULL,
    isAdmin     BOOLEAN         NOT NULL DEFAULT 0,

    PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=201 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS DepartmentPlanner (
    departmentId    INTEGER     NOT NULL,
    userId          INTEGER     NOT NULL,

    PRIMARY KEY (departmentId, userId),

    CONSTRAINT FOREIGN KEY (departmentId) REFERENCES Department(id) 
        ON DELETE CASCADE 
        ON UPDATE NO ACTION,
    CONSTRAINT FOREIGN KEY (userId) REFERENCES `User`(id) 
        ON DELETE CASCADE 
        ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS Building (
    id          INTEGER         NOT NULL AUTO_INCREMENT,
    name        VARCHAR(255)    UNIQUE NOT NULL,
    description VARCHAR(16000), 

    PRIMARY KEY (id)

) ENGINE=InnoDB AUTO_INCREMENT=401 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS SpaceType (
    id      INTEGER NOT NULL AUTO_INCREMENT,
    name    VARCHAR(255) NOT NULL,
    description VARCHAR(16000),

    PRIMARY KEY(id)

) ENGINE=InnoDB AUTO_INCREMENT=5001 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `Space` (
    id              INTEGER NOT NULL AUTO_INCREMENT,
    name            VARCHAR(255) NOT NULL,
    area            DECIMAL(5,1),
    info            VARCHAR(16000),
    personLimit     INTEGER,
    buildingId      INTEGER NOT NULL,
    availableFrom   TIME,
    availableTo     TIME,
    classesFrom     TIME,
    classesTo       TIME,
	inUse			BOOLEAN DEFAULT 1,
    spaceTypeId     INTEGER,

    CONSTRAINT AK_UNIQUE_name_in_building UNIQUE(buildingId, name),

    PRIMARY KEY (id),

    CONSTRAINT `FK_space_building`
    	FOREIGN KEY (`buildingId`) REFERENCES `Building`(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    
    CONSTRAINT `FK_space_spaceType`
    	FOREIGN KEY (`spaceTypeId`) REFERENCES `SpaceType`(id)
            ON DELETE SET NULL
            ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1001 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS Equipment (
    id            INTEGER             NOT NULL AUTO_INCREMENT,
    name          VARCHAR(255)        UNIQUE NOT NULL,
    isMovable     BOOLEAN             NOT NULL,
    priority      INTEGER             NOT NULL DEFAULT 0,
    description   VARCHAR(16000),

    PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=2001 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS SpaceEquipment (
    spaceId       INTEGER     NOT NULL,
    equipmentId   INTEGER     NOT NULL,
    
    PRIMARY KEY(spaceId,equipmentId),

    CONSTRAINT `FK_SpaceEquipment_Equipment` 
        FOREIGN KEY (`equipmentId`) REFERENCES `Equipment` (id) 
            ON DELETE CASCADE 
            ON UPDATE CASCADE,
    CONSTRAINT `FK_SpaceEquipment_Space` 
        FOREIGN KEY (`spaceId`) REFERENCES `Space` (id) 
            ON DELETE CASCADE 
            ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS Program (
  id            INTEGER         NOT NULL AUTO_INCREMENT,
  name          VARCHAR(255)    NOT NULL UNIQUE,
  
  departmentId  INTEGER         NOT NULL,

  PRIMARY KEY (id),
  
  CONSTRAINT FOREIGN KEY (departmentId) REFERENCES Department(id) 
    ON DELETE NO ACTION       
    ON UPDATE NO ACTION       
) ENGINE=InnoDB AUTO_INCREMENT=3001 DEFAULT CHARSET=latin1;

-- Tarvitaanko Program-taulussa tätä:
-- participants INT(4),

CREATE TABLE IF NOT EXISTS `Subject` (
    id              INTEGER         NOT NULL AUTO_INCREMENT,
    name            VARCHAR(255)    UNIQUE,
    groupSize       INTEGER,
    groupCount      INTEGER,
    sessionLength   TIME,
    sessionCount    INTEGER,
    area            DECIMAL(5,1) DEFAULT NULL,         
    programId       INTEGER NOT NULL,
    spaceTypeId     INTEGER,

    CONSTRAINT AK_Subject_unique_name_in_program UNIQUE (programId, name),
  
    PRIMARY KEY (id),

    CONSTRAINT `FK_Subject_Program` FOREIGN KEY (`programId`) 
        REFERENCES `Program`(id) 
        ON DELETE NO ACTION 
        ON UPDATE NO ACTION,

    CONSTRAINT `FK_Subject_SpaceType` FOREIGN KEY (`SpaceTypeId`)
        REFERENCES `SpaceType`(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4001 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS SubjectEquipment (
    subjectId      INTEGER     NOT NULL,
    equipmentId    INTEGER     NOT NULL,
    priority       INTEGER     NOT NULL,
    obligatory     BOOLEAN     DEFAULT 0,

    PRIMARY KEY (subjectId, equipmentId),

    CONSTRAINT `FK_SubjectEquipment_Subject` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,

    CONSTRAINT `FK_SubjectEquipment_Equipment` FOREIGN KEY (`equipmentId`) REFERENCES `Equipment`(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


/* CREATE ALLOC TABLES */

CREATE TABLE IF NOT EXISTS AllocRound (
    id              INTEGER     NOT NULL AUTO_INCREMENT,
    date            TIMESTAMP   NOT NULL DEFAULT current_timestamp(),
    name            VARCHAR(255) NOT NULL,
    isSeasonAlloc   BOOLEAN,
    userId          INTEGER     NOT NULL,
    description     VARCHAR(16000),
    lastModified    TIMESTAMP   NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),

    PRIMARY KEY(id),
    
    CONSTRAINT `FK_AllocRound_User` FOREIGN KEY (`userId`)
        REFERENCES `User`(id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE

)ENGINE=InnoDB AUTO_INCREMENT=10001 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS AllocSubject (
    subjectId       INTEGER     NOT NULL,
    allocRound      INTEGER     NOT NULL,
    isAllocated     BOOLEAN     DEFAULT 0,
    cantAllocate    BOOLEAN     DEFAULT 0,
    priority        INTEGER,
    allocatedDate   TIMESTAMP, 
    
    PRIMARY KEY(subjectId, allocRound), 

    CONSTRAINT `FK_AllocSubject_Subject` FOREIGN KEY (`subjectId`)
        REFERENCES `Subject`(id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE,

    CONSTRAINT `FK_AllocSubject_AllocRound` FOREIGN KEY (`allocRound`)
        REFERENCES `AllocRound`(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE  
) ENGINE=InnoDB CHARSET=latin1;

CREATE TABLE IF NOT EXISTS AllocSpace (
    subjectId       INTEGER     NOT NULL,
    allocRound      INTEGER     NOT NULL,
    spaceId         INTEGER     NOT NULL,
    totalTime       TIME,

    PRIMARY KEY(subjectId, allocRound, spaceId),

    CONSTRAINT `FK_AllocSpace_AllocSubject`
        FOREIGN KEY (`subjectId`, `allocRound`)
        REFERENCES `AllocSubject` (subjectId, allocRound)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT `FK_AllocSpace_Space`
        FOREIGN KEY (`spaceId`)
        REFERENCES `Space` (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS AllocSubjectSuitableSpace (
    allocRound  INTEGER     NOT NULL,
    subjectId   INTEGER     NOT NULL,
    spaceId     INTEGER     NOT NULL,

    PRIMARY KEY(allocRound, subjectId, spaceId),

    CONSTRAINT `FK_AllocSubjectSpace_AllocSubject`
        FOREIGN KEY(`allocRound`, `subjectId`)
        REFERENCES `AllocSubject` (allocRound, subjectId)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT `FK_AllocSubjectSpace_Space`
        FOREIGN KEY (`spaceId`)
        REFERENCES `Space` (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS AllocSpaceMissingEquipment (
    allocRound  INTEGER     NOT NULL,
    subjectId   INTEGER     NOT NULL,
    equipmentId INTEGER     NOT NULL,

    PRIMARY KEY(allocRound, subjectId, equipmentId),

    CONSTRAINT `FK_AllocSubjectEquipmentMissing_AllocSubject`
        FOREIGN KEY(`allocRound`, `subjectId`)
        REFERENCES `AllocSubject` (allocRound, subjectId)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

        CONSTRAINT `FK_AllocSpaceMissingEquipment_Equipment`
        FOREIGN KEY (`equipmentId`)
        REFERENCES `Equipment` (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
        
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS AllocCurrentRoundUser (
    allocId     INTEGER     NOT NULL,
    userId      INTEGER,
    
    PRIMARY KEY(allocId, userId),
    
    CONSTRAINT `FK_AllocCurrentRoundUser_AllocRound` 
        FOREIGN KEY (`allocId`) 
        REFERENCES `AllocRound` (id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
        
    CONSTRAINT `FK_AllocCurrentRoundUser_User` 
        FOREIGN KEY (`userId`) 
        REFERENCES `User` (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;