<?php

require("myDBInfo.php");
require("MySQLObj.php");

//Checking if data sent from AngularJS
if(empty($_POST)){
	$_POST = json_decode(file_get_contents("php://input"), true);
}

$firstname = htmlentities($_POST["firstname"]);
$lastname = htmlentities($_POST["lastname"]);
$email = htmlentities($_POST["email"]);
$password = htmlentities($_POST["password"]);

$returnValue = array();

if(empty($firstname) || empty($lastname) || empty($email) || empty($password)){
	$returnValue["status"] = "error";
	$returnValue["message"] = "Missing required field";
	echo json_encode($returnValue);
	return;
}

$Obj = new MySQLObj();
$Obj->openConnection();
$checkEmail = $Obj->checkEmail($email);

if(!empty($checkEmail)){
	$returnValue["status"] = "error";
	$returnValue["message"] = "User already exists";
	echo json_encode($returnValue);
	return;
}

$encryptPassword = md5($password);

$result = $Obj->createUser($firstname, $lastname, $email, $encryptPassword);

if($result){
	$returnValue["status"] = "Success";
	$returnValue["message"] = "User is registered";
	echo json_encode($returnValue);
	return;
}

$Obj->closeConnection();

?>
