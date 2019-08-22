//Api pour twitch
const tmi = require('tmi.js');

//Import de la configuration
var config = require("../config/config.json");

//Nom de la chaine ou le bot fait la modération sur twitch
var channel = config.streameur.username

//Option à la connexion de twitch
const options = {
	options: {
		debug:true,
	},
	connection: {
		cluster: 'aws',
		reconnect: true,
	},
	identity: {
		username : config.twitch.username,
		password: config.twitch.oauth,
	},
	channels : [channel],
};

//Mise en place du bot twitch avec les options sur client
const clientTwitch = new tmi.client(options);

//Connexion du bot twitch
clientTwitch.connect();

//Message d'allumage du bot sur le tchat twitch
clientTwitch.on('connected', (adress, port) => {
    console.log("[Twitch] : " + clientTwitch.getUsername() + " s'est connecté sur : " + adress + ", port : " + port);
    clientTwitch.action(channel, 'Bonjour , je suis le bot en configuration. j"arrive avec le compte bot !');
});