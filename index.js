// Express pour gestion port de la partie discord 
const express = require("express");

//Utilisation app pour express
const app = express();

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
var channel1 = config.streameur.username

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
	channels : [channel1],
};

//Mise en place du bot twitch avec les options sur client
const clientTwitch = new tmi.client(options);

//Connexion du bot twitch
clientTwitch.connect();

//Message d'allumage du bot sur le tchat twitch
clientTwitch.on('connected', (adress, port) => {
    console.log("[Twitch] : " + clientTwitch.getUsername() + " s'est connecté sur : " + adress + ", port : " + port);
    clientTwitch.action(channel1, 'Bonjour , je suis le bot en configuration. j"arrive avec le compte bot !');
});

//Fin connexion du bot twitch

//Connexion du bot discord 

//Génération du port random
app.set('port', (process.env.PORT || Math.floor(Math.random() * Math.floor(5000))))

app.listen(app.get('port'), function(){
    console.log(`[Discord] : Le bot fonctionne sur le port : ${app.get('port')} `);
})

//En cas d'erreur pour le bot discord
clientDiscord.on('warn', console.warn);
clientDiscord.on('error', console.error);
clientDiscord.on('disconnect', () => console.log('[Discord] : Je viens de me déconnecter, en m\'assurant que vous savez, je vais me reconnecter maintenant'));
clientDiscord.on('reconnecting', () => console.log('[Discord] : Je reconnecte maintenant !'));


//Clé du bot
clientDiscord.login(config.discord.token);

//Status du bot discord 
clientDiscord.on('ready', () => {
	//Génération du profils du bot sur discord.
	clientDiscord.user.setPresence({ game: { name: "En développement By Alexandre78R", type : "STREAMING", url: "https://www.twitch.tv/jaxoou"}});
	//Fix l'id du channel log sur discord
	ChannelLog = clientDiscord.channels.get(config.discord.log);
	
	//Vérification du channel de log sur discord
	if(ChannelLog === undefined){
		console.log("[Discord] : Attention vous n'avez pas définie le channel log ou il est introuvable !")
	}else{
		console.log(`[Discord] : Mise en place du channel log sur ${ChannelLog.name}`)
		console.log(`[Discord] : Connecté en tant que ${clientDiscord.user.tag}`)
	}
});

//Fin connexion du bot discord

// Début des commandes Discord

var prefixDiscord = config.discord.prefix;


//Commande test pour discord
clientDiscord.on('message', message => {

	if (message.content === prefixDiscord + 'test') {
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
  const prefixTwitch = "!";

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
			clientTwitch.say("alexandre78rg", `${user['display-name']}, Vous avez taper la commande !test !`)
			ChannelLog.send(`[LOG] : Un viewers à utilisé la commande test !**`)
			
			break;
			
				//Message d'erreur si la commande n'existe pas.
		    default:
		       clientTwitch.say("alexandre78rg", `${user['display-name']}, La Commande '` + command + "'' est non reconnue. Tapez " + prefix + "help pour la liste des commandes de " + client.getUsername());
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
	clientTwitch.action(channel1, `${username} a sub à la chaîne!`)
});

//Event quand une personne resub sur la chaine twitch !
clientTwitch.on("resub", function (channel, username, months, message, userstate, methods) {
	// Log sur discord
	ChannelLog.send(`[LOG] : ${username} est sub à la chaîne depuis ${months} mois ! Son message : ${message}`)
	// Message sur le tchat de twitch
	clientTwitch.action(channel1, `${username} est sub à la chaîne depuis ${months} mois ! `)
});

//Event quand une personne donne des cheer sur la chaîne twitch !
clientTwitch.on("cheer", function (channel, userstate, message) {
	// Log sur discord
	ChannelLog.send(`[LOG] : ${userstate.username} a donné ${userstate.bits} bits !`)
});

//Event quand une personne host sur la chaîne twitch !
clientTwitch.on("hosted", function (channel, username, viewers, autohost) {
	// Message sur le tchat de twitch
	clientTwitch.action(channel1, ` Merci pour le host ${username} ! ( ${viewers} )`)
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
	// clientTwitch.action(channel1, `L'utilisateur "${username}" est to pendant ${duration} !`)
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
