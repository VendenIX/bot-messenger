const fs = require('fs');

function lireFichierJson(nomFichier) {
    const contenuFichier = fs.readFileSync(nomFichier, 'utf8');
    return JSON.parse(contenuFichier);
}

function main() {
    const nomFichier = 'data.json';

    try {
        // Lecture du fichier JSON
        const data = lireFichierJson(nomFichier);

        // Vérification que le contenu est bien une liste
        if (Array.isArray(data)) {
            // Calcul et affichage du nombre d'éléments dans la liste
            const nombreElements = data.length;
            console.log('Le nombre d\'éléments dans la liste est :', nombreElements);
        } else {
            console.log('Le contenu du fichier n\'est pas un tableau.');
        }
    } catch (erreur) {
        console.error('Une erreur est survenue lors de la lecture du fichier :', erreur.message);
    }
}

main();