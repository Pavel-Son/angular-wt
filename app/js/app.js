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

app.controller('UserController', function ($scope, $cookies, $state, $http, userService) {
	$scope.login = {};
	$scope.userSettings = {};

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



	$scope.getUserList = function () {
		var token = $cookies.get('token');

		userService.getUserList(token).then(function(response) {
			$scope.user = response.data;
		});
	}

	$scope.getUsers = function () {
		userService.getUsers().then(function(request) {
			$scope.status = request.status;
			$scope.users = request.data;
		});
	}

	$scope.getLoggedInUser = function () {
		return $cookies.get('loggedInUser');
	}
	
	$scope.token = $cookies.get('token');
	// $scope.loggedInUser  = $cookies.get('loggedInUser');
	// $scope.loggedInUser_login = $cookies.get('loggedInUser_login');
	// $scope.loggedInUser_id = $cookies.get('loggedInUser_id');
	// $scope.loggedInUser_email = $cookies.get('loggedInUser_email');
	
	$cookies.remove('loggedInUser.email');
	$cookies.remove('loggedInUser.login');
	$cookies.remove('loggedInUser.id');
	$cookies.remove('loggedInUser_email');
	$cookies.remove('loggedInUser_login');
	$cookies.remove('loggedInUser_id');

	$scope.logInUser = function (userName, password) {
		userService.logInUser(userName, password).then(function(response) {
			if (response.status = 200) {
				$cookies.put('token', response.data.token);
				
				$cookies.put('loggedInUser', response.data.user.login);
				$cookies.put('loggedInUser_login', response.data.user.login);
				$cookies.put('loggedInUser_id', response.data.user.id);
				$cookies.put('loggedInUser_email', response.data.user.email);
				$state.go('main');
			}
		});
	}

	$scope.getUserData = function () {
		var id = parseInt($scope.loggedInUser_id);
		userService.getUserData(id, $scope.token).then(function (response) {
			console.log(response.data);
		});	
	}

	$scope.updateUser = function () {
		// console.log($scope.token);
		// var user = {
		// 	login: $scope.newLogin || $scope.loggedInUser_login,
		// 	email: $scope.newEmail || $scope.loggedInUser_email,
		// 	password: 
		// }

		// userService.updateUser($scope.token).then
	}

	$scope.signUpUser = function () {
		userService.signUpUser(
			$scope.signUp.userName,
			$scope.signUp.password,
			$scope.signUp.email
		).then(function(data) {
			if (data.status == 201) {
				$scope.logInUser($scope.signUp.userName, $scope.signUp.password);
			}
		});
	}

	$scope.logOutUser = function () {
		$cookies.put('loggedInUser', '');	
		$state.go('main');
	}

});

app.filter('customTime', function () {
	return function (input) {
		return input.toString().length < 2 ? '0' + input : input;
	}
});

app.run(function($http, $rootScope) {
	$http({
		method: "GET",
		url: '/'
	}).then(function(res) {
		if (res.status == 200) {
			$rootScope.apiAvailable = 'true';
		}
	});
});

app.provider("httpRequest", function () {
	var response;
	return {
		sendRequest: function () {
			var xhr = new XMLHttpRequest();
			
			xhr.open('GET', '/', false)
				 .send();

			if (xhr.status != 200) {
			  alert("ERROR!");
			} else {
			  response = xhr.responseText;
			}

			console.log(response);
		},
		logData: function () {
			console.log(response);
		},
		$get: function () {
			 return {
			 	data: response
			 }
		}
	}
	
});

app.config([
	'$stateProvider', '$urlRouterProvider', 'httpRequestProvider',
	function($stateProvider, $urlRouterProvider, httpRequestProvider) {
		httpRequestProvider.sendRequest();

		$urlRouterProvider.when('', '/');

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
}]);





