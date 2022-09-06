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


-- Dumping database structure for siba
CREATE DATABASE IF NOT EXISTS `siba` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `siba`;

-- Dumping structure for taulu siba.department
CREATE TABLE IF NOT EXISTS `department` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `dep_name` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Tietojen vientiä ei oltu valittu.

-- Dumping structure for taulu siba.equipment
CREATE TABLE IF NOT EXISTS `equipment` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `equipment_name` varchar(50) DEFAULT NULL,
  `priority` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Tietojen vientiä ei oltu valittu.

-- Dumping structure for taulu siba.program
CREATE TABLE IF NOT EXISTS `program` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `prog_name` varchar(50) NOT NULL DEFAULT '0',
  `dep_id` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`),
  KEY `FK__department` (`dep_id`),
  CONSTRAINT `FK__department` FOREIGN KEY (`dep_id`) REFERENCES `department` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Tietojen vientiä ei oltu valittu.

-- Dumping structure for taulu siba.requirement
CREATE TABLE IF NOT EXISTS `requirement` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `type` int(11) NOT NULL DEFAULT 0,
  `subject_id` int(11) NOT NULL,
  `equipment_id` int(11) DEFAULT NULL,
  `participants` int(11) DEFAULT NULL,
  `area` decimal(20,6) DEFAULT NULL,
  `hours` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_requirement_program` (`subject_id`) USING BTREE,
  KEY `FK_requirement_instrument` (`equipment_id`) USING BTREE,
  CONSTRAINT `FK_requirement_instrument` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_requirement_subject` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Tietojen vientiä ei oltu valittu.

-- Dumping structure for taulu siba.space
CREATE TABLE IF NOT EXISTS `space` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `area` double DEFAULT NULL,
  `maximum_pariticipants` int(11) DEFAULT NULL,
  `available_hours` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Tietojen vientiä ei oltu valittu.

-- Dumping structure for taulu siba.spaces_equipment
CREATE TABLE IF NOT EXISTS `spaces_equipment` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `space_id` int(11) NOT NULL DEFAULT 0,
  `equipment_id` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`),
  KEY `FK__space` (`space_id`),
  KEY `FK__equipment` (`equipment_id`),
  CONSTRAINT `FK__equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK__space` FOREIGN KEY (`space_id`) REFERENCES `space` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Tietojen vientiä ei oltu valittu.

-- Dumping structure for taulu siba.subject
CREATE TABLE IF NOT EXISTS `subject` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `program_id` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK__program` (`program_id`),
  CONSTRAINT `FK__program` FOREIGN KEY (`program_id`) REFERENCES `program` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Tietojen vientiä ei oltu valittu.

-- Dumping structure for taulu siba.user
CREATE TABLE IF NOT EXISTS `user` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Role` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Tietojen vientiä ei oltu valittu.

-- Dumping structure for taulu siba.users_departments
CREATE TABLE IF NOT EXISTS `users_departments` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK__user` (`user_id`),
  KEY `FK_users_departments_department` (`department_id`),
  CONSTRAINT `FK__user` FOREIGN KEY (`user_id`) REFERENCES `user` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_users_departments_department` FOREIGN KEY (`department_id`) REFERENCES `department` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Tietojen vientiä ei oltu valittu.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
