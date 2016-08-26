app.controller("categoriaCtrl", function($scope, $location, $rootScope, $http, Categoria){

	// Definisco le variabili
	$scope.articoli = [];
	$scope.articInizio = 0;	
	$scope.articFine = 2;
	$scope.lunghezzaArticTot = 0;
    $scope.sottocategoria=undefined;


    // Trovo tutti gli articoli per genere
    $scope.getArticoli = function(){
		getArticoli($rootScope.categoria, $scope.articInizio, $scope.articFine, $scope.sottocategoria)
			.success(function(response){
				$scope.articoli = $scope.articoli.concat(response.obj);	
				$scope.lunghezzaArticTot = response.lunghezza;                 
			});
	    	    	
    };

    // Carico altri articoli
    $scope.getAltriArticoli = function(){
    	// Aggiorno gli indici degli articoli da prendere
    	$scope.articInizio = $scope.articFine;
    	$scope.articFine = $scope.articFine*2;
    	// Chiamo la function che restituisce gli articoli
    	$scope.getArticoli();
    };    

    $scope.getArticoliCultura = function(sottocategoria){
        $scope.sottocategoria = sottocategoria;
        $scope.articoli = [];
        $scope.articInizio = 0; 
        $scope.getArticoli();
        $('html, body').animate({
            scrollTop: $("#categoriaLabel").offset().top
        }, 500);           
    } // fine function()

    $scope.getTuttiArticoliCultura = function(){
        $scope.sottocategoria = undefined;
        $scope.articoli = [];
        $scope.articInizio = 0; 
        $scope.getArticoli();    
        $('html, body').animate({
            scrollTop: $("#categoriaLabel").offset().top
        }, 500);           
           
    } // fine function()


    $scope.leggiTutto = function(articolo){
        $rootScope.articolo = articolo;
        $location.path("/articoli/"+articolo._id+"/"+articolo.title);
    } // fine function()
    

});