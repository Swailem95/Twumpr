app = angular.module('twumprApp', ['ngRoute']);

app.config(function($routeProvider){
	$routeProvider

	.when('/', {
		templateUrl : '/partials/main.html',
		controller  : 'mainCtrl'
	});


});
