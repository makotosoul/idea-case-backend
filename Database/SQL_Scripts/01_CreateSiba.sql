-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.6.9-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET NAMES utf8 */
;
/*!50503 SET NAMES utf8mb4 */
;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */
;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */
;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */
;
-- Dumping database structure for casedb
DROP DATABASE IF EXISTS `casedb`;
CREATE DATABASE IF NOT EXISTS `casedb`
/*!40100 DEFAULT CHARACTER SET utf8mb4 */
;
USE `casedb`;
-- Dumping structure for table casedb.Building
CREATE TABLE IF NOT EXISTS `Building` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- Data exporting was unselected.
-- Dumping structure for table casedb.Equipment
CREATE TABLE IF NOT EXISTS `Equipment` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- Data exporting was unselected.
CREATE TABLE IF NOT EXISTS `Space` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `buildingId` INTEGER NOT NULL,
  `area` double NOT NULL,
  `maxParticipants` INTEGER NOT NULL,
  `startingHour` TIME NULL DEFAULT NULL,
  `endingHour` TIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_space_building` (`buildingId`),
  CONSTRAINT `FK_space_building` FOREIGN KEY (`buildingId`) REFERENCES `Building` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- Dumping structure for table casedb.SpaceEquipment
CREATE TABLE IF NOT EXISTS `SpaceEquipment` (
  `spaceId` INTEGER NOT NULL,
  `equipmentId` INTEGER NOT NULL,
  KEY `FK__space` (`spaceId`),
  KEY `FK__equipment` (`equipmentId`),
  CONSTRAINT `FK__equipment` FOREIGN KEY (`equipmentId`) REFERENCES `Equipment` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK__space` FOREIGN KEY (`spaceId`) REFERENCES `Space` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- Data exporting was unselected.
-- Dumping structure for table casedb.Space
-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */
;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */
;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */
;