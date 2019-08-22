//Connexion Discord 
require("./connection/discord")

//Connexion Twitch 
require("./connection/twitch")

//Api pour twitch
const tmi = require('tmi.js');

//Api discord
const Discord = require('discord.js');

//Nom du client pour discord 
const clientDiscord = new Discord.Client();

//Import de la configuration
var config = require("./config/config.json");

// Valeur null pour le canal de log sur discord
var ChannelLog = null;

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

// Début des commandes Discord

var prefixDiscord = config.discord.prefix;

//Commande test pour discord
clientDiscord.on('message', message => {

	if (message.content === prefixDiscord+'test') {
		let reportEmbed = new Discord.RichEmbed()
		.setTitle("Test message")
		.setColor("#15f153")
		.addField("Test message", `test`)
		let reportschannel = message.guild.channels.find(`name`, "test-dev");
		if(!reportschannel) return message.channel.send(console.log("error channel"));

		reportschannel.send(reportEmbed);
		message.reply('test!');
	}

  });

  //Fin des commandes Discord

  //Prefix de commande pour twitch 
  const prefixTwitch = config.twitch.prefix;

  //Gestion prefix
  function commandParser(message){
    let prefixEscaped = prefixTwitch.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    let regex = new RegExp("^" + prefixEscaped + "([a-zA-Z]+)\s?(.*)");
    return regex.exec(message);
  }

//Début des commandes Twitch

//Gestion des commandes sur twitch
clientTwitch.on('chat', (channel, user, message, self) => {
	//Si le message via du bot il stop les fonctions.
	if (self) return;

		// client.say(channel, user['display-name'] + " a dit " + message );
		let commands = commandParser(message);

		//Les agument des commandes après le prefix
		if(commands){
			// Nom de la commande
			let command = commands[1];

		//Un paramètre mais désactivé pour raison que l'on utilise pas.
        	// let param = commands[2];
		
		//Liste des commandes
       	switch(command){
			//Commande de test
		    case "test":
			clientTwitch.say(channel, `${user['display-name']}, Vous avez taper la commande !test !`)
			ChannelLog.send(`[LOG] : Un viewers à utilisé la commande test !**`)
		    break;

				//Message d'erreur si la commande n'existe pas.
		    default:
		       clientTwitch.say(channel, `${user['display-name']}, La Commande '` + command + "'' est non reconnue. Tapez " + prefix + "help pour la liste des commandes de " + client.getUsername());
			//ChannelLog.send(`[LOG] : La commande n'existe pas ! `)
		}
    }
	
});

//Fin des commandes Twitch

//Début des events Twitch

//Event quand une personne sub sur la chaine twitch !
clientTwitch.on("subscription", function (channel, username, method, message, userstate) {
	// Log sur discord
	ChannelLog.send(`[LOG] : ${username} a sub à la chaîne ! Son Message : ${message}`)
	//Message sur le tchat de twitch
	clientTwitch.action(channel, `${username} a sub à la chaîne!`)
});

//Event quand une personne resub sur la chaine twitch !
clientTwitch.on("resub", function (channel, username, months, message, userstate, methods) {
	// Log sur discord
	ChannelLog.send(`[LOG] : ${username} est sub à la chaîne depuis ${months} mois ! Son message : ${message}`)
	// Message sur le tchat de twitch
	clientTwitch.action(channel, `${username} est sub à la chaîne depuis ${months} mois ! `)
});

//Event quand une personne donne des cheer sur la chaîne twitch !
clientTwitch.on("cheer", function (channel, userstate, message) {
	// Log sur discord
	ChannelLog.send(`[LOG] : ${userstate.username} a donné ${userstate.bits} bits !`)
});

//Event quand une personne host sur la chaîne twitch !
clientTwitch.on("hosted", function (channel, username, viewers, autohost) {
	// Message sur le tchat de twitch
	clientTwitch.action(channel, ` Merci pour le host ${username} ! ( ${viewers} )`)
	ChannelLog.send(`[LOG] : Merci pour le host ${username} ! ( ${viewers} )`)
});

//Event quand une personne to sur la chaîne twitch !
clientTwitch.on("timeout", (channel, username, reason, duration, userstate) => {
	// client.action(channel, `L'utilisateur "${username}" est to pendant ${duration} !`)
	if(duration === 1){
		ChannelLog.send(`[LOG] : L'utilisateur " ${username} " est to pendant ${duration} seconde ! `)
	}else{
		ChannelLog.send(`[LOG] : L'utilisateur " ${username} " est to pendant ${duration} secondes ! `)	
	}
});

//Event quand une personne deviens vip sur la chaîne twitch !
//Event non fontionnelle pour l'instant 
clientTwitch.on("vips", (channel, vips) => {
	// clientTwitch.action(channel, `L'utilisateur "${username}" est to pendant ${duration} !`)
	console.log(vips)
	// ChannelLog.send(`[LOG] : L'utilisateur "${vips}" est devenue vip !`)
});

// //Event quand une personne se follow !
// clientTwitch.on("followersonly", (channel, enabled, length) => {
// 	console.log("Channel", channel)
// 	console.log("Enable",  enabled)
// 	console.log("Length", length)
// });

// Event quand une personne supprime un messages sur la chaîne twitch !
clientTwitch.on("messagedeleted", (channel, username, deletedMessage, userstate) => {
	// Message LOGS
	ChannelLog.send(`[LOG] : Le message de ${username} a était supprimé. Il contenait: ${deletedMessage}`)
});

// Evvent quand une personne rejion là première fois la chaîne twitch
//Désactivé pour éviter les spams
// clientTwitch.on("join", (channel, username, self) => {
// 	ChannelLog.send(`[LOG] : " ${username} " viens de rejoindre la chaîne de twitch !`)
// });

//Fin des events Twitch
