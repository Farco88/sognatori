//Importo mongoose
var mongoose = require('mongoose');


// Definisco lo schema degli articoli
var utentiSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
	sesso: String,
	nascita: Date,
	pathImmagine: String	
});

// Creo l'entità Articoli
var Utenti = mongoose.model('utenti', utentiSchema, 'utenti');

// Esporto l'entità articoli
module.exports = Utenti;