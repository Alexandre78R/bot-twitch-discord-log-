const config = require('../config/config.json')
const Discord = require("discord.js");

module.exports = {
    'test': test,
} 

function test (message) {

    if(message.author.bot) return;
     if(message.channel.type === "dm") return;
   
     let messageArray = message.content.split(" ");
     let cmd = messageArray[0];
     let args = messageArray.slice(1);
   
          if (message.length == 1){
              if (message[0].charAt(0) == config.discord.prefix) 
                  message[0] = message[0].slice(1);
   
         }
        console.log("test commande")
        let test = new Discord.RichEmbed()
        .setColor("#15f153")
        .addField("test", "test")
        message.channel.send(test);
} 
   
