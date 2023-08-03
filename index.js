require('dotenv').config();
const {
    Builder,
    By,
    Key,
    until
} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function example() {

    let options = new chrome.Options();
    options.addArguments("--disable-notifications"); // Désactiver les notifications
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        await driver.executeScript(`
            window.screen = {
                width: window.innerWidth,
                height: window.innerHeight,
                availWidth: window.innerWidth,
                availHeight: window.innerHeight
            };
            window.moveTo(0, 0);
            window.resizeTo(800, 600);
        `);


        // Connectez-vous à Facebook
        await driver.get('https://www.facebook.com/login');
        await driver.findElement(By.id('email')).sendKeys(process.env.FACEBOOK_USER);
        await driver.findElement(By.id('pass')).sendKeys(process.env.FACEBOOK_PASSWORD, Key.RETURN);

        await driver.sleep(5000);
        await driver.get('https://www.facebook.com/groups/secretbeatmaker/members');
        //await driver.get('https://www.facebook.com/groups/6361783373936922/members');
        await driver.sleep(5000);

        // Trouver toutes les listes
        let lists = await driver.findElements(By.css('div[role="list"]'));

        // Sélectionner la troisième liste (l'index 2 car l'indexation commence à 0)
        let thirdList = lists[3];
        //let thirdList = lists[2];

        let processedElements = 0;
        let keepScrolling = true;
        let message_send = 0;
        while (keepScrolling) {
            if (message_send >= 50) {
                break;
            }
            // Trouver tous les éléments dans la troisième liste
            let elements = await thirdList.findElements(By.css('a'));
            names = []
            for (let i = processedElements; i < elements.length; i++) {

                if (elements == null || elements.length == 0) {
                    let elements = await thirdList.findElements(By.css('a'));
                }
                let text = await elements[i].getText();

                // Chargez les noms à partir du fichier JSON
                const fs = require('fs');
                let data = fs.readFileSync('data.json', 'utf8');
                let dataJson = data ? JSON.parse(data) : [];

                //convertir un float en int:

                // Vérifiez si le nom existe déjà dans le tableau
                if (processedElements < dataJson.length * 2) {
                    processedElements++;


                    if (processedElements % 10 == 0) {
                        updateProgressBar(processedElements, dataJson.length * 2);
                        // Si vous avez traité 10 éléments, scroller vers le bas pour charger plus d'éléments
                        await driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
                        await driver.sleep(2000); // Attente de 2 secondes pour que les nouveaux éléments soient chargés

                        // Mettez à jour les éléments de la liste après le scroll
                        elements = await thirdList.findElements(By.css('a'));

                        // Si aucun nouvel élément n'a été chargé, arrêtez de scroller
                        if (i >= elements.length - 1) {
                            keepScrolling = false;
                            break;
                        }


                    }
                    continue;
                }

                if (dataJson.includes(text)) {
                    console.log('Message déjà envoyé à :', text, " ", processedElements, "/", dataJson.length);
                    await driver.sleep(1000);
                    continue; // Passer à la prochaine itération de la boucle
                }

                //attendre entre 3 et 5 secondes
                let number = Math.floor(Math.random() * 5) + 3;
                await driver.sleep(number * 1000);


                if (!names.includes(text) && text.trim().length > 0 && !text.includes("Travail") && text != "Ajouter comme ami(e)" && !text.includes("Membre") && !text.includes("depuis") && !text.includes("Ajouter")) {
                    console.log(text);
                    const url = await elements[i].getAttribute("href");
                    // Ouvre un nouvel onglet
                    await driver.executeScript(`window.open('${url}', '_blank');`);
                    await driver.sleep(2000);

                    // Alterner d'onglet
                    let tabs = await driver.getAllWindowHandles();
                    await driver.switchTo().window(tabs[tabs.length - 1]);

                    //ajoute le nom au fichier data.json
                    dataJson.push(text);
                    fs.writeFileSync('data.json', JSON.stringify(dataJson));

                    names.push(text);

                    await driver.sleep(10000);


                    let images = await driver.findElements(By.tagName("img"));
                    images = await Promise.all(images.map(async (img) => {
                        let height = await img.getCssValue("height");
                        return (height === "16px") ? img : null;
                    })).then((result) => result.filter(e => e !== null));
                    await images[0].click();

                    await driver.sleep(5000);


                    let final_message = process.env.MESSAGE;
                    //remplacer la premiere occurence de '!' par le prénom de la personne donc le prendre la premiere chaine et cut apres espace le getText
                    final_message = final_message.replace('!', text.split(' ')[0]);
                    await driver.switchTo().activeElement().sendKeys(final_message, Key.RETURN);
                    message_send += 1;
                    await driver.sleep(2000);


                    await driver.close();
                    await driver.switchTo().window(tabs[0]);
                }
                processedElements++;

                if (processedElements % 10 == 0) {
                    // Si vous avez traité 10 éléments, scroller vers le bas pour charger plus d'éléments
                    await driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
                    await driver.sleep(2000); // Attente de 2 secondes pour que les nouveaux éléments soient chargés

                    // Mettez à jour les éléments de la liste après le scroll
                    elements = await thirdList.findElements(By.css('a'));

                    // Si aucun nouvel élément n'a été chargé, arrêtez de scroller
                    if (i >= elements.length - 1) {
                        keepScrolling = false;
                        break;
                    }
                }
            }
        }

    } finally {

        await driver.quit();
    }
}

example();

let startTime = Date.now(); // Temps de début

function updateProgressBar(processedElements, totalElements) {
    process.stdout.write('\x1Bc'); // Effacer le terminal
    let percentage = Math.floor((processedElements / totalElements) * 100);

    if (percentage < 100) {
        let endTime = Date.now(); // Temps de fin
        let elapsedTimeInSeconds = (endTime - startTime) / 1000; // Temps écoulé en secondes

        // Estimation du temps restant en fonction du pourcentage actuel et du temps écoulé
        let estimatedTotalTimeInSeconds = (elapsedTimeInSeconds * 100) / percentage;
        let estimatedTimeRemainingInSeconds = estimatedTotalTimeInSeconds - elapsedTimeInSeconds;

        // Affichage du temps restant estimé
        process.stdout.write(`Temps restant estimé: ${formatTime(estimatedTimeRemainingInSeconds)}\n`);
    } else {
        process.stdout.write("Passing terminé, envoie des messages en cours ..\n");

    }
}

function formatTime(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let remainingSeconds = Math.floor(seconds % 60);

    return `${hours}h ${minutes}m ${remainingSeconds}s`;
}