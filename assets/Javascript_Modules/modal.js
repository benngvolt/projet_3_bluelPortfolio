
// -----------------------
// IMPORTATION DES MODULES
// -----------------------


import {generateSingleWork} from "../Javascript_Modules/works.js"

 
const modalWork = document.getElementById("modalWork");
const closeButton = document.querySelector(".closeButton");
const goBackButton = document.querySelector(".goBackButton");
const modalGallery = document.querySelector(".modalGallery");
const modalAdd = document.querySelector(".modalAdd");

const inputFiles = document.querySelector('#inputFiles');
const inputTitle = document.querySelector('#title');
const inputCategory = document.querySelector('#category');
const imgFieldContainer = document.querySelector('.imgFieldContainer');

const imgText = document.querySelector('.imgText');
const imgIcon = document.querySelector('.imgIcon');
const imgInputButton = document.querySelector('.imgInputButton');

const imgSample = document.createElement("img");
imgFieldContainer.appendChild(imgSample);
imgSample.setAttribute("class", "imgSample");

const alertMessageUpload = document.createElement("p");
const categoryForm = document.querySelector(".categoryForm");
categoryForm.appendChild(alertMessageUpload);


// ---------------------------------
// FONCTION 'OUVERTURE DE LA MODALE'
// ---------------------------------


export function openWorkModal(event) {
    event.preventDefault();
    modalWork.style.display = 'flex';
    modalAdd.style.display = 'none';
    closeButton.addEventListener("click", closeWorkModal);
    goBackButton.style.display = 'none';
    alertMessageUpload.innerText = "";
}


// ------------------------------------------
// FONCTION 'OUVERTURE DU FORMULAIRE D'AJOUT'
// ------------------------------------------


export function openEditionMode(event) {
    event.preventDefault();
    modalGallery.style.display = 'none';
    modalAdd.style.display = null;
    goBackButton.style.display = 'block';
    alertMessageUpload.innerText = "";
}


// ---------------------------------------------------
// FONCTION 'RETOUR AU MODE 'SUPPRESSION DES TRAVAUX''
// ---------------------------------------------------


export function goBackModal(event) {
    event.preventDefault();
    modalGallery.style.display = 'flex';
    modalAdd.style.display = 'none';
    alertMessageUpload.innerText = "";
    goBackButton.style.display = 'none';
    reinitAddModal(); //ré-initialisation de la modale d'ajouts
    document.getElementById("inputFiles").value=""; // Puis ré-initialisation du champs d'upload de l'image
}


// ---------------------------------
// FONCTION 'FERMETURE DE LA MODALE'
// ---------------------------------


function closeWorkModal(event) {
    goBackModal(event);
    modalWork.style.display = 'none';
    alertMessageUpload.innerText = "";
    document.getElementById("inputFiles").value = ""; // Puis ré-initialisation du champs d'upload de l'image
}


// -------------------------------------------
// FONCTION 'AFFICHAGE D'UN SAMPLE PAR PROJET'
// -------------------------------------------


export function displaySample(){

    // dissimulation du formulaire d'ajout d'image
    imgIcon.style.display="none";
    imgText.style.display="none";
    imgInputButton.style.display="none";

    // création et définition des attributs du sample pour affichage 
    const file = inputFiles.files[0]; // récupération du fichier image dans le formulaire
    const reader = new FileReader(); 
    reader.readAsDataURL(file); // lecture du fichier image récupéré comme adresse url
    reader.onload = function() { // création des attributs de l'image (src, alt, class)
        imgSample.setAttribute("src", reader.result);
        imgSample.setAttribute("alt", "");
        imgSample.setAttribute("class", "imgSample");
    }

    // affichage du sample image
    imgSample.style.display="block";
};


// --------------------------------------
// FONCTION 'ENVOI DU FORMULAIRE D'AJOUT'
// --------------------------------------


export async function formSubmit(event) {
    event.preventDefault();
    const workFormData = new FormData();
    workFormData.append('image', inputFiles.files[0]);
    workFormData.append('title', inputTitle.value);
    workFormData.append('category', inputCategory.value);
    let tokenValue = sessionStorage.getItem("1");

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
                let sampleId = `sample${data.id}`;
                let imgSrc = data.imageUrl;
                let imgTitle = inputTitle.value;
                let workId = data.id;

                generateSingleWork(figureId, sampleId, imgSrc, imgTitle, workId);

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


// ------------------------------------------------
// FONCTION 'REINITIALISATION DE LA MODALE D'AJOUT'
// ------------------------------------------------


function reinitAddModal() {
    imgIcon.style.display= "block";
    imgText.style.display= "block";
    imgInputButton.style.display= "block";
    imgSample.src ="";
    inputTitle.value="";
}