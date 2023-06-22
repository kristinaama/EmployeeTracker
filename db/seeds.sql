INSERT INTO departments (department_name)
VALUES
("Sales"),
("Engineering"),
("HR");

INSERT INTO roles (department_id, job_title, salary)
VALUES
(1, "Account Executive", 60000),
(1, "Sales Manager", 80000),
(2, "Mechanical Engineer", 120000),
(2, "Software Developer", 130000),
(2, "Software Developer", 150000),
(3, "Consultant", 70000);

INSERT INTO employees (first_name, last_name, role_id)
VALUES
("John", "Smith", 2),
("Sara", "Tonin", 1),
("Flint", "Lockwood", 4),
("Ron", "Weasley", 3),
("Shania", "Twain", 5);
