USE employeetracker_db;

INSERT INTO department(name)
VALUES("Overseer"),
("Hunter"),
("Warlock"),
("Crucible");

INSERT INTO employee_role(title, salary, department_id)
VALUES("Manager", 75000, 1),
("Supervisor", 55000, 2),
("Associate", 37000, 3);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES("Commander", "Zavala", 1, 1),
("Cayde", "6", 2, 1),
("Ikora", "Rey", 3, 1),
("Lord", "Shaxx", 4, 1);