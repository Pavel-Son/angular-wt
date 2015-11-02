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


