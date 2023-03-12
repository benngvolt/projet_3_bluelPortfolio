// -----------------------------------
// CREATION DU FORMULAIRE DE CONNEXION
// -----------------------------------


// DOM - Partie du formulaire relative à l'EMAIL
const emailField = document.querySelector(".emailField");

// DOM - Partie du formulaire relative au MOT-DE-PASSE
const passwordField = document.querySelector(".passwordField");

// DOM - partie du formulaire relative aux BOUTONS (bouton d'envoi + oubli mot-de-passe)
const buttonForm = document.querySelector(".buttonForm");
const loginForm = document.querySelector(".loginForm");

const alertMessage = document.createElement("p");
const passwordForm = document.querySelector(".passwordForm");
passwordForm.appendChild(alertMessage);
alertMessage.setAttribute("class", "alertMessage");


//------------------------------------------------------------
// CREATION D'UN ECOUTEUR D'EVENEMENT POUR ENVOI DU FORMULAIRE
//------------------------------------------------------------


loginForm.addEventListener("submit", async function(event){

    // Empêchement du navigateur de recharger la page par défault
    event.preventDefault();

    // Réinitialisation du message d'alerte d'identifiants incorrects
    alertMessage.innerText = "";

    // Stockage des valeurs 'email' et 'password' entrées en input dans le champs de saisie, dans des variables email et password
    let email = emailField.value;
    let password = passwordField.value;

    // Requête POST avec fonction asynchrone FETCH, puis méthode THEN pour traiter les promesses
    
    fetch('http://localhost:5678/api/users/login',{
        method:"POST", 
        body: JSON.stringify({"email":email, "password":password}),
        headers: {'Content-Type':'application/json'}
    })
        .then((response) => response.json())

        // Vérification de la génération du token d'identification, en fonction de la réponse délivrée par l'API, selon la combinaison email/mot de passe entrée*/
        .then((data) => {
            if(data.token) {
                console.log("autorisé");
                // si authentification réussie, stockage du token en session storage et redirection vers la page d'accueil en mode logged In (cf script.js)*/
                window.sessionStorage.setItem("1",JSON.stringify(data.token));
                window.location.href = "index.html";
            } else {
                // si authentification échouée, message d'alerte via une boîte de dialogue
                alertMessage.innerText = "utilisateur / mot de passe incorrects";     
        }
    })
        .catch((error) => console.error(error))
})
