
app.controller("homeCtrl", function($scope, $location, $rootScope, $http, $interval, Home){

	// Definisco le variabili
	$scope.intervista;
	$scope.libro;
	$scope.cultura;

	// Faccio andare avanti le immagini dello slider ogni tot secondi
	$interval( function(){ $scope.avanti(); }, 7000);

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
			attivo = $scope.carouselFoto[$scope.indice]
			passivo = $scope.carouselFoto[$scope.carouselFoto.length-1];
		}else{
			$scope.indice++;
			attivo = $scope.carouselFoto[$scope.indice];
			passivo = $scope.carouselFoto[$scope.indice-1];		
		}
		document.getElementById(attivo).className = "active";
		document.getElementById(passivo).className = "";		
	} // fine function()

	$scope.indietro = function(){
		if($scope.indice == 0){
			$scope.indice = $scope.carouselFoto.length-1;
			attivo = $scope.carouselFoto[$scope.indice];
			passivo = $scope.carouselFoto[0];		
		}else{
			$scope.indice--;
			attivo = $scope.carouselFoto[$scope.indice];
			passivo = $scope.carouselFoto[$scope.indice+1];	
		}
		document.getElementById(attivo).className = "active";
		document.getElementById(passivo).className = "";			
	} // fine function()	



});	