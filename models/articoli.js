//Importo mongoose
var mongoose = require('mongoose');


// Definisco lo schema degli articoli
var articoliSchema = new mongoose.Schema({
	username: String,
	nome: String,
	cognome: String,
	title: String,
	article: String,
	genre: String,
	subgenre: String,
	datetime: Date,
	pathImmagine: String,
	commenti : [{
	    email: String,
	    testo : String,
	    data: Date
    }],
    cuori : [String]
});

// Creo l'entità Articoli
var Articoli = mongoose.model('articoli', articoliSchema, 'articoli');

// Esporto l'entità articoli
module.exports = Articoli;