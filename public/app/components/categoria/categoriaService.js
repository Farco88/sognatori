app.service("Categoria", ["$http", function($http){

	getArticoli = function(genre, inizio, fine, sottocategoria){
		info = {
			"genre": genre,
			"subgenre": sottocategoria,
			"inizio": inizio,
			"fine": fine
		};
		return $http.post("/getArticoli", info);
	};	


}]);	