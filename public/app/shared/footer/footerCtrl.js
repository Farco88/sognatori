

app.controller("footerCtrl", function($scope, $sce, $location, $rootScope, $http, Upload, $timeout, Amministratori, Categoria, Email){

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
	$scope.listaImmagini=[];


	$scope.tinymceOptions = {
	    format:'text',
	    plugins: 'link image code media textcolor colorpicker',
	    media_live_embeds: true,
	    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | forecolor backcolor |code image media'  
	};	


	$scope.logInAmm = function(){		
		checkUsernamePass($scope.usernameAmmAttempting, $scope.passwordAmmAttempting)
			.success(function(response){
				$scope.showError = response.showError;
				// Se non c'è errore mostra Logout e recupera l'oggetto amministratore
				if(!$scope.showError){
					$rootScope.amm = response.user;
					// Leggo le immagini caricate
			    	leggiImgCaricate()
			    		.success(function(response){
							$scope.listaImmagini = response;
			    		});					
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


    $scope.getArticoloPulito = function(articolo, preview){
    	$scope.articoloPulito = articolo;
	  	// Centro
	  	$scope.articoloPulito = $scope.articoloPulito.replace(/style="text-align: center;"/g, 'class="text-center"');
	  	$scope.articoloPulito = $scope.articoloPulito.replace(/<p><img style="display: block; margin-left: auto; margin-right: auto;"/g, '<p class="text-center"><img');
	  	// Destra
	  	$scope.articoloPulito = $scope.articoloPulito.replace(/<p style="text-align: right;">/g, '<p class="pull-right">');
	  	$scope.articoloPulito = $scope.articoloPulito.replace(/<p><img style="float: right;"/g, '<p class="pull-right"><img');
	  	// Sinistra
	  	$scope.articoloPulito = $scope.articoloPulito.replace(/<p style="text-align: left;">/g, '<p class="pull-left">'); 	
	  	$scope.articoloPulito = $scope.articoloPulito.replace(/<p><img style="float: left;"/g, '<p class="pull-left"><img');
	  	// A capi
	  	$scope.articoloPulito = $scope.articoloPulito.replace(/<p class="pull-right">&nbsp;<\/p>/g, '</br>'); 
	  	$scope.articoloPulito = $scope.articoloPulito.replace(/<p class="pull-left">&nbsp;<\/p>/g, '</br>'); 
	  	$scope.articoloPulito = $scope.articoloPulito.replace(/<p class="text-center">&nbsp;<\/p>/g, '</br>'); 

	    if(preview){
	    	$scope.articoloPulito = $scope.articoloPulito.substring(0, 400);
	    }  	  	

	    // Mi fido degli iframe inseriti
	    $scope.articoloPulito=$sce.trustAsHtml($scope.articoloPulito);	

	    return $scope.articoloPulito;
    } // fine function()



    $scope.inserisciImmagine = function(file, errFiles){
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];    	
    	insertImmagine($scope.f, Upload, $timeout)
    		.success(function(response){
    			console.log("Immagine inserita");
    		});
    } // fine function()


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
    	$scope.f = null;
    	findArticolobyId(id)
			.success(function(response){
				// Assegno i valori della risposta
				$scope.title = response.title;		
				$scope.article = response.article;	
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