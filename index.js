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

// Valeur null pour le canal de log commande sur discord
var channelLogCommande = null;

// Valeur null pour le canal de log sub sur discord
var channelLogSub = null;

// Valeur null pour le canal de log des to sur discord
var channelLogTo = null;

// Valeur null pour le canal de log des Messages sur discord
var channelLogMessage = null;

// Valeur null pour le canal de log sur discord
var channelLog = null;

// Valeur null pour le canal de log des notifs sur discord
var channelLogNotif = null;

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
    // clientTwitch.action(channel1, 'Bonsoir tous mondes !');
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
	//Fix l'id des channel de log sur discord
	channelLogCommande = clientDiscord.channels.get(config.discord.channelLogCommande);
	channelLogSub = clientDiscord.channels.get(config.discord.channelLogSub);
	channelLogTo = clientDiscord.channels.get(config.discord.channelLogTo);
	channelLogMessage = clientDiscord.channels.get(config.discord.channelLogMessage);
	channelLog = clientDiscord.channels.get(config.discord.channelLog);
	channelLogNotif = clientDiscord.channels.get(config.discord.channelLogNotif);
	//Vérification des channels de log sur discord
	if(channelLogCommande === undefined){
		console.log("[Discord] : Attention vous n'avez pas définie le channel log des commandes ou il est introuvable !")
	} else if(channelLogSub === undefined){
		console.log("[Discord] : Attention vous n'avez pas définie le channel log des subs ou il est introuvable !")
	} else if(channelLogTo === undefined){
		console.log("[Discord] : Attention vous n'avez pas définie le channel log des to ou il est introuvable !")
	} else if(channelLogMessage === undefined){
		console.log("[Discord] : Attention vous n'avez pas définie le channel log des messages ou il est introuvable !")
	} else if(channelLog === undefined){
		console.log("[Discord] : Attention vous n'avez pas définie le channel log ou il est introuvable !")
	} else if(channelLogNotif === undefined){
		console.log("[Discord] : Attention vous n'avez pas définie le channel log des notifs ou il est introuvable !")
	}else{
		console.log(`[Discord] : Mise en place du channel log des commandes sur ${channelLogCommande.name} (ID : ${channelLogCommande.id})`)
		console.log(`[Discord] : Mise en place du channel log des subs sur ${channelLogSub.name} (ID : ${channelLogSub.id})`)
		console.log(`[Discord] : Mise en place du channel log des to sur ${channelLogTo.name} (ID : ${channelLogTo.id})`)
		console.log(`[Discord] : Mise en place du channel log des messages sur ${channelLogMessage.name} (ID : ${channelLogMessage.id})`)
		console.log(`[Discord] : Mise en place du channel log sur ${channelLog.name} (ID : ${channelLog.id})`)
		console.log(`[Discord] : Mise en place du channel log des notifs sur ${channelLogNotif.name} (ID : ${channelLogNotif.id})`)
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
			// clientTwitch.say(channel1, `${user['display-name']}, Vous avez taper la commande !test !`)

			let test = new Discord.RichEmbed()
			.setTitle(`[LOG] : Commande " ${prefixDiscord}test "`)
			.setColor("#15f153")
			.setDescription(`Un viewers à utilisé la commande " ${prefixDiscord}test " !`)
			channelLogCommande.send(test);
			
			break;
				//Message d'erreur si la commande n'existe pas.
		    default:
		    //    clientTwitch.say("alexandre78rg", `${user['display-name']}, La Commande '` + command + "'' est non reconnue. Tapez " + prefix + "help pour la liste des commandes de " + client.getUsername());
			//ChannelLog.send(`[LOG] : La commande n'existe pas ! `)
			console.log(`La commande " ${command} " n'existe pas !`)
		}
    }
	
});

//Fin des commandes Twitch

//Début des events Twitch

//Event quand une personne sub sur la chaine twitch !
clientTwitch.on("subscription", function (channel, username, method, message, userstate) {
	// Log sur discord
	let sub = new Discord.RichEmbed()
	.setTitle(`Une personne viens de subscription sur la chaîne !`)
	.setColor("#15f153")
	.addField(`Bienvenue à ${username} ! Son message contenait :`, message === null ? "" : message)
	channelLogSub.send(sub);

	//Message sur le tchat de twitch
	clientTwitch.action(channel1, `${username} c'est subscription à la chaîne! Son message contenaît : ${message === null ? "" : message}`)
});

