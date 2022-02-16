<?php
   session_start();
   
   if(session_destroy()) {
      echo "LoggedOut";
   } else {
      echo "Error";
   }
?>