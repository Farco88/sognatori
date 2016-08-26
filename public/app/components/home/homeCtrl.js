
app.controller("homeCtrl", function($scope, $location, $rootScope, $http, Home){

	// Definisco le variabili
	$scope.intervista;
	$scope.libro;
	$scope.cultura;

	$scope.getNews = function(){
		getNews("Intervista")
			.success(function(response){
				$scope.intervista = response.obj;
			});
		getNews("Libro")
			.success(function(response){
				$scope.libro = response.obj;
			});
		getNews("Cultura")
			.success(function(response){
				$scope.cultura = response.obj;
			});
	} // fine function()



	$scope.sfogliaIntervista = function(articolo){
        $rootScope.articolo = articolo;
        $rootScope.categoria = "Intervista";
        $location.path("/articoli/"+articolo._id+"/"+articolo.title);
	} // fine functon()

	$scope.sfogliaLibro = function(articolo){
        $rootScope.articolo = articolo;
        $rootScope.categoria = "Libro";
        $location.path("/articoli/"+articolo._id+"/"+articolo.title);
	} // fine functon()

	$scope.sfogliaCultura = function(articolo){
        $rootScope.articolo = articolo;
        $rootScope.categoria = "Cultura";
        $location.path("/articoli/"+articolo._id+"/"+articolo.title);
	} // fine functon()


	$scope.carouselFoto = ["img/interviste.jpg", "img/libri.jpg", "img/cultura.jpg"];
	$scope.indice = 0;



	$scope.avanti = function(){
		if($scope.indice == $scope.carouselFoto.length-1){
			$scope.indice = 0;
			document.getElementById($scope.carouselFoto[$scope.indice]).className = "active";
			document.getElementById($scope.carouselFoto[$scope.carouselFoto.length-1]).className = "";
		}else{
			$scope.indice++;
			document.getElementById($scope.carouselFoto[$scope.indice]).className = "active";
			document.getElementById($scope.carouselFoto[$scope.indice-1]).className = "";			
		}
	} // fine function()

	$scope.indietro = function(){
		if($scope.indice == 0){
			$scope.indice = $scope.carouselFoto.length-1;
			document.getElementById($scope.carouselFoto[$scope.indice]).className = "active";
			document.getElementById($scope.carouselFoto[0]).className = "";			
		}else{
			$scope.indice--;
			document.getElementById($scope.carouselFoto[$scope.indice]).className = "active";
			document.getElementById($scope.carouselFoto[$scope.indice+1]).className = "";		
		}
	} // fine function()	



});	