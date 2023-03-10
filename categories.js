// -----------------------
// IMPORTATION DES MODULES
// -----------------------


import { generateAllWorks } from "./works.js";


// ------------------------------------------------------------------------------
// FONCTION POUR LA CREATION ET L'AFFICHAGE DE  FILTRES PAR CATEGORIES DE TRAVAUX
// ------------------------------------------------------------------------------


export function createFilters(categories, works){
    
    let work;

     
    const allCategoriesElement = document.querySelector(".allCategories"); // DOM - Définition de l'élément 'bouton filtre "Tous"'
    const sectionFilters = document.querySelector(".filters");
    sectionFilters.appendChild(allCategoriesElement);
    
    // Création d'un écouteur d'évènement correspondant au bouton filtre "Tous", affichage de tous les projets
    allCategoriesElement.addEventListener("click", function(){
        document.querySelector(".gallery").innerHTML = "";
        document.querySelector(".gallery").style.display='grid';
        generateAllWorks(works);
    })

    // Boucle 'for' itérant la fonction pour chaque catégorie
    for (let u=0 ; u < categories.length; u++){
        let category = categories[u];
        let categoryId = category.id;

        
        const categoryElement = document.createElement("li"); // DOM - Création d'un élement par bouton filtre et définition de ses attributs.
        categoryElement.setAttribute("class",`category${category.id}`);
        sectionFilters.appendChild(categoryElement);
        categoryElement.innerText = category.name; // Affichage du nom de la catégorie par bouton filtre
        
        // Création d'un menu de sélection des catégories dans le champs 'catégorie' du formulaire d'ajout des projets
        const categoryField = document.querySelector(".categoryField");
        const categoryOption = document.createElement("option");
        categoryField.appendChild(categoryOption);
        categoryOption.setAttribute("value",`${category.id}`);
        categoryOption.innerText = category.name;

        // Création d'un écouteur d'évènement lié aux boutons de filtres
        categoryElement.addEventListener("click",function(){
            
            // Boucle 'for' vérifiant la condition pour chaque projet dans chaque catégorie
            for (let i=0 ; i < works.length; i++) {
                    work = works[i];
                }
            // Définition d'une fonction de filtre par catégorie puis stockage de la réponse dans une variable worksFiltered 
            let worksFiltered = works.filter(function(work){
                return work.category.id === categoryId;
            })
            
            // Affichage des travaux filtrés
            const sectionGallery = document.querySelector(".gallery");
            sectionGallery.style.display='grid';
            document.querySelector(".gallery").innerHTML = "";
            generateAllWorks(worksFiltered);
            
            // Condition 'if' si aucun projet n'est présent dans la catégorie sélectionnée, affichage d'un message.
            if(worksFiltered.length === 0){ 
                console.log("aucun projet");
                sectionGallery.style.display='block';
                const noCategoryTxt = document.createElement("p");
                sectionGallery.appendChild(noCategoryTxt);
                noCategoryTxt.innerHTML="Aucun projet ne correspond à cette catégorie...";
                noCategoryTxt.setAttribute("class", "noCategoryTxt");
            }
        })
    }
}   