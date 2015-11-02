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
