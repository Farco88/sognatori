// Dipendenze
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

 
// Connessione a MongoDB
mongoose.connect('mongodb://localhost/sognatori');
 
// Importo i modelli
// var Utenti = require('./models/utenti');


// Inizializzazione Express
var app = express();

// Uso la cartella public e il suo file index.html come inizio 
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/uploads'));

// Uso il bodyParser
app.use(bodyParser.json());



// Importo il router
var router = require('./router/api');
app.use('/', router);

// Starto il server sulla porta 3000
app.listen(3000);

console.log("Server in running sulla porta 3000");
