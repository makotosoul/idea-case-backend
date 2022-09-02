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

-- Dumping data for table sibammjj.building: ~1 rows (approximately)
/*!40000 ALTER TABLE `building` DISABLE KEYS */;
INSERT INTO `building` (`id`, `name`) VALUES
	(1, 'Musiikkitalo');
/*!40000 ALTER TABLE `building` ENABLE KEYS */;

-- Dumping data for table sibammjj.equipment: ~1 rows (approximately)
/*!40000 ALTER TABLE `equipment` DISABLE KEYS */;
INSERT INTO `equipment` (`id`, `name`) VALUES
	(1, 'Flyygeli');
/*!40000 ALTER TABLE `equipment` ENABLE KEYS */;

-- Dumping data for table sibammjj.equipmentspace: ~0 rows (approximately)
/*!40000 ALTER TABLE `equipmentspace` DISABLE KEYS */;
INSERT INTO `equipmentspace` (`spaceId`, `equipmentId`) VALUES
	(1, 1);
/*!40000 ALTER TABLE `equipmentspace` ENABLE KEYS */;

-- Dumping data for table sibammjj.space: ~0 rows (approximately)
/*!40000 ALTER TABLE `space` DISABLE KEYS */;
INSERT INTO `space` (`id`, `buildingId`, `area`, `maxParticipants`, `startingHour`, `endingHour`) VALUES
	(1, 1, 40.5, 2, NULL, NULL);
/*!40000 ALTER TABLE `space` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
