// ---- IMPORT DES MODULES ----

import { generateAllWorks, generateSingleWork } from "./works.js";
import { createFilters } from "./categories.js";

// ---- RECUPERATION DES TABLEAUX 'works' ET 'categories' VIA L'API avec methode FETCH en GET, puis stockage des réponses dans des constantes --------

const worksResponse = fetch("http://localhost:5678/api/works");
const categoriesResponse = fetch("http://localhost:5678/api/categories");



// ----------
// ----------------------
// ---------------------------------
// ----------------------------------------------
// AFFICHAGE DES PROJETS + CREATION DES FILTRES à partir promesse asynchrone--------------------------------------------------------------------------



Promise.all([worksResponse, categoriesResponse])   

        // PARSING DE LA REPONSE (string) en OBJETS JSON ---------------------------------------------------------------------------------------------
        .then((response) => {
            const worksData = response[0];
            const categoriesData = response[1];
            return Promise.all([worksData.json(), categoriesData.json()]);
        })
        
        // ---- RECUPERATION DES TABLEAUX JSON dans des constantes 'works' et 'categories'------------------------------------------------------------
        .then((jsonResponse) => {
            const works = jsonResponse[0];
            const categories = jsonResponse[1];
            
            // ---- AFFICHAGE DE TOUS LES  PROJETS ---------------------------------------------------------------------------------------------------
            generateAllWorks (works);
            
            // ---- CREATION DES FILTRES -------------------------------------------------------------------------------------------------------------
            createFilters (categories, works);
        })

        // CONDITION si la promesse n'est pas atteinte -----------------------------------------------------------------------------------------------
        .catch(console.error);



// ----------
// ----------------------
// ---------------------------------
// ----------------------------------------------
// MODIFICATIONS RELATIVES AUX ETATS D'AUTHENTIFICATION LOGIN / LOGOUT de la page d'accueil-----------------------------------------------------------



// RECUPERATION DU TOKEN d'identification présent dans le stockage local (dans le cas d'authentification réussie) dans une variable 'tokenValue'------         
let tokenValue = sessionStorage.getItem("1");

// CREATION DE DEUX FONCTIONS, l'une pour définir le mode logged IN de la page...---------------------------------------------------------------------
function loginVersion(loginLink,logoutButton, modifProfile, modifWork, filters, topBlackNav){
    loginLink.style.display = "none";
    logoutButton.style.display = "block";
    modifProfile.style.display = "block";
    modifWork.style.display = "block";
    filters.style.display = "none";
    topBlackNav.style.display = "flex"
}

// L'autre pour le mode logged OUT -------------------------------------------------------------------------------------------------------------------
function logoutVersion(loginLink,logoutButton, modifProfile, modifWork, filters,topBlackNav){
    loginLink.style.display = "block";
    logoutButton.style.display = "none";
    modifProfile.style.display = "none";
    modifWork.style.display = "none";
    filters.style.display = "flex";
    topBlackNav.style.display = "none"
}

// VERIFICATION DE L'ETAT AUTHENTIFICATION et APPLICATION DES MODIFS A EFFECTUER SUR L'AFFICHAGE DE LA PAGE D'INDEX, EN FONCTION----------------------

