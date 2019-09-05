//Import de la config
const config = require('../config/config.json')

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Module export des commandes admins qui sont appeler dans le fichier clientDisocrd.js
module.exports = {
    'aide_modo': aide_modo,
    'kick': kick,
} 

//Commande aide_modo
function aide_modo (message) {

    //Sécurité pour pas que le bot réagi avec lui-même
    if(message.author.bot) return;

    //Permet d'éviter de répondre aux messages privés
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
    .addField(config.discord.prefix+"kick", `Kick un utilisateur // EX : ${config.discord.prefix}kick @nom_de_la_personne_a_kick raison.`)
    .setFooter("( Auto-destruction du message dans 30s ! )")

    //Envois de la réponse avec une auto-destruction de la réponse dans 30s
    message.channel.send(aideembed).then(message => {message.delete(18000)});;

    //Suppression de la commande de l'utilisateur qui la taper.
    message.delete().catch(O_o=>{});
} 

//Commande Kick
function kick (message) { // !kick @membre-a-kick raison

    //Sécurité pour pas que le bot réagi avec lui-même
    if(message.author.bot) return;

    //Permet d'éviter de répondre aux messages privés
    if(message.channel.type === "dm") return;
   
    //Prise en compte du préfix
    if (message.length == 1){
        if (message[0].charAt(0) == config.discord.prefix) 
            message[0] = message[0].slice(1);

    } 

    //Variable de vérifiction de la mention et la raison
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);

    //Création du message d'erreur si l'utilisateur n'a pas le droit de kick
    let kickPerm = new Discord.RichEmbed()
    .setTitle("Réponse de la commande :")
    .setColor("#bc0000")
    .addField(":x: Tu n'as pas le droit de kick !", "👮 Bien essayer en tous cas.")
    .setFooter("( Auto-destruction du message dans 10s ! )")
    message.delete().catch(O_o=>{});

    //Condition pour vérifier si l'utulisateur à bien le droit de kick
    if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(kickPerm).then(message => {message.delete(6000)}); 

    //Création du message d'errreur si on n'a pas mit d'argument du tag de la personne à kick
    let errMention = new Discord.RichEmbed()
    .setTitle("Réponse de la commande :")
    .setColor("#bc0000")
    .addField(":x: Merci de mentionné un pseudo !", "👮Merci de refaire la commande avec une mention de un pseudo.")
    .setFooter("( Auto-destruction du message dans 10s ! )")
    message.delete().catch(O_o=>{});

    //On passe à l'étape suivente si le tag est bien mit
    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

    //Sinon on redirige sur le message d'erreur pour le tag.
    if(!kUser) return message.channel.send(errMention).then(message => {message.delete(6000)});

    //Création du message d'erreur si vous n'avez pas préciser de message 
    let kickErrorMessage = new Discord.RichEmbed()
    .setTitle("Réponse de la commande :")
    .setColor("#bc0000")
    .addField(":x: Vous n’avez pas mis de message en expliquant le kick.", "👮Merci de refaire la commande avec un message.")
    .setFooter("( Auto-destruction du message dans 10s ! )")
    message.delete().catch(O_o=>{});
    
    //Si il contiens bien un message on laisse passer à l'étape suivante
    let kReason = message.guild.members.get([1]) || args.join(" ").slice(22);

    //Sinon on redirige vers le message d'erreur que il n'a pas de message
    if(!kReason) return message.channel.send(kickErrorMessage) || message.delete(6000).catch(O_o=>{}); 

    //Création du message  d'erreur si la personne ne peut pas se faire kick
    let kickError = new Discord.RichEmbed()
    .setTitle("Réponse de la commande :")
    .setColor("#bc0000")
    .addField(":x: Cette personne ne peut pas être kick !", "👮Merci de vérifié le profil.")
    .setFooter("( Auto-destruction du message dans 10s ! )")
    message.delete().catch(O_o=>{});

    //On vérif si la personne viser du kick n'a pas la perm kick pour le kick
    if(kUser.hasPermission("KICK_MEMBERS")) return message.channel.send(kickError).then(message => {message.delete(6000)});

    //Création d'un message d'erreur si le canal de log ne se trouve pas
    let kickCanalErro = new Discord.RichEmbed()
    .setTitle("Réponse de la commande :")
    .setColor("#bc0000")
    .addField(":x: Je ne trouve pas le canal d'envoi.", "👮Merci de contacter un Administrateur.")
    .setFooter("( Auto-destruction du message dans 10s ! )")
    message.delete().catch(O_o=>{});

    //Si le canal est trouvé on passe à l'étape suivante
    let kickChannel = message.guild.channels.get(config.discord.channelLogSanction);

    //Si il ne trouve pas le canal de log on redirige sur l'erreur
    if(!kickChannel) return message.channel.send(kickCanalErro).then(message => {message.delete(6000)});

    //Création de la réponse si la personne est kick 
    let kickValid = new Discord.RichEmbed()
    .setTitle("Réponse de la commande :")
    .setColor("#15f153")
    .addField(":white_check_mark: L'utilisateur a été kick !", "👮Ce kick a été sauvegarder.")
    .setFooter("( Auto-destruction du message dans 20s ! )")
    
    //Envois du message si la personne est kick
    message.channel.send(kickValid).then(message => {message.delete(12000)});

    //Suppression de la commande
    message.delete().catch(O_o=>{});

    //Création du message de log sur un canal
    let kickEmbed = new Discord.RichEmbed()
    .setTitle("Info du Kick :")
    .setColor("#e56b00")
    .addField("Membre kick :", `${kUser}> ID : ${kUser.id}`, true)
    .addField("Kick par :", `<@${message.author.id}> ID : ${message.author.id}`, true)
    .addField("Canal :", message.channel, true)
    .addField("Kick :", message.createdAt)
    .addField("Raison :", kReason, true);

    //Envois de la réponse log sur le canal concerné 
    kickChannel.send(kickEmbed);

    //Kick du membre plus stckage dans les log discord pour la raison
    message.guild.member(kUser).kick(kReason);
}