//Import de la config
const config = require('../config/config.json')

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Module export des commandes admins qui sont appeler dans le fichier clientDisocrd.js
module.exports = {
    'aide_modo': aide_modo,
} 

//Commande aide_modo
function aide_modo (message) {

    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
   
    //Prise en compte du préfix
    if (message.length == 1){
        if (message[0].charAt(0) == config.discord.prefix) 
            message[0] = message[0].slice(1);

    }

    //Création de la réponse en cas si l'utilisateur n'a pas la permission de faire cette commande
    let aide_modoPerm = new Discord.RichEmbed()
    .setTitle("Réponse de la commande :")
    .setColor("#bc0000")
    .addField(":x: Tu n'as pas le droit de utilisé cette commande.", "👮 Bien essayer en tous cas.")
    .setFooter("( Auto-destruction du message dans 10s ! )")

    //Suppression de la commande de l'utilisateur qui la taper.
    message.delete().catch(O_o=>{});

    //On vérifie si l'utilisateur à la permission de faire la commande
    if (!message.channel.permissionsFor(message.author).hasPermission("MANAGE_MESSAGES")) {

        //Envoie de la réponse erreur si il n'a pas la permission avec une auto-destruction de 10s
        message.channel.sendMessage(aide_modoPerm).then(message => {message.delete(6000)});

        console.log("Désolé, vous n'avez pas la permission d'exécuter la commande \""+message.content+"\"");
        
        return;
    }

    //Création de la réponse si l'utilisateur à bien la permission 
    let aideembed = new Discord.RichEmbed()
    .setColor("#15f153")
    .addField(config.discord.prefix+"aide_modo", "Voir les commandes du bot, pour la modération !")
    .setFooter("( Auto-destruction du message dans 30s ! )")

    //Envois de la réponse avec une auto-destruction de la réponse dans 30s
    message.channel.send(aideembed).then(message => {message.delete(18000)});;

    //Suppression de la commande de l'utilisateur qui la taper.
    message.delete().catch(O_o=>{});
} 
