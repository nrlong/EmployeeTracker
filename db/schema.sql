DROP DATABASE IF EXISTS employeetracker_db;

CREATE DATABASE	employeetracker_db;

USE employeetracker_db;

CREATE TABLE employees(
	id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    salary DECIMAL(10,0),
    department_id INT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE department(
	id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(60) NULL,
    PRIMARY KEY(id)
);

CREATE TABLE employee_role(
	id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary VARCHAR(10),
    deparment_id INT,
    PRIMARY KEY(id)
);