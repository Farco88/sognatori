app.service("Profilo", ["$http", function($http){

	aggiornaProfilo = function(user, file, Upload, $timeout){
		info = {};
		// Ciclo sulle key di user
		for (var p in user) {
			// Se è stata definita la proprietà ed il suo valore è diverso da undefined allora vai avanti
			// e aggiungi tutte le coppie key e value a info
		    if( user.hasOwnProperty(p) && user[p] != undefined ) {
		    	info[p] = user[p];
		    } // fine if
		} // fine for 
		
		// Aggiungo il file
		if(file){
			if(file.type.split('/')[0] === 'image'){
		        file.upload = Upload.upload({
		            url: '/inserisciImmagine',
		            data: {file: file}
		        });
		        file.upload.then(function (response) {
		            $timeout(function () {
		                file.result = response.data;
		            });
		        }, function (response) {
		            if (response.status > 0)
		                $scope.errorMsg = response.status + ': ' + response.data;
		        }, function (evt) {
		            file.progress = Math.min(100, parseInt(100.0 * 
		                                     evt.loaded / evt.total));
		        });   
		        info["file"] = file; 		
	    	} // fine if type = image						
		} // fine if file
		return $http.post("/modifyUtente", info);
	} // fine function()


}]);