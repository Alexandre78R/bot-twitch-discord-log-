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

// Début des commandes Discord
var prefixDiscord = config.discord.prefix;

//Commande test pour discord
clientDiscord.on('message', msg => {
    if (msg.author.bot || msg.channel.type != 'text')
        return;

    if (!msg.content.startsWith(prefixDiscord))
        return;

    let cmd = msg.content.split(/\s+/)[0].slice(prefixDiscord.length).toLowerCase();
    getCmdFunction(cmd)(msg);
  });

function getCmdFunction(cmd) {
    const COMMANDS = {
        'test': cmds.test,
    }
    return COMMANDS[cmd] ? COMMANDS[cmd] : () => {};
}

//Export discord
module.exports = clientDiscord