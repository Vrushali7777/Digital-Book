<?php
include 'db_connect.php';

// Confirm connection
if (!$conn) {
    die("❌ Database connection failed: " . mysqli_connect_error());
} else {
    echo "✅ Database connected successfully!<br>";
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = password_hash($_POST['password'] ?? '', PASSWORD_DEFAULT);

    // Check if email already exists
    $check = $conn->prepare("SELECT * FROM users WHERE email = ?");
    if (!$check) {
        die("❌ Prepare (check) failed: " . $conn->error);
    }
    $check->bind_param("s", $email);
    if (!$check->execute()) {
        die("❌ Execute (check) failed: " . $check->error);
    }

    $result = $check->get_result();
    if ($result && $result->num_rows > 0) {
        echo "<script>alert('Email already registered!'); window.location='index.html';</script>";
    } else {
        $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        if (!$stmt) {
            die("❌ Prepare (insert) failed: " . $conn->error);
        }

        $stmt->bind_param("sss", $username, $email, $password);
        if (!$stmt->execute()) {
            die("❌ Execute (insert) failed: " . $stmt->error);
        } else {
            echo "<script>alert('Registration successful! Please login now.'); window.location='index.html';</script>";
        }

        $stmt->close();
    }

    $check->close();
}
$conn->close();
?>
