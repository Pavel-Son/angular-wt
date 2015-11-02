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

app.controller('UserController', function ($scope, $cookies, $state, userService, $http) {
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

	$scope.logOutUser = function () {
		// TODO: remove user from cookies
		$cookies.put('loggedInUser', '');
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
		.state('user', {
			url: '/user',
			parent: 'main',
			templateUrl: "partials/user.html",
			controller: 'UserController'
		});
});





'use strict';


angular.module('wt.directives', ['wt.utilites'])
	.directive('showHours', function(utilites) {

		function timeFormatChanger(scope, element, attrs) {

			var showDate = attrs.showDate;
			var showAmPm = attrs.showAmPm;
			var minutes  = attrs.minutes;

			// add zero if val.length < 2
			function addZero(val) {
				return val = val.length < 2 ? '0' + val : val;
			}

			function getDay(day) {

			}

			// return short mounth name
			function getMounth(num) {
				var mounthNames = [
					"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
				];

				return mounthNames[num];
			}

			// return a.m or p.m from 24 format hours
			function getDayPart(hours) {
				return hours >= 12 ? 'p.m' : 'a.m';
			}

			function updateTime(format) {
				var hours = attrs.showHours;
				var html = (hours >= format) ? hours - format : hours;
				html = html + '';
				html = addZero(html);

				if (format !== 24 && format !== 12) {
					format = 24;
				} 

				// add minutes
				if (minutes) {
					html += ':' + addZero(minutes);
				}
				// if it's a new day- show date
				if (showDate == 'true') {
					var date = new Date();
					var day = date.getDate();
					var mounth = date.getMonth();
					if (hours == '24') {
						html = addZero(day + 1) + "<span class='mounth'>" + getMounth(mounth) + "</span>";
					} else if (hours == '0') {
						html = addZero(day) + "<span class='mounth'>" + getMounth(mounth) + "</span>";
					}
				}
				
				// add am/pm day part
				if (showAmPm == 'true' && hours !== "24" && hours !== '0' && format !== 24) {
					html += "<span class='day-part'>" + getDayPart(hours) + "</span>";
				}

				element.html(html);

			};

			scope.$watch('hoursFormat', function(value) {
				updateTime(value);
			});

			// TODO: add timeout on hr
			

			// 24hrs= default format
			updateTime(24);
		}

		return {
			restrict: 'A',
			link: timeFormatChanger
		};
	})


	.directive('showDay', function() {

	});



'use strict';

angular.module('wt.services', [])
	.factory('citiesService', function ($http) {
		var returnCities = function () {
			return $http({
				method: "POST",
				url: "../../cities.json"
			});
		}

		return {
			getCities: function () {
				return returnCities();
			}
		}
	})
	.factory('userService', function ($http) {
		return {
			getUsers: function () {
				var requestParam = {
					method: "POST",
					url: "../../users.json"
				};

				//return promise
				return $http(requestParam);
			},

			verifyUser: function (users, userName, pass) {
				var currentUser = users[userName],
					userStatus = {
						"userExist": false,
						"passwordMatch": false
					};

				//userExist
				if (currentUser !== null) {
					userStatus.userExist = true;
					userStatus.passwordMatch = (currentUser.password == pass) ? true : false;
				}

				return userStatus;
			},

			getUserSettings: function (users, userName) {
				var currentUser = users[userName];
				return currentUser.userSettings;
			}
		}
	});


angular.module('wt.utilites', [])
	.factory('utilites', function() {
		return {
			addZero: function(val) {
				return val = val.length < 2 ? '0' + val : val;
			}
		}
	})