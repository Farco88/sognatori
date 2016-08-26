app.controller("profiloCtrl", function($scope, $location, $rootScope, $http, Upload, $timeout, Profilo, Articolo){

	// Inizializzo variabili
	$scope.immagineProfilo = "img/profilo.png";
	if($rootScope.userLogged["pathImmagine"]){
		$scope.immagineProfilo = $rootScope.userLogged["pathImmagine"];
	}
	$scope.f="";
	$scope.usernameGiaPresente = false;
	var number2Mese = { 0: "Gennaio", 1: "Febbraio", 2: "Marzo", 3:"Aprile", 4: "Maggio", 5: "Giugno",
						 6: "Luglio", 7: "Agosto", 8: "Settembre", 9: "Ottobre", 10: "Novembre", 11: "Dicembre"}	




	// Assegno a $scope.f il file caricato
	$scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        
    }

	// Tiro fuori la data di nascita
	nascita = new Date($rootScope.userLogged.nascita);
	// Se la data di nascita non è definita allora metti undefined i suo attributi
	if(nascita == undefined){
		anno = undefined;
		mese = undefined;
		giorno = undefined;
	}else{
		anno = nascita.getFullYear();
		mese = number2Mese[nascita.getMonth()];
		giorno = nascita.getDate();		
	}
	$scope.user={
		"_id": $rootScope.userLogged._id,
		"username": $rootScope.userLogged.username,
		"sesso": $rootScope.userLogged.sesso,
		"anno": anno,
		"mese": mese,
		"giorno": giorno
	};
	$scope.giorni = [];
	for (var i = 1; i <= 31; i++) {
	    $scope.giorni.push(i);
	}	
	$scope.mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"]
	$scope.anni = [];
	for (var i = 1900; i <= new Date().getFullYear(); i++) {
	    $scope.anni.push(i);
	}	

	$scope.salva = function(){
		if ($scope.modifyForm.$valid) {
			// Vedi se l'username è già stata utilizzata
			checkUsername($scope.user.username)
				.success(function(response){
					if(!response || $scope.user.username == $rootScope.userLogged.username){
						$scope.usernameGiaPresente = false;
			          	// Se anno o mese o giorno non è stato definito allora metti tutti e tre a non definito
			          	if($scope.user.anno == undefined || $scope.user.mese == undefined || $scope.user.giorno == undefined){
			          		$scope.user.anno = undefined;
			          		$scope.user.mese = undefined;
			          		$scope.user.giorno = undefined;
			          	}
						// Se ho il giorno allora vuol dire che ho tutta la data
						// quindi rimuovo le tre componenti per mettere solo nascita
						if ('giorno' in $scope.user){
							$scope.user["nascita"] = getDate($scope.user["anno"], $scope.user["mese"], $scope.user["giorno"]);
							delete $scope.user["giorno"];
							delete $scope.user["mese"];
							delete $scope.user["anno"];
						}			          				
			          	// Aggiorno il profilo
			          	aggiornaProfilo($scope.user, $scope.f, Upload, $timeout)
			          		.success(function(response){
								$rootScope.userLogged["username"] = response["username"];		          			
								$rootScope.userLogged["password"] = response["password"];		          			
								$rootScope.userLogged["nascita"] = response["nascita"];		          			
								$rootScope.userLogged["sesso"] = response["sesso"];		          			
								$rootScope.userLogged["pathImmagine"] = response["pathImmagine"];		          			
			          			alert("Profilo modificato con successo");
			          		});
					}else{
						$scope.usernameGiaPresente = true;
					}
				});
			

		}else {
			$scope.modifyForm.submitted=true;
		}
	
	} // fine function()


	$scope.ritornaArticolo = function(){
		$location.path("/articoli/"+$rootScope.articolo._id+"/"+$rootScope.articolo.title);
	} // fine function()

});