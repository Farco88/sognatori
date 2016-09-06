var app = angular.module("app", ["ngSanitize", "ngRoute", "ngFileUpload", "ui.tinymce", "ngMessages", "angulike"]);


app.config(function($routeProvider){
	$routeProvider
	.when("/",{
		templateUrl: "app/components/home/homeView.html"
	})
	.when("/home",{
		templateUrl: "app/components/home/homeView.html"
	})
	.when("/interviste",{
		templateUrl: "app/components/categoria/intervisteView.html"
	})
	.when("/libri",{
		templateUrl: "app/components/categoria/libriView.html"
	})
	.when("/cultura",{
		templateUrl: "app/components/categoria/culturaView.html"
	})
	.when("/articoli/:idarticolo/:nomearticolo", {
		templateUrl: "app/components/articolo/articoloView.html"
	})
	.when("/profilo/:username", {					 
		templateUrl: "app/components/profilo/profiloView.html",
		resolve: {
			"check": function($location, $rootScope){
				if(!$rootScope.userLogged){
					$location.path("/")
				}
			}
		}		
	})

	.otherwise({
		redirectTo: "/"
	})
});