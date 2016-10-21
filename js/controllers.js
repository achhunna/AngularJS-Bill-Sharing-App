//loginController to manage login
evenup.controller("loginController", function($myService, $scope, $http, $location, $cookies){
	//Check used logged in
	if(!!$cookies.get("userId")){
		//console.log("User is logged in.");
		$location.path("/dash");
	}else{
		//Declare variables
		var user = {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			password2: "",
		};

		//Assign to $scope
		$scope.user = user;

		$myService.loginAuth($scope, "", "");

		$scope.registerFlag = false;

		$scope.submit = function(){

			if(!$scope.user.email){
				$myService.loginAuth($scope, "email", "Email field is required");
				return;
			}else if(!$scope.user.password){
				$myService.loginAuth($scope, "password", "Password field is required");
				return;
			}else{
				var loginUrl = "./php/loginUser.php";
				var data = {"email":$scope.user.email, "password":$scope.user.password};
				$http.post(loginUrl, data)
					.success(function(data){
						//$scope.output = data;
						if(data["status"] === "Success"){
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
									$myService.loginAuth($scope, "email", data["message"]);
									break;
								case "Incorrect password":
									$myService.loginAuth($scope, "password", data["message"]);
									break;
							}
						}
					})
					.error(function(err) {
						$log.error(err);
					})
			}
		};

		$scope.toggleRegister = function(){
			$scope.registerFlag = !$scope.registerFlag;
			$myService.clearForm($scope);
			$myService.loginAuth($scope, "", "");
		};

		$scope.register = function(){
			var emptyInput = false;
			for(var key in $scope.user){
				if(!$scope.user[key]){
					$myService.loginClassUpdate($scope, key, true, "Cannot be empty");
					emptyInput = true;
				}else{
					$myService.loginClassUpdate($scope, key, false,  "");
				}
			}

			if(!emptyInput){
				if($scope.user.password !== $scope.user.password2){
					$myService.loginClassUpdate($scope, "password2", true, "Password mismatch");
					return;
				}
				var registerUrl = "./php/registerUser.php";
				var data = {"firstname":$scope.user.firstName, "lastname":$scope.user.lastName, "email":$scope.user.email, "password":$scope.user.password};
				$http.post(registerUrl, data)
					.success(function(data){
						if(data["status"] === "Success"){
							$scope.registerMessage = "User registered";
							$scope.toggleRegister();
						}
					})
					.error(function(err){
						$log.error(err);
					})
			}
		};

		$scope.fillGuest = function(){
			var guestUrl = "./php/guest.php";

			$http.post(guestUrl)
				.success(function(data){
					$scope.user.email = data["email"];
					$scope.user.password = data["password"];
					$scope.submit();
				});

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
