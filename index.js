//Appelle du client Twitch
const clientTwitch = require('./client/clientTwitch.js')

//Appelle du client Discord
const clientDiscord = require('./client/clientDiscord.js')

//Import de la configuration
var config = require("./config/config.json");

//Connexion bot Twitch
clientTwitch.connect()

//Connexion bot Discord
clientDiscord.login(config.discord.token)