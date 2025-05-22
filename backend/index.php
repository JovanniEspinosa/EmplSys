<?php
include './db.php';
include './header.php';

header('Content-Type: application/json');

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'checkAuth':
        checkAuth();
        break;
    case 'fetchUserDetails':
        fetchUserDetails();
        break;
    case 'loginUser':
        loginUser();
        break;
    case 'logoutUser':
        logoutUser();
        break;
    case 'addNewUser':
        addNewUser();
        break;
    case 'fetchActivityLogs':
        fetchActivityLogs();
        break;
    case 'fetch':
        fetchData();
        break;
    case 'add':
        addEmployee();
        break;
    case 'departments':
        fetchDepartments();
        break;
    case 'roles':
        fetchRoles();
        break;
    case 'loginWithRole':
        loginUserWithRole();
        break;
    case 'getEmployee':
        getEmployee();
        break;
    case 'updateEmployee':
        updateEmployee();
        break;
    case 'edit':
        editEmployee();
        break;
    case 'delete':
        deleteEmployee();
        break;
    case 'removeEmployee':
        removeEmployee();
        break;
    case 'getAllUsersCount':
        getAllUsersCount();
        break;
    case 'fetchAllEmployees':
        fetchAllEmployees();
        break;
    case 'fetchAllUsers':
        fetchAllUsers();
        break;
    case 'addNewEmployee':
        addNewEmployee();
        break;
    case 'updateAvatar':
        updateAvatar();
        break;
    default:
        echo json_encode(['type' => 'error', 'message' => 'Invalid action']);
        break;
}

function checkAuth()
{
    global $connect;

    session_start();

    $user_id = $_SESSION['user_id'];
    $role = $_SESSION['role'];

    if (!isset($user_id)) {

        $response = [
            'type' => 'error',
            'message' => 'User not Authenticated',
        ];

        echo json_encode($response);

    } else {

        $response = [
            'type' => 'success',
            'message' => 'User Authenticated',
            'role' => $role,
        ];

        echo json_encode($response);

    }


}

function loginUser()
{
    session_start();
    global $connect;

    $data = json_decode(file_get_contents("php://input"), true);
    $username = $data['username'];
    $password = $data['password'];

    $sql = "SELECT user_id, role, password, status FROM users WHERE username = ?";
    $stmt = $connect->prepare($sql);

    $stmt->bind_param('s', $username);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        if ($user['status'] === 'disabled') {
            $response = [
                'type' => 'error',
                'message' => 'Account is disabled. Please contact administrator.'
            ];
        } else if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['role'] = $user['role'];

            $response = [
                'type' => 'success',
                'message' => 'Login Success',
                'user' => $user,
                'session' => $_SESSION['user_id']
            ];
        } else {
            $response = [
                'type' => 'error',
                'message' => 'Wrong Password'
            ];
        }
    } else {
        $response = [
            'type' => 'error',
            'message' => 'Wrong Username'
        ];
    }

    echo json_encode($response);
    $stmt->close();
}

function logoutUser()
{
    session_start();

    session_abort();
}

