/* RECUPERATION DES TABLEAUX 'works' ET 'categories' (sous forme de chaînes de caractères) VIA L'API avec methode FETCH en GET, puis stockage des réponses dans des constantes -------- */

const worksResponse = fetch("http://localhost:5678/api/works");
const categoriesResponse = fetch("http://localhost:5678/api/categories");

/* DECLARATION DE DEUX VARIABLES pour définir les DEUX TABLEAUX 'works' et 'categories' AU FORMAT JSON afin de les utiliser par la suite, 
PUIS LES VARIABLES 'work' et 'category' pour définir les OBJETS contenus dans ces tableaux, et pouvoir récupérer leurs propriétés -----*/
let works;
let work;
let categories;
let category;

/* CRÉATION D'UNE PROMESSE relative à l'exécution des méthodes fetch asynchrones -----------------------------------------------------*/
Promise.all([worksResponse, categoriesResponse])   

    /* PARSING DE LA REPONSE (string) en OBJETS JSON */
    .then((response) => {
        const worksData = response[0];
        const categoriesData = response[1];
        return Promise.all([worksData.json(), categoriesData.json()]);
    })
    
    /* RECUPERATION DES TABLEAUX JSON dans des constantes 'works' et 'categories' */
    .then((jsonResponse) => {
        const works = jsonResponse[0];
        const categories = jsonResponse[1];


        /* ---- AFFICHAGE DES PROJETS -------------------------------------------------------------------------------------------------
        -----------------------------------------------------------------------------------------------------------------------------*/

        /* CREATION D'UNE FONCTION: on intéragit avec le DOM pour créer les éléments correspondants aux balises / 
        puis on génère l'affichage de chaque projet en utilisant la boucle for --------------------------------*/    
        
        function generateWorks (works){
            const sectionGallery = document.querySelector(".gallery"); /* DEFINITION DE L'ELEMENT PARENT sectionGallery POUR L'AFFICHAGE DES PROJETS*/
            for (let i=0 ; i < works.length ; i++) {
                work = works[i]; /* RECUPERATION DES OBJETS 'work' et 'category' dans des variables---------------------------------*/
                const figureElement = document.createElement("figure"); /* CREATION D'UN ELEMENT PARENT pour contenir <img> + <figcaption> de chaque projet*/
                sectionGallery.appendChild(figureElement); 

                const imageElement = document.createElement("img"); /* CREATION D'UN ELEMENT <img> par projet, avec ses attributs*/
                imageElement.src = work.imageUrl;
                imageElement.alt = work.title;

                const figcaptionElement = document.createElement("figcaption"); /* CREATION D'UN ELEMENT <figcaption> par projet, avec ses attributs et sa légende associée*/
                figcaptionElement.innerText = work.title;
                figureElement.appendChild(imageElement);                
                figureElement.appendChild(figcaptionElement);
            }
        }

        /* EXECUTION DE LA FONCTION pour un premier affchage par défault des travaux -------------------------------------------------*/
        generateWorks (works);

        /* ---- AFFICHAGE DES FILTRES --------------------------------------------------------------------------------------------------
        ------------------------------------------------------------------------------------------------------------------------------*/

        /* IDEM... COMMUNICATION avec le DOM pour créer les éléments correspondants aux balises / 
        puis GENERATION DE l'affichage des filtres en utilisant la boucle 'for' ---------------*/

        const sectionFilters = document.querySelector(".filters");
        const allCategoriesElement = document.querySelector(".allCategories");
        sectionFilters.appendChild(allCategoriesElement);

        for (let u=0 ; u < categories.length; u++){
            category = categories[u];
            let categoryId = category.id;
            const categoryElement = document.createElement("li");
            
            /* CREATION D'UNE CLASSE par balise <li> dans le HTML*/
            categoryElement.setAttribute("class",`category${category.id}`);/* CONCATENATION des strings 'category'+ variable d'identification de la categorie, 
            afin de différencier les catégories dans les classes -------------------------------------------------------------------------------------------*/
            sectionFilters.appendChild(categoryElement);
            categoryElement.innerText = category.name; /*AFFICHAGE DU NOM DE LA CATEGORIE A FILTRER par bouton */
            
            /* CREATION D'UN EVENEMENT LIÉ AUX BOUTONS DE FILTRES dans le HTML*/
            let buttonFilter = document.querySelector(`.category${category.id}`);
            buttonFilter.addEventListener("click",function(){
                for (let i=0 ; i < works.length; i++) {
                    work = works[i];
                }
                /* DEFINITION D'UNE FONCTION DE FILTRE PAR CATEGORIE, puis STOCKAGE DE LA REPONSE DANS UNE VARIABLE worksFiltered */
                let worksFiltered = works.filter(function(work){
                    return work.category.id === categoryId;
                    })
                /* vérification par affichage dans la console */
                console.log(worksFiltered);

                /* EFFACEMENT DE LA PAGE et REGENERATION de la page avec les travaux filtrés, 
                en EXECUTANT la fonction de génération des travaux avec cette fois-ci l'attribut 'worksFiltered' (travaux filtrés) */
                document.querySelector(".gallery").innerHTML = "";
                generateWorks (worksFiltered);
                })
            }

        /* CREATION DU BOUTON "TOUS" qui affichera la totalité des travaux----------------------------------------------------*/
        const buttonAllWorks = document.querySelector(".allCategories");
        buttonAllWorks.addEventListener("click", function(){
            document.querySelector(".gallery").innerHTML = "";
            generateWorks (works);
        })
    })

    /* CONDITION si la promesse n'est pas atteinte */
    .catch(console.error);





