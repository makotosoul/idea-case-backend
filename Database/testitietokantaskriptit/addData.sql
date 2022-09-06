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

-- Dumping data for table siba.department: ~3 rows (suunnilleen)
INSERT INTO `department` (`Id`, `dep_name`) VALUES
	(1, 'urunsoitto'),
	(2, 'urunsoitto'),
	(3, 'lyomasoittimet');

-- Dumping data for table siba.equipment: ~2 rows (suunnilleen)
INSERT INTO `equipment` (`Id`, `equipment_name`, `priority`) VALUES
	(1, 'bongo', 110),
	(2, 'urut', 60);

-- Dumping data for table siba.program: ~3 rows (suunnilleen)
INSERT INTO `program` (`Id`, `prog_name`, `dep_id`) VALUES
	(1, 'urku', 1),
	(2, 'vasara', 3),
	(3, 'rumpu', 3);

-- Dumping data for table siba.requirement: ~3 rows (suunnilleen)
INSERT INTO `requirement` (`Id`, `type`, `subject_id`, `equipment_id`, `participants`, `area`, `hours`) VALUES
	(1, 7, 1, NULL, NULL, NULL, 20),
	(2, 6, 1, NULL, NULL, 40.100000, NULL),
	(3, 4, 1, 1, NULL, NULL, NULL);

-- Dumping data for table siba.space: ~1 rows (suunnilleen)
INSERT INTO `space` (`Id`, `area`, `maximum_pariticipants`, `available_hours`) VALUES
	(1, 30, 10, 37);

-- Dumping data for table siba.spaces_equipment: ~1 rows (suunnilleen)
INSERT INTO `spaces_equipment` (`Id`, `space_id`, `equipment_id`) VALUES
	(1, 1, 2);

-- Dumping data for table siba.subject: ~2 rows (suunnilleen)
INSERT INTO `subject` (`Id`, `program_id`) VALUES
	(2, 1),
	(1, 3);

-- Dumping data for table siba.user: ~0 rows (suunnilleen)
INSERT INTO `user` (`Id`, `Role`) VALUES
	(1, 'ADMIN'),
	(2, 'PLANNER');

-- Dumping data for table siba.users_departments: ~0 rows (suunnilleen)
INSERT INTO `users_departments` (`Id`, `user_id`, `department_id`) VALUES
	(1, 2, 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
