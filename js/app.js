//Create a module
var billyApp = angular.module("billyApp", ["ngRoute","ngCookies"]);

//ngRoute to manage page loads
billyApp.config(function($routeProvider){
	$routeProvider
	.when("/", {
		templateUrl: "templates/login.html"
	})
	.when("/dash", {
		templateUrl: "templates/dash.html"
	})
	.otherwise({
		redirectTo: "/"
	})
})

//Create billsService for app functions
billyApp.factory("$myService", function($cookies, $http){
	var user = {
		id: $cookies.get("userId"),
		name: $cookies.get("username"),
		email: $cookies.get("email")
	};
	return{
		updateUser: function(id, name, email){
			user.id = id;
			user.name = name;
			user.email = email;
		},
		returnId: function(){
			return user.id;
		},
		returnName: function(){
			return user.name;
		},
		returnEmail: function(){
			return user.email;
		},
		//Reset scope values
		reset: function($scope, username, email){
			$scope.username = username;
			$scope.email = email;
			$scope.categories = [
				"Entertainment",
				"Food",
				"Grocery",
				"Rent",
				"Travel",
				"Other"
			];
			$scope.expgroup = [
				"Household"
			];
			$scope.categorySelect = $scope.categories[1];
			$scope.note = "";
			$scope.expgroupSelect = $scope.expgroup[0];
			$scope.amount = 0;
			$scope.total = 0;
		},
		//Create function to load bills
		loadBills: function($scope, retrieveUrl, email){

			$http.post(retrieveUrl, {"email": email})
			.success(function(data){
				$scope.bills = data;
				angular.forEach($scope.bills, function(v,k){
					//console.log(v["amount"]);
					var amt = Number(v["amount"]);
					$scope.total += amt;
				});
			})
			.error(function(err) {
				console.error(err);
			})
		}
	};
});

//Create a receipt object using service
billyApp.factory("$receiptObj", function($html){

	//Instantiate receiptObj
	var receiptObj = function(email, category, note, expgroup, amount){
		this.email = email;
		this.category = category;
		this.note = note;
		this.expgroup = expgroup;
		this.amount = amount;
	};

	//Define variable return method
	receiptObj.returnEmail = function(){
		return this.email;
	};

	return receiptObj;

});

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

		$scope.submit = function(){
			var loginUrl = "./php/loginUser.php";
			var data = {"email":user.email, "password":user.password};
			$http.post(loginUrl, data)
				.success(function(data){
					$scope.output = data;
					if(data["status"] == "Success"){
						//Update $myService with user info
						$myService.updateUser(data["id"], data["username"], data["email"]);
						//Create persistent cookie
						$cookies.put("userId", data["id"], {expires: cookieExp()});
						$cookies.put("username", data["username"], {expires: cookieExp()});
						$cookies.put("email", data["email"], {expires: cookieExp()});
						$location.path("/dash");
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
		//var email = $cookies.get("userId");
		var username = $myService.returnName();
		var email = $myService.returnEmail();

		//Reset input variables
		$myService.reset($scope, username, email);

		//Call function to load bills
		$myService.loadBills($scope, retrieveUrl, email);

		//Submit clicked
		$scope.submit = function(){
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
	}
});

//Set cookie expiration date
function cookieExp(){
	var now = new Date();
	now.setDate(now.getDate() + 30); //30 days expiration
	return now;
}