function addNewUser()
{
    session_start();
    global $connect;

    if (!isset($_SESSION['user_id'])) {
        echo json_encode(value: [
            "type" => "error",
            "message" => "Unauthorized access"
        ]);
        return;
    }

    $user_id = $_SESSION['user_id'];
    $currentUserRole = $_SESSION['role'];

    $data = json_decode(file_get_contents("php://input"), true);
    $username = $data["username"];
    $password = $data["password"];
    $role = $data["role"];
    $dept_id = $data["dept_id"];

    if (!isset($data["username"], $data["password"], $data["role"])) {
        echo json_encode([
            "type" => "error",
            "message" => "Missing required fields"
        ]);
        return;
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (avatar, username, password, role, dept_id) VALUES (?,?,?,?,?)";

    $stmt = $connect->prepare($sql);
    $stmt->bind_param("ssssi", base64_decode($data['avatar']), $username, $hashedPassword, $role, $dept_id);

    if ($stmt->execute()) {

        $action = "add_user";
        $details = "User_ID $user_id ($currentUserRole) added user '$username' with role '$role'";

        $logSql = "INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)";
        $logStmt = $connect->prepare($logSql);
        $logStmt->bind_param("iss", $user_id, $action, $details);
        $logStmt->execute();
        $logStmt->close();

        $response = [
            "type" => "success",
            "message" => "New User Added"
        ];
    } else {

        $response = [
            "type" => "error",
            "message" => "Failed to add new user",
            'errorNo' => $connect->errno
        ];
    }

    echo json_encode($response);
    $stmt->close();

}

function fetchData()
{
    global $connect;

    $name = isset($_GET['name']) ? '%' . $connect->real_escape_string($_GET['name']) . '%' : '%';
    $role_id = isset($_GET['role_id']) ? $connect->real_escape_string($_GET['role_id']) : null;
    $dept_id = isset($_GET['dept_id']) ? $connect->real_escape_string($_GET['dept_id']) : null;

    $query = "
            SELECT employee.*, users.username, users.password, departments.dept_name, roles.role_name 
            FROM employee 
            LEFT JOIN users ON employee.user_id = users.user_id
            LEFT JOIN departments ON employee.dept_id = departments.dept_id
            LEFT JOIN roles ON employee.role_id = roles.role_id
            WHERE (employee.first_name LIKE ? OR employee.last_name LIKE ?)
        ";

    if ($role_id) {
        $query .= " AND employee.role_id = ?";
    }
    if ($dept_id) {
        $query .= " AND employee.dept_id = ?";
    }

    $stmt = $connect->prepare($query);

    if ($role_id && $dept_id) {
        $stmt->bind_param("sss", $name, $name, $role_id, $dept_id);
    } elseif ($role_id) {
        $stmt->bind_param("sss", $name, $name, $role_id);
    } elseif ($dept_id) {
        $stmt->bind_param("sss", $name, $name, $dept_id);
    } else {
        $stmt->bind_param("ss", $name, $name);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $data = [];
    while ($row = $result->fetch_assoc()) {
        if (isset($row['profile_picture'])) {
            $row['profile_picture'] = base64_encode($row['profile_picture']);
        }
        $data[] = $row;
    }

    echo json_encode($data);
    $stmt->close();
}

function removeEmployee()
{
    session_start();
    global $connect;

    $data = json_decode(file_get_contents("php://input"), true);

    $employee_id = $data['user_id'];
    $action = $data['action'];
    $new_status = $action === 'enable' ? 'active' : 'disabled';

    $user_id = $_SESSION['user_id'];
    $currentUserRole = $_SESSION['role'];

    $sql = "UPDATE users SET status = ? WHERE user_id = ?";
    $stmt = $connect->prepare($sql);
    $stmt->bind_param("ss", $new_status, $employee_id);

    if ($stmt->execute()) {
        $stmt->close();

        $action_type = $action . "_user";
        $details = "User_ID $user_id ($currentUserRole) {$action}d user_id '$employee_id'";

        $logSql = "INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)";
        $logStmt = $connect->prepare($logSql);
        $logStmt->bind_param("iss", $user_id, $action_type, $details);
        $logStmt->execute();
        $logStmt->close();

        $response = [
            "type" => "success",
            "message" => "User " . ucfirst($action) . "d"
        ];
    } else {
        $response = [
            "type" => "error",
            "message" => "Failed to " . $action . " user"
        ];
    }

    echo json_encode($response);
}

function updateEmployee()
{
    session_start();
    global $connect;

    $data = json_decode(file_get_contents("php://input"), true);

    $employee_id = $data['user_id'];
    $username = $data['username'];
    $base64Avatar = trim($data['avatar']);
    $newPass = trim($data['newPass']);
    $dept_id = isset($data['dept_id']) ? intval($data['dept_id']) : null;

    $user_id = $_SESSION['user_id'];
    $currentUserRole = $_SESSION['role'];

    $avatar = !empty($base64Avatar) ? base64_decode($base64Avatar) : null;
    $hashedPass = !empty($newPass) ? password_hash($newPass, PASSWORD_DEFAULT) : null;

    if ($avatar && $hashedPass && $dept_id) {
        $sql = "UPDATE users SET username = ?, avatar = ?, password = ?, dept_id = ? WHERE user_id = ?";
        $stmt = $connect->prepare($sql);
        $stmt->bind_param("sssii", $username, $avatar, $hashedPass, $dept_id, $employee_id);
    } elseif ($avatar && $hashedPass) {
        $sql = "UPDATE users SET username = ?, avatar = ?, password = ? WHERE user_id = ?";
        $stmt = $connect->prepare($sql);
        $stmt->bind_param("ssss", $username, $avatar, $hashedPass, $employee_id);
    } elseif ($avatar && $dept_id) {
        $sql = "UPDATE users SET username = ?, avatar = ?, dept_id = ? WHERE user_id = ?";
        $stmt = $connect->prepare($sql);
        $stmt->bind_param("ssii", $username, $avatar, $dept_id, $employee_id);
    } elseif ($hashedPass && $dept_id) {
        $sql = "UPDATE users SET username = ?, password = ?, dept_id = ? WHERE user_id = ?";
        $stmt = $connect->prepare($sql);
        $stmt->bind_param("ssii", $username, $hashedPass, $dept_id, $employee_id);
    } elseif ($avatar) {
        $sql = "UPDATE users SET username = ?, avatar = ? WHERE user_id = ?";
        $stmt = $connect->prepare($sql);
        $stmt->bind_param("sss", $username, $avatar, $employee_id);
    } elseif ($hashedPass) {
        $sql = "UPDATE users SET username = ?, password = ? WHERE user_id = ?";
        $stmt = $connect->prepare($sql);
        $stmt->bind_param("sss", $username, $hashedPass, $employee_id);
    } elseif ($dept_id) {
        $sql = "UPDATE users SET username = ?, dept_id = ? WHERE user_id = ?";
        $stmt = $connect->prepare($sql);
        $stmt->bind_param("sii", $username, $dept_id, $employee_id);
    } else {
        $sql = "UPDATE users SET username = ? WHERE user_id = ?";
        $stmt = $connect->prepare($sql);
        $stmt->bind_param("ss", $username, $employee_id);
    }

    if ($stmt->execute()) {
        $stmt->close();

        $action = "update_user";
        $details = "User_ID $user_id ($currentUserRole) updated user_id '$employee_id' with username '$username'";
        if ($dept_id)
            $details .= ", changed department to ID $dept_id";
        if ($avatar)
            $details .= ", updated avatar";
        if ($hashedPass)
            $details .= ", changed password";

        $logSql = "INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)";
        $logStmt = $connect->prepare($logSql);
        $logStmt->bind_param("iss", $user_id, $action, $details);
        $logStmt->execute();
        $logStmt->close();

        $response = [
            "type" => "success",
            "message" => "User updated successfully"
        ];
    } else {
        $response = [
            "type" => "error",
            "message" => "Failed to update user"
        ];
    }

    echo json_encode($response);
}



function addEmployee()
{
    global $connect;

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data['first_name'], $data['last_name'], $data['dept_id'], $data['role_id'], $data['job_title'], $data['email'], $data['contact_number'], $data['address'], $data['username'], $data['password'], $data['profile_picture'])) {
        echo json_encode(['error' => true, 'message' => 'Invalid input']);
        return;
    }

    // Insert into users table
    $stmtUser = $connect->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmtUser->bind_param("ss", $data['username'], $data['password']);

    if ($stmtUser->execute()) {
        // Get the generated user_id
        $user_id = $stmtUser->insert_id;

        // Insert into employee table
        $stmtEmployee = $connect->prepare("INSERT INTO employee (
                first_name, last_name, dept_id, role_id, job_title,
                email, contact_number, address, username, password, user_id, profile_picture, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");

        $stmtEmployee->bind_param(
            "ssssssssssss",
            $data['first_name'],
            $data['last_name'],
            $data['dept_id'],
            $data['role_id'],
            $data['job_title'],
            $data['email'],
            $data['contact_number'],
            $data['address'],
            $data['username'],
            $data['password'],
            $user_id, // Use the user_id from the users table
            base64_decode($data['profile_picture'])
        );

        if ($stmtEmployee->execute()) {
            echo json_encode(['type' => 'success', 'message' => 'Employee added successfully']);
        } else {
            echo json_encode(['type' => 'error', 'message' => 'Failed to add employee']);
        }

        $stmtEmployee->close();
    } else {
        echo json_encode(['type' => 'error', 'message' => 'Failed to create user']);
    }

    $stmtUser->close();
}

function fetchDepartments()
{
    global $connect;

    $stmt = $connect->prepare("SELECT dept_id, dept_name FROM departments");
    $stmt->execute();
    $result = $stmt->get_result();

    $departments = [];
    while ($row = $result->fetch_assoc()) {
        $departments[] = $row;
    }

    echo json_encode($departments);
    $stmt->close();
}

function fetchRoles()
{
    global $connect;

    $stmt = $connect->prepare("SELECT role_id, role_name FROM roles");
    $stmt->execute();
    $result = $stmt->get_result();

    $roles = [];
    while ($row = $result->fetch_assoc()) {
        $roles[] = $row;
    }

    echo json_encode($roles);
    $stmt->close();
}

function loginUserWithRole()
{
    global $connect;

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['username'], $data['password'], $data['role_name'])) {
        echo json_encode(['type' => 'error', 'message' => 'Invalid input']);
        return;
    }

    // Fetch the role_id based on the role_name
    $stmtRole = $connect->prepare("SELECT role_id FROM roles WHERE role_name = ?");
    $stmtRole->bind_param("s", $data['role_name']);
    $stmtRole->execute();
    $resultRole = $stmtRole->get_result();

    if ($resultRole->num_rows > 0) {
        $role = $resultRole->fetch_assoc();
        $role_id = $role['role_id'];

        // Validate the username, password, and role_id
        $stmt = $connect->prepare("
                SELECT users.user_id, users.username, roles.role_name 
                FROM users 
                INNER JOIN employee ON users.user_id = employee.user_id
                INNER JOIN roles ON employee.role_id = roles.role_id
                WHERE users.username = ? AND users.password = ? AND roles.role_id = ?
            ");
        $stmt->bind_param("sss", $data['username'], $data['password'], $role_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            echo json_encode(['type' => 'success', 'user' => $user]);
        } else {
            echo json_encode(['type' => 'error', 'message' => 'Invalid username, password, or role']);
        }

        $stmt->close();
    } else {
        echo json_encode(['type' => 'error', 'message' => 'Invalid role']);
    }

    $stmtRole->close();
}

