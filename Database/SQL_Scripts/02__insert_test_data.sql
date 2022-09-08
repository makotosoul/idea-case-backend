USE casedb;

/* INSERTS */
/* --- Insert: Department --- */

/* --- Insert: `User` --- */

/* --- Insert: DepartmentPlanner * --- */

/* --- Insert: Campus --- */

/* --- Insert: Building * --- */

/* --- Insert: Space * --- */

/* --- Insert: Equipment --- */

/* --- Insert: SpaceEquipment * --- */

/* --- Insert: Program * --- */

/* --- Insert: Subject * --- */
INSERT INTO Subject(name, groupSize, groupCount, sessionLength, sessionCount, area, programId) VALUES
('Saksan kielen perusteet', 10, 2, '01:30:00', 2, 100.5, 3002),
('Viulistien kehonhallinta', 20, 1, '00:30:00', 2, 200, 3003),
('Piano yksilöopetus', 1, 1, '02:30:00', 2, 40, 3004),
('Trumpetin ryhmäsoitto', 10, 1,'01:30:00', 3, 80, 3002),
('Kirkkomusiikin ryhmäsoittoa', 15, 4, '02:30:00', 2, 300, 3005),
('Ruotsin kielen oppintunti', 40, 2, '01:45:00', 1, 100, 3006),
('Kitaran soiton perusteet', 15, 1, '01:30:00', 2, 60, 3007);

/* --- Insert: SubjectEquipment * --- */
INSERT INTO SubjectEquipment(subjectId, equipmentId, priority) VALUES
(4001, 2001, 5),
(4002, 2002, 3),
(4003, 2003, 1),
(4004, 2004, 1),
(4005, 2005, 2),
(4006, 2001, 5),
(4007, 2006, 2);

/* END */