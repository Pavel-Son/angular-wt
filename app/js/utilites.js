angular.module('wt.utilites', [])
	.factory('utilites', function() {
		return {
			addZero: function(val) {
				return val = val.length < 2 ? '0' + val : val;
			}
		}
	})