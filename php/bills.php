<?php

require("myDBInfo.php");
require("MySQLObj.php");

//Checking if data sent from AngularJS
if (empty($_POST)){
	$_POST = json_decode(file_get_contents("php://input"), true);
}

$email = htmlentities($_POST["email"]);

//Create MySQLObj
$Obj = new MySQLObj();
$Obj->openConnection();
$checkEmail = $Obj->checkEmail($email);
if(!empty($checkEmail)){
	echo json_encode($Obj->retrieveBills($email));
}else{
	echo "Error";
}

$Obj->closeConnection();
?>
