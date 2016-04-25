<?php

require("myDBInfo.php");
require("MySQLObj.php");

//Checking if data sent from AngularJS
if (empty($_POST)){
	$_POST = json_decode(file_get_contents("php://input"), true);
}

$id = htmlentities($_POST["id"]);

//Create MySQLObj
$Obj = new MySQLObj();
$Obj->openConnection();
$Obj->deleteBill($id);
$Obj->closeConnection();

?>
