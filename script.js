import { generateAllWorks, generateSingleWork } from "./works.js";
import { createFilters } from "./categories.js";

// RECUPERATION DES TABLEAUX 'works' ET 'categories' (sous forme de chaînes de caractères) VIA L'API avec methode FETCH en GET, puis stockage des réponses dans des constantes --------

const worksResponse = fetch("http://localhost:5678/api/works");
const categoriesResponse = fetch("http://localhost:5678/api/categories");

// CRÉATION D'UNE PROMESSE relative à l'exécution des méthodes fetch asynchrones -------------------------------------------------------------------

Promise.all([worksResponse, categoriesResponse])   

        // PARSING DE LA REPONSE (string) en OBJETS JSON -------------------------------------------------------------------------------------------
        .then((response) => {
            const worksData = response[0];
            const categoriesData = response[1];
            return Promise.all([worksData.json(), categoriesData.json()]);
        })
        
        // ---- RECUPERATION DES TABLEAUX JSON dans des constantes 'works' et 'categories'----------------------------------------------------------
        .then((jsonResponse) => {
            const works = jsonResponse[0];
            const categories = jsonResponse[1];
            
            // ---- AFFICHAGE DES PROJETS ----------------------------------------------------------------------------------------------------------    
            generateAllWorks (works);
            
            // ---- AFFICHAGE DES FILTRES ----------------------------------------------------------------------------------------------------------
            createFilters (categories, works);
        })

        /* CONDITION si la promesse n'est pas atteinte */
        .catch(console.error);


/* MODIFICATIONS RELATIVES AUX ETATS D'AUTHENTIFICATION LOGIN / LOGOUT de la page d'accueil--------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------------------------------*/

/* RECUPERATION DU TOKEN d'identification présent dans le stockage local (dans le cas d'authentification réussie) dans une variable 'tokenValue' */        
let tokenValue = sessionStorage.getItem("1");

/* CREATION DE DEUX FONCTIONS, l'une pour définir le mode logged IN de la page, l'autre pour le mode logged OUT */

function loginVersion(loginLink,logoutButton, modifProfile, modifWork, filters){
    loginLink.style.display = "none";
    logoutButton.style.display = "block";
    modifProfile.style.display = "block";
    modifWork.style.display = "block";
    filters.style.display = "none";
}

function logoutVersion(loginLink,logoutButton, modifProfile, modifWork, filters){
    loginLink.style.display = "block";
    logoutButton.style.display = "none";
    modifProfile.style.display = "none";
    modifWork.style.display = "none";
    filters.style.display = "flex";
}

/* VERIFICATION DE L'ETAT AUTHENTIFICATION et APPLICATION DES MODIFS A EFFECTUER SUR L'AFFICHAGE DE LA PAGE D'INDEX, EN FONCTION-------------------
-------------------------------------------------------------------------------------------------------------------------------------------------*/