//Event quand une personne resub sur la chaine twitch !
clientTwitch.on("resub", function (channel, username, months, message, userstate, methods) {
	// Log sur discord 
	let resub = new Discord.RichEmbed()
	.setTitle(`Nouveau re-subscription sur la chaîne !`)
	.setColor("#15f153")
	.addField(`${username} c'est re-subscription à la chaîne depuis ${months} mois ! Son message contenait :`, message === null ? "" : message)
	channelLogSub.send(resub);

	// Message sur le tchat de twitch
	clientTwitch.action(channel1, `${username} est re-subscription à la chaîne depuis ${months} mois ! Son message contenaît : ${message === null ? "" : message}`)
});

//Event quand une personne donne des cheer sur la chaîne twitch !
clientTwitch.on("cheer", function (channel, userstate, message) {

	//Notif sur discord 
	if (userstate.bits === 1){
		let cheer1 = new Discord.RichEmbed()
		.setTitle(`Dons de cheer sur la chaîne !`)
		.setColor("#15f153")
		.addField(`Merci à ${userstate.username} d'avoir donné ${userstate.bits} bit ! Son message contenait :`,  message === null ? "" : message)
		channelLogNotif.send(cheer1);

		clientTwitch.action(channel1, `Merci à ${userstate.username} d'avoir donné ${userstate.bits} bit !`)
	}else{
		let cheer = new Discord.RichEmbed()
		.setTitle(`Dons de cheer sur la chaîne !`)
		.setColor("#15f153")
		.addField(`Merci à ${userstate.username} d'avoir donnés ${userstate.bits} bits ! Son message contenait :`,  message === null ? "" : message)
		channelLogNotif.send(cheer);

		//Message sur le tchat de twitch
		clientTwitch.action(channel1, `Merci à ${userstate.username} d'avoir donnés ${userstate.bits} bits !`)
	}
});

//Event quand une personne host sur la chaîne twitch !
clientTwitch.on("hosted", function (channel, username, viewers, autohost) {
	//Désactivé pour l'instant.

	// let hosted = new Discord.RichEmbed()
	// .setTitle(`Host sur la chaîne Twitch !`)
	// .setColor("#15f153")
	// .setDescription(`Merci pour le host de ${username} ! Bienvenue aux ${viewers} viewers !`)
	// channelLogNotif.send(hosted);

	console.log("username", username)
	console.log("viewers", viewers)
	console.log("autohost", autohost)

	//Désactivé pour l'instant
	// clientTwitch.action(channel1, `Merci pour le host ${username} ! Bienvenue aux ${viewers} viewers !`)
});

clientTwitch.on("hosting", (channel, target, viewers) => {
	//Désactivé pour l'instant 

	// let hosting = new Discord.RichEmbed()
	// .setTitle(`Host sur la chaîne Twitch !`)
	// .setColor("#15f153")
	// .setDescription(`Merci pour le host de  ! Bienvenue aux ${viewers} viewers !`)
	// channelLogNotif.send(hosting);

	console.log("target", target)
	console.log("viewers", viewers)
	console.log("channel", channel)

	//Désactivé pour l'instant
	// clientTwitch.action(channel1, `Merci pour le host ${target} ! Bienvenue aux ${viewers} viewers !`)

});

//Event quand une personne to sur la chaîne twitch !
clientTwitch.on("timeout", (channel, username, reason, duration, userstate) => {
	// Notif sur discord
	if(duration === 1){
		let to1 = new Discord.RichEmbed()
		.setTitle(`[LOG] TO`)
		.setColor("#15f153")
		.setDescription(`L'utilisateur " ${username} " est to pendant ${duration} seconde ! `)
		channelLogTo.send(to1);
	}else{
		let to = new Discord.RichEmbed()
		.setTitle(`To sur ${username}`)
		.setColor("#15f153")
		.setDescription(`L'utilisateur " ${username} " est to pendant ${duration} secondes ! `)
		channelLogTo.send(to);	
	}
});

// Event quand une personne supprime un messages sur la chaîne twitch !
clientTwitch.on("messagedeleted", (channel, username, deletedMessage, userstate) => {
	//Log sur le discord
	let message = new Discord.RichEmbed()
	.setTitle(`Message suprimé`)
	.setColor("#15f153")
	.addField(`Le message de ${username} a était supprimé. Il contenait :`, `${deletedMessage}`)
	channelLogMessage.send(message);
});

