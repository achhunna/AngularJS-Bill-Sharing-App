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
	//Return from bills table matching email
	$myBills = $Obj->retrieveBills($email);

	//Retrieve friend's bills
	$friend = (string)$Obj->retrieveFriends($email)[0]["friend"];
	$friendBills = $Obj->retrieveBills($friend);
	//Friend amount negative
	foreach($friendBills as &$value){
		 $value["amount"] = -$value["amount"];
	}

	//Merge bills
	$merge = array_merge($myBills, $friendBills);
	echo json_encode($merge);
}else{
	echo "Error";
}

$Obj->closeConnection();
?>
