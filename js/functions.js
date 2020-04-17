const connection = require("../db/db");
const mysql = require("mysql");
const inquirer = require("inquirer");
// const connection = require("./db/db")
const cTable = require('console.table');

function start(){
    inquirer.prompt({
        name: "choice",
        type: "list",
        message: "What would you like to do?",
        choices:[
            "view department",
            "view roles",
            "view employees",
            "add department",
            "add roles",
            "add employee",
            // "update employee role",
            "Quit"
        ]
    }).then(function(answer){
        switch(answer.choice){
            
            case "view department": 
            viewDepartment();
            break;

            case "view roles":
            viewRoles();
            break;

            case "view employees":
            viewEmployees();
            break;

            case "add department":
            addDepartment();
            break;

            case "add roles":
            addRole();
            break;

            case "add employee":
            addEmployee();
            break;

            // case "update employee role":
            //     updateEmployeeRole();
            // break;

            default:
            console.log("Thank you for using this service!")
            connection.end();
        };
    });
};

function viewDepartment(){
    let query = "SELECT * FROM department";
    connection.query(query, function(err, res){
        if(err) throw err;
        console.table(res);
        console.log("Request Completed...");
        start();
    })
}

function viewRoles(){
    let query = "SELECT * FROM employee_role"
    connection.query(query, function(err, res){
        if(err) throw err;
        console.table(res);
        console.log("Request Completed...");
        start();
    })
    
}

function viewEmployees(){
    let query = "SELECT employees.first_name, employees.last_name, employee_role.title, employee_role.salary, department.name  FROM employees LEFT JOIN employee_role ON employee_role.id = employees.role_id LEFT JOIN department ON employee_role.department_id = department.id";
    connection.query(query, function (err, res){
        if (err) throw err;
        console.table(res);
        console.log("Request Completed...");
        start();
    })
}

function addDepartment(){
    inquirer.prompt([{
        type: "input",
        name: "name_department",
        message: "What is the name of the department you would like to add?"
    }]).then(function(answer){
    connection.query("INSERT INTO department(name) VALUES(?)", [answer.name_department], function(err, res){
        if(err) throw err;
        console.log("Department has been succesfully added...")
        start();
    })
})
}

function addRole(){
    let currentDepts = [];
    let query = "SELECT * FROM department";
    connection.query(query, function(err, res){
        
        for(let i =0; i < res.length; i++){
            currentDepts.push(res[i].name);
        };
        // console.log(currentDepts);
    })
    inquirer.prompt([{
        type: "input",
        name: "role_name",
        message: "Please name the New Role you would like to add."
    },{
       type: "input",
       name: "role_salary",
       message: "Please enter salary." 
    },{
        type: "list",
        name: "department_list",
        message: "Select department.",
        choices: currentDepts
    },
]).then(function(answer){
    console.log(answer);
    let departmentID;
    for(let i =0; i < currentDepts.length; i++){
        if(currentDepts[i] === answer.department_list){
            departmentID = i + 1
        }
    };
    // console.log(departmentID);

    let query = "INSERT INTO employee_role(title, salary, department_id) VALUES(?, ?, ?)";
    connection.query(query, [answer.role_name, answer.role_salary, departmentID], function(err, res){
        if (err) throw err;
        console.log("Role has been added...");
        start();
    })
})   
};

function addEmployee(){
    let currentRoles = [];
    let query = "SELECT * FROM employee_role";
    connection.query(query, function(err, res){
        
        for(let i = 0; i < res.length; i++){
            currentRoles.push(res[i].title);
        };
        console.log(currentRoles);
    });
    inquirer.prompt([{
        type: "input",
        name: "first_name",
        message: "Enter First Name."
    },{
        type: "input",
        name: "last_name",
        message: "Enter Last Name."
    },{
        type: "list",
        name: "role_id",
        message: "Please select a role",
        choices: currentRoles
    },
]).then(function(answer){
    console.log(answer)
    let roleID;
    for(let i = 0; i < currentRoles.length; i++){
        if(currentRoles[i] === answer.role_id){
            roleID = i + 1;
        }
    }
    let query = "INSERT INTO employees(first_name, last_name, role_id) VALUES (?, ?, ?)";
    connection.query(query, [answer.first_name, answer.last_name, roleID], function(err, res){
        if(err) throw err;
        console.log("Employee has been added...");
        start();
    })
    
})
}

module.exports = {
    start : start()
}