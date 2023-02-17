/* on charge l'URL des fichiers JSON */
const worksResponse = fetch("http://localhost:5678/api/works");
const categoriesResponse = fetch("http://localhost:5678/api/categories");

/* on déclare des variables pour définir les deux objets json 'works' et 'categories' et les utiliser par la suite, 
et des variable 'work' et 'category' pour récupérer les propriétés de chaque objet.*/
let works;
let work;
let categories;
let category;

/* On créer une promesse pour la génération des projets et la création des listeners pour les filtres */

Promise.all([worksResponse, categoriesResponse])
    
    /* d'abord on parse la réponse en objet JSON pour pouvoir l'utiliser */
    .then((response) => {
        const worksData = response[0];
        const categoriesData = response[1];
        return Promise.all([worksData.json(), categoriesData.json()]);
    })
    
    /* puis on récupère les objets JSON dans des constantes 'works' et 'categories' */
    .then((jsonResponse) => {
        const works = jsonResponse[0];
        const categories = jsonResponse[1];


        /* ---- AFFICHAGE DES PROJETS --------------------------------------------------*/

        /* CREATION D'UNE FONCTION: on intéragis avec le DOM pour créer les éléments correspondants aux balises / 
        puis on génère l'affichage de chaque projet en utilisant la boucle for */    
        
        function generateWorks (works){
            const sectionGallery = document.querySelector(".gallery");

            for (let i=0 ; i < works.length ; i++) {
                work = works[i];
                const figureElement = document.createElement("figure");
                sectionGallery.appendChild(figureElement);

                const imageElement = document.createElement("img");
                imageElement.src = work.imageUrl;
                imageElement.alt = work.title;

                const figcaptionElement = document.createElement("figcaption");
                figcaptionElement.innerText = work.title;
                figureElement.appendChild(imageElement);                
                figureElement.appendChild(figcaptionElement);
            }
        }

        /*PREMIER AFFICHAGE DES TRAVAUX*/
        generateWorks (works);

        /* ---- AFFICHAGE DES FILTRES --------------------------------------------------*/

        /* IDEM je connecte avec le DOM pour créer les éléments correspondants aux balises / 
        puis je génère l'affichage des filtres en utilisant la boucle for */

        const sectionFilters = document.querySelector(".filters");
        const allCategoriesElement = document.querySelector(".allCategories");
        sectionFilters.appendChild(allCategoriesElement);

        allCategoriesElement.innerText = "Tous";

        for (let u=0 ; u < categories.length; u++){
            category = categories[u];
            let categoryId = category.id;
            const categoryElement = document.createElement("li");
            
            /* On crée une classe par balise "li" dans le HTML*/
            categoryElement.setAttribute("class",`category${category.id}`);
            sectionFilters.appendChild(categoryElement);
            categoryElement.innerText = category.name;
            
            /* On crée un élément lié au boutton de filres dans le HTML*/
            let buttonFilter = document.querySelector(`.category${category.id}`);
            buttonFilter.addEventListener("click",function(){
                for (let i=0 ; i < works.length; i++) {
                    work = works[i];
                }
            let worksFiltered = works.filter(function(work){
                return work.category.id === categoryId;
                })
            console.log(worksFiltered);

            /* EFFACEMENT DE LA PAGE et REGENERATION de la page avec les travaux filtrés */
            document.querySelector(".gallery").innerHTML = "";
            generateWorks (worksFiltered);
            })
        }

        /* On crée un bouton pour le filtre "tous" qui affichera la totalité des travaux*/
        const buttonAllWorks = document.querySelector(".allCategories");
        buttonAllWorks.addEventListener("click", function(){
            document.querySelector(".gallery").innerHTML = "";
            generateWorks (works);
        })
    })
    .catch(console.error);



