document.addEventListener("DOMContentLoaded", function() { // on exécute cette partie de code dans une fonction permettant d'attendre que le DOM soit chargé
    
    // ---- DEFINITION DES ELEMENTS de boutons logIn et logOut, boutons de modifications d'image de profil et des travaux, et liste de filtre */
    const loginLink = document.querySelector (".loginLink");
    const logoutButton = document.querySelector (".logoutButton");
    const modifProfile = document.querySelector (".modifProfile");
    const modifWork = document.querySelector (".modifWork");
    const filters = document.querySelector (".filters");

    // ---- CREATION D'UN EVENEMENT sur le bouton logout puis exécution des modifications: effacement du token et fonction logOut*/
    logoutButton.addEventListener("click", function() {
        window.sessionStorage.removeItem("1");
        logoutVersion(loginLink,logoutButton, modifProfile, modifWork, filters);
        window.location.reload();
    })
    
    // ---- CREATION DE LA FONCTION CHECKAUTH, permettant de vérifier si l'authentification est réussie ou non, 
    //et d'appliquer les modifications du mode logIN ou logOUT avec une condition if/else 
    function checkAuth (tokenValue) {
        if (tokenValue) {
            loginVersion(loginLink, logoutButton, modifProfile, modifWork, filters);
        } else {
            logoutVersion(loginLink, logoutButton, modifProfile, modifWork, filters);
        }
    }

    // ---- EXECUTION DE LA FONCTION CHECKAUTH avec 'tokenValue' en paramètre 
    checkAuth (tokenValue);

    // ---- OUVERTURE DE LA MODALE -------------------------------------------------------

    const modalWork = document.getElementById ("modalWork");
    const closeButton = document.querySelector (".closeButton");
    const goBackButton = document.querySelector (".goBackButton");
    const modalGallery = document.querySelector (".modalGallery");
    const modalAdd = document.querySelector (".modalAdd");

    const openWorkModal = function (event) {
        event.preventDefault();
        modalWork.style.display = 'flex';
        modalAdd.style.display = 'none';
        closeButton.addEventListener("click", closeWorkModal);
    }

    const closeWorkModal = function (event) {
        goBackModal(event);
        modalWork.style.display = 'none';
    }

    modifWork.addEventListener("click", openWorkModal);
    
    // ---- OUVERTURE DU MODE EDITION / AJOUT PHOTO 

    const addPicButton = document.querySelector (".addPicButton");
    const openEditionMode = function (event) {
        event.preventDefault();
        modalGallery.style.display = 'none';
        modalAdd.style.display = null;
        goBackButton.style.display = 'block';
    }
    addPicButton.addEventListener("click", openEditionMode);

    // ---- RETOUR EN ARRIERE VERS LE MODE SUPPR TRAVAUX 
    
    const goBackModal = function (event) {
        event.preventDefault();
        modalGallery.style.display = 'flex';
        modalAdd.style.display = 'none';
        //ré-initialiser la modale d'ajouts:
        reinitAddModal();
    }
    goBackButton.addEventListener("click", goBackModal);









    // ---- AJOUT D'UN NOUVEAU PROJET AVEC REQUETE POST et FORMDATA 
    






    // ---- création d'une variable pour définir le formulaire d'ajout
    const addWorkForm = document.querySelector(".addWorkForm");

    // ---- création des éléments du DOM pour afficher le template image
    const inputFiles = document.querySelector('#inputFiles');
    const inputTitle = document.querySelector('#title');
    const inputCategory = document.querySelector('#category');
    const picFieldContainer = document.querySelector('.picFieldContainer');

    const picText = document.querySelector('.picText');
    const picIcon = document.querySelector('.picIcon');
    const imgTemplate = document.createElement("img");
    const picInputButton = document.querySelector('.picInputButton');
    picFieldContainer.appendChild(imgTemplate);
    imgTemplate.setAttribute("class", "imgTemplate");

    // ---- AFFICHER UN TEMPLATE IMAGE DU PROJET
    function displayTemplate(){
        console.log("image uploadee");

        picIcon.style.display="none";
        picText.style.display="none";
        picInputButton.style.display="none";
        imgTemplate.style.display="block";

        const file = inputFiles.files[0];
        const reader = new FileReader();
        
        reader.readAsDataURL(file);
        
        reader.onload = function() {
            imgTemplate.setAttribute("src", reader.result);
            imgTemplate.setAttribute("alt", "");
            imgTemplate.setAttribute("class", "imgTemplate");
        }
    };

    // ---- CREATION D'UNE FONCTION POUR REINITIALISER LA MODALE D'AJOUT ---
    function reinitAddModal() {
        picIcon.style.display= "block";
        picText.style.display= "block";
        picInputButton.style.display= "block";
        imgTemplate.style.display ="none";
        inputTitle.value="";
    }

    inputFiles.addEventListener('change', displayTemplate);
    
    // ---- création d'un écouteur d'évènement pour soumettre le formulaire 
    addWorkForm.addEventListener('submit',formSubmit);

    async function formSubmit(event) {

        event.preventDefault();
        const workFormData = new FormData();

        workFormData.append('image', inputFiles.files[0]);
        workFormData.append('title', inputTitle.value);
        workFormData.append('category', inputCategory.value);

      
        // ---- Envoyer formData au backend pour le traitement, à condition que tous les champs soient remplis

        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                "Authorization": 'Bearer ' + tokenValue.replace(/"/g, '')
            },
            body: workFormData
        })
            //.then(response => {
            .then(response => response.json())
            .then(data => {
                if(data.id){
                    
                    // ---- A la place d'un reload de la page, création d'éléments dans le DOM pour afficher les images dans le portfolio
                    console.log (data);
                    let figureId = `figure${data.id}`;
                    let templateId = `template${data.id}`;
                    let imgSrc = data.imageUrl;
                    let imgTitle = inputTitle.value;
                    let workId = data.id;

                    generateSingleWork (figureId, templateId, imgSrc, imgTitle, workId);

                    //revenir à la modale précédente: 
                    event.preventDefault();
                    modalGallery.style.display = 'flex';
                    modalAdd.style.display = 'none';

                    //ré-initialiser la modale d'ajouts:
                    reinitAddModal();
                    
                } else {
                    const alertMessageUpload = document.createElement("p");
                    const categoryForm = document.querySelector(".categoryForm");
                    categoryForm.appendChild(alertMessageUpload);
                    alertMessageUpload.innerText = "tous les champs doivent être complétés!";
                    alertMessageUpload.setAttribute("class", "alertMessage");
                    //ré-initialiser la modale d'ajouts:
                    reinitAddModal();
                }
            })
            .catch(error => {
                (console.error);
            });
    }      
})