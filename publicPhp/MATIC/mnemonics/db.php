<?php
$servername = "localhost";
$username = "user";
$password = "micheal20";
$dbname = "LuckyGuy";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
?>