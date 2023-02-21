
/*CREATION DU FORMULAIRE DE CONNEXION----------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------*/

/* DEFINITION DES ELEMENTS du formulaires ainsi que leurs ELEMENTS PARENTS en communiquant avec le DOM*/

/* partie du formulaire relative à l'EMAIL */
const emailForm = document.querySelector(".emailForm");

const emailField = document.querySelector(".emailField");
emailForm.appendChild(emailField);

/* partie du formulaire relative au MOT DE PASSE */
const passwordForm = document.querySelector(".passwordForm");

const passwordField = document.querySelector(".passwordField");
passwordForm.appendChild(passwordField);

/* partie du formulaire relative aux BOUTONS (bouton d'envoi + oubli mot-de-passe) */
const buttonForm = document.querySelector(".buttonForm");

const submitButton = document.querySelector(".submitButton");
buttonForm.appendChild(submitButton);

/* CREATION D'UN EVENEMENT D'ENVOI DU FORMULAIRE lié à l'élément 'submitButton', 
et exécution d'une requête POST via l'API pour vérification identification------
------------------------------------------------------------------------------*/

submitButton.addEventListener ("click", async function(event){
    /* empêchement du navigateur de recharger la page par défault */
    event.preventDefault();
    /* stockage des valeurs email et password entrées en input dans le champs de saisie, dans des variables email et password*/
    let email = emailField.value;
    let password = passwordField.value;
    /* requête POST avec fonction asynchrone FETCH, puis méthode THEN pour traiter les promesses */
    
    fetch('http://localhost:5678/api/users/login',{
        method:"POST", 
        body: JSON.stringify({"email":email, "password":password}),
        headers: {'Content-Type':'application/json'}
    })
        .then((response) => response.json())
        /* vérification de la génération du token d'identification, en fonction de la réponse délivrée par l'API, selon la combinaison email/mot de passe entrée*/
        .then((data) => {
            if(data.token) {
                console.log("autorisé");
                /*si authentification réussie, stockage du token en local storage et redirection vers la page d'accueil en mode logged In (cf script.js)*/
                window.localStorage.setItem(JSON.stringify(data.userId),JSON.stringify(data.token));
                window.location.href = "index.html";
            } else {
                /*si authentification échouée, message d'alerte via une boîte de dialogue*/
                (console.log("refusé"));
                window.alert("utilisateur / mot de passe incorrects");
        } 
    })
        .catch((error) => console.error(error))
})
