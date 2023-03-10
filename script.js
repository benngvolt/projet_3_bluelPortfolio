// -----------------------
// IMPORTATION DES MODULES
// -----------------------

import { generateAllWorks } from "./works.js";
import { createFilters } from "./categories.js";
import { logoutVersion, checkAuth} from "./checkAuth.js";
import { openWorkModal, openEditionMode, goBackModal, formSubmit, displaySample} from "./modal.js";


// -------------------------------------------------------------------------------------------------------------------------------------
// RECUPERATION DES TABLEAUX 'works' ET 'categories' VIA L'API avec methode FETCH en GET, puis stockage des réponses dans des constantes
// -------------------------------------------------------------------------------------------------------------------------------------


const worksResponse = fetch("http://localhost:5678/api/works");
const categoriesResponse = fetch("http://localhost:5678/api/categories");


// --------------------------------------------
// AFFICHAGE DES PROJETS + CREATION DES FILTRES
// --------------------------------------------


Promise.all([worksResponse, categoriesResponse])   

        // PARSING DE LA REPONSE (string) en OBJETS JSON
        .then((response) => {
            const worksData = response[0];
            const categoriesData = response[1];
            return Promise.all([worksData.json(), categoriesData.json()]);
        })
        
        // RECUPERATION DES TABLEAUX JSON dans des constantes 'works' et 'categories'
        .then((jsonResponse) => {
            const works = jsonResponse[0];
            const categories = jsonResponse[1];
            
            // AFFICHAGE DE TOUS LES  PROJETS (appel de la fonction generateAllWorks)
            generateAllWorks(works);
            
            // CREATION et AFFICHAGE DES FILTRES (appel de la fonction createFilters)
            createFilters(categories, works);
        })

        // CONDITION si la promesse n'est pas atteinte
        .catch(console.error);


// -------------------------------------------------------------------------------------------------------------------------------------
// MODIFICATIONS RELATIVES AUX ETATS D'AUTHENTIFICATION LOGIN / LOGOUT
// -------------------------------------------------------------------------------------------------------------------------------------


document.addEventListener("DOMContentLoaded", function() { // execution du code dans une fonction permettant d'attendre que le DOM soit chargé
    
    //Déclaration des différentes variables et constantes

    let tokenValue = sessionStorage.getItem("1"); // Récupération du token
    const loginLink = document.querySelector(".loginLink"); // DOM - Définition de l'élément 'lien vers la page logIn'
    const logoutButton = document.querySelector(".logoutButton"); // DOM - Définition de l'élément 'bouton logOut'
    const modifProfile = document.querySelector(".modifProfile"); // DOM - Définition de l'élément 'bouton "Modifier Profil"'
    const modifWork = document.querySelector(".modifWork"); // DOM - Définition de l'élément 'bouton "Modifier Projets"'
    const filters = document.querySelector(".filters"); // DOM - Définition des éléments 'boutons Filtres'
    const topBlackNav = document.querySelector(".topBlackNav"); // DOM - Définition de l'élément 'barre de navigation noire'
    const goBackButton = document.querySelector(".goBackButton"); // DOM - Définition de l'élément 'bouton retour (modale)'
    const addImgButton = document.querySelector(".addImgButton"); // DOM - Définition de l'élément 'bouton "ajouter une photo" (modale)'
    const addWorkForm = document.querySelector(".addWorkForm"); // DOM - Définition de l'élément 'bouton soumettre le formulaire d'ajout d'un projet (modale)'
    const inputFiles = document.querySelector('#inputFiles'); // DOM - Définition de l'élément 'champs d'upload image (modale)'
    const imgFieldContainer = document.querySelector('.imgFieldContainer'); // DOM - Définition de l'élément 'container pour grid d'images samples'
    
    // Exécution de la fonction chekAuth avec 'tokenValue' en paramètre, pour définir si la page doit être en mode logIn ou logOut.
    checkAuth(tokenValue);

    // Création d'un évènement sur le bouton logOut pour : effacement du token, appel fonction logout, reload page d'accueil.
    logoutButton.addEventListener("click", function() {
        window.sessionStorage.removeItem("1");
        logoutVersion(loginLink,logoutButton, modifProfile, modifWork, filters, topBlackNav);
        window.location.reload();
    })


    // --------------------------------------------------------------
    // OUVERTURE, FERMETURE ET MANIPULATION DES ELEMENTS DE LA MODALE
    // --------------------------------------------------------------
 

    // Ajout d'un écouteur d'évènement sur le bouton "Modifier Projets" pour ouvrir la modale
    modifWork.addEventListener("click", openWorkModal);
    
    // Ajout d'un écouteur d'évènement sur le bouton "ajouter une photo" pour ouverture du mode édition/ajout photo
    addImgButton.addEventListener("click", openEditionMode);

    // Ajout d'un écouteur d'évènement sur l'icône flèche 'bouton retour' pour revenir au mode "suppression travaux"
    goBackButton.addEventListener("click", goBackModal);

    // DOM - Création d'un message d'alerte initialement vide sous le formulaire d'ajout d'un projet
    const alertMessageUpload = document.createElement("p");
    const categoryForm = document.querySelector(".categoryForm"); 
    categoryForm.appendChild(alertMessageUpload);


    // -------------------------------------------------------------------------------------------------------
    // AJOUT D'UN NOUVEAU PROJET AVEC REQUETE POST et FORMDATA, AFFICHAGE D'UN sample ET ENVOI DU FORMULAIRE
    // -------------------------------------------------------------------------------------------------------


    // DOM - Création d'une balise img pour le sample à afficher, lors de l'upload de l'image à ajouter
    const imgSample = document.createElement("img"); 
    imgFieldContainer.appendChild(imgSample);
    imgSample.setAttribute("class", "imgSample");

    // Ajout d'un écouteur d'évènement sur le chargement de l'image pour afficher le sample 
    inputFiles.addEventListener('change', displaySample);
    
    // Ajout d'un écouteur d'évènement sur le bouton "valider" pour envoi le formulaire
    addWorkForm.addEventListener('submit',formSubmit);     
})