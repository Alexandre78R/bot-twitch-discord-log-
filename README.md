# Présentation 

C'est un bot twitch qui est relier avec un bot discord !

Le rôle du bot c'est stocker les logs de twitch (exemple : to, suppression message, mode sub only, mode follow-only etc..)  sur des salons différent sur discord.

Des commandes sur discord sont disponible en temps que membre ou bien l'équipe du discord.
> **Note:** Le bot est en cours de développement !

## Installation
Pour faire fonctionner les deux bots faudra utilisé NodeJs avec plusieurs modules différents avec la commande `npm install`.

Liste des modules installer dedans  :
- Libs discord ( `npm install discord.js --save` )
- Libs Twitch (  `npm install tmi.js --save` )
- Express pour le port du bot discord ( `npm install express --save` )

## Configuration

La configuration est très simple à faire, sa seras juste à modifier les informations dans le fichier `./config/config.json` tous est expliquer de dans  !

## Démarrage du bot 

Vous devrez utilisé la commande `node index`!


## Liste  des commandes 

Les commandes pour les membres de l'équipe sur  le discord :

- `(prefix)aide_modo` Voir les commandes du bot, pour la modération !
- `(prefix)kick` Kick un utilisateur // EX : (prefix)kick @nom_de_la_personne_a_kick raison.

Les commandes pour les membres sur le discord :

- `(prefix)aide` Voir les commandes du bot.
- `(prefix)serverinfo` Indique les informations du serveur.
- `(prefix)avatar` Pour voir votre image de profil.

