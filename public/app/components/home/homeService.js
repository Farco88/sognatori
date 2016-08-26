app.service("Home", ["$http", function($http){

	getNews = function(genre){
		info = {
			"genre": genre
		};
		return $http.post("/getNews", info);
	};	

}]);