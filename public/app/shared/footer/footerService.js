
app.service("Amministratori", ["$http", function($http){

	checkUsernamePass = function(username, password){
		info = {
			"username": username,
			"password": password
		};
		return $http.post("/verificaPassword", info);
	}; // fine checkUsernamePass


	leggiImgCaricate = function(){
		info = {}
		return $http.post("/leggiImgCaricate", info);
	} // fine function leggiImmagini()


	insertImmagine = function(file, Upload, $timeout){
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
		}
	} // fine function insertImmagine()


	insertArticolo = function(amm, title, article, genre, file, Upload, $timeout){
		// Definisco la data
		var datetime = new Date().toUTCString();
		// Definisco le caratteristiche del nuovo articolo
		info = {
			"username": amm.username,
			"nome": amm.nome,
			"cognome": amm.cognome,
			"title": title,
			"article": article,
			"genre": genre.categoria,
			"subgenre": genre.sottocategoria,
			"datetime": datetime,
			"file": file
		};
    	if (file) {
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
	    	} // fine if type = image
        } // fine if file
        return $http.post("/inserisciArticolo", info);
	}; // fine function insertArticolo

	editArticolo = function(id, title, article, genre, file, Upload, $timeout){
		// Definisco la data
		var datetime = new Date().toUTCString();
		// Definisco le caratteristiche dell'articolo modificato
		info = {
			"_id": id,
			"title": title,
			"article": article,
			"genre": genre.categoria,
			"subgenre": genre.sottocategoria,
			"datetime": datetime,
			"file": file
		};
    	if (file) {
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
	    	} // fine if type = image
        } // fine if file		
        return $http.post("/editArticolobyId", info);
	};

	findArticolobyId = function(id){
		info = {
			"_id": id
		};
		return $http.post("/getArticolobyId", info);
	};



	removeArticolo = function(id){
		info = {
			"_id": id
		};
		return $http.post("/removeArticolo", info);
	};		
	


}]);	


app.service("Email", ["$http", function($http){

	inviaEmail = function(name, email, text){
		info = {
			"name": name,
			"email": email,
			"text": text
		};		
		return $http.post("/inviaEmailContatti", info);
	};	

}]);