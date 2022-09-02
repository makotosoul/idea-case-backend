USE siba;

INSERT INTO department (name) VALUES 
	('Piano, Harmonikka, Kitara ja Kantele'), 
	('Puhaltimet, Lyömäsoittimet ja Harput'),
	('Laulumusiikki')
; 

INSERT INTO program(name, department_id) VALUES
	('Piano', 1),
    ('Kantele', 1),
    ('Trumpetti', 2),
    ('Laulutaide', 3)
;
