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
			},
			getUserData: function (id, token) {
				return $http({
					method: "GET",
					url: apiUrl + 'auth/user/' + id,
					headers: {
						Authorization: token
					}
				})
			},
			logInUser: function (userName, password) {
				var userData = {
					login: userName,
					password: password
				};

				return $http.post(apiUrl + "user/login", userData);
			},
			getUserList: function (token) {
				return $http({
					method: "GET",
					url: apiUrl + 'auth/users',
					headers: {
						Authorization: token
					}
				});
			},
			updateUser: function (user, token) {
				return $http({
					method: 'PUT',
					url: apiUrl + "/user/" + user.id,
					data: user,
					headers: {
						Authorization: token
					}
				});
			}
		}
	});
