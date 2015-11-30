'use strict';

var app = angular.module('wt', ['ui.bootstrap', 'ngCookies', 'ui.router' , 'wt.utilites' , 'wt.services', 'wt.directives']);

app.controller('ClockController', function ($scope, $timeout) {
	$scope.clock = {};
	$scope.clock.UTC = {};
	
	$scope.hoursFormat = 24;

	var updateClock = function() {
		$scope.clock.now = new Date();
		$scope.clock.UTC.hours = new Date().getUTCHours();
		$scope.clock.UTC.minutes = new Date().getUTCMinutes();

		$timeout(function() {
			updateClock();
		}, 1000);
	};

	updateClock();
});

app.controller('CityController', function ($scope, citiesService) {
	// get list of cities from API
	citiesService.getCities()
		.success(function(data) {
			$scope.cities = data;
		});

	$scope.getHoursList = function (timeZone) {
		var current = $scope.getCurrentHour(timeZone);
		var hoursList = [];
		for (var i = current - 13; i <= current + 10; i++) {
			var h = i;
			if (i < 0) {
				h = 24 + i;
			} else if (i > 24) {
				h = i - 24;
			}

			hoursList.push(h);
		}
		return hoursList;
	}

	// replace and get from API
	$scope.homeCity = {};
	$scope.homeCity.timestamp = 5;

	$scope.currentHourSelector = 12;


	$scope.getCurrentHour = function (timeZone) {
		var hours = parseInt($scope.clock.UTC.hours) + parseInt(timeZone);
		
		return hours;
	}


	$scope.setCurrentHour = function(index) {
		$scope.currentHourSelector = index;
	}
	$scope.addCity = function () {
		$scope.cities.push({
			"name": "Novosibirsk",
			"country": "Russia",
			"timeZone": "+7",
			"currentDate": "24.09.2015"
		});
	}

	$scope.removeCity = function (index) {
		$scope.cities.splice(index, 1);
	}
});

app.controller('UserController', function ($scope, $cookies, $state, userService, $http, userService1) {
	$scope.login = {};
	$scope.userSettings = {};
	// $scope.userStatus = {};
	// $scope.test = 
	
	$scope.loggedInUser = function () {
		return $cookies.get('loggedInUser');
	}
	
	$scope.getLoggedInUser = function () {
		return $cookies.get('loggedInUser');
	}

	$scope.getUserSettings = function () {
		if ($scope.getLoggedInUser()) {
			userService.getUsers().then(function(response) {
				var userName = $scope.getLoggedInUser();			
				$scope.userSettings = userService.getUserSettings(response.data, userName);
			});
		}
	}

	$scope.logInUser = function () {
		var userName = $scope.login.userName,
				password = $scope.login.password;

		userService.getUsers().then(function(response) {
	 		$scope.userStatus = userService.verifyUser(response.data, userName, password);
		}).then(function() {
			//verifyed succesfully
			if ($scope.userStatus.userExist == true &&
				$scope.userStatus.passwordMatch == true ) {
				
				// put user in cookies
				// and redirect to main page
				$cookies.put('loggedInUser', userName);
				$state.go('main');
			}
		});
				
	}

	$scope.userCityFilter = function (item) {
		if ($scope.userSettings.cities) {
			for (var i = 0; i < $scope.userSettings.cities.length; i++) {
				if ($scope.userSettings.cities[i] == item.name) {
					return item;
				};
			}
		} else {
			return item;
		}
	}


	$scope.togglePassVisibility = function () {
		var type = (jQuery('#pass').attr('type') == 'password')? 'text' : 'password';
		var eyesIcon = (jQuery('.password-input-group .glyphicon').hasClass('glyphicon-eye-open')) ? 'close' : 'open';

		jQuery('.password-input-group .glyphicon')
			.removeClass('glyphicon-eye-open')
			.removeClass('glyphicon-eye-close')
			.addClass('glyphicon-eye-' + eyesIcon);

		jQuery('#pass').attr('type', type);
	}

	$scope.getUsers = function () {
		userService1.getUsers().then(function(request) {
			$scope.status = request.status;
			$scope.users = request.data;
		});
	}

	$scope.$watch('searchUser', function(newVal, oldVal, scope) {
		if (scope.users) {
			// console.log('asdf');
			scope.searchedUser = scope.users.data.filter(function(user) { 
				return user.login == newVal;
			});
		}
	});



	$scope.signUpUser = function () {
		userService1.signUpUser(
			$scope.signUp.userName,
			$scope.signUp.password,
			$scope.signUp.email
		).then(function(data) {
			console.log(data);
		});
	}

	$scope.logOutUser = function () {
		// TODO: remove user from cookies
		$cookies.put('loggedInUser', '');
	}

});

app.filter('customTime', function () {
	return function (input) {
		return input.toString().length < 2 ? '0' + input : input;
	}
});


app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when('', '/');
	// $urlRouterProvider.otherwise("/#/");

	$stateProvider
		.state('main', {
			url: "",
			templateUrl: "partials/main.html",
			controller: 'UserController'
		})
		.state('clock', {
			url: "/",
			parent: "main",
			templateUrl: "partials/clocks.html",
			controller: "UserController"
		})
		.state('login', {
			url: "/login",
			parent: 'main',
			templateUrl: "partials/login.html",
			controller: 'UserController'
		})
		.state('signUp', {
			url: "/signup",
			parent: 'main',
			templateUrl: 'partials/signUp.html',
			controller: "UserController"
		})
		.state('user', {
			url: '/user',
			parent: 'main',
			templateUrl: "partials/user.html",
			controller: 'UserController'
		});
});




