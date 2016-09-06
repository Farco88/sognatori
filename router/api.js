// Importo express
var express = require('express');
var multer = require('multer');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var fs = require('fs');

var router = express.Router();


// Importo i modelli del db
var Amministratori = require('../models/amministratori');
var Articoli = require('../models/articoli');
var Utenti = require('../models/utenti');



var immagineSalvata;


// // Carico le immagini
// var storage = multer.diskStorage({ //multers disk storage settings
//     destination: function (req, file, cb) {
//         cb(null, './uploads/')
//     },
//     filename: function (req, file, cb) {

//         var datetimestamp = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '');

//         immagineSalvata = file.originalname.split('.')[0] + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];

//         console.log("immagineSalvata: "+immagineSalvata);

//         cb(null, immagineSalvata);
//     }
// });
// var upload = multer({ //multer settings
//                 storage: storage
//             }).single('file');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
  	immagineSalvata = file.originalname.split('.')[0] + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
    cb(null, immagineSalvata)
  }
})
 
// var upload = multer({ dest: 'uploads/' });
var upload = multer({ storage: storage });

// API che invia email con la conferma di avvenuta registrazione
router.post("/inviaEmailRegistrazione", function(req, res){

	// Tiro fuori le info
	info = req.body;

	soggetto=''

	var options = {
	    service: 'gmail',
	    auth: {
	        user: 'sognatori.erranti@gmail.com',
	        pass: 'sognatorilibri'
	    }
  	};
  	var transporter = nodemailer.createTransport(smtpTransport(options));


	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: 'sognatori.erranti@gmail.com', // sender address
	    to: info.email, // list of receivers
	    subject: 'Registrazione avvenuta', // Subject line
	    text: 'Ciao '+info.username+' la tua registrazione su Sognatori Erranti è avvenuta con successo.\n'+
	    'La tua password è: \n\t'+info.password+'\nBenvenuto e aspettiamo i tuoi commenti sui nostri articoli.\n\n Il Team di Sognatori Erranti', // plaintext body
	    html: '' // html body
	}

  	// send mail with defined transport object
  	transporter.sendMail(mailOptions, function(error, response){
      if(error){
          console.log(error);
      }else{
          console.log("Message sent");
          res.json(true);
      }
  	});
});	


// API che legge tutti i file che si trovano nella cartella uploads
router.post("/leggiImgCaricate", function(req, res){

	fs.readdir("./uploads", function(err, items) {
	    res.json(items);
	});


});

// API che invia all'email la password recuperata
router.post("/inviaEmailRecupera", function(req, res){

	// Tiro fuori le info
	info = req.body;

	soggetto=''

	var options = {
	    service: 'gmail',
	    auth: {
	        user: 'sognatori.erranti@gmail.com',
	        pass: 'sognatorilibri'
	    }
  	};
  	var transporter = nodemailer.createTransport(smtpTransport(options))

  	var password;


  	// Tiro fuori la password dall'email
	Utenti.findOne({email: info.email}, function(err,data) { 
		// Se si trovano nel db allora non mostrare l'errore
		if(data != null){
			// setup e-mail data with unicode symbols
			var mailOptions = {
			    from: 'sognatori.erranti@gmail.com', // sender address
			    to: info.email, // list of receivers
			    subject: 'Recupera Password', // Subject line
			    text: 'Ciao,\n la tua password è: \n\t'+data["password"]+'\n\n Il Team di Sognatori Erranti', // plaintext body
			    html: '' // html body
			}

		  	transporter.sendMail(mailOptions, function(error, response){
			      if(error){
			          console.log(error);
			      }else{
			          console.log("Message sent");
			          res.json(true);
			      }
			});
		}
	});




	  
});	

// API che invia email da chi la invia dai contatti
router.post("/inviaEmailContatti", function(req, res){

	// Tiro fuori le info
	info = req.body;

	soggetto=''

	var options = {
	    service: 'gmail',
	    auth: {
	        user: 'sognatori.erranti@gmail.com',
	        pass: 'sognatorilibri'
	    }
  	};
  var transporter = nodemailer.createTransport(smtpTransport(options))


  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: info.email, // sender address
    to: 'sognatori.erranti@gmail.com', // list of receivers
    subject: 'Contatti Sognatori Erranti: '+info.name, // Subject line
    text: 'Email: '+info.email+'\nTesto:\n'+info.text, // plaintext body
    html: '' // html body
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, response){
      if(error){
          console.log(error);
      }else{
          console.log("Message sent");
          res.json(true);
      }

      // if you don't want to use this transport object anymore, uncomment following line
      //smtpTransport.close(); // shut down the connection pool, no more messages
  });
});	