/* MODIFICATIONS RELATIVES AUX ETATS D'AUTHENTIFICATION LOGIN / LOGOUT de la page d'accueil--------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------------------------------*/

/* RECUPERATION DU TOKEN d'identification présent dans le stockage local (dans le cas d'authentification réussie) dans une variable 'tokenValue' */        
let tokenValue = localStorage.getItem("1");

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

document.addEventListener("DOMContentLoaded", function() { /*on exécute cette partie de code dans une fonction permettant d'attendre que le DOM soit chargé*/
    
    /*DEFINITION DES ELEMENTS de boutons logIn et logOut, boutons de modifications d'image de profil et des travaux, et liste de filtre */
    const loginLink = document.querySelector (".loginLink");
    const logoutButton = document.querySelector (".logoutButton");
    const modifProfile = document.querySelector (".modifProfile");
    const modifWork = document.querySelector (".modifWork");
    const filters = document.querySelector (".filters");

    /* CREATION D'UN EVENEMENT sur le bouton logout puis exécution des modifications: effacement du token et fonction logOut*/
    logoutButton.addEventListener("click", function() {
        window.localStorage.removeItem("1");
        logoutVersion(loginLink,logoutButton, modifProfile, modifWork, filters);
    })
    
    /* CREATION DE LA FONCTION CHECKAUTH, permettant de vérifier si l'authentification est réussie ou non, 
    et d'appliquer les modifications du mode logIN ou logOUT avec une condition if/else */
    function checkAuth (tokenValue) {
        if (tokenValue) {
            loginVersion(loginLink, logoutButton, modifProfile, modifWork, filters);
        } else {
            logoutVersion(loginLink, logoutButton, modifProfile, modifWork, filters);
        }
    }

    /* EXECUTION DE LA FONCTION CHECKAUTH avec 'tokenValue' en paramètre */
    checkAuth (tokenValue);

    /* OUVERTURE DE LA MODALE -------------------------------------------------------*/

    const modalWork = document.getElementById ("modalWork");
    const closeButton = document.querySelector (".closeButton");

    const openWorkModal = function (event) {
        event.preventDefault();
        modalWork.style.display = null;
        closeButton.addEventListener("click", closeWorkModal);
    }

    const closeWorkModal = function (event) {
        event.preventDefault();
        modalWork.style.display = "none";
    }

    modifWork.addEventListener("click", openWorkModal);
})