function getEmployee()
{
    global $connect;

    $id = isset($_GET['id']) ? $connect->real_escape_string($_GET['id']) : null;

    if (!$id) {
        echo json_encode(['error' => true, 'message' => 'Invalid employee ID']);
        return;
    }

    $query = "
            SELECT employee.*, departments.dept_name, roles.role_name 
            FROM employee 
            LEFT JOIN departments ON employee.dept_id = departments.dept_id
            LEFT JOIN roles ON employee.role_id = roles.role_id
            WHERE employee.emp_id = ?
        ";

    $stmt = $connect->prepare($query);
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $employee = $result->fetch_assoc();
        if (isset($employee['profile_picture'])) {
            $employee['profile_picture'] = base64_encode($employee['profile_picture']);
        }
        echo json_encode($employee);
    } else {
        echo json_encode(['error' => true, 'message' => 'Employee not found']);
    }

    $stmt->close();
}

function editEmployee()
{
    global $connect;

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data['emp_id'], $data['first_name'], $data['last_name'], $data['dept_id'], $data['role_id'], $data['job_title'], $data['email'], $data['contact_number'], $data['address'], $data['username'], $data['password'], $data['profile_picture'])) {
        echo json_encode(['error' => true, 'message' => 'Invalid input']);
        return;
    }

    // Update the `users` table
    $stmtUser = $connect->prepare("
            UPDATE users 
            SET username = ?, password = ? 
            WHERE user_id = (SELECT user_id FROM employee WHERE emp_id = ?)
        ");
    $stmtUser->bind_param("sss", $data['username'], $data['password'], $data['emp_id']);

    if (!$stmtUser->execute()) {
        echo json_encode(['type' => 'error', 'message' => 'Failed to update user credentials']);
        $stmtUser->close();
        return;
    }
    $stmtUser->close();

    // Update the `employee` table
    $stmtEmployee = $connect->prepare("
            UPDATE employee 
            SET first_name = ?, last_name = ?, dept_id = ?, role_id = ?, job_title = ?, email = ?, contact_number = ?, address = ?, username = ?, password = ?, profile_picture = ? 
            WHERE emp_id = ?
        ");
    $stmtEmployee->bind_param(
        "ssssssssssss",
        $data['first_name'],
        $data['last_name'],
        $data['dept_id'],
        $data['role_id'],
        $data['job_title'],
        $data['email'],
        $data['contact_number'],
        $data['address'],
        $data['username'], // Update username in employee table
        $data['password'], // Update password in employee table
        base64_decode($data['profile_picture']),
        $data['emp_id']
    );

    if ($stmtEmployee->execute()) {
        echo json_encode(['type' => 'success', 'message' => 'Employee updated successfully']);
    } else {
        echo json_encode(['type' => 'error', 'message' => 'Failed to update employee']);
    }

    $stmtEmployee->close();
}

function deleteEmployee()
{
    global $connect;

    $emp_id = isset($_GET['emp_id']) ? $connect->real_escape_string($_GET['emp_id']) : null;

    if (!$emp_id) {
        echo json_encode(['error' => true, 'message' => 'Invalid employee ID']);
        return;
    }

    // Get the user_id associated with the employee
    $stmtGetUserId = $connect->prepare("SELECT user_id FROM employee WHERE emp_id = ?");
    $stmtGetUserId->bind_param("s", $emp_id);
    $stmtGetUserId->execute();
    $result = $stmtGetUserId->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $user_id = $row['user_id'];

        // Delete from employee table
        $stmtDeleteEmployee = $connect->prepare("DELETE FROM employee WHERE emp_id = ?");
        $stmtDeleteEmployee->bind_param("s", $emp_id);

        if ($stmtDeleteEmployee->execute()) {
            // Delete from users table
            $stmtDeleteUser = $connect->prepare("DELETE FROM users WHERE user_id = ?");
            $stmtDeleteUser->bind_param("s", $user_id);

            if ($stmtDeleteUser->execute()) {
                echo json_encode(['type' => 'success', 'message' => 'Employee and associated user deleted successfully']);
            } else {
                echo json_encode(['type' => 'error', 'message' => 'Failed to delete user']);
            }

            $stmtDeleteUser->close();
        } else {
            echo json_encode(['type' => 'error', 'message' => 'Failed to delete employee']);
        }

        $stmtDeleteEmployee->close();
    } else {
        echo json_encode(['type' => 'error', 'message' => 'Employee not found']);
    }

    $stmtGetUserId->close();
}

function fetchUserDetails()
{
    session_start();
    global $connect;

    $user_id = $_SESSION['user_id'];

    $sql = "SELECT user_id, avatar, username, role, created_at FROM users WHERE user_id = ?";
    $stmt = $connect->prepare($sql);

    if (!$stmt) {
        echo json_encode(['error' => true, 'message' => 'SQL error: ' . $connect->error]);
        return;
    }

    $stmt->bind_param('i', $user_id);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $user = $result->fetch_assoc();

        if (isset($user['avatar'])) {
            $user['avatar'] = base64_encode($user['avatar']);
        }
        echo json_encode(['type' => 'success', 'user' => $user]);
    } else {
        echo json_encode(['error' => true, 'message' => 'User not found']);
    }
}

function fetchActivityLogs()
{
    session_start();
    global $connect;

    $sql = 'SELECT * FROM activity_logs';
    $stmt = $connect->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    $logs = [];
    while ($row = $result->fetch_assoc()) {
        $logs[] = $row;
    }

    echo json_encode($logs);
    $stmt->close();
}

function getAllUsersCount()
{
    global $connect;

    $sql = 'SELECT role, COUNT(*) as totalCount FROM users GROUP BY role';
    $stmt = $connect->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    echo json_encode($users);
}

function fetchAllEmployees()
{
    global $connect;
    $sql = 'SELECT 
    u.avatar, 
    u.role, 
    u.user_id, 
    u.username, 
    u.created_at, 
    u.status,
    d.dept_name 
FROM users u
LEFT JOIN departments d ON u.dept_id = d.dept_id WHERE role = "employee"';
    $stmt = $connect->prepare($sql);
    $stmt->execute();

    $result = $stmt->get_result();
    $employees = [];
    while ($row = $result->fetch_assoc()) {
        $row['avatar'] = base64_encode($row['avatar']);
        $employees[] = $row;
    }

    echo json_encode($employees);
}

