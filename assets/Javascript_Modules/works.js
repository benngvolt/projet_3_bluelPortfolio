// -----------------------------------------------------------------------------------------------------------------------------------------------------------
// FONCTION pour la génération d'UN SEUL travail à afficher: GENERATION DU PROJET SUR PAGE 'PROJETS' + CREATION D'UN SAMPLE DANS MODALE + FONCTION SUPPRESSION
// -----------------------------------------------------------------------------------------------------------------------------------------------------------


export function generateSingleWork(figureId, sampleId, imgSrc, imgTitle, workId){
    
    // ---------------------------------------------------------------------
    // AFFICHAGE DU PROJET SUR PAGE 'PROJETS' et CREATION SAMPLE DANS MODALE
    // ---------------------------------------------------------------------

    const sectionGallery = document.querySelector(".gallery"); // DOM - définition de l'élément parent 'sectionGallery' pour l'affichage des projets
            
    const figureElement = document.createElement("figure"); // DOM - création d'un élément parent pour contenir <img> + <figcaption> de chaque projet
    figureElement.id = figureId;
    sectionGallery.appendChild(figureElement); 

    const imageElement = document.createElement("img"); // DOM - création d'un élément <img> par projet, avec ses attributs
    imageElement.src = imgSrc;
    imageElement.alt = imgTitle;
    figureElement.appendChild(imageElement);

    const figcaptionElement = document.createElement("figcaption"); // DOM - création d'un élément <figcaption> par projet, avec ses attributs et sa légende associée
    figcaptionElement.innerText = imgTitle;              
    figureElement.appendChild(figcaptionElement); 
        
    const samplesContainer = document.querySelector(".samplesContainer"); // DOM - création d'un 'container' parent pour afficher les samples images des projets
    const sampleElement = document.createElement("li"); // DOM - création d'un élément 'sample' qui contiendra un sample image, un lien 'éditer' et un bouton 'supprimer'
    sampleElement.id = sampleId;
    samplesContainer.appendChild(sampleElement);

    const sampleImage = document.createElement("img"); // DOM - création d'un sample image du projet avec ses attributs
    sampleImage.setAttribute("class","sampleImage");
    sampleImage.src = imgSrc;
    imageElement.alt = imgTitle;
    sampleElement.appendChild(sampleImage);

    const editButton = document.createElement("button"); // DOM - création d'un lien 'éditer', (utilisé pour un sprint futur?)
    editButton.innerText = "éditer";
    sampleElement.appendChild(editButton);


    // -------------------------------
    // BOUTON DE SUPPRESSION DU PROJET 
    // -------------------------------


    const trashButton = document.createElement("button"); // DOM - création d'un bouton 'supprimer' par projet
    trashButton.setAttribute("class","trashButton");
    sampleElement.appendChild(trashButton);

    const trashIcon = document.createElement("i"); // DOM - création de l'icône 'corbeille' du bouton 'supprimer'
    trashIcon.setAttribute("class","trashIcon fa-regular fa-trash-can");
    trashButton.appendChild(trashIcon);

    // DOM - Définition des éléments de la CONFIRMBOX pour valider la suppression du projet
    const confirmBox = document.getElementById("confirmBox");
    const cancelButton = document.querySelector(".cancelButton");
    const okButton = document.querySelector(".okButton");

    let tokenValue = sessionStorage.getItem('1'); // Récupération du token dans le session storage
    
    // Création d'un écouteur d'évènement sur le bouton 'supprimer', afin d'afficher la confirmbox et valider ou non la suppression du projet
    
    trashButton.addEventListener("click", function(){
        
        trashButton.id = workId;
        
        // Affichage de la confirmbox
        confirmBox.style.display="flex";

        //cration d'un écouteur d'évènement pour le bouton 'NON' pour revenir en arrière sans supprimer le projet, en dissimulant la confirmbox
        cancelButton.addEventListener('click', function(){
            confirmBox.style.display="none";
            trashButton.id = "";
        })

        //création d'un écouteur d'évènement pour le bouton 'OUI' afin de supprimer le projet via une requête fetch en DELETE
        okButton.addEventListener('click', function(){
            fetch("http://localhost:5678/api/works/" + trashButton.id, {
                method: 'DELETE',
                headers: {
                    "Authorization": 'Bearer ' + tokenValue.replace(/"/g, ''),
                }
            })
            .then ((response) => {
                if(response.ok) {
                    if(document.getElementById(figureElement.id)) {
                        document.getElementById(figureElement.id).remove();
                    }
                    if(document.getElementById(sampleElement.id)) {
                        document.getElementById(sampleElement.id).remove();
                    }
                    document.getElementById("inputFiles").value="";
                    confirmBox.style.display="none";
                } else {
                    console.log("delete error");
                }
            })
        })
    })
}


// --------------------------------------------------------------------------------------------------------------------------
// FONCTION pour la génération de TOUS LES TRAVAUX A AFFICHER en itérant la fonction generateSingleWork dans une boucle 'for'
// --------------------------------------------------------------------------------------------------------------------------


export function generateAllWorks(works){
    for (let i=0 ; i < works.length ; i++) {
        let work = works[i]; // récupération des objets 'work' et 'category' dans des variables
        let figureId = `figure${work.id}`;
        let sampleId = `sample${work.id}`;
        let imgSrc = work.imageUrl;
        let imgTitle = work.title;
        let workId = work.id;
        
        generateSingleWork(figureId, sampleId, imgSrc, imgTitle, workId)
    }
}