document.addEventListener("DOMContentLoaded", function() { // execution du code dans une fonction permettant d'attendre que le DOM soit chargé--------
    
    // ---- DEFINITION DES ELEMENTS de boutons logIn et logOut, boutons de modifications d'image de profil et des travaux, et liste de filtre --------
    const loginLink = document.querySelector (".loginLink");
    const logoutButton = document.querySelector (".logoutButton");
    const modifProfile = document.querySelector (".modifProfile");
    const modifWork = document.querySelector (".modifWork");
    const filters = document.querySelector (".filters");
    const topBlackNav = document.querySelector (".topBlackNav");

    // ---- CREATION D'UN EVENEMENT sur le bouton logout puis exécution des modifications: effacement du token et appel fonction logOut --------------
    logoutButton.addEventListener("click", function() {
        window.sessionStorage.removeItem("1");
        logoutVersion(loginLink,logoutButton, modifProfile, modifWork, filters, topBlackNav);
        window.location.reload();
    })
    
    // ---- CREATION DE LA FONCTION CHECKAUTH, permettant de vérifier si l'authentification est réussie ou non,  
    function checkAuth (tokenValue) {
        // APPLICATION des modifications du mode logIN ou logOUT avec une condition if/else
        if (tokenValue) {
            loginVersion(loginLink, logoutButton, modifProfile, modifWork, filters, topBlackNav);
        } else {
            logoutVersion(loginLink, logoutButton, modifProfile, modifWork, filters, topBlackNav);
        }
    }

    // ---- EXECUTION DE LA FONCTION CHECKAUTH avec 'tokenValue' en paramètre -----------------------------------------------------------------------
    checkAuth (tokenValue);



    // ----------
    // ----------------------
    // ---------------------------------
    // ----------------------------------------------
    // OUVERTURE, FERMETURE ET MANIPULATION DE LA MODALE -------------------------------------------------------------------------------------------



    // Déclaration des éléments de la modale via le DOM --------------------------------------------------------------------------------------------
    const modalWork = document.getElementById ("modalWork");
    const closeButton = document.querySelector (".closeButton");
    const goBackButton = document.querySelector (".goBackButton");
    const modalGallery = document.querySelector (".modalGallery");
    const modalAdd = document.querySelector (".modalAdd");

    // Création de la fonction d'ouverture de la modale --------------------------------------------------------------------------------------------
    const openWorkModal = function (event) {
        event.preventDefault();
        modalWork.style.display = 'flex';
        modalAdd.style.display = 'none';
        closeButton.addEventListener("click", closeWorkModal);
        alertMessageUpload.innerText = "";
    }
    
    // Création de la fonction de fermeture de la modale -------------------------------------------------------------------------------------------
    const closeWorkModal = function (event) {
        goBackModal(event);
        modalWork.style.display = 'none';
        alertMessageUpload.innerText = "";
        document.getElementById("inputFiles").value=""; // Puis ré-initialisation du champs d'upload de l'image
    }

    // Ajout écouteur d'évènement sur bouton "modifier" pour ouverture de la modale ----------------------------------------------------------------
    modifWork.addEventListener("click", openWorkModal);

    // Passage en mode EDITION / AJOUT PHOTO -------------------------------------------------------------------------------------------------------
    const addPicButton = document.querySelector (".addPicButton");
    const openEditionMode = function (event) {
        event.preventDefault();
        modalGallery.style.display = 'none';
        modalAdd.style.display = null;
        goBackButton.style.display = 'block';
        alertMessageUpload.innerText = "";
    }
    // Ajout écouteur d'évènement sur bouton "ajouter" pour ouverture mode édition/ajout photo
    addPicButton.addEventListener("click", openEditionMode);

    // Retour en arrière vers le mode SUPPRESSION TRAVAUX -------------------------------------------------------------------------------------------
    const goBackModal = function (event) {
        event.preventDefault();
        modalGallery.style.display = 'flex';
        modalAdd.style.display = 'none';
        alertMessageUpload.innerText = "";
        reinitAddModal(); //ré-initialiser la modale d'ajouts
        document.getElementById("inputFiles").value=""; // Puis ré-initialisation du champs d'upload de l'image
    }
    // Ajout écouteur d'évènement sur icône flèche pour revenir au mode "suppression travaux"
    goBackButton.addEventListener("click", goBackModal);

    // Création d'un message d'alerte initialement vide ---------------------------------------------------------------------------------------------
    const alertMessageUpload = document.createElement("p");
    const categoryForm = document.querySelector(".categoryForm");
    categoryForm.appendChild(alertMessageUpload);



    // ----------
    // ----------------------
    // ---------------------------------
    // ----------------------------------------------
    // AJOUT D'UN NOUVEAU PROJET AVEC REQUETE POST et FORMDATA -------------------------------------------------------------------------------------------



    // Définition d'une variable pour le formulaire d'ajout ----------------------------------------------------------------------------------------------
    const addWorkForm = document.querySelector(".addWorkForm");

    // Création des éléments du DOM pour afficher le template image --------------------------------------------------------------------------------------
    const inputFiles = document.querySelector('#inputFiles');
    const inputTitle = document.querySelector('#title');
    const inputCategory = document.querySelector('#category');
    const picFieldContainer = document.querySelector('.picFieldContainer');

    const picText = document.querySelector('.picText');
    const picIcon = document.querySelector('.picIcon');
    const picInputButton = document.querySelector('.picInputButton');

    const imgTemplate = document.createElement("img");
    picFieldContainer.appendChild(imgTemplate);
    imgTemplate.setAttribute("class", "imgTemplate");


    // AFFICHAGE DU TEMPLATE IMAGE -----------------------------------------------------------------------------------------------------------------------
    

    // Création d'une fonction pour l'affichage du template image lors du chargement de l'image
    function displayTemplate(){

        // dissimulation du formulaire d'ajout d'image
        picIcon.style.display="none";
        picText.style.display="none";
        picInputButton.style.display="none";

        // création et définition des attributs du template pour affichage 
        const file = inputFiles.files[0]; // récupération du fichier image dans le formulaire
        const reader = new FileReader(); 
        reader.readAsDataURL(file); // lecture du fichier image récupéré comme adresse url
        reader.onload = function() { // création des attributs de l'image (src, alt, class)
            imgTemplate.setAttribute("src", reader.result);
            imgTemplate.setAttribute("alt", "");
            imgTemplate.setAttribute("class", "imgTemplate");
        }

        // affichage du template image
        imgTemplate.style.display="block";
    };

    // Ajout d'un écouteur d'évènement sur le chargement de l'image pour affichage du template 
    inputFiles.addEventListener('change', displayTemplate);


    // ENVOI DU FORMULAIRE -------------------------------------------------------------------------------------------------------------
    
    // Création d'une fonction asynchrone pour envoi du formulaire, via fetch en POST 
    async function formSubmit(event) {
        event.preventDefault();
        const workFormData = new FormData();
        workFormData.append('image', inputFiles.files[0]);
        workFormData.append('title', inputTitle.value);
        workFormData.append('category', inputCategory.value);

        alertMessageUpload.innerText = "";

        // ENVOI formData au backend pour le traitement, à condition que tous les champs soient remplis
        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                "Authorization": 'Bearer ' + tokenValue.replace(/"/g, '')
            },
            body: workFormData
        })
            .then(response => response.json())
            .then(data => {
                
                if(data.id){
        
                    // Récupération de la réponse pour publication dynamique du projet uploadé, via la fonction generateSingleWork
                    console.log(data);
                    let figureId = `figure${data.id}`;
                    let templateId = `template${data.id}`;
                    let imgSrc = data.imageUrl;
                    let imgTitle = inputTitle.value;
                    let workId = data.id;

                    generateSingleWork(figureId, templateId, imgSrc, imgTitle, workId);

                    // Puis retour à la modale précédente de grille et suppression des projets
                    event.preventDefault();
                    modalGallery.style.display = 'flex';
                    modalAdd.style.display = 'none';

                    // Puis ré-initialisation de la modale d'ajouts(fonction créée plus bas)
                    reinitAddModal();

                    // Puis ré-initialisation du champs d'upload de l'image
                    document.getElementById("inputFiles").value="";
                    
                } else {

                    // Affichage d'un message d'erreur, si tous les champs ne sont pas complétés 
                    alertMessageUpload.innerText = "tous les champs doivent être complétés!";
                    alertMessageUpload.setAttribute("class", "alertMessage");
                    // Puis ré-initialisation de la modale d'ajouts (fonction créée plus bas)
                    reinitAddModal();
                }
            })

            .catch(error => {
                (console.error);
            });
    } 

    // Création d'une fonction pour la réinitialisation de la modale d'ajout, lorsque le formulaire est envoyé
    function reinitAddModal() {
        picIcon.style.display= "block";
        picText.style.display= "block";
        picInputButton.style.display= "block";
        imgTemplate.src ="";
        inputTitle.value="";
    }
    
    // Ajout d'un écouteur d'évènement sur le bouton "valider" pour envoi le formulaire
    addWorkForm.addEventListener('submit',formSubmit);     
})