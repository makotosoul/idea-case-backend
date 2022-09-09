INSERT INTO Department (name) VALUES
	('Jazzin aineryhmä'),
    ('Laulumusiikin aineryhmä'),
    ('Pianon, harmonikan, kitaran ja kanteleen aineryhmä');

INSERT INTO `User` (name, isAdmin, email) VALUES
    ('admin', 1, 'e@e.e'),
    ('planner', 0, 'e@e.e');

INSERT INTO Program (name , departmentId) VALUES
    ('Piano', 3),
    ('Laulutaide pääaineena', 2),
    ('Jazzmusiikin instrumentti- tai lauluopinnot pääaineena', 1);

INSERT INTO DepartmentPlanner (departmentId, userId) VALUES
    (1, 2),
    (3, 2);