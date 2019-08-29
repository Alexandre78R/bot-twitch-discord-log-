const config = require('../config/config.json')
const Discord = require("discord.js");

module.exports = {
    'aide_modo': aide_modo,
} 

function aide_modo (message) {

    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
   
    if (message.length == 1){
        if (message[0].charAt(0) == config.discord.prefix) 
            message[0] = message[0].slice(1);

    }

    let aide_modoPerm = new Discord.RichEmbed()
    .setTitle("Réponse de la commande :")
    .setColor("#bc0000")
    .addField(":x: Tu n'as pas le droit de utilisé cette commande.", "👮 Bien essayer en tous cas.")
    .setFooter("( Auto-destruction du message dans 10s ! )")
    message.delete().catch(O_o=>{});

    if (!message.channel.permissionsFor(message.author).hasPermission("MANAGE_MESSAGES")) {
        message.channel.sendMessage(aide_modoPerm).then(message => {message.delete(6000)});
        console.log("Désolé, vous n'avez pas la permission d'exécuter la commande \""+message.content+"\"");
        return;
    }

    let aideembed = new Discord.RichEmbed()
    .setColor("#15f153")
    .addField(config.discord.prefix+"aide_modo", "Voir les commandes du bot, pour la modération !")
    .setFooter("( Auto-destruction du message dans 30s ! )")
    message.channel.send(aideembed).then(message => {message.delete(18000)});;
    message.delete().catch(O_o=>{});
} 
