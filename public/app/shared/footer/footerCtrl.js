

app.controller("footerCtrl", function($scope, $location, $rootScope, $http, Upload, $timeout, Amministratori, Categoria, Email){

	// Definizione variabili
	$rootScope.logAmmName = "Accedi";	
	$scope.generi = [
		{"categoria":"Intervista", "sottocategoria":"Intervista"},
		{"categoria":"Libro", "sottocategoria":"Libro"},
		{"categoria":"Cultura", "sottocategoria":"Cultura Generica"},
		{"categoria":"Cultura", "sottocategoria":"Fashion"},
		{"categoria":"Cultura", "sottocategoria":"Cinema"},
		{"categoria":"Cultura", "sottocategoria":"Giappone"}
	];
	$scope.azioneArticolo = "Nuovo Articolo";
	$scope.idArt;
	$scope.f="";

	$scope.logInAmm = function(){		
		checkUsernamePass($scope.usernameAmmAttempting, $scope.passwordAmmAttempting)
			.success(function(response){
				$scope.showError = response.showError;
				// Se non c'è errore mostra Logout e recupera l'oggetto amministratore
				if(!$scope.showError){
					$rootScope.amm = response.user;
				}					
			});

		
	}; // fine function()

	$scope.logOutAmm = function(){
		$rootScope.amm=null;
	} // fine function()


	$scope.apriNuovoArticolo = function(){
		$scope.azioneArticolo = "Nuovo Articolo";
		$scope.title = "";		
		$scope.article = "";
		$scope.genre = $scope.generi[0];		
		$('#articolo-modal').modal('show');
	} // fine function apriNuovoArticolo()


	// Assegno a $scope.f il file caricato
	$scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        
    }

    // Salvo un articolo
    $scope.salvaArticolo = function(){
    	// Aggiungo un nuovo articolo
    	if($scope.azioneArticolo === "Nuovo Articolo"){
        	insertArticolo($rootScope.amm, $scope.title, $scope.article, $scope.genre, $scope.f, Upload, $timeout)
        		.success(function(response){
		    		getArticoli($rootScope.categoria, 0, $scope.articFine, $scope.sottocategoria)
						.success(function(response){
							$scope.articoli = response.obj;	
							$scope.lunghezzaArticTot = response.lunghezza;
						});
        		});			
    	}else{ // Modifico un articolo
    		editArticolo($scope.idArt, $scope.title, $scope.article, $scope.genre, $scope.f, Upload, $timeout)
				.success(function(response){
        			getArticoli($rootScope.categoria, 0, $scope.articFine, $scope.sottocategoria)
						.success(function(response){
							$scope.articoli = response.obj;	
							$scope.lunghezzaArticTot = response.lunghezza;
						});
        		});    		
    	}
		// Chiudo il modal dell'articolo
		$('#articolo-modal').modal('hide');
    }	


    // Trovo un articolo per id per poi modificarlo
    $scope.findArticolobyId = function(id){
    	findArticolobyId(id)
			.success(function(response){
				// Assegno i valori della risposta
				$scope.title = response.title;		
				$scope.article = response.article;
				$scope.f.name = response.pathImmagine;	
				$scope.idArt = response._id;
				// Cambio il titolo dell'azione in Modifica
				$scope.azioneArticolo = "Modifica Articolo";
				// Apro il modal
				$('#articolo-modal').modal('show');	
			});     	
    };

	$scope.apriConfermaRimozione = function(id){
		$('#confermaRimozione-modal').modal('show');
			$scope.idArt = id;
	};

	$scope.annullaRimozione = function(){
		$('#confermaRimozione-modal').modal('hide');
	};


	// Rimuovo un articolo per id
    $scope.removeArticolo = function(){
    	$('#confermaRimozione-modal').modal('hide');
    	removeArticolo($scope.idArt)
			.success(function(response){
	    		getArticoli($rootScope.categoria, 0, $scope.articFine, $scope.sottocategoria)
					.success(function(response){
						$scope.articoli = response.obj;	
						$scope.lunghezzaArticTot = response.lunghezza;
					});
			}); 
    };

    // Invia Email
    $scope.inviaEmail = function(){
    	if ($scope.emailForm.$valid) {
	    	inviaEmail($scope.emailName, $scope.emailEmail, $scope.emailText)
				.success(function(response){
					if(response){
						alert('Email inviata con successo!')
					}
				}); 
    	}else {
			$scope.emailForm.submitted=true;
		}

    };


});	