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
    ('DocMus', 'Aineryhmän kuvaus'),
    ('Kansanmusiikki ja Global music & GLOMAS', 'Aineryhmän kuvaus'),
    ('Kirkkomusiikki ja urut', 'Aineryhmän kuvaus'),
    ('Jouset ja kamarimusiikki', 'Aineryhmän kuvaus'),
    ('Puhaltimet, lyömäsoittimet ja harppu', 'Aineryhmän kuvaus'),
    ('Sävellys ja musiikinteoria', 'Aineryhmän kuvaus'),
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
	('Urut', 0, 600, 'Valtavan kokoinen soitin'),
	('Kantele', 1, 50, 'Väinämöisen soitin'),
    ('Nokkahuilu', 1, 50, 'Kaikki rakastaa'),
    ('Rumpusetti, Jazz', 1, 250, 'Ääntä riittää'),
    ('Äänityslaitteisto Xyz', 0, 900, '8 kanavaa'),
    ('Viulu', 1, 50, 'Jousisoitin, 4-kieltä'),
    ('Alttoviulu', 1, 50, 'Jousisoitin, suurempi kuin viulu'),
    ('Sello', 1, 100, 'Suuri, 4-kielinen jousisoitin'),
    ('Kontrabasso', 1, 100, 'Suurin jousisoitin'),
    ('Piano', 0, 900, 'Piano-opetus vaatii kaksi flyygeliä'),
    ('Kitara', 1, 100, '6-kielinen soitin'),
    ('Harmonikka', 1, 200, 'Hanuri'),
    ('Fortepiano', 0, 500, 'Pianon varhaismuoto'),
    ('Huilu', 1, 50, 'puhallinsoitin'),
    ('Oboe', 1, 100, 'puupuhallinsoitin'),
    ('Tuuba', 1, 100, 'Suurehko puhallinsoitin');
    
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
    ('Global Music', 112),
    ('Harmonikka', 103),
    ('Harppu', 114),
    ('Jousisoitin', 113),
    ('Kansanmusiikki', 111),
    ('Kirkkomusiikki', 112),
    ('Korrepetitio', 102),
    ('Lyömäsoitin', 114),
    ('Musiikin johtaminen', 108),
    ('Musiikin tohtorikoulutus', 110),
    ('Musiikkikasvatus', 104),
    ('Musiikkiteknologia', 107),
    ('Nordic Master in Folk Music', 111),
    ('Nordic Master in Jazz', 101),
    ('Oopperalaulu', 102),
    ('Pianokamarimusiikki ja lied', 103),
    ('Puhallinsoitin', 114),
    ('Sävellys', 115),
    ('Taidejohtaminen ja yrittäjyys', 109),
    ('Urut', 112),
    ('Vanha musiikki', 106),
    ('Avoin Kampus', 110);

/* --- Insert: Subject * --- */
INSERT INTO Subject(name, groupSize, groupCount, sessionLength, sessionCount, area, programId, subjectTypeId) VALUES
('Saksan kielen perusteet', 10, 2, '01:30:00', 2, 100.5, 3002, 801),
('Viulistien kehonhallinta', 20, 1, '00:30:00', 2, 200, 3013, 801),
('Piano yksilöopetus', 1, 1, '02:30:00', 2, 40, 3001, 802),
('Trumpetin ryhmäsoitto', 10, 1,'01:30:00', 3, 80, 3002, 804),
('Kirkkomusiikin ryhmäsoittoa', 15, 4, '02:30:00', 2, 30, 3015, 804),
('Ruotsin kielen oppintunti', 40, 2, '01:45:00', 1, 100, 3031, 801),
('Kitaran soiton perusteet', 15, 1, '01:30:00', 2, 60, 3003, 804),
('Kontrabassonsoitto, taso A', 1, 3, '01:00:00', 2, 10, 3013, 802),
('Kanteleensoitto (musiikin kandidaatti)', 1, 4, '01:00:00', 1, 10, 3004, 802),
('Yhteissoitto / kantele', 16, 1, '01:30:00', 1, 20, 3004, 804),
('Urkujensoitto (musiikin kandidaatti)', 1, 3, '01:30:00', 1, 20, 3029, 802),
('Yhteissoitto / kitara', 34, 1, '01:30:00', 1, 35, 3003, 804),
('Huilunsoitto, taso A', 1, 5, '01:00:00', 1, 10, 3026, 802),
('Fortepianonsoitto 1', 1, 7, '01:10:00', 2, 30, 3001, 802),
('Nokkahuilunsoitto, taso B', 1, 3, '01:00:00', 1, 10, 3026, 802),
('Viulunsoitto, taso D', 1, 12, '01:00:00', 1, 10, 3013, 802 ),
('Tuubansoitto, taso C', 1, 5, '01:00:00', 1, 15, 3026, 802 ),
('Harmonikansoitto (musiikin kandidaatti)', 1, 2, '01:00:00', 1, 15, 3011, 802),
('Jazz, rumpujensoitto, taso B', 1, 4, '01:00:00', 1, 15, 3017, 802);

/* --- Insert: SubjectEquipment * --- */
INSERT INTO SubjectEquipment(subjectId, equipmentId, priority) VALUES
(4001, 2001, 90),
(4001, 2002, 900),
(4001, 2003, 90),
(4001, 2004, 40),
(4005, 2005, 170),
(4006, 2001, 90),
(4007, 2006, 900);

/* --- Insert: AllocRound * --- */
INSERT INTO AllocRound(name, isSeasonAlloc, userId) VALUES
("Testikierros", 0, 201),
("Kevät 2023", 1, 201);

/* --- Insert: AllocSubject * --- */
INSERT INTO AllocSubject(subjectId, allocRound, isAlloc, allocatedDate) VALUES
(4001, 10001, 1, '2022-09-21'),
(4002, 10001, 1, '2022-09-21'),
(4003, 10001, 1, '2022-09-21'),
(4004, 10001, 1, '2022-09-21'),
(4005, 10001, 1, '2022-09-21'),
(4006, 10001, 1, '2022-09-21'),
(4007, 10001, 1, '2022-09-21'),
(4001, 10002, 1, '2022-09-21'),
(4002, 10002, 0, '2022-09-21');


/* --- Insert: AllocCurrentRoundUser * --- */
INSERT INTO AllocCurrentRoundUser(allocId, userId) VALUES
(10001, 201),
(10001, 202),
(10002, 201);

/* END */