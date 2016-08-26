
app.controller("menuCtrl", function($scope, $location, $rootScope, $http){


	$scope.vaiHome = function(){
		$location.path("/home");
		$('html, body').animate({
	        scrollTop: $("#myCarousel").offset().top
	    }, 2000);		
	} // fine function()

	$scope.vaiInterviste = function(){
		$rootScope.categoria = "Intervista";
		$location.path("/interviste");
	} // fine function()

	$scope.vaiLibri = function(){
		$rootScope.categoria = "Libro";
		$location.path("/libri");
	} // fine function()

	$scope.vaiCultura = function(){
		$rootScope.categoria = "Cultura";
		$location.path("/cultura");
	} // fine function()

	$scope.vaiContatti = function(){
		$('html, body').animate({
	        scrollTop: $("#contattiLabel").offset().top
	    }, 2000);
	} // fine function()



});	