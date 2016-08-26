app.service("Articolo", ["$http", function($http){

	getDate = function(anno, mese, giorno){
		var meseNumber = {"Gennaio": 0, "Febbraio": 1, "Marzo": 2, "Aprile": 3, "Maggio": 4, "Giugno": 5,
						 "Luglio": 6, "Agosto": 7, "Settembre": 8, "Ottobre": 9, "Novembre": 10, "Dicembre": 11}

		return new Date(parseInt(anno), meseNumber[mese], parseInt(giorno));
	}

	verificaUsernamePass = function(email, password){
		info = {
			"email": email,
			"password": password
		};
		return $http.post("/verificaPasswordUtente", info);
	}; // fine checkUsernamePass

	inserisciCommento = function(_idArticolo, email, testo){
		data = new Date();
		info = {
			"_id": _idArticolo,
			"email": email,
			"testo": testo,
			"data": data
		};		
		return $http.post("/inserisciCommento", info);
	}

	miPiace = function(_idArticolo, email){
		info = {
			"_id": _idArticolo,
			"email": email,
		};		
		return $http.post("/inserisciMiPiace", info);
	} 

	checkMiPiace = function(_idArticolo, email){
	info = {
			"_id": _idArticolo,
			"email": email,
		};		
		return $http.post("/checkMiPiace", info);			
	}


	registraUtente = function(user){
		info = {};
		// Ciclo sulle key di user
		for (var p in user) {
			// Se è stata definita la proprietà ed il suo valore è diverso da undefined allora vai avanti
			// e aggiungi tutte le coppie key e value a info
		    if( user.hasOwnProperty(p) && user[p] != undefined ) {
		    	info[p] = user[p];
		    } 
		}  

		// Se ho il giorno allora vuol dire che ho tutta la data
		// quindi rimuovo le tre componenti per mettere solo nascita
		if ('giorno' in info){
			info["nascita"] = getDate(info["anno"], info["mese"], info["giorno"]);
			delete info["giorno"];
			delete info["mese"];
			delete info["anno"];
		}

		return $http.post("/registraUtente", info);
	};	 

	checkEmail = function(email){
		info = {
			"email": email
		}
		return $http.post("/checkRegistrato", info);
	} // fine function()


	checkUsername = function(username){
		info = {
			"username": username
		}
		return $http.post("/checkUsername", info);
	} // fine function()	

	getCommenti = function(commenti){
		info = {
			"commenti": commenti
		}
		return $http.post("/getCommenti", info);
	} // fine function()


	invaiEmailConferma = function(user){
		info = {
			"email": user.email,
			"username": user.username,
			"password": user.password
		}
		return $http.post("/inviaEmailRegistrazione", info);
	}

	inviaEmailRecupera = function(user){
		info = {
			"email": user.email
		}
		return $http.post("/inviaEmailRecupera", info);
	}

}]);