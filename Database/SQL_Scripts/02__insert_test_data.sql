USE casedb;

/* INSERTS */
/* --- Insert: GlobalSettings --- */
INSERT INTO GlobalSetting(name, description, numberValue, textValue) VALUES
    ('X', 'Korkea prioriteettiarvo', 800, NULL);

/* --- Insert: Department --- */
INSERT INTO Department(name, description) VALUES
	('Jazz', 'Aineryhmän kuvaus'),
    ('Laulumusiikki', 'Aineryhmän kuvaus'),
    ('Piano, harmonikka, kitara ja kantele', 'Aineryhmän kuvaus'),
    ('Musiikkikasvatus', 'Aineryhmän kuvaus'),
    ('MuTri', "Aineryhmän kuvaus"),
    ('Vanha musiikki', "Aineryhmän kuvaus"),
    ('Musiikkiteknologia', 'Aineryhmän kuvaus'),
    ('Musiikinjohtaminen sekä orkesteri- ja kuorotoiminta', 'Aineryhmän kuvaus'),
    ('Taidejohtaminen ja yrittäjyys', 'Aineryhmän kuvaus'),
    ('Avoin Kampus', 'Aineryhmän kuvaus');

/* --- Insert: `User` --- */
INSERT INTO `User`(email, isAdmin) VALUES
    ('fake_admin@test.co', 1),
    ('fake_planner@test.co', 0),
    ('fake_planner2@test.co', 0);

/* --- Insert: DepartmentPlanner * --- */
INSERT INTO DepartmentPlanner(userId, departmentId) VALUES
    (202, 101),
    (202, 105),
    (203, 103),
    (203, 104),
    (202, 102);

/* --- Insert: Campus --- */
INSERT INTO `Campus` (`name`, `description`) VALUES
	('Siba', 'Sibeliusakatemian kampus');
/* --- Insert: Building * --- */
INSERT INTO `Building` (`name`, `description`, `campusId`) VALUES
	('Musiikkitalo', 'Sibeliusakatemian päärakennus', 301),
	('N-talo', 'Sibeliusakatemian opetus ja harjoittelu talo ', 301),
	('R-talo', 'Sibeliusakatemian konserttitalo', 301);

/* --- Insert: SubjectType --- */
INSERT INTO SubjectType(name) VALUES
    ('Teoriatunti'),
    ('Yksilösoittotunti'),
    ('Yksilöharjoitustunti'),
    ('Ryhmäsoitto');

/* --- Insert: `Space` * --- */
INSERT INTO `Space` (`name`, `area`, `people_capasity`, `buildingId`, `availableFrom`, `availableTo`, `classesFrom`, `classesTo`, `subjectTypeId`) VALUES
	('S6117', 31.0, 10, 401, '08:00:00', '21:00:00', '09:00:00', '16:00:00', 801),
	('S6104 ', 63.0, 50, 401, '08:00:00', '21:00:00', '10:00:00', '17:00:00', 804),
	('R312', 15.0, 4, 403, '08:00:00', '21:00:00', '08:00:00', '18:00:00', 802);

/* --- Insert: Equipment --- */
INSERT INTO `Equipment` (`name`, `isMovable`, `priority`, `description`) VALUES
	('Kontrabasso', 1, 110, 'Kaunis puinen soitin, jolla on neljä kieltä.'),
	('Urut', 0, 600, 'Valtavan kokoinen soitin'),
	('Kantele', 1, 50, 'Väinämöisen soitin'),
    ('Nokkahuilu', 1, 50, 'Kaikki rakastaa'),
    ('Rumpusetti, Jazz', 1, 250, 'Ääntä riittää'),
    ('Äänityslaitteisto Xyz', 0, 900, '8 kanavaa');
    
/* --- Insert: SpaceEquipment * --- */
INSERT INTO `SpaceEquipment` (`spaceId`, `equipmentId`) VALUES
	(1001, 2001),
	(1002, 2002),
	(1003, 2003);
    
/* --- Insert: Program * --- */
INSERT INTO Program (name , departmentId) VALUES
    ('Piano', 103),
    ('Laulutaide pääaineena', 102),
    ('Kitara', 103),
    ('Kantele', 103),
    ('Jazzsävellys', 101),
    ('Laulutaide', 102),
    ('Musiikinteoria pääaineena', 104),
    ('Jazzmusiikin instrumentti- tai lauluopinnot pääaineena', 102),
    ('Fortepiano', 103),
    ('Avoin Kampus', 110);

/* --- Insert: Subject * --- */
INSERT INTO Subject(name, groupSize, groupCount, sessionLength, sessionCount, area, programId, subjectTypeId) VALUES
('Saksan kielen perusteet', 10, 2, '01:30:00', 2, 100.5, 3002, 801),
('Viulistien kehonhallinta', 20, 1, '00:30:00', 2, 200, 3003, 801),
('Piano yksilöopetus', 1, 1, '02:30:00', 2, 40, 3004, 802),
('Trumpetin ryhmäsoitto', 10, 1,'01:30:00', 3, 80, 3002, 804),
('Kirkkomusiikin ryhmäsoittoa', 15, 4, '02:30:00', 2, 300, 3005, 804),
('Ruotsin kielen oppintunti', 40, 2, '01:45:00', 1, 100, 3006, 801),
('Kitaran soiton perusteet', 15, 1, '01:30:00', 2, 60, 3007, 804);

/* --- Insert: SubjectEquipment * --- */
INSERT INTO SubjectEquipment(subjectId, equipmentId, priority) VALUES
(4001, 2001, 5),
(4001, 2002, 3),
(4001, 2003, 1),
(4001, 2004, 1),
(4005, 2005, 2),
(4006, 2001, 5),
(4007, 2006, 2);

/* END */