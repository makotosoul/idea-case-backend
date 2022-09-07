/* --- 01 CREATE TABLES --- */
CREATE TABLE IF NOT EXISTS Department (
    id          INTEGER         NOT NULL AUTO_INCREMENT,
    name        VARCHAR(255)    UNIQUE NOT NULL,
    description VARCHAR(16000)  NOT NULL,

    PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `User` (
  id            INTEGER         NOT NULL AUTO_INCREMENT,
  name          VARCHAR(255)    UNIQUE NOT NULL,
  email         VARCHAR(255)    UNIQUE NOT NULL,
  isAdmin       BOOLEAN         NOT NULL,

  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=201 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `DepartmentPlanner` (
  departmentId INTEGER,
  userId INTEGER,

  PRIMARY KEY (id),
  CONSTRAINT FOREIGN KEY (departmentId) REFERENCES Department(id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION,
  CONSTRAINT FOREIGN KEY (userId) REFERENCES User(id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS Campus (
    id          INTEGER         NOT NULL AUTO_INCREMENT,
    name        VARCHAR(255)    UNIQUE NOT NULL,
    description VARCHAR(16000)  NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Building (
    id          INTEGER       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(255)     UNIQUE NOT NULL,
    description VARCHAR(16000)    NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Space (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    area       SMALLINT UNSIGNED,
    people_capasity SMALLINT UNSIGNED,
    buildingId     INT UNSIGNED NOT NULL,
    availableFrom   TIME,
    availableTo     TIME,
    classesFrom     TIME,
    classesTo       TIME,

    PRIMARY KEY (`id`)
    CONSTRAINT FK_space_building
    	FOREIGN KEY (buildingId) REFERENCES Building(id)
    	ON DELETE CASCADE
    	ON UPDATE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `Equipment` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) DEFAULT NULL,
  movable BOOLEAN,
  `priority` INTEGER DEFAULT NULL,
  description VARCHAR(16000)    NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `SpaceEquipment` (
  `spaceId` INTEGER NOT NULL,
  `equipmentId` INTEGER NOT NULL,
  KEY `FK__space` (`spaceId`),
  KEY `FK__equipment` (`equipmentId`),
  CONSTRAINT `FK__equipment` FOREIGN KEY (`equipmentId`) REFERENCES `Equipment` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK__space` FOREIGN KEY (`spaceId`) REFERENCES `Space` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `Program` (
  id INTEGER NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  -- participants INT(4),
  departmentId INTEGER,
  PRIMARY KEY (id),
  CONSTRAINT FOREIGN KEY (departmentId) REFERENCES Department (id) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS `Subject` (
    `id`            INTEGER NOT NULL AUTO_INCREMENT,
    name            VARCHAR(255),
    groupSize       INTEGER,
    groupCount      INTEGER,
    sessionLength   TIME,
    sessionCount    INTEGER,
  `area` decimal(20,6) DEFAULT NULL,
    `programId` INTEGER NOT NULL,
  
  PRIMARY KEY (`id`),

  CONSTRAINT `FK__program` FOREIGN KEY (`programId`) REFERENCES `Program` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `SubjectEquipment` (
    subjectId      INTEGER     NOT NULL,
    equipmentId    INTEGER     NOT NULL,
    priority        INTEGER     NOT NULL,

    PRIMARY KEY (subjectId,equipmentId),

    CONSTRAINT `FK_SubjectEquipment_Subject` FOREIGN KEY (`subjectId`) REFERENCES `Subject` (`id`) 
        ON DELETE NO ACTION ON UPDATE NO ACTION
    CONSTRAINT `FK_SubjectEquipment_Equipment` FOREIGN KEY (`equipmentId`) REFERENCES `Equipment` (`id`) 
        ON DELETE NO ACTION ON UPDATE NO ACTION,
  
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;