<?php
   include('db.php');
   session_start();
   
   $user_check = $_SESSION['email_hash'];
   
   $ses_sql = mysqli_query($con,"SELECT `email_hash` FROM `mnemonic` WHERE email_hash = '$user_check' ");
   
   $row = mysqli_fetch_array($ses_sql,MYSQLI_ASSOC);
   
   $login_session = $row['email_hash'];
   
   if(!isset($_SESSION['email_hash'])){
      echo "End";
      die();
   }
?>