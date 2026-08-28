/*********************************************************************************
 * 
 * Ce fichier contient toutes les fonctions nécessaires au fonctionnement du jeu. 
 * 
 *********************************************************************************/

/**
 * Cette fonction affiche dans la console le score de l'utilisateur
 * @param {number} score : le score de l'utilisateur
 * @param {number} nbMotsProposes : le nombre de mots proposés à l'utilisateur
 */
function afficherResultat(score, nbMotsProposes) {
    // Récupération de la zone dans laquelle on va écrire le score
    let spanScore = document.querySelector(".zoneScore span")
    // Ecriture du texte
    let affichageScore = `${score} / ${nbMotsProposes}` 
    // On place le texte à l'intérieur du span. 
    spanScore.innerText = affichageScore
}

/**
 * Cette fonction affiche une proposition, que le joueur devra recopier, 
 * dans la zone "zoneProposition"
 * @param {string} proposition : la proposition à afficher
 */
function afficherProposition(proposition,id) {
    let zoneProposition = document.getElementById(id)
    zoneProposition.innerText = proposition
}

/**
 * Cette fonction construit et affiche l'email. 
 * @param {string} nom : le nom du joueur
 * @param {string} email : l'email de la personne avec qui il veut partager son score
 * @param {string} score : le score. 
 */
function afficherEmail(nom, email, score) {
    let mailto = `mailto:${email}?subject=Partage du score Azertype&body=Salut, je suis ${nom} et je viens de réaliser le score ${score} sur le site d'Azertype !`
    location.href = mailto
}


// Verifie que le nom depasse 2 lettres
function verifierNom(balise){
    let nomRegExp=new RegExp("\\w{2}")
    if(nomRegExp.test(balise.value)===false){
        balise.classList.add("erreur")
        throw new Error("Le nom est trop court")
    }
    else{
        balise.classList.remove("erreur")
    }
}

//Verifie que l'email est dans le bon format: exemple@exemple.exemple
function verifierEmail(balise){
    let emailRegExp=new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+")
    if(emailRegExp.test(balise.value)===false){
        balise.classList.add("erreur")
        throw new Error("L e-mail n est pas valide")
    }
    else{
        balise.classList.remove("erreur")
    }
}

//permet de valider ou non le formulaire et d'afficher un message
function gererFormulaire(scoreEmail){
        try{
           
            let baliseNom=document.getElementById("nom")
            nom=baliseNom.value
            verifierNom(baliseNom)
            let baliseEmail=document.getElementById("email")
            email=baliseEmail.value
            verifierEmail(baliseEmail)
            afficherEmail(nom,email,scoreEmail)    
            afficherMessageErreur("")   
        }
        catch(erreur){
            console.log("erreur")
            afficherMessageErreur(erreur.message)
        }

}

function afficherMessageErreur(message){
    popup=document.querySelector(".popup")
    let messageErreur=document.getElementById("erreurMessage")
    if(!messageErreur){
        messageErreur=document.createElement("span")
        messageErreur.id="erreurMessage"
        popup.append(messageErreur)
    }
    messageErreur.innerText=message
}



/**
 * Cette fonction lance le jeu. 
 * Elle demande à l'utilisateur de choisir entre "mots" et "phrases" et lance la boucle de jeu correspondante
 */
function lancerJeu() {
    // Initialisations
    initAddEventListenerPopup()
    let score = 0
    let i = 0
    let listeProposition = listeMots
    afficherProposition("valider","btnValiderMot")
    afficherProposition("Choisissez votre option et tapez la proposition qui s'affiche dans le champ en-dessous.","zoneOptionsp")

    let btnValiderMot = document.getElementById("btnValiderMot")
    let inputEcriture = document.getElementById("inputEcriture")

    let pas=3 //pour la subdivision en sous parties

    afficherProposition(listeProposition[i],"zoneProposition")

    //Verifier la reponse et adapte les messages
function verifierReponse(){
    if (inputEcriture.value === listeProposition[i]) {
            score++
        }
        i++
        afficherResultat(score, i)
        inputEcriture.value = ''
        if(i===listeProposition.length){
            afficherProposition("Recommencer","btnValiderMot")
            afficherProposition("Le jeu est fini","zoneProposition")
            afficherProposition(`Fin du jeu. Tapez Recommencer pour jouer à nouveau.`,"zoneOptionsp")
            i=-1
        }
        else{
            afficherProposition(listeProposition[i],"zoneProposition")
            if(i%pas===0){
                afficherProposition("Continuer","btnValiderMot")
                afficherProposition(`Fin de la partie ${i/pas}. Tapez continuer pour poursuivre.`,"zoneOptionsp")
            }
            else{
                afficherProposition("valider","btnValiderMot")
                afficherProposition("Choisissez votre option et tapez la proposition qui s'affiche dans le champ en-dessous.","zoneOptionsp")
            }
        }
}

    // Gestion de l'événement click sur le bouton "valider"
    btnValiderMot.addEventListener("click", verifierReponse)

    //ajout de validation par la touche entrée
    inputEcriture.addEventListener("keydown",(event)=>{
            if (event.key==="Enter"){
                verifierReponse()
            }
    })


    // Gestion de l'événement change sur les boutons radios. 
    let listeBtnRadio = document.querySelectorAll(".optionSource input")
    for (let index = 0; index < listeBtnRadio.length; index++) {
        listeBtnRadio[index].addEventListener("change", (event) => {
            // Si c'est le premier élément qui a été modifié, alors nous voulons
            // jouer avec la listeMots. 
            if (event.target.value === "1") {
                listeProposition = listeMots
            } else {
                // Sinon nous voulons jouer avec la liste des phrases
                listeProposition = listePhrases
            }
            // Et on modifie l'affichage en direct. (correction apportée)s

            if (listeProposition[i] === undefined) {
                afficherProposition("Le jeu est fini","zoneProposition")
                btnValiderMot.disabled = true
            } else {
                afficherProposition(listeProposition[i],"zoneProposition")
            }
        })
    }
    
    afficherResultat(score, i)

    initAddEventListenerPopup()

    const formPartage=document.querySelector(".formPartage")
    formPartage.addEventListener("submit",(event)=>{
        event.preventDefault()
        scoreEmail=`${score}/${i}`
        gererFormulaire(scoreEmail)
    })
    

}