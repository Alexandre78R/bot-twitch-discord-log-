const config = require('../config/config.json')
const Discord = require("discord.js");

module.exports = {
    'aide': aide,
    'serverinfo' : serverinfo,
    'avatar' : avatar,
} 

function aide (message) {

    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
   
    if (message.length == 1){
        if (message[0].charAt(0) == config.discord.prefix) 
            message[0] = message[0].slice(1);

    }

    let aideembed = new Discord.RichEmbed()
    .setColor("#15f153")
    .addField(config.discord.prefix+"aide", "Voir les commandes du bot.")
    .addField(config.discord.prefix+"serverinfo", "Indique les informations du serveur.")
    .addField(config.discord.prefix+"avatar", "Permettre de voir votre photo de profil et avoir le lien.")
    message.channel.send(aideembed);
} 

function serverinfo (message) {

    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    if (message.length == 1){
        if (message[0].charAt(0) == config.prefix) 
        message[0] = message[0].slice(1);
    }

    function bot(guild) {
        let botCount = 0;
        guild.members.forEach(member => { 
            if(member.user.bot) botCount++; 
        });
        return botCount;
    }

    function membre(guild) {
        let memberCount = 0;
        guild.members.forEach(member => {
            if(!member.user.bot) memberCount++; 
        });
        return memberCount;
    }

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

    message.channel.send(embed);
}
   
function avatar (msg) {

    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    if (msg.length == 1) {
        if (msg[0].charAt(0) == config.prefix)
            msg[0] = msg[0].slice(1);
    }

    let avatarEmbed = new Discord.RichEmbed()
    .setTitle(`Ton image de profil.`)
    .setColor("#15f153")
    .setImage(`${msg.author.avatarURL}`)
    .setURL(`${msg.author.avatarURL}`)
    .setDescription(`[Lien direct vers l'image](${msg.author.avatarURL})`)
    .setAuthor(`Par ${msg.author.username} - Informations`, msg.author.avatarURL);

    msg.channel.send(avatarEmbed);
}