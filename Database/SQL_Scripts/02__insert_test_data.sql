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
('Piano yksilöopetus', 1, 1, '02:30:00', 2, 40, 3004);
/* --- Insert: SubjectEquipment * --- */
INSERT INTO SubjectEquipment(subjectId, equipmentId, priority) VALUES
(4001, NULL, 5),
(4002, NULL, 3),
(4003, 2001, 1);


/* END */