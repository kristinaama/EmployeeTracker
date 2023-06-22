
// Import the node packages and directories required
const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
const cTable = require('console.table'); 

require('dotenv').config()

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'business_db'
});

// Function to View All Employees
const viewEmployees = () => {
    db.connect(function(err) {
        if (err) console.log(err);
        db.query("SELECT * FROM employees", function (err, result, fields) {
          if (err) console.log(err);
          console.table(result);
        });
      });
};

// Function to Add Employees
const addEmployees = () => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'fistName',
        message: "What is the employee's first name?",
        validate: addFirst => {
          if (addFirst) {
              return true;
          } else {
              console.log('Please enter a first name.');
              return false;
          }
        }
      },
      {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
        validate: addLast => {
          if (addLast) {
              return true;
          } else {
              console.log('Please enter a last name.');
              return false;
          }
        }
      }
    ])
      .then(answer => {
      const params = [answer.fistName, answer.lastName]
  
      // grab roles from roles table
      const roleSql = `SELECT roles.role_id, roles.job_title FROM roles`;
    
      db.promise().query(roleSql, (err, data) => {
        if (err) console.log(err); 
        
        const roles = data.map(({ role_id, role_title }) => ({ name: job_title, value: id }));
  
        inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "What is the employee's role?",
                choices: roles
              }
            ])
              .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role);
  
                const managerSql = `SELECT * FROM employees`;
  
                db.promise().query(managerSql, (err, data) => {
                  if (err) console.log(err);
  
                  const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
                  inquirer.prompt([
                    {
                      type: 'list',
                      name: 'manager',
                      message: "Who is the employee's manager?",
                      choices: managers
                    }
                  ])
                    .then(managerChoice => {
                      const manager = managerChoice.manager;
                      params.push(manager);
  
                      const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                      VALUES (?, ?, ?, ?)`;
  
                      db.query(sql, params, (err, result) => {
                      if (err) console.log(err);
                      console.log("Employee has been added!")
  
                      showEmployees();
                });
              });
            });
          });
       });
    });
  };

// Function to Update Employees
const updateEmployees = () => {
    const employeeSql = `SELECT * FROM employees`;
  
    db.promise().query(employeeSql, (err, data) => {
      if (err) console.log(err); 
  
    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
      inquirer.prompt([
        {
          type: 'list',
          name: 'name',
          message: "Which employee would you like to update?",
          choices: employees
        }
      ])
        .then(empChoice => {
          const employee = empChoice.name;
          const params = []; 
          params.push(employee);
  
          const roleSql = `SELECT * FROM roles`;
  
          db.promise().query(roleSql, (err, data) => {
            if (err) console.log(err); 
  
            const roles = data.map(({ id, title }) => ({ name: title, value: id }));
            
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'role',
                  message: "What is the employee's new role?",
                  choices: roles
                }
              ])
                  .then(roleChoice => {
                  const role = roleChoice.role;
                  params.push(role); 
                  
                  let employee = params[0]
                  params[0] = role
                  params[1] = employee
  
                  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
  
                  db.query(sql, params, (err, result) => {
                    if (err) console.log(err);
                  console.log("Employee has been updated!");
                
                  viewEmployees();
            });
          });
        });
      });
    });
  };


// Function to View All Roles
    const viewRoles = () => {
        db.connect(function(err) {
            if (err) console.log(err);
            db.query("SELECT departments.department_name AS department_name, roles.job_title, roles.salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id", function (err, result, fields) {
              if (err) console.log(err);
              console.table(result);
            });
          });
    };

// Function to Add Roles
const addRoles = () => {
    db.query('SELECT * FROM departments', (err, departments) => {
        if (err) console.log(err);
        departments = departments.map((departments) => {
            return {
                name: departments.name,
                value: departments.id,
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
                db.query(
                    'INSERT INTO roles SET ?',
                    {
                        title: data.newRole,
                        salary: data.salary,
                        department_id: data.departmentId,
                    },
                    function (err) {
                        if (err) console.log(err);
                    }
                );
                console.log('Added new employee role!')
                viewRoles();
            });

    });

};


// Function to View All Departments
    const viewDepartments = () => {
        db.connect(function(err) {
            if (err) console.log(err);
            db.query("SELECT * FROM departments", function (err, result, fields) {
              if (err) console.log(err);
              console.table(result);
            });
          });
    };

// Function to Add Departments
const addDepartments = () => {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'addDept',
        message: "What department do you want to add?",
        validate: addDept => {
          if (addDept) {
              return true;
          } else {
              console.log('Please enter a department');
              return false;
          }
        }
      }
    ])
      .then(answer => {
        const sql = `INSERT INTO departments (name)
                    VALUES (?)`;
        db.query(sql, answer.addDept, (err, result) => {
          if (err) console.log(err);
          console.log('Added ' + answer.addDept + " to departments!"); 
  
          viewDepartments();
      });
    });
  };

// userResponses() function will prompt the user to answer questions in the command line
function userResponses() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'choices',
                message: 'What would you like to do?',
                choices: ['View All Employees', 'View All Roles', 'View All Departments', 'Update Employee Role', 'Add Employee', 'Add Role', 'Add Department']
            },
// Conditional statement will check which user input was selected
        ]).then(function (results) {
            if (results.choices == 'View All Employees') {
                // TODO add code for viewing all employees
                viewEmployees();
                //userResponses();
            } else if (results.choices == 'Add Employee') {
                // TODO add code for adding employees to table
                addEmployees();
                //userResponses();
            } else if (results.choices == 'Update Employee Role') {
                // TODO add code for updating employee table
                updateEmployees();
                //userResponses();
            } else if (results.choices == 'View All Roles') {
                // TODO add code for viewing all roles
                viewRoles();
                //userResponses();
            } else if (results.choices == 'Add Role') {
                // TODO add code for adding role to table
                addRoles();
                //userResponses();
            } else if (results.choices == 'View All Departments') {
                // TODO add code for viewing all departments
                viewDepartments();
                //userResponses();
            } else if (results.choices == 'Add Department') {
                // TODO add code for adding a department to table
                addDepartments();
                //userResponses();
            } else {
                console.log("Error! Please make another selection.");
                userResponses();
        }
    });
};

// init() function will begin the userResponses() function
function init() {
    userResponses();
}

// The init() function will run when application starts
init();