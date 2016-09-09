
app.controller("menuCtrl", function($scope, $location, $rootScope, $http, $interval){


	$scope.vaiHome = function(){
		$location.path("/home");	
	} // fine function()

	$scope.vaiInterviste = function(){
		$rootScope.categoria = "Intervista";
		$interval.cancel($rootScope.intervalPromise);		
		$location.path("/interviste");
	} // fine function()

	$scope.vaiLibri = function(){
		$rootScope.categoria = "Libro";
		$interval.cancel($rootScope.intervalPromise);
		$location.path("/libri");
	} // fine function()

	$scope.vaiCultura = function(){
		$rootScope.categoria = "Cultura";
		$interval.cancel($rootScope.intervalPromise);
		$location.path("/cultura");
	} // fine function()

	$scope.vaiContatti = function(){
		$('html, body').animate({
	        scrollTop: $("#contattiLabel").offset().top
	    }, 2000);
	} // fine function()



});	