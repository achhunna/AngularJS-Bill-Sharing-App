//Create a module
var evenup = angular.module("evenup", ["ngRoute","ngCookies"]);

evenup.config(function($routeProvider, $locationProvider){
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
	.otherwise({
		redirectTo: "/"
	})
})

//Create factory for common app functions
evenup.factory("$myService", function($cookies, $http){
	var user = {
		id: $cookies.get("userId"),
		name: $cookies.get("username"),
		email: $cookies.get("email")
	};

	//Array of login form inputs
	var loginInput = ["email", "password"];
	//Array of register form inputs
	var registerInput = ["firstName", "lastName", "email", "password", "password2"];

	//Default input class for login form
	var formDefaultClass = "form-group";
	var spanDefaultClass = "glyphicon";
	//Create input class for Error for login form
	var formErrorClass = "form-group has-error has-feedback";
	var spanErrorClass = "glyphicon form-control-feedback";

	return{
		//Clear form elements
		clearForm: function($scope){
			for(var each in $scope.user){
				$scope.user[each] = "";
			}
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

		//Login form class update
		loginClassUpdate: function($scope, field, error, message){
			if(error){
				$scope[field + "Input"] = formErrorClass;
				$scope[field + "Span"] = spanErrorClass;
				$scope[field + "Error"] = message;
			}else{
				$scope[field + "Input"] = formDefaultClass;
				$scope[field + "Span"] = spanDefaultClass;
				$scope[field + "Error"] = "";
			}
		},
		//Login form auth styles
		loginAuth: function($scope, errorField, message){
			var array = [];
			if($scope.registerFlag === false){
				array = loginInput;
			}else{
				array = registerInput;
			};
			for(i=0; i<array.length; i++){
				if(array[i] === errorField){
					this.loginClassUpdate($scope, array[i], true, message);
				}else{
					this.loginClassUpdate($scope, array[i], false, "");
				}
			}
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
		returnEmail: function(){
			return user.email;
		},
		returnId: function(){
			return user.id;
		},
		returnName: function(){
			return user.name;
		},
		updateUser: function(id, name, email){
			user.id = id;
			user.name = name;
			user.email = email;
		},

	};
});

/* Custom currency format filter */
evenup.filter("customCurrency", function() {
    return function (value) {
		value = Math.round(value);
        if (value < 0) {
            value = "(" + Math.abs(value) + ")";
        }
        return value.toLocaleString();
    };
});

/*
//Create a receipt object using service
evenup.factory("$receiptObj", function($http){

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
