// Require modules
const mysql = require('mysql2');
const inquirer = require('inquirer');
const chalk = require('chalk');
const consoleTable = require('console.table');
const util = require("util");

// Connect to database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Mahdi321123',
  database: 'employeeDB'
});

// Start connection
connection.connect(err => {
  if (err) throw err;
  console.log(' ');
  start();
});

// Promisifies the connection query
const queryAsync = util.promisify(connection.query).bind(connection);

// Prompts user for the list of options
async function start() {
	const answer = await inquirer.prompt({
		name: 'selectOption',
		type: 'list',
		message: 'What would you like to do?',
		choices: [
			'View All Departments',
			'View All Roles',
			'View All Employees',
			'Add A Department',
			'Add A Role',
			'Add An Employee',
			'Delete A Department',
			'Delete A Role',
			'Delete An Employee',
			'Update A Role\'s Salary',
			'Update An Employee\'s Role',
			'Update An Employee\'s Manager',
			'Exit'
		]
	});

    // Check which option was selected
	switch (answer.selectOption) {
		case 'View All Departments':
			viewDepartments();
			break;
		case 'View All Roles':
			viewRoles();
			break;
		case 'View All Employees':
			viewEmployees();
			break;
		case 'Add A Department':
			addDepartment();
			break;
		case 'Add A Role':
			addRole();
			break;
		case 'Add An Employee':
			addEmployee();
			break;
		case 'Delete A Department':
			deleteDepartment();
			break;
		case 'Delete A Role':
			deleteRole();
			break;
		case 'Delete An Employee':
			deleteEmployee();
			break;
		case 'Update A Role\'s Salary':
			updateSalary();
			break;
		case 'Update An Employee\'s Role':
			updateRole();
			break;
		case 'Update An Employee\'s Manager':
			updateManager();
			break;
		case 'Exit':
			console.log(' ');
			connection.end();
			break;
	}
};

// Perform console table to view all the departments
const viewDepartments = () => {
	const query = 'SELECT * FROM department';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
    })
    start();
};

// Console table the roles
const viewRoles = () => {
	const query = 'SELECT role.id, role.title, role.salary, department.name FROM role INNER JOIN department ON role.departmentId = department.id';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
    })
    start();
};

// Console table the employees
const viewEmployees = () => {	
	const query = 'SELECT e.id, CONCAT(e.firstName, " ", e.lastName) AS employeeName, role.title, role.salary, CONCAT(m.firstName, " ", m.lastName) AS managerName FROM employee e LEFT JOIN employee m ON m.id = e.managerId INNER JOIN role ON e.roleId = role.id';
	connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
    })
    start();
};

// Use inquirer to prompt for deparment name, then insert into the department table
const addDepartment = () => {
	inquirer.prompt({
		name: 'departmentName',
		type: 'input',
		message: 'Department Name:'
	})
	.then((data) => {
		connection.query('INSERT INTO department SET ?',
			{
                // Sets the name to departmentName insterted from the user
				name: data.departmentName,
			},
            // Throw an error if unsuccessful
			function (err) {
				if (err) throw err;
			}
		);
	console.log(chalk.bold.green('\nSUCCESS:'), 'Department was added.');
    // Show table after update
	viewDepartments();
		});
};

// Use inquirer to prompt for role, then insert into the role table
const addRole = () => {
    connection.query('SELECT * FROM department', (err, departments) => {
        if (err) console.log(err);
        departments = departments.map((department) => {
            return {
                name: department.name,
                value: department.id,
            };
        });
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'newRole',
                    message: 'Enter title of new role...'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter salary of new role...',
                },
                {
                    type: 'list',
                    name: 'departmentId',
                    message: 'Enter department of new role...',
                    choices: departments,
                },
            ])
            .then((data) => {
                connection.query(
                    'INSERT INTO role SET ?',
                    {
                        title: data.newRole,
                        salary: data.salary,
                        departmentId: data.departmentId,
                    },
                    function (err) {
                        if (err) throw err;
                    }
                );
                console.log('added new employee role!')
                viewRoles();
            });

    });

};



// Use inquirer to prompt for employee, then insert into the employee table
const addEmployee = () => {
    connection.query('SELECT * FROM role', (err, roles) => {
        if (err) console.log(err);
        roles = roles.map((role) => {
            return {
                name: role.title,
                value: role.id,
            };
        });
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'Enter first name of new employee...'
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'Enter last name of new employee...'
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'Enter new employee role...',
                    choices: roles,
                },
                {
                    type: 'list',
                    name: 'managerId',
                    message: 'select a manager id...',
                    choices: [1, 3, 5, 6, 7]
                }
            ])
            .then((data) => {
                console.log(data.role);
                connection.query(
                    'INSERT INTO employee SET ?',
                    {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        roleId: data.role,
                        managerId: data.managerId
                    },
                    (err) => {
                        if (err) throw err;
                        console.log('Updated Employee Roster;');
                        viewEmployees();

                    }
                );
            });

    });

};

// Delete the selected department in the department table
async function deleteDepartment() {
	const res = await queryAsync('SELECT * FROM department');
	const answer = await inquirer.prompt({
		name: 'department',
		type: 'list',
		message: 'Department to Delete:',
		choices: () => {
			const departments = [];
			for (let i of res) {
				departments.push(i.name);
			}
			return departments;
		}
	});
	await queryAsync('DELETE FROM department WHERE ?', { name: answer.department });
	console.log(chalk.bold.green('\nSUCCESS:'), 'Department was deleted.');
	viewDepartments();
};

