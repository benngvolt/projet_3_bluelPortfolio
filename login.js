// --
// ----------
// ----------------------
// ---------------------------------
// ----------------------------------------------
// CREATION DU FORMULAIRE DE CONNEXION ---------------------
// ----------------------------------------------
// ---------------------------------
// ----------------------
// ----------
// --

// ---- partie du formulaire relative à l'EMAIL ---------------------------------------------------------------------------------
const emailField = document.querySelector(".emailField");

// ---- partie du formulaire relative au MOT DE PASSE ---------------------------------------------------------------------------
const passwordField = document.querySelector(".passwordField");

// partie du formulaire relative aux BOUTONS (bouton d'envoi + oubli mot-de-passe) ----------------------------------------------
const buttonForm = document.querySelector(".buttonForm");
const loginForm = document.querySelector(".loginForm");


/* CREATION D'UN EVENEMENT D'ENVOI DU FORMULAIRE lié à l'élément 'submitButton', 
et exécution d'une requête POST via l'API pour vérification identification------
------------------------------------------------------------------------------*/

loginForm.addEventListener ("submit", async function(event){

    // empêchement du navigateur de recharger la page par défault ---------------------------------------------------------------
    event.preventDefault();

    // stockage des valeurs email et password entrées en input dans le champs de saisie, dans des variables email et password ---
    let email = emailField.value;
    let password = passwordField.value;

    // requête POST avec fonction asynchrone FETCH, puis méthode THEN pour traiter les promesses -------------------------------- 
    
    fetch('http://localhost:5678/api/users/login',{
        method:"POST", 
        body: JSON.stringify({"email":email, "password":password}),
        headers: {'Content-Type':'application/json'}
    })
        .then((response) => response.json())

        // --- Vérification de la génération du token d'identification, en fonction de la réponse délivrée par l'API, selon la combinaison email/mot de passe entrée*/
        .then((data) => {
            if(data.token) {
                console.log("autorisé");
                /*si authentification réussie, stockage du token en session storage et redirection vers la page d'accueil en mode logged In (cf script.js)*/
                window.sessionStorage.setItem(JSON.stringify(data.userId),JSON.stringify(data.token));
                window.location.href = "index.html";
            } else {
                /*si authentification échouée, message d'alerte via une boîte de dialogue*/
                (console.log("refusé"));
                //window.alert("utilisateur / mot de passe incorrects");
                const alertMessage = document.createElement("p");
                const passwordForm = document.querySelector(".passwordForm");
                passwordForm.appendChild(alertMessage);
                alertMessage.innerText = "utilisateur / mot de passe incorrects";
                alertMessage.setAttribute("class", "alertMessage");
        }
    })
        .catch((error) => console.error(error))
})
