Bot qui sert à envoyer un message automatiquement dans un groupe privé messenger

ajouter un fichier .env avec:

FACEBOOK_USER=Adresse mail du compteur émetteur
FACEBOOK_PASSWORD=Mot de passe facebook du compte émetteur
MESSAGE=Message à envoyer

effectué avec selenium, code à modifier en fonction de ses besoins
le script parse tous les utilisateurs du groupe en scrollant automatiquement et envoie le message à tous les utilisateurs
actuellement, j'ai remarqué que facebook limite ses utilisateurs à environ 70 messages maximum par jour

le script info.js renvoie la taille du tableau dans le fichier data.json, soit le nombre de personnes à qui on a envoyé un message
le script index.js est le script d'envoie de messages
