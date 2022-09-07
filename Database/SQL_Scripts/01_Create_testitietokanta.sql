-- --------------------------------------------------------
-- Verkkotietokone:              127.0.0.1
-- Palvelinversio:               10.9.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Versio:              12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for casedb
CREATE DATABASE IF NOT EXISTS `casedb` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `casedb`;

-- Dumping structure for taulu casedb.Department
CREATE TABLE IF NOT EXISTS `Department` (
  `Id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(60) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Tietojen vientiä ei oltu valittu.

-- Dumping structure for taulu casedb.Equipment
CREATE TABLE IF NOT EXISTS `Equipment` (
  `Id` INTEGER NOT NULL AUTO_INCREMENT,
  `equipment_name` VARCHAR(60) DEFAULT NULL,
  `priority` INTEGER DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Tietojen vientiä ei oltu valittu.

-- Dumping structure for taulu casedb.Program
CREATE TABLE IF NOT EXISTS `Program` (
  `Id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(60) NOT NULL DEFAULT '0',
  `dep_id` INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`),
  KEY `FK__department` (`dep_id`),
  CONSTRAINT `FK__department` FOREIGN KEY (`dep_id`) REFERENCES `Department` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Tietojen vientiä ei oltu valittu.

-- Dumping structure for taulu casedb.Requirement
CREATE TABLE IF NOT EXISTS `Requirement` (
  `Id` INTEGER NOT NULL AUTO_INCREMENT,
  `type` INTEGER NOT NULL DEFAULT 0,
  `subject_id` INTEGER NOT NULL,
  `equipment_id` INTEGER DEFAULT NULL,
  `participants` INTEGER DEFAULT NULL,
  `area` decimal(20,6) DEFAULT NULL,
  `hours` INTEGER DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_requirement_program` (`subject_id`) USING BTREE,
  KEY `FK_requirement_instrument` (`equipment_id`) USING BTREE,
  CONSTRAINT `FK_requirement_instrument` FOREIGN KEY (`equipment_id`) REFERENCES `Equipment` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_requirement_subject` FOREIGN KEY (`subject_id`) REFERENCES `Subject` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Tietojen vientiä ei oltu valittu.

-- Dumping structure for taulu casedb.Space
CREATE TABLE IF NOT EXISTS `Space` (
  `Id` INTEGER NOT NULL AUTO_INCREMENT,
  `area` double DEFAULT NULL,
  `maximum_pariticipants` INTEGER DEFAULT NULL,
  `available_hours` INTEGER DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Tietojen vientiä ei oltu valittu.

-- Dumping structure for taulu casedb.SpaceEquipment
CREATE TABLE IF NOT EXISTS `SpaceEquipment` (
  `Id` INTEGER NOT NULL AUTO_INCREMENT,
  `space_id` INTEGER NOT NULL DEFAULT 0,
  `equipment_id` INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`),
  KEY `FK__space` (`space_id`),
  KEY `FK__equipment` (`equipment_id`),
  CONSTRAINT `FK__equipment` FOREIGN KEY (`equipment_id`) REFERENCES `Equipment` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK__space` FOREIGN KEY (`space_id`) REFERENCES `Space` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Tietojen vientiä ei oltu valittu.

-- Dumping structure for taulu casedb.Subject
CREATE TABLE IF NOT EXISTS `Subject` (
  `Id` INTEGER NOT NULL AUTO_INCREMENT,
  `program_id` INTEGER NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK__program` (`program_id`),
  CONSTRAINT `FK__program` FOREIGN KEY (`program_id`) REFERENCES `Program` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Tietojen vientiä ei oltu valittu.

-- Dumping structure for taulu casedb.User
CREATE TABLE IF NOT EXISTS `User` (
  `Id` INTEGER NOT NULL AUTO_INCREMENT,
  `Role` VARCHAR(60) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Tietojen vientiä ei oltu valittu.

-- Dumping structure for taulu casedb.DepartmentUser
CREATE TABLE IF NOT EXISTS `DepartmentUser` (
  `Id` INTEGER NOT NULL AUTO_INCREMENT,
  `user_id` INTEGER NOT NULL,
  `department_id` INTEGER NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK__user` (`user_id`),
  KEY `FK_users_departments_department` (`department_id`),
  CONSTRAINT `FK__user` FOREIGN KEY (`user_id`) REFERENCES `User` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_users_departments_department` FOREIGN KEY (`department_id`) REFERENCES `Department` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Tietojen vientiä ei oltu valittu.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
