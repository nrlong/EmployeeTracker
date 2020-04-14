const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: " ",
    database: "employeetracker_db"
})

connection.connect((error) => {
    if (error) throw error;
    console.log("connected as id: " + connection.threadId);
    start();
    // connection.end();
})

function start(){
    inquirer.prompt({
        name: "choice",
        type: "list",
        message: "What would you like to do?",
        choices:[
            "view department",
            "view roles",
            "view employees",
            "add deparment",
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
                addRoles();
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
        }
    })
}

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
        
    })
    start();
}

function viewEmployees(){
    let query = "SELECT * FROM employees"
    connection.query(query, function (err, res){
        if (err) throw err;
        console.table(res);
        console.log("Request Completed...");
    })
    // start();
}

function addDepartment(){
    start();
}

function addRoles(){
    start();
}

function addEmployee(){
    start();
}