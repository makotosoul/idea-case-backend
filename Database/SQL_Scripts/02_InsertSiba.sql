-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.6.9-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping data for table casedb.Building: ~1 rows (approximately)
/*!40000 ALTER TABLE `Building` DISABLE KEYS */;
INSERT INTO `Building` (`id`, `name`) VALUES
	(1, 'Musiikkitalo');
/*!40000 ALTER TABLE `Building` ENABLE KEYS */;

-- Dumping data for table casedb.Equipment: ~1 rows (approximately)
/*!40000 ALTER TABLE `Equipment` DISABLE KEYS */;
INSERT INTO `Equipment` (`id`, `name`) VALUES
	(1, 'Flyygeli');
/*!40000 ALTER TABLE `Equipment` ENABLE KEYS */;

-- Dumping data for table casedb.SpaceEquipment: ~0 rows (approximately)
/*!40000 ALTER TABLE `SpaceEquipment` DISABLE KEYS */;
INSERT INTO `SpaceEquipment` (`spaceId`, `equipmentId`) VALUES
	(1, 1);
/*!40000 ALTER TABLE `SpaceEquipment` ENABLE KEYS */;

-- Dumping data for table casedb.Space: ~0 rows (approximately)
/*!40000 ALTER TABLE `Space` DISABLE KEYS */;
INSERT INTO `Space` (`id`, `buildingId`, `area`, `maxParticipants`, `startingHour`, `endingHour`) VALUES
	(1, 1, 40.5, 2, NULL, NULL);
/*!40000 ALTER TABLE `Space` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