//Event quand une personne prend un ban à vie sur la chaîne twitch
clientTwitch.on("ban", (channel, username, reason, userstate) => {
	//Notif sur discord
	let ban = new Discord.RichEmbed()
	.setTitle(`Ban sur ${username}`)
	.setColor("#15f153")
	.setDescription(`L'utilisateur " ${username} " est ban à vie ! `)
	channelLogTo.send(ban);	
});

//Event en test
clientTwitch.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
	let senderCount = ~~userstate["msg-param-sender-count"];
	console.log("senderCount", senderCount)
	console.log("userneme", username)
	console.log("streakMonths", streakMonths)
	console.log("recipient", recipient)
});

//Event en test
clientTwitch.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {

	let senderCount = ~~userstate["msg-param-sender-count"];
	console.log("senderCount", senderCount)
	console.log("userneme", username)
	console.log("numbOfSubs", numbOfSubs)
});

//Event si le mode sub du tchat est activé ou désactivé
clientTwitch.on("subscribers", (channel, enabled) => {
	//Notif sur discord
	if (enabled === true){
		let subOnlyT = new Discord.RichEmbed()
		.setTitle(`Etat tchat abonné`)
		.setColor("#15f153")
		.addField(`Le mode tchat abonné est activé !`)
		channelLog.send(subOnlyT);	
	}{
		let subOnlyF = new Discord.RichEmbed()
		.setTitle(`Etat tchat abonné`)
		.setColor("#bc0000")
		.addField(`Le mode tchat abonné est désactivé !`)
		channelLog.send(subOnlyF);	
	}
});

//Event si le slowmode est activé ou désactivé sur le tchat
clientTwitch.on("slowmode", (channel, enabled, length) => {
	//Notif sur discord
	if (enabled === true){
		let slowT = new Discord.RichEmbed()
		.setTitle(`Etat slowmode ON`)
		.setColor("#15f153")
		.addField(`Le slowmode est activé !`, `L'envois des messages lentes est de ${length} seccondes !`)
		channelLog.send(slowT);
	}else{
		let slowF = new Discord.RichEmbed()
		.setTitle(`Etat slowmode OFF`)
		.setColor("#bc0000")
		.setDescription(`Le slowmode est désactivé !`)
		channelLog.send(slowF);
	}
});

//Event sile R9KBETA est activé ou désactivé 
clientTwitch.on("r9kbeta", (channel, enabled) => {
	//Notif sur discord
	if (enabled === true){
		let r9kbetaT = new Discord.RichEmbed()
		.setTitle(`Etat r9kbeta ON`)
		.setColor("#15f153")
		.setDescription(`Le r9kbeta est activé !`)
		channelLog.send(r9kbetaT);
	}else{
		let r9kbetaF = new Discord.RichEmbed()
		.setTitle(`Etat r9kbeta OFF`)
		.setColor("#bc0000")
		.setDescription(`Le r9kbeta est désactivé !`)
		channelLog.send(r9kbetaF);
	}
});

//Event si une personne offre un sub à une autre personne
clientTwitch.on("giftpaidupgrade", (channel, username, sender, userstate) => {
	//Notif sur discord
	let subgift = new Discord.RichEmbed()
	.setTitle(`Une personne viens de reçevoir un sub sur la chaîne !`)
	.setColor("#15f153")
	.addField(`Bienvenue à ${username} ! Merci du sub offert par :`, `${sender}`)
	channelLogSub.send(subgift);

	//Message sur le tchat de twitch
	clientTwitch.action(channel1, `${username} à reçus subscription par ${sender}!`)
});

//Event si le mode emoteonly est activé ou désactivé
clientTwitch.on("emoteonly", (channel, enabled) => {
	//Notif discord
	if (enabled === true){
		let emoteonlyT = new Discord.RichEmbed()
		.setTitle(`Etat emoteonly ON`)
		.setColor("#15f153")
		.setDescription(`Le emoteonly est activé !`)
		channelLog.send(emoteonlyT);
	}else{
		let emoteonlyF = new Discord.RichEmbed()
		.setTitle(`Etat emoteonly OFF`)
		.setColor("#bc0000")
		.setDescription(`Le emoteonly est désactivé !`)
		channelLog.send(emoteonlyF);
	}
});

