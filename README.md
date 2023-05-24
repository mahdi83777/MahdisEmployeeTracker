# MahdisEmployeeTracker

## Your Task

This command line application uses Node.js, Inquirer, and MySQL to manage a company's employee database. It can view, add, update and delete data from the database.

## User Story

```
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria

```
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```

## Screenshot

The following image shows the web application's appearance and functionality:

!["Circle".](./images/Output.PNG)

## Setup

Make sure Node.js and MySQL are installed. Enter your password in the connection function in server.js. Next, Open the integrated terminal and run mysql -u root -p into the root folder and enter your password. Then run source ./db/query.sql, enter, then run source ./db/seeds.sql and enter. Then run quit. Finally, run node server.js, enter and from there you can select any option and test the command line application.

## Installation

Github repository:

https://github.com/mahdi83777/MahdisEmployeeTracker

Deployed video:



## References

[Node JS] (https://www.w3schools.com/nodejs/)
