USE employeeDB;

INSERT INTO department (name)
VALUES ('Design'), ('Marketing');

INSERT INTO role (title, salary, departmentId)
VALUES ('Web Designer', 80000, 1), ('Design Director', 60000, 1), ('Print Director', 50000, 1), ('Creative Designer', 30000, 2), ('Marketing Manager', 90000, 2), ('Social Media Executive', 40000, 2);

INSERT INTO employee (firstName, lastName, roleId)
VALUES ('Youssef', 'Hamade', 1), ('Alex', 'Johnson', 4), ('Cameron', 'Ruddy', 5);

INSERT INTO employee (firstName, lastName, roleId, managerId)
VALUES ('Lucy', 'Moffin', 2, 2), ('Lisa', 'Meyer', 3, 1), ('Connor', 'Nachbar', 6, 3);