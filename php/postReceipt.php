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
	$id = htmlentities($_POST["id"]);
	$category = htmlentities($_POST["category"]);
	$note = htmlentities($_POST["note"]);
	$expgroup = htmlentities($_POST["expgroup"]);
	$amount = htmlentities($_POST["amount"]);
	if(htmlentities($_POST["action"]) == "add"){
		echo json_encode($Obj->addBill($email, $category, $note, $expgroup, $amount));
	}elseif(htmlentities($_POST["action"]) == "edit"){
		echo json_encode($Obj->editBill($id, $email, $category, $note, $expgroup, $amount));		
	}
}else{
	echo "Error";
}

$Obj->closeConnection();

?>
