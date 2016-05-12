<html>
<head>
	<title>User Login Test</title>
</head>

<body>
<?php

echo "<h2>User Login Test using PHP</h2>\n";
echo "<form action='' method='post'>\n";
echo "<p>Email: <input type='text' name='email'></p>\n";
echo "<p>Password: <input type='password' name='password'></p>\n";
echo "<p><input type='submit' value='submit'></p>\n";
echo "</form>\n";


require("myDBInfo.php");
require("MySQLObj.php");

if(isset($_POST["email"])){

	$email = $_POST["email"];
	$id = $_POST["id"];

	$encryptPassword = md5($_POST["password"]);

	$Obj = new MySQLObj();
	$Obj->openConnection();
	$checkEmail = $Obj->checkEmail($email);

	if(!empty($checkEmail)){
		$checkPassword = $Obj->retrieveData($email, $encryptPassword);
		if(!empty($checkPassword)){
			$returnValue["username"] = $checkPassword["firstname"];
			$returnValue["status"] = "Success";
			$returnValue["message"] = "User is registered";
			/*
			$addBill = $Obj->addBill($email, "Food", "Sushirrito lunch", "Household", 50.00);
			if($addBill){
				$returnValue["addBill"] = "Success";
			}else{
				$returnValue["addBill"] = "Fail";
			}
			*/

			$friend = (string)$Obj->retrieveFriends($email)[0]["friend"];
			echo "friend:".$friend;
			
			$return = $Obj->retrieveBills($email);
			$count = 0;
			foreach($return as $id){
				echo "<form method='post'>";
				//Print output from bills table that matches email
				echo json_encode($return[$count]);
				//echo $return[$count]["id"];
				echo "<input type='hidden' name='emailDelete' value='".$email."'>";
				echo "<input type='hidden' name='idDelete' value='".$return[$count]["id"]."'>";
				echo "<input type='submit' name='delete' value='X'>";
				echo "</form>";
				$count += 1;
			}
			//Print auth parameters
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
}
if(isset($_POST["delete"])){
	$email = $_POST["emailDelete"];
	$id = $_POST["idDelete"];

	$Obj = new MySQLObj();
	$Obj->openConnection();

	$Obj->deleteBill($id);
}


?>
</body>

</html>
