<?php
require("myDBInfo.php");
require("MySQLObj.php");

//Checking if data sent from AngularJS
if(empty($_POST)){
	$_POST = json_decode(file_get_contents("php://input"), true);
}

$email = htmlentities($_POST["email"]);
$password = htmlentities($_POST["password"]);

$returnValue = array();

if(empty($email) || empty($password)){
	$returnValue["status"] = "error";
	$returnValue["message"] = "Missing required field";
	$returnValue["email"] = $email;
	echo json_encode($returnValue);
	return;
}

$encryptPassword = md5($password);

$Obj = new MySQLObj();
$Obj->openConnection();
$checkEmail = $Obj->checkEmail($email);

if(!empty($checkEmail)){
	$checkPassword = $Obj->retrieveData($email, $encryptPassword);
	if(!empty($checkPassword)){
		$returnValue["id"] = $checkPassword["id"];
		$returnValue["username"] = $checkPassword["firstname"];
		$returnValue["email"] = $checkPassword["email"];
		$returnValue["status"] = "Success";
		$returnValue["message"] = "User is registered";
		echo json_encode($returnValue);
		return;
	}else{
		$returnValue["status"] = "error";
		$returnValue["message"] = "Incorrect password";
		echo json_encode($returnValue);
	}
}else{
	$returnValue["status"] = "error";
	$returnValue["message"] = "User is not found";
	echo json_encode($returnValue);
}

$Obj->closeConnection();

?>
