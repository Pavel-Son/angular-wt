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
		var apiUrl = "http://s.q-man.ru:3000/";

		return {
			signUpUser: function (userName, password, email) {
				return $http({
					method: "POST",
					url: apiUrl + "user",
					data: {
						"login": userName,
						"password": password,
						"email": email
					}
				});
			},
			getUsers: function () {
				return $http({
					method: "GET",
					url: apiUrl + "users"
				});
			},
			getUser: function (users, userName) {
				return _.find(users, function(user) {
					return user.login == userName
				});
			}
		}
	});
