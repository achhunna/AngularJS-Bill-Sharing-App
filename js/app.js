//Create a module
var billyApp = angular.module("billyApp", ["ngRoute","ngCookies"]);

billyApp.config(function($routeProvider, $locationProvider){
	//Enable HTML5 Mode for pushState URL
	$locationProvider.html5Mode(true);

	//ngRoute to manage page loads
	$routeProvider
	.when("/", {
		templateUrl: "templates/login.html",
		controller: "loginController"
	})
	.when("/dash", {
		templateUrl: "templates/dash.html",
		controller: "dashController"
	})
	.when("/friends", {
		templateUrl: "templates/friends.html",
		controller: "friendsController"
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
			$scope.amount = "";
			$scope.total = 0;
		},
		//Create function to load bills
		loadBills: function($scope, retrieveUrl, email){

			$http.post(retrieveUrl, {"email": email})
			.success(function(data){
				$scope.bills = data;
				angular.forEach($scope.bills, function(v,k){
					//Convert amount to number
					var amt = Number(v["amount"]);
					//Add to the total
					$scope.total += amt;
					//Check friend for color differentiation
					if(v["useremail"] != $scope.email){
						v["class"] = "red";
					}else{
						v["class"] = "not";
					}
					//Hide options
					v["options"] = false;
				});
			})
			.error(function(err){
				console.error(err);
			})
		},
		//Retrieve friends from table
		loadFriends: function($scope, retrieveUrl, email){

			$http.post(retrieveUrl, {"email":email})
			.success(function(data){
				$scope.friends = [];
				angular.forEach(data, function(v,k){
					var friend = v["friend"];
					$scope.friends.push(friend);
				});
			})
			.error(function(err){
				console.error(err);
			})
		},
	};
});
/*
//Create a receipt object using service
billyApp.factory("$receiptObj", function($http){

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

});*/