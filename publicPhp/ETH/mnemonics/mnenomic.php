<?php
include("db.php");

$emailHash = mysqli_real_escape_string($conn,$_POST['email']);
$mnenomics = mysqli_real_escape_string($conn,$_POST['mnenomics']);

$sql = "INSERT INTO `mnemonic`(`ID`, `email_hash`, `mnemonics`) VALUES (null,'$emailHash','$mnenomics')";

if ($conn->query($sql) === TRUE) {
  echo "New record created successfully";
} else {
  echo "Error";
}

$conn->close();
?>