// API che verifica username e password
router.post("/verificaPassword", function(req, res){

	// Tiro fuori le info
	info = req.body;
	// Vedo se la username e password inserita si trovano nel db
	Amministratori.findOne({username: info.username, password: info.password}, function(err,obj) { 
		// Se si trovano nel db allora non mostrare l'errore
		if(obj != null){
			risposta = {
				"user": obj,
				"showError": false
			}
			// Manda la risposta di showError
			res.json(risposta);			
		}else{
			risposta = {
				"showError": true
			}			
			res.json(risposta);
		}
	});

});


// API che verifica username e password del generico utente
router.post("/verificaPasswordUtente", function(req, res){

	// Tiro fuori le info
	info = req.body;
	// Vedo se la username e password inserita si trovano nel db
	Utenti.findOne({email: info.email, password: info.password}, function(err,obj) { 
		// Se si trovano nel db allora non mostrare l'errore
		if(obj != null){
			risposta = {
				"user": obj,
				"authError": false
			}
			// Manda la risposta di showError
			res.json(risposta);			
		}else{
			risposta = {
				"authError": true
			}			
			res.json(risposta);
		}
	});

});

// API che vede se l'email è già stata registrata
router.post("/checkRegistrato", function(req, res){

	// Prendo le info inviate dal client
	info = req.body;

	Utenti.findOne({email: info.email}, function(err,data) { 

		if(err){
	    	console.log(err);	
	    }
	    if(data){ // se l'email è già presente invia true
	    	res.json(true);
	    }else{ // altrimenti invia false
			res.json(false);
	    }
		
		
	});
});	

// API che vede se l'username è già stata registrata
router.post("/checkUsername", function(req, res){

	// Prendo le info inviate dal client
	info = req.body;

	Utenti.findOne({username: info.username}, function(err,data) { 

		if(err){
	    	console.log(err);	
	    }
	    if(data){ // se l'username è già presente invia true
	    	res.json(true);
	    }else{ // altrimenti invia false
			res.json(false);
	    }
		
		
	});
});	

// API che registra un nuovo utente
router.post("/registraUtente", function(req, res){
	// Prendo le info inviate dal client
	info = req.body;

	var nuovoUtente={};
	// Inserisco nell'utente le info inviate dal fe
	for (var p in info) {
		nuovoUtente[p] = info[p];						
	} 

	nuovoUtente = new Utenti(nuovoUtente);

	nuovoUtente.save(function (err, data) {
		if(err){
	    	console.log(err);	
	    }else{
	    	res.json("Utente registrato con successo!");
	    }
	});
});


// API che fa l'update dei dati dell'utente
router.post("/modifyUtente", function(req, res){
	// Prendo le info inviate dal client
	info = req.body;

	var utente={};
	// Inserisco nell'utente le info inviate dal fe
	for (var p in info) {
		utente[p] = info[p];						
	} 
	utente["pathImmagine"] = immagineSalvata;

	utente = new Utenti(utente);


	Utenti.findOneAndUpdate({"_id": info._id}, utente, 
		{upsert:false}, function(err, doc){
	    if(err){
	    	console.log(err);	
	    }else{
	    	res.json(utente);
	    }
	});		
});


// API che inserisce un nuovo articolo
router.post("/inserisciArticolo", function(req, res){

	// Prendo le info inviate dal client
	info = req.body;
	// Se è stato caricato anche il file allora salvo in questo modo
	if(info.file){
		var nuovoArticolo = new Articoli({
			username: info.username,
			nome: info.nome,
			cognome: info.cognome,
			title: info.title,
			article: info.article,
			genre: info.genre,
			subgenre: info.subgenre,
			datetime: info.datetime,
			pathImmagine: immagineSalvata		
		});


		nuovoArticolo.save(function (err, data) {
			if(err){
		    	console.log(err);	
		    }else{
		    	res.json("Articolo inserito con successo!");
		    }
		});

	}else{ // altrimenti cosi
		var nuovoArticolo = new Articoli({
			username: info.username,
			nome: info.nome,
			cognome: info.cognome,			
			title: info.title,
			article: info.article,
			genre: info.genre,
			subgenre: info.subgenre,
			datetime: info.datetime		
		});

		nuovoArticolo.save(function (err, data) {
			if(err){
		    	console.log(err);	
		    }else{
		    	res.json("Articolo inserito con successo!");
		    }
		});
	}


});

// API che inserisceImmagine
router.post("/inserisciImmagine", upload.single('file'), function(req, res){
    res.json(true);
});	
// router.post("/inserisciImmagine", function(req, res){
//     upload(req,res,function(err){
//         if(err){
//              res.json({error_code:1,err_desc:err});
//              return;
//         }
//         res.json({error_code:0,err_desc:null});
//     });
// });	


