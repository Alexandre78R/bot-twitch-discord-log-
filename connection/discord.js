//Api discord
const Discord = require('discord.js');

//Nom du client pour discord 
const clientDiscord = new Discord.Client();

// Express pour gestion port de la partie discord 
const express = require("express");

//Utilisation app pour express
const app = express();

//Import de la configuration
var config = require("../config/config.json");

// Valeur null pour le canal de log sur discord
var ChannelLog = null;

//Génération du port random
app.set('port', (process.env.PORT || Math.floor(Math.random() * Math.floor(5000))))

app.listen(app.get('port'), function(){
    console.log(`[Discord] : Le bot fonctionne sur le port : ${app.get('port')} `);
})

//En cas d'erreur pour le bot discord
clientDiscord.on('warn', console.warn);
clientDiscord.on('error', console.error);
clientDiscord.on('disconnect', () => console.log('Je viens de me déconnecter, en m\'assurant que vous savez, je vais me reconnecter maintenant'));
clientDiscord.on('reconnecting', () => console.log('Je reconnecte maintenant !'));


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
		console.log("Attention vous n'avez pas définie le channel log ou il est introuvable !")
	}else{
		console.log(`[Discord] : Mise en place du channel log sur ${ChannelLog.name}`)
		console.log(`[Discord] : Connecté en tant que ${clientDiscord.user.tag}`)
	}
});