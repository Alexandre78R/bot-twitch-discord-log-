//Import de la config
const config = require('../config/config.json')

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Module export des commandes qui sont appeler dans le fichier clientDisocrd.js
module.exports = {
    'aide': aide,
    'serverinfo' : serverinfo,
    'avatar' : avatar,
} 

//Commande aide
function aide (message) {
    
    //Sécurité pour pas que le bot réagi avec lui-même
    if(message.author.bot) return;

    //Permet d'éviter de répondre aux messages privés
    if(message.channel.type === "dm") return;
   
    //Prise en compte du prefix
    if (message.length == 1){
        if (message[0].charAt(0) == config.discord.prefix) 
            message[0] = message[0].slice(1);

    }

    //Création de la réponse
    let aideembed = new Discord.RichEmbed()
    .setColor("#15f153")
    .addField(config.discord.prefix+"aide", "Voir les commandes du bot.")
    .addField(config.discord.prefix+"serverinfo", "Indique les informations du serveur.")
    .addField(config.discord.prefix+"avatar", "Permettre de voir votre photo de profil et avoir le lien.")
    
    //Envois de la réponse
    message.channel.send(aideembed);
} 

//Commande serverinfo
function serverinfo (message) {

    //Sécurité pour pas que le bot réagi avec lui-même
    if(message.author.bot) return;

    //Permet d'éviter de répondre aux messages privés
    if(message.channel.type === "dm") return;

    //Prise en compte du prefix
    if (message.length == 1){
        if (message[0].charAt(0) == config.discord.prefix) 
        message[0] = message[0].slice(1);
    }

    //Annalyse du nombre de bot qui est sur le serveur discord
    function bot(guild) {
        //Stockage du nombre de bot
        let botCount = 0;
        //Annalyse de tous les membres
        guild.members.forEach(member => { 
            //Quand il trouve un bot on rajoute +1 dans le stockage
            if(member.user.bot) botCount++; 
        });
        //On retourne le nombre de bot
        return botCount;
    }

    //Annalyse du nombre de membre qui est sur le serveur discord
    function membre(guild) {
        //Stockage du nombre de membre
        let memberCount = 0;
        //Annalyse de tous les membres
        guild.members.forEach(member => {
            //Quand il trouve un membre on rajoute +1 dans le stockage
            if(!member.user.bot) memberCount++; 
        });
        //On retourne le nombre de membre 
        return memberCount;
    }

    //Création de la réponse
    let embed = new Discord.RichEmbed()
    .setAuthor(`${message.guild.name} - Informations`, message.guild.iconURL)
    .setColor('#15f153') 
    .addField('Propriétaire du serveur', message.guild.owner, true)
    .addField('Localisation du serveur', message.guild.region, true) 
    .addField('Nombre de canaux sur le serveur', message.guild.channels.size, true) 
    .addField('Nombre de personne sur le serveur', message.guild.memberCount) 
    .addField('Nombre de membre sur le serveur', membre(message.guild), true)
    .addField('Nombre de bot sur le serveur', bot(message.guild), true)
    .setFooter('Serveur Discord créer le :')
    .setTimestamp(`${message.guild.createdAt}`)

    //Envoie de la réponse
    message.channel.send(embed);
}

//Commande avatar
function avatar (message) {

    //Sécurité pour pas que le bot réagi avec lui-même
    if(message.author.bot) return;

    //Permet d'éviter de répondre aux messages privés
    if(message.channel.type === "dm") return;

    //Prise en compte du préfix
    if (message.length == 1) {
        if (message[0].charAt(0) == config.discord.prefix)
            message[0] = message[0].slice(1);
    }

    //Création de la réponse
    let avatarEmbed = new Discord.RichEmbed()
    .setTitle(`Ton image de profil.`)
    .setColor("#15f153")
    .setImage(`${message.author.avatarURL}`)
    .setURL(`${message.author.avatarURL}`)
    .setDescription(`[Lien direct vers l'image](${message.author.avatarURL})`)
    .setAuthor(`Par ${message.author.username} - Informations`, message.author.avatarURL);

    //Envoie de la réponse
    message.channel.send(avatarEmbed);
}