function fetchAllUsers()
{
    global $connect;

    $sql = 'SELECT 
                u.avatar, 
                u.role, 
                u.user_id, 
                u.username, 
                u.created_at, 
                u.status,
                d.dept_name 
            FROM users u
            LEFT JOIN departments d ON u.dept_id = d.dept_id';

    $stmt = $connect->prepare($sql);
    $stmt->execute();

    $result = $stmt->get_result();
    $users = [];

    while ($row = $result->fetch_assoc()) {
        $row['avatar'] = $row['avatar'] ? base64_encode($row['avatar']) : null;
        $users[] = $row;
    }

    echo json_encode($users);
}

function addNewEmployee()
{
    session_start();
    global $connect;

    if (!isset($_SESSION['user_id'])) {
        echo json_encode(value: [
            "type" => "error",
            "message" => "Unauthorized access"
        ]);
        return;
    }

    $user_id = $_SESSION['user_id'];
    $currentUserRole = $_SESSION['role'];

    $data = json_decode(file_get_contents("php://input"), true);
    $username = $data["username"];
    $password = $data["password"];
    $role = $data["role"];

    if (!isset($data["username"], $data["password"], $data["role"])) {
        echo json_encode([
            "type" => "error",
            "message" => "Missing required fields"
        ]);
        return;
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (avatar, username, password, role) VALUES (?,?,?,?)";

    $stmt = $connect->prepare($sql);
    $stmt->bind_param("ssss", base64_decode($data['avatar']), $username, $hashedPassword, $role);

    if ($stmt->execute()) {

        $action = "add_user";
        $details = "User_ID $user_id ($currentUserRole) added user '$username' with role '$role'";

        $logSql = "INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)";
        $logStmt = $connect->prepare($logSql);
        $logStmt->bind_param("iss", $user_id, $action, $details);
        $logStmt->execute();
        $logStmt->close();

        $response = [
            "type" => "success",
            "message" => "New User Added"
        ];
    } else {

        $response = [
            "type" => "error",
            "message" => "Failed to add new user",
            'errorNo' => $connect->errno
        ];
    }

    echo json_encode($response);
    $stmt->close();
}

function updateAvatar()
{
    session_start();
    global $connect;

    if (!isset($_SESSION['user_id'])) {
        echo json_encode([
            "type" => "error",
            "message" => "Unauthorized access"
        ]);
        return;
    }

    $user_id = $_SESSION['user_id'];

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["avatar"])) {
        echo json_encode([
            "type" => "error",
            "message" => "Missing avatar data"
        ]);
        return;
    }

    $avatar = base64_decode($data["avatar"]);

    $sql = "UPDATE users SET avatar = ? WHERE user_id = ?";
    $stmt = $connect->prepare($sql);
    $stmt->bind_param("si", $avatar, $user_id);

    if ($stmt->execute()) {
        echo json_encode([
            "type" => "success",
            "message" => "Avatar updated successfully"
        ]);
    } else {
        echo json_encode([
            "type" => "error",
            "message" => "Failed to update avatar",
            "errorNo" => $connect->errno
        ]);
    }

    $stmt->close();
}
