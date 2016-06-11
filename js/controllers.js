//loginController to manage login
evenup.controller("loginController", function($myService, $scope, $http, $location, $cookies){
	//Check used logged in
	if(!!$cookies.get("userId")){
		//console.log("User is logged in.");
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
evenup.controller("dashController", function($myService, $scope, $http, $location, $cookies){

	//Callback function when .btn-ok clicked
	$(document).on("click", ".btn-ok", function(){
		var id = $(this).data("billId");
		$scope.delete(id);
		$("#confirmDelete").modal("hide");
	});
	//Callback function run when modal is open
	$(document).on("show.bs.modal", function(e) {
		hideReceipt($scope);
		var data = $(e.relatedTarget).data();
		$(".btn-ok", this).data("billId", data.billId);
	});

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
				//console.log($scope.submitType);
				var data = {"id":$scope.id, "email":$scope.email, "category":$scope.categorySelect, "note":$scope.note, "expgroup":$scope.expgroupSelect, "amount":$scope.amount, "action":$scope.submitType};
				$http.post(submitUrl, data)
					.success(function(data){
						//Call function to load bills
						$myService.loadBills($scope, retrieveUrl, email);
						$myService.reset($scope, username, email);
					})
					.error(function(err) {
						console.log(err);
					})

				//Hide receipt sheet
				hideReceipt($scope);
			}else{
				$scope.noAmount = "Please enter receipt amount";
			}
		};

		//Mouse hover options
		$scope.hover = function(bill){
			return bill.options = ! bill.options;
		};

		//Edit clicked
		$scope.edit = function(id){
			//URL to editing existing receipt
			var editUrl = "./php/editReceipt.php";

			showReceipt($scope);
			$scope.id = Number(id);
			$.each($scope.bills, function(key, value){
				$.each(value, function(k,v){
					//console.log(k + ":" + v);
					if(k == "id" && v == $scope.id){
						//console.log(k + ":" + v);
						$scope.categorySelect = value["category"];
						$scope.note = value["note"];
						$scope.amount = Number(value["amount"]);
					};
				});
			});
			$scope.submitType = "edit";
			$scope.noAmount = "";
			
			//Enable delete button
			$("#deleteButton").prop('disabled', false);
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
		$scope.openReceipt = function(){
			$scope.id = null;
			$scope.categorySelect = $scope.categories[1];
			$scope.note = "";
			$scope.amount = "";
			$scope.submitType = "add";
			showReceipt($scope);
			
			//Disable delete button
			$("#deleteButton").prop('disabled', true);
		}

		$scope.closeReceipt = function(){
			hideReceipt($scope);
			$scope.noAmount = "";
		}
		
	}
});

//friendController to display friends
evenup.controller("friendsController", function($myService, $scope, $http, $location){
	var friendUrl = "./php/friends.php";
	var email = $myService.returnEmail();
	//Load friends
	console.log(email);
	$myService.loadFriends($scope, friendUrl, email);

});
