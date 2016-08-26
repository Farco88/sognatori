//Importo mongoose
var mongoose = require('mongoose');


// Definisco lo schema degli utenti
var amministratoriSchema = new mongoose.Schema({
	username: String,
	password: String
});

// Creo l'entità Utenti
var Amministratori = mongoose.model('amministratori',amministratoriSchema,'amministratori');

// Esporto l'entità utenti
module.exports = Amministratori;