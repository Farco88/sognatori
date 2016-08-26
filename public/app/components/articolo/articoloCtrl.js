app.controller("articoloCtrl", function($scope, $location, $rootScope, $http, Articolo){

	// Inizializzo le variabili
	$scope.giorni = [];
	for (var i = 1; i <= 31; i++) {
	    $scope.giorni.push(i);
	}	
	$scope.mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"]
	$scope.anni = [];
	for (var i = 1900; i <= new Date().getFullYear(); i++) {
	    $scope.anni.push(i);
	}
	$scope.user;
	$scope.commentRow;
	$scope.loggarsi = false;
	$scope.puoCommentare = false;
	$scope.authError = false;
	$scope.emailGiaPresente = false;
	$scope.usernameGiaPresente = false;
	$scope.utenteDaRegistrare = false;
	$scope.errorPrivacy = false;
	$scope.showPrivacy = false;
	$scope.immagineProfilo = "img/profilo.png";
	$scope.mostrareCommenti = false;
	$scope.testoMostrareCommenti = "Mostra Commenti";
	$scope.indirizzo=


	$scope.social = {
              Url: $location.path(),
              Name: $rootScope.articolo.title,
              ImageUrl: $rootScope.articolo.pathImmagine
  	};	

	$scope.mostraCommenti = function(){
		if($scope.testoMostrareCommenti === "Mostra Commenti"){
			$scope.mostrareCommenti = true;
			$scope.testoMostrareCommenti = "Nascondi Commenti";
		}else{
			$scope.mostrareCommenti = false;
			$scope.testoMostrareCommenti = "Mostra Commenti";			
		}
		
	} // fine function()

	$scope.getCommenti = function(){
		getCommenti($rootScope.articolo.commenti)
			.success(function(response){
				for(var i=0;i<response.length;++i){
					$rootScope.articolo.commenti[i]["username"] = response[i]["username"];	
					if(response[i]["pathImmagine"] == undefined){
						$rootScope.articolo.commenti[i]["pathImmagine"] = "img/profilo.png";	
					}else{
						$rootScope.articolo.commenti[i]["pathImmagine"] = response[i]["pathImmagine"];		
					}
					
				} // fine for()
				// Ordino per l'ultima data
				$rootScope.articolo.commenti.sort(function(a, b) {
				  if (a.data < b.data) {
				    return 1;
				  }
				  if (a.data > b.data) {
				    return -1;
				  }
				  // names must be equal
				  return 0;
				});							
			});
	} // fine function()

	$scope.miPiace = function(){
			
		checkMiPiace($rootScope.articolo._id, $rootScope.userLogged.email)
			.success(function(response){
				// Se non gli piace allora inserisci il suo mi piace
				if(!response){
					miPiace($rootScope.articolo._id, $rootScope.userLogged.email)
						.success(function(response){
							if(response){
								document.getElementById("cuore").className = "glyphicon glyphicon-heart pull-left";
							}
						});		
				}
			});
	} // fine function()


	$scope.vuolePartecipare = function(){
		
		$scope.commentRow = 8;
		if(!$scope.puoCommentare){
			$scope.loggarsi = true;	
		}
		
	} // fine function()


	$scope.logIn = function(){
        // Controlla se tutti i campi del form sono validi
        if ($scope.loginForm.$valid) {    
			verificaUsernamePass($scope.user.email, $scope.user.password)
				.success(function(response){
					$scope.authError = response.authError;						
					if(!$scope.authError){
						$scope.user = response.user;
						if($scope.user["pathImmagine"]){
							$scope.immagineProfilo = $scope.user["pathImmagine"];
						}else{
							$scope.immagineProfilo = "img/profilo.png";;
						}
						
						$rootScope.userLogged = $scope.user;
						$scope.loggarsi = false;
						$scope.puoCommentare = true;
						checkMiPiace($rootScope.articolo._id, $rootScope.userLogged.email)
							.success(function(response){
								if(response){
									document.getElementById("cuore").className = "glyphicon glyphicon-heart pull-left";	
									console.log("si gli piaceva");

								}else{
									document.getElementById("cuore").className = "glyphicon glyphicon-heart-empty pull-left";
									console.log("NON gli piaceva");
								}			
							});							
					}					
				});          
        }
        else { 
            //if form is not valid set $scope.addContact.submitted to true     
            $scope.loginForm.submitted=true;    
        }	
	} // fine function()

	$scope.logOut = function(){
		$rootScope.userLogged = null;
		$scope.loggarsi = true;
		$scope.puoCommentare = false;		
	} // fine function()

	$scope.vaiProfilo = function(){
		$location.path("/profilo/"+$rootScope.userLogged.username);
	} // fine function()


	$scope.commenta = function(){
		if ($scope.commentaForm.$valid) {
			inserisciCommento($rootScope.articolo._id, $rootScope.userLogged.email, $scope.commento)
				.success(function(response){
					if(response){
						alert("Commento inserito");
					}
				});		
		}else {
			$scope.commentaForm.submitted=true;
		}
		} // fine function()

	$scope.apriModalRegistrazione = function(){		
		$('#registrazione-modal').modal('show');
	} // fine function()

	$scope.apriModalRecupera = function(){			
		$('#recupera-modal').modal('show');
	} // fine function()


	$scope.apriPrivacy =  function(){
		$scope.showPrivacy = true;
	} // fine function()

	$scope.register = function(){
		if($scope.user.check == undefined){
			$scope.errorPrivacy = true;
		}else{
			$scope.errorPrivacy = false
		}
		if ($scope.registerForm.$valid) {    
              	// Se anno o mese o giorno non è stato definito allora metti tutti e tre a non definito
              	if($scope.user.anno == undefined || $scope.user.mese == undefined || $scope.user.giorno == undefined){
              		$scope.user.anno = undefined;
              		$scope.user.mese = undefined;
              		$scope.user.giorno = undefined;
              	}
              	// Verifica se l'username è gia presente
              	checkUsername($scope.user.username)
              		.success(function(response){
              			if(!response){ // Se non è gia presente allora vai avanti coi controlli
              				$scope.usernameGiaPresente = false;
			              	// Verifica se l'email è gia presente nel db
			              	checkEmail($scope.user.email)
			  					.success(function(response){
			  						if(!response){ // Se non è gia presente allora registra l'utente
			  							$scope.emailGiaPresente = false;
			  							registraUtente($scope.user)
			  								.success(function(response){
			  									if(response){
			  										$('#registrazione-modal').modal('hide');
			  										alert("Registrazione avvenuta con successo, è stata inviata un'email di conferma al tuo indirizzo di posta.");	
			  										invaiEmailConferma($scope.user);
			  									}  									
			  								});	
			  						}else{
			  							$scope.emailGiaPresente = true;
			  							
			  						}
								});
              			}else{
              				$scope.usernameGiaPresente = true;
              			}
              		});
			
		              	
            }
            else {
                //if form is not valid set $scope.addContact.submitted to true     
                $scope.registerForm.submitted=true;    
            }		
	} // fine function()

	$scope.inviaPassword = function(){
		checkRegistrato($scope.user.email)
			.success(function(response){
				if(!response){ // Se non è registrato mostra che deve prima registrarsi
						$scope.utenteDaRegistrare = true;
				}else{ // altrimenti invia l'email
					$scope.utenteDaRegistrare = false;
					inviaEmailRecupera($scope.user)
						.success(function(response){
							console.log("email inviata");
							if(response){
								$('#recupera-modal').modal('hide');
								alert("La password è stata inviata all'email del tuo indirizzo di posta.");								
							}
						});
				}
			});			
	} // fine function()1


});