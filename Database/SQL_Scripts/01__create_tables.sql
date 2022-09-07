/* --- 01 CREATE TABLES --- */
CREATE TABLE IF NOT EXISTS Department (
    id          INTEGER       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(60)     UNIQUE NOT NULL,
    description VARCHAR(16000)    NOT NULL,

    PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `User` (
  id INTEGER NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  isAdmin BOOLEAN NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `DepartmentPlanner` (
  id INTEGER NOT NULL AUTO_INCREMENT,
  departmentId INTEGER,
  userId INTEGER,
  PRIMARY KEY (id),
  CONSTRAINT FOREIGN KEY (departmentId) REFERENCES Department (id) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION,
  CONSTRAINT FOREIGN KEY (userId) REFERENCES User (id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS Campus (
    id          INTEGER       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(60)     UNIQUE NOT NULL,
    description VARCHAR(16000)    NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Building (
    id          INTEGER       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(60)     UNIQUE NOT NULL,
    description VARCHAR(16000)    NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Space (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    room_size       SMALLINT UNSIGNED,
    people_capasity SMALLINT UNSIGNED,
    building_id     INT UNSIGNED NOT NULL,
    availableFrom   TIME,
    availableTo     TIME,
    classesFrom     TIME,
    classesTo       TIME,

    PRIMARY KEY (`Id`)
    CONSTRAINT FK_space_building
    	FOREIGN KEY (building_id) REFERENCES Building(id)
    	ON DELETE CASCADE
    	ON UPDATE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `Equipment` (
  `Id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(60) DEFAULT NULL,
  movable BOOLEAN,
  `priority` INTEGER DEFAULT NULL,
  description VARCHAR(16000)    NOT NULL,
  PRIMARY KEY (`Id`)
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
    `Id`            INTEGER NOT NULL AUTO_INCREMENT,
    name            VARCHAR(60),
    groupSize       INTEGER,
    groupCount      INTEGER,
    sessionLength   TIME,
    sessionCount    INTEGER,
  `area` decimal(20,6) DEFAULT NULL,
    `program_id` INTEGER NOT NULL,
  
  PRIMARY KEY (`Id`),

  CONSTRAINT `FK__program` FOREIGN KEY (`program_id`) REFERENCES `Program` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `SubjectEquipment` (
    subject_id      INTEGER     NOT NULL,
    equipment_id    INTEGER     NOT NULL,
    priority        INTEGER     NOT NULL,

    PRIMARY KEY (subject_id,equipment_id),

    CONSTRAINT `FK_SubjectEquipment_Subject` FOREIGN KEY (`subject_id`) REFERENCES `Subject` (`Id`) 
        ON DELETE NO ACTION ON UPDATE NO ACTION
    CONSTRAINT `FK_SubjectEquipment_Equipment` FOREIGN KEY (`equipment_id`) REFERENCES `Equipment` (`Id`) 
        ON DELETE NO ACTION ON UPDATE NO ACTION,
  
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;