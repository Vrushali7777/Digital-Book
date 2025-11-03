<?php
echo "TESTING FILE CONNECTION<br>";

$servername = "localhost";
$username = "root";
$password = ""; // 👈 replace 12345 with YOUR MySQL password
$dbname = "digital_book";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    echo "✅ Database connected successfully!";
}
?>