// Delete the selected role in the role table
async function deleteRole() {
	const res = await queryAsync('SELECT * FROM role');
	const answer = await inquirer.prompt({
		name: 'role',
		type: 'list',
		message: 'Role to Delete:',
		choices: () => {
			const roles = [];
			for (let i of res) {
				roles.push(i.title);
			}
			return roles;
		}
	});		
	await queryAsync('DELETE FROM role WHERE ?', { title: answer.role });
	console.log(chalk.bold.bgCyan('\nSUCCESS:'), 'Role was deleted.');
	viewRoles();
};

// Delete the selected employee in the employee table
async function deleteEmployee() {
	const res = await queryAsync('SELECT employee.id, CONCAT(employee.firstName, " ", employee.lastName) AS employeeName, employee.roleId, employee.managerId FROM employee');	
	const answer = await inquirer.prompt({
		name: 'employee',
		type: 'list',
		message: 'Employee to Delete:',
		choices: () => {
			const names = [];
			for (let i of res) {
				names.push(i.employeeName);
			}
			return names;
		}
	});		
	let deleteId;	
	for (let i of res) {
		if (i.employeeName === answer.employee) {
			deleteId = i.id;
		}
	}		
	await queryAsync('DELETE FROM employee WHERE ?', { id: deleteId });
	console.log(chalk.bold.bgCyan('\nSUCCESS:'), 'Employee was deleted.');
	viewEmployees();
};

// Update selected salary in salary table
async function updateSalary() {
	const res = await queryAsync('SELECT * FROM role');	
	const answer = await inquirer.prompt([
		{
			name: 'title',
			type: 'list',
			message: 'Role:',
			choices: () => {
				const roles = [];
				for (let i of res) {
					roles.push(i.title);
				}
				return roles;
			}
		},
		{
			name: 'salary',
			type: 'input',
			message: 'New Salary:',
			validate: value => {
			  if (isNaN(value) === false) return true;
			  return false;
			}
		}
	]);				
	await queryAsync('UPDATE role SET salary = ? WHERE title = ?', [answer.salary, answer.title]);	
	console.log(chalk.bold.green('\nSUCCESS:'), 'Salary was updated.');
	viewRoles();
};

// Update the selected role id in the employee table
async function updateRole() {
	const resE = await queryAsync('SELECT employee.id, CONCAT(employee.firstName, " ", employee.lastName) AS employeeName, employee.roleId, employee.managerId FROM employee');	
	const answerE = await inquirer.prompt({
		name: 'employee',
		type: 'list',
		message: 'Employee to Update:',
		choices: () => {
			const names = [];
			for (let i of resE) {
				names.push(i.employeeName);
			}
			return names;
		}
	});
	const resR = await queryAsync('SELECT * FROM role');	
	const answerR = await inquirer.prompt({
		name: 'role',
		type: 'list',
		message: 'New Role:',
		choices: () => {
			const roles = [];
			for (let i of resR) {
				roles.push(i.title);
			}
			return roles;
		}
	});	
	const select = await queryAsync('SELECT employee.id, CONCAT(employee.firstName, " ", employee.lastName) AS employeeName, employee.roleId, role.title FROM employee INNER JOIN role ON employee.roleId = role.id');	
	let employeeId;	
	for (let i of select) {
		if (i.employeeName === answerE.employee) {
			employeeId = i.id;
		}
	}	
	let newRoleId;
	for (let i of resR) {
		if (i.title === answerR.role) {
			newRoleId = i.id;
		}
	}
	await queryAsync('UPDATE employee SET roleId = ? WHERE id = ?', [newRoleId, employeeId]);	
	console.log(chalk.bold.green('\nSUCCESS:'), 'Role was updated.');
	viewEmployees();
};

// Update the selected manager id in the employee table
async function updateManager() {
	const res = await queryAsync('SELECT e.id, CONCAT(e.firstName, " ", e.lastName) AS employeeName, e.managerId, CONCAT(m.firstName, " ", m.lastName) AS managerName FROM employee e LEFT JOIN employee m ON m.id = e.managerId');	
	const answer = await inquirer.prompt([
		{
			name: 'employee',
			type: 'list',
			message: 'Employee to Update:',
			choices: () => {
				const names = [];
				for (let i of res) {
					names.push(i.employeeName);
				}
				return names;
			}
		},
		{
			name: 'manager',
			type: 'list',
			message: 'New Manager:',
			choices: () => {
				const names = ['None'];
				for (let i of res) {
					names.push(i.employeeName);
				}
				return names;
			}
		}
	]);	
	let employeeId;
	let newManagerId;
	for (let i of res) {
		if (i.employeeName === answer.employee) {
			employeeId = i.id;
		}
		if (i.employeeName === answer.manager) {
			newManagerId = i.id;
		}
	}	
	await queryAsync('UPDATE employee SET managerId = ? WHERE id = ?', [newManagerId, employeeId]);	
	console.log(chalk.bold.green('\nSUCCESS:'), 'Manager was updated.');
	viewEmployees();
};