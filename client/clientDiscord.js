// Express pour gestion port de la partie discord 
const express = require("express");

//Utilisation app pour express
const app = express();

//Api discord
const Discord = require('discord.js');

//Nom du client pour discord 
const clientDiscord = new Discord.Client();

//Import de la configuration
var config = require("../config/config.json");

//Import des commandes discord
const cmds = require('../commands/cDiscord.js');

//Import des commandes admins discord
const cmdsAdmin = require('../commands/cAdminDiscord.js');

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

// function testStream() {
//     console.log("test")
// }
//Status du bot discord 
clientDiscord.on('ready', () => {
	//Génération du profils du bot sur discord.
	clientDiscord.user.setPresence({ game: { name: "En développement By Alexandre78R", type : "STREAMING", url: "https://www.twitch.tv/jaxoou"}});
    // testStream()
    // setInterval(testStream, 25000)
});

// Début des commandes Discord

//Préfix du bot 
var prefixDiscord = config.discord.prefix;

//Les commandes pour discord
clientDiscord.on('message', msg => {
    if (msg.author.bot || msg.channel.type != 'text')
        return;

    if (!msg.content.startsWith(prefixDiscord))
        return;

    let cmd = msg.content.split(/\s+/)[0].slice(prefixDiscord.length).toLowerCase();
    getCmdFunction(cmd)(msg);
});

//Gestion des fichiers pour les commandes discord.
function getCmdFunction(cmd) {
    const COMMANDS = {
        'aide_modo': cmdsAdmin.aide_modo,
        'kick': cmdsAdmin.kick,
        'aide': cmds.aide,
        'serverinfo': cmds.serverinfo,
        'avatar': cmds.avatar,
    }
    return COMMANDS[cmd] ? COMMANDS[cmd] : () => {};
}

//Export discord
module.exports = clientDiscord