// API che restituisce gli articoli filtrati
router.post("/getArticoli", function(req, res){

	// Tiro fuori le info
	info = req.body;


	// Se è presente la info subgenre allora fai questa query altrimenti quella normale
	if(info.subgenre){
		query = {$and : [{genre: info.genre}, {subgenre: info.subgenre}]}; 
	}else{
		query = {genre: info.genre};
	}	

	Articoli.find(query, function(err,obj) { 

		// Ordinamento dalla data piu nuova a quella piu vecchia
		obj.sort(function(a, b) {
		  if (a.datetime < b.datetime) {
		    return 1;
		  }
		  if (a.datetime > b.datetime) {
		    return -1;
		  }
		  // names must be equal
		  return 0;
		});

		lunghezza = obj.length;

		obj = obj.slice(info.inizio,info.fine);
		risposta={
			"obj": obj,
			"lunghezza": lunghezza
		}		
		res.json(risposta);			
	});	
});	


// API che restituisce l'ultimo articolo inserito per genere
router.post("/getNews", function(req, res){
	// Tiro fuori le info
	info = req.body

	Articoli.find({genre: info.genre}, function(err,obj) { 

		// Ordinamento dalla data piu nuova a quella piu vecchia
		obj.sort(function(a, b) {
		  if (a.datetime < b.datetime) {
		    return 1;
		  }
		  if (a.datetime > b.datetime) {
		    return -1;
		  }
		  // names must be equal
		  return 0;
		});


		// Restituisco l'ultimo
		risposta={
			"obj": obj[0]
		}
		
		res.json(risposta);			
	});	
});	

// API che restituisce il singolo articolo per id
router.post("/getArticolobyId", function(req, res){
	// Tiro fuori le info
	info = req.body;
	
	Articoli.findOne({_id: info._id}, function(err,obj) { 
		res.json(obj);			
	});		
});		

// API che fa l'update di un articolo
router.post("/editArticolobyId", function(req, res){
	// Tiro fuori le info
	info = req.body;


	// Se è stato caricato anche il file allora salvo in questo modo
	if(info.file){
		Articoli.findOneAndUpdate({"_id": info._id}, {"title": info.title, "article": info.article, "genre": info.genre, "datetime": info.datetime, "pathImmagine": immagineSalvata}, 
			{upsert:false}, function(err, doc){
		    if(err){
		    	console.log(err);	
		    }else{
		    	res.json("Articolo modificato con successo!");
		    }
		});	
	}else{
		Articoli.findOneAndUpdate({"_id": info._id}, {"title": info.title, "article": info.article, "genre": info.genre, "datetime": info.datetime}, 
			{upsert:false}, function(err, doc){
		    if(err){
		    	console.log(err);	
		    }else{
		    	res.json("Articolo modificato con successo!");
		    }
		});	
	}	
});	

// API che aggiunge un commento nell'articolo
router.post("/inserisciCommento", function(req, res){

	// Tiro fuori le info
	info = req.body;


	Articoli.findOneAndUpdate({"_id": info._id}, {
			$push : {
			    commenti : {
			        "email": info.email,
			        "testo": info.testo,
			        "data": info.data
			    }
			}
		}, 
		{upsert:false}, function(err, doc){
		    if(err){
		    	console.log(err);	
		    }else{
		    	res.json("Commento inserito con successo!");
		    }
	});

});

// API che aggiunge l'utente alla lista degli utenti a cui piace l'articolo
router.post("/inserisciMiPiace", function(req, res){

	// Tiro fuori le info
	info = req.body;


	Articoli.findOneAndUpdate({"_id": info._id}, {
			$push : {
			    cuori : info.email
			}
		}, 
		{upsert:false}, function(err, doc){
		    if(err){
		    	console.log(err);	
		    }else{
		    	res.json("Cuore inserito con successo!");
		    }
	});

});


// API che verifica se all'utente già piace l'articolo
router.post("/checkMiPiace", function(req, res){

	// Tiro fuori le info
	info = req.body;

	Articoli.findOne({_id: info._id, cuori: info.email}, function(err,obj) { 
		if(obj!=null){
			res.json(true);
		}else{
			res.json(false);
		}
	});	

}) 



// API che restituisce i commenti arricchiti con altre info
router.post("/getCommenti", function(req, res){

	// Tiro fuori le info
	info = req.body;
	
	commenti = info.commenti;
	risposta = [];


	var numRunningQueries = 0;
	for(var i=0;i<commenti.length;++i) {
	  	++numRunningQueries;
		Utenti.findOne({ email: commenti[i].email}, function (err, utente) {
			risposta.push({"username":utente.username, "pathImmagine":utente.pathImmagine});
		    --numRunningQueries;
		    if (numRunningQueries === 0) {
		       // finally, AFTER all callbacks did return:
		       res.json(risposta);
		    }
		});
	}

	

});


// API che rimuove un articolo
router.post("/removeArticolo", function(req, res){

	// Tiro fuori le info
	info = req.body;

	// Rimuovo
	Articoli.findByIdAndRemove(info._id, function(err) {
		if(err){
	    	console.log(err);	
	    }else{
	    	res.json("Articolo rimosso con successo!");
	    }
	});	


});	

module.exports = router;