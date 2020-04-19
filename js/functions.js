const connection = require("../db/db");
const inquirer = require("inquirer");
const cTable = require('console.table');

function start(){
    inquirer.prompt({
        name: "choice",
        type: "list",
        message: "What would you like to do?",
        choices:[
            "view employees",
            "view department",
            "view roles",
            "add department",
            "add roles",
            "add employee",
            "update employee role",
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

            case "update employee role":
            updateRole();
            break;

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
    },
]).then(function(answer){
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
    let departmentID;
    for(let i =0; i < currentDepts.length; i++){
        if(currentDepts[i] === answer.department_list){
            departmentID = i + 1
        };
    };

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

    // create comparison variable for role id placement
    let roleID;
    for(let i = 0; i < currentRoles.length; i++){
        if(currentRoles[i] === answer.role_id){
            roleID = i + 1;
        };
    };
    let query = "INSERT INTO employees(first_name, last_name, role_id) VALUES (?, ?, ?)";
    connection.query(query, [answer.first_name, answer.last_name, roleID], function(err, res){
        if(err) throw err;
        console.log("Employee has been added...");
        start();
    });
    
});
};
// update roles
function updateRole(){
    let query = "SELECT * FROM employees";
    connection.query(query, function(err, res){
        if (err) throw err;
        let currentEmployees = res.map(function(names){
            return `${names.first_name} ${names.last_name}` 
        });
        let query2 = "SELECT * FROM employee_role";
        let currentRoles2 = [];
        connection.query(query2, function(err, res){
            if (err) throw err;
            for(let i=0; i < res.length; i++){
                currentRoles2.push(res[i].title)
            };
        
        inquirer.prompt([{
            type: "list",
            name: "employee_names",
            message: "Please select the employee you would like to update.",
            choices: currentEmployees
        },{
            type: "list",
            name: "update_role",
            message: "What is the new role?",
            choices: currentRoles2
        },
        ]).then(function(answer){
            //create comparison variable for role ID
            let id;
            for(let i=0; i< currentEmployees.length; i++){
                if(currentEmployees[i] === answer.employee_names){
                    console.log(id);
                    id = i + 1;
                    break;
                };
            };
            // create role variable
            let roleID2;
            for(let i =0; i < currentRoles2.length; i++){
                if(currentRoles2[i] === answer.update_role){
                    roleID2 = i + 1;
                    break;
                };
            };

            console.log(roleID2, id);
            let query3 = "UPDATE employees SET role_id = ? WHERE id = ?"
            connection.query(query3, [roleID2, id], function(err, res){
                if(err) throw err;
                console.log("The role has been succesfully updated...");
                start();
            });
        });
    });
    });
}

module.exports = {
    start : start()
}