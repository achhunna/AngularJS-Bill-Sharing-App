<?php
class MySQLObj{

	var $dbhost = null;
	var $dbuser = null;
	var $dbpassword = null;
	var $dbname = null;
	var $con = null;
	var $result = null;

	function __construct(){
		$this->dbhost = DBInfo::$dbhost;
		$this->dbuser = DBInfo::$dbuser;
		$this->dbpassword = DBInfo::$dbpassword;
		$this->dbname = DBInfo::$dbname;
	}

	public function openConnection(){
		$this->con = mysqli_connect($this->dbhost, $this->dbuser, $this->dbpassword, $this->dbname);
		// Check connection
		if (mysqli_connect_errno()){
			echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}
	}

	public function getConnection(){
		return $this->con;
	}

	public function closeConnection(){
		$this->con->close();
	}

	//functions for users query
	public function checkEmail($email){
		$returnValue = array();
		$query = "SELECT email FROM users WHERE email = '".$email."'";

		$result = $this->con->query($query);

		if($result != null && (mysqli_num_rows($result) >= 1)){
			$row = $result->fetch_array(MYSQLI_ASSOC);
			if(!empty($row)){
				$returnValue = $row;
			}
		}
		return $returnValue;
	}

	public function retrieveEmail($id){
		$returnValue = array();
		$query = "SELECT email FROM users WHERE id = '".$id."'";
		$result = $this->con->query($query);

		if($result != null && (mysqli_num_rows($result) >= 1)){
			$row = $result->fetch_array(MYSQLI_ASSOC);
			if(!empty($row)){
				$returnValue = $row;
			}
		}
		return $returnValue;
	}

	public function retrieveData($email, $password){
		$returnValue = array();
		$query = "SELECT * FROM users WHERE email = '".$email."' AND password = '".$password."'";

		$result = $this->con->query($query);

		if($result != null && (mysqli_num_rows($result) >= 1)){
			$row = $result->fetch_array(MYSQLI_ASSOC);
			if(!empty($row)){
				$returnValue = $row;
			}
		}
		return $returnValue;
	}

	public function createUser($firstname, $lastname, $email, $password){
		$query = "INSERT INTO users SET firstname=?, lastname=?, email=?, password=?";
		$execute = $this->con->prepare($query);

		if(!$execute){
			throw new Exception($execute->error);
		}

		$execute->bind_param("ssss", $firstname, $lastname, $email, $password);
		return $execute->execute();
	}


	//functions for bills query
	public function retrieveBills($useremail){
		$returnValue = array();
		$id = 0;
		$query = "SELECT * FROM bills WHERE useremail='".$useremail."'";

		$result = $this->con->query($query);

		if($result != null && (mysqli_num_rows($result) >= 1)){
			while($row = $result->fetch_array(MYSQLI_ASSOC)){
				$returnValue[$id] = $row;
				//echo $returnValue[$id]["id"];
				$id += 1;
			}
		/*
			$row = $result->fetch_array(MYSQLI_ASSOC);
			if(!empty($row)){
				$returnValue = $row;
			}
		*/
		}
		return $returnValue;
	}
	
	//function for adding new bill
	public function addBill($useremail, $category, $note, $expgroup, $amount){
		$query = "INSERT INTO bills SET useremail=?, category=?, note=?, expgroup=?, amount=?";
		$execute = $this->con->prepare($query);

		if(!$execute){
			throw new Exception($execute->error);
		}

		$execute->bind_param("ssssd", $useremail, $category, $note, $expgroup, $amount);
		return $execute->execute();
	}

	//function for updating existing bill
	public function editBill($id, $useremail, $category, $note, $expgroup, $amount){
		$query = "UPDATE bills SET useremail=?, category=?, note=?, expgroup=?, amount=? WHERE id=?";
		$execute = $this->con->prepare($query);

		if(!$execute){
			throw new Exception($execute->error);
		}

		$execute->bind_param("ssssdd", $useremail, $category, $note, $expgroup, $amount, $id);
		return $execute->execute();
	}

	public function deleteBill($id){
		$query = "DELETE FROM bills WHERE id='".$id."'";

		$result = $this->con->query($query);

		if($result){
			return;
		}
	}

	//functions to retrieve friends
	public function retrieveFriends($useremail){
		$returnValue = array();
		$id = 0;
		$query = "SELECT friend FROM friends WHERE useremail='".$useremail."'";

		$result = $this->con->query($query);

		if($result != null && (mysqli_num_rows($result) >= 1)){
			while($row = $result->fetch_array(MYSQLI_ASSOC)){
				$returnValue[$id] = $row;
				$id += 1;
			}
		}
		return $returnValue;
	}
}
?>