//Event si un modérateur à nettoyer le tchat 
clientTwitch.on("clearchat", (channel) => {
	//Notif sur discord
	let clearchat = new Discord.RichEmbed()
	.setTitle(`Nettoyage du tchat`)
	.setColor("#15f153")
	.setDescription(`Un modérateurs viens de nettoyer le tchat !`)
	channelLog.send(clearchat);
});

//Event si le follower mode est activé ou désactivé :)
clientTwitch.on("followersonly", (channel, enabled, length) => {
	//Notif sur discord
	if (enabled === true){
		switch (length) {
			case 0: //Temps de folow de 0 minute
				let followersonlyT0 = new Discord.RichEmbed()
				.setTitle(`Etat followersonly ON`)
				.setColor("#15f153")
				.addField(`Le followersonly est activé !`, `Le tchat est réservé pour les followers !`)
				channelLog.send(followersonlyT0);
			break;

			case 10: //Temps de folow de 10 minutes.
				let followersonlyT10 = new Discord.RichEmbed()
				.setTitle(`Etat followersonly ON`)
				.setColor("#15f153")
				.addField(`Le followersonly est activé !`, `Le tchat est réservé pour les followers depuis 10 minutes !`)
				channelLog.send(followersonlyT10);
			break;

			case 30: //Temps de folow de 30 minutes
				let followersonlyT30 = new Discord.RichEmbed()
				.setTitle(`Etat followersonly ON`)
				.setColor("#15f153")
				.addField(`Le followersonly est activé !`, `Le tchat est réservé pour les followers depuis 30 minutes !`)
				channelLog.send(followersonlyT30);
			break;

			case 60: //Temps de folow de 1 heure
				let followersonlyT60 = new Discord.RichEmbed()
				.setTitle(`Etat followersonly ON`)
				.setColor("#15f153")
				.addField(`Le followersonly est activé !`, `Le tchat est réservé pour les followers depuis 1 heure !`)
				channelLog.send(followersonlyT60);
			break;

			case 1440: //Temps de folow de 1 jour
				let followersonlyT1440 = new Discord.RichEmbed()
				.setTitle(`Etat followersonly ON`)
				.setColor("#15f153")
				.addField(`Le followersonly est activé !`, `Le tchat est réservé pour les followers depuis 1 jour !`)
				channelLog.send(followersonlyT1440);
			break;

			case 10080: //Temps de folow de 1 semaine
				let followersonlyT10080 = new Discord.RichEmbed()
				.setTitle(`Etat followersonly ON`)
				.setColor("#15f153")
				.addField(`Le followersonly est activé !`, `Le tchat est réservé pour les followers depuis 1 semaine !`)
				channelLog.send(followersonlyT10080);
			break;

			case 43200: //Temps de folow de 1 mois
				let followersonlyT43200 = new Discord.RichEmbed()
				.setTitle(`Etat followersonly ON`)
				.setColor("#15f153")
				.addField(`Le followersonly est activé !`, `Le tchat est réservé pour les followers depuis 1 mois !`)
				channelLog.send(followersonlyT43200);
			break;

			case 129600: //Temps de folow de 3 mois
				let followersonlyT129600 = new Discord.RichEmbed()
				.setTitle(`Etat followersonly ON`)
				.setColor("#15f153")
				.addField(`Le followersonly est activé !`, `Le tchat est réservé pour les followers depuis 3 mois !`)
				channelLog.send(followersonlyT129600);
			break;

			default: //Si c'est un autre temps par défault on l'affiche en minutes
				if (length === 1){
					let followersonlyTI1 = new Discord.RichEmbed()
					.setTitle(`Etat followersonly ON`)
					.setColor("#15f153")
					.addField(`Le followersonly est activé !`, `Le tchat est réservé pour les followers depuis ${length} minuste !`)
					channelLog.send(followersonlyTI1);  
				}else{
					let followersonlyTI = new Discord.RichEmbed()
					.setTitle(`Etat followersonly ON`)
					.setColor("#15f153")
					.addField(`Le followersonly est activé !`, `Le tchat est réservé pour les followers depuis ${length} minustes !`)
					channelLog.send(followersonlyTI); 
				}
		  }

	}else{
		let followersonlyF = new Discord.RichEmbed()
		.setTitle(`Etat followersonly OFF`)
		.setColor("#bc0000")
		.setDescription(`Le followersonly est désactivé !`)
		channelLog.send(followersonlyF);
	}

});

//Fin des events Twitch
