<?php
//session_start();
include("db.php");

if (isset($_POST['sub'])) {
   $emailHash = mysqli_real_escape_string($conn,$_POST['email']);

   $sql = "SELECT * FROM `mnemonic` WHERE email_hash = '$emailHash'";

   $result = mysqli_query($conn,$sql);
   

   $count = mysqli_num_rows($result);
   echo $sql;
  // if($count > 1) {
      //while($row = mysqli_fetch_array($result)) {
      //   $mnemonics = $row['mnemonics'];   
         //session_register("email_hash");
       //  $_SESSION['email_hash'] = $emailHash;
      //   echo $mnemonics;   
      //}

  // }else {
    //  $error = "Error".$conn->error;
      //echo $error;
  // }   
}

?>