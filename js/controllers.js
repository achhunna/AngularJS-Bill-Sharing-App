//loginController to manage login
billyApp.controller("loginController", function($myService, $scope, $http, $location, $cookies){
	//Check used logged in
	if(!!$cookies.get("userId")){
		console.log("User is logged in.");
		$location.path("/dash");
	}else{
		//Declare variables
		var user = {
			email: "",
			password: ""
		};

		//Assign to $scope
		$scope.user = user;
		//Default input class
		var formDefaultClass = "form-group";
		var spanDefaultClass = "glyphicon";

		//Create input class for Error
		var formErrorClass = "form-group has-error has-feedback";
		var spanErrorClass = "glyphicon glyphicon-remove form-control-feedback";

		$scope.userInput = formDefaultClass;
		$scope.passwordInput = formDefaultClass;
		$scope.userSpan = spanDefaultClass;
		$scope.passwordSpan = spanDefaultClass;
		$scope.userError = "";
		$scope.passwordError = "";

		$scope.submit = function(){
			if(user.email == ""){
				$scope.userInput = formErrorClass;
				$scope.passwordInput = formDefaultClass;
				$scope.userSpan = spanErrorClass;
				$scope.passwordSpan = spanDefaultClass;
				$scope.userError = "Email field is required";
				$scope.passwordError = "";
				return;
			}else if(user.password == ""){
				$scope.userInput = formDefaultClass;
				$scope.passwordInput = formErrorClass;
				$scope.userSpan = spanDefaultClass;
				$scope.passwordSpan = spanErrorClass;
				$scope.userError = "";
				$scope.passwordError = "Password field is required";
				return;
			}
			var loginUrl = "./php/loginUser.php";
			var data = {"email":user.email, "password":user.password};
			$http.post(loginUrl, data)
				.success(function(data){
					//$scope.output = data;
					if(data["status"] == "Success"){
						//Update $myService with user info
						$myService.updateUser(data["id"], data["username"], data["email"]);
						//Create persistent cookie
						$cookies.put("userId", data["id"], {expires: cookieExp()});
						$cookies.put("username", data["username"], {expires: cookieExp()});
						$cookies.put("email", data["email"], {expires: cookieExp()});
						$location.path("/dash");
					}else{
						switch(data["message"]){
							case "User is not found":
								$scope.userInput = formErrorClass;
								$scope.passwordInput = formDefaultClass;
								$scope.userSpan = spanErrorClass;
								$scope.passwordSpan = spanDefaultClass;
								$scope.userError = data["message"];
								$scope.passwordError = "";
								break;
							case "Incorrect password":
								$scope.userInput = formDefaultClass;
								$scope.passwordInput = formErrorClass;
								$scope.userSpan = spanDefaultClass;
								$scope.passwordSpan = spanErrorClass;
								$scope.userError = "";
								$scope.passwordError = data["message"];
								break;
						}
					}
				})
				.error(function(err) {
					$log.error(err);
				})
		};
	}
});

//dashController to display output from bills table
billyApp.controller("dashController", function($myService, $scope, $http, $location, $cookies){
	//Check used logged in
	if(!$cookies.get("userId")){
		console.log("User is not logged in.");
		$location.path("/");
	}else{
		//Declare variables
		var retrieveUrl = "./php/bills.php";
		var username = $myService.returnName();
		var email = $myService.returnEmail();
		$scope.showReceiptSheet = false;

		//Reset input variables
		$myService.reset($scope, username, email);

		//Call function to load bills
		$myService.loadBills($scope, retrieveUrl, email);

		//Submit clicked
		$scope.submit = function(){
			if($scope.amount !== ""){
				$scope.noAmount = "";
				//URL to submit receipt
				var submitUrl = "./php/postReceipt.php";

				var data = {"email":$scope.email, "category":$scope.categorySelect, "note":$scope.note, "expgroup":$scope.expgroupSelect, "amount":$scope.amount};
				$http.post(submitUrl, data)
					.success(function(data){
						//Call function to load bills
						$myService.loadBills($scope, retrieveUrl, email);
						$myService.reset($scope, username, email);
					})
					.error(function(err) {
						$log.error(err);
					})
				
				//Hide receipt sheet
				$scope.showReceiptSheet = false;
			}else{
				$scope.noAmount = "Please enter receipt amount";
			}
		};

		//Mouse hover options
		$scope.hover = function(bill){
			return bill.options = ! bill.options;
		};

		//Delete clicked
		$scope.delete = function(id){
			//URL to delete receipt
			var deleteUrl = "./php/deleteReceipt.php";

			var data = {"id":id};
			$http.post(deleteUrl, data)
				.success(function(data){
					$myService.loadBills($scope, retrieveUrl, email);
					$myService.reset($scope, username, email);
				})
				.error(function(err){
					console.log(err);
				})
		};

		//Logout clicked
		$scope.logout = function(){
			//Remove all cookies
			var cookies = $cookies.getAll();
			angular.forEach(cookies, function(v,k){
				$cookies.remove(k);
			});
		}
		
		//Reset receipt sheet
		$scope.resetReceipt = function(){
			$scope.categorySelect = $scope.categories[1];
			$scope.note = "";
			$scope.amount = "";
			if($scope.showReceiptSheet){
				$scope.showReceiptSheet = false;
			}else{
				$scope.showReceiptSheet = true;
			}
		}
	}
});

//friendController to display friends
billyApp.controller("friendsController", function($myService, $scope, $http, $location){
	var friendUrl = "./php/friends.php";
	var email = $myService.returnEmail();
	//Load friends
	console.log(email);
	$myService.loadFriends($scope, friendUrl, email);

});
