USE casedb;

INSERT INTO Department (name) VALUES 
	('Piano, Harmonikka, Kitara ja Kantele'), 
	('Puhaltimet, Lyömäsoittimet ja Harput'),
	('Laulumusiikki')
; 

INSERT INTO Program(name, departmentId) VALUES
	('Piano', 1),
    ('Kantele', 1),
    ('Trumpetti', 2),
    ('Laulutaide', 3)
;
