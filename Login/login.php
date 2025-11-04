<?php
session_start();
include 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            $_SESSION['username'] = $user['username'];
            
            // ✅ Homepage is now in root folder
            header("Location: ../index.html");
            exit();
        } else {
            echo "<script>alert('Incorrect password!'); window.location='index.html';</script>";
        }
    } else {
        echo "<script>alert('No account found with that username!'); window.location='index.html';</script>";
    }

    $stmt->close();
}
$conn->close();
?>
