SELECT departments.department_name AS department_name, roles.job_title, roles.salary
FROM roles
LEFT JOIN departments
ON roles.department_id = departments.id

-- SELECT roles.job_title AS employees.first_name, employees.last_name, job_title,
-- FROM employees
-- LEFT JOIN roles