
// --------------------------------------------------------------
// DECLARATION DES CONSTANTES pour DEFINITION DES ELEMENTS DU DOM
// --------------------------------------------------------------


const loginLink = document.querySelector(".loginLink"); // DOM - définition de l'élément 'lien logIn' 
const logoutButton = document.querySelector(".logoutButton"); // DOM - définition de l'élément 'bouton logOut'
const modifProfile = document.querySelector(".modifProfile"); // DOM - définition de l'élément 'bouton "modifier le profil"'
const modifWork = document.querySelector(".modifWork"); // DOM - définition de l'élément 'bouton "modifier les projets"'
const filters = document.querySelector(".filters"); // DOM - définition de l'élément 'bouton filtres'
const topBlackNav = document.querySelector(".topBlackNav"); // DOM - définition de l'élément 'barre de navigation noire'


// --------------
// FONCTION LOGIN
// --------------


export function loginVersion(loginLink,logoutButton, modifProfile, modifWork, filters, topBlackNav){
    //affichage des éléments : barre de navigation noire / bouton logOut / boutons 'modifier'
    topBlackNav.style.display = "flex"
    logoutButton.style.display = "block";
    modifProfile.style.display = "block";
    modifWork.style.display = "block";
    //dissimulation des éléments : boutons de filtres / lien vers logIn
    filters.style.display = "none";
    loginLink.style.display = "none";   
}


// ---------------
// FONCTION LOGOUT
// ---------------


export function logoutVersion(loginLink,logoutButton, modifProfile, modifWork, filters,topBlackNav){
    //dissimulation des éléments : barre de navigation noire / bouton logOut / boutons 'modifier'  
    logoutButton.style.display = "none";
    modifProfile.style.display = "none";
    modifWork.style.display = "none";
    topBlackNav.style.display = "none"
    //affichage des éléments : boutons de filtres / lien vers logIn
    filters.style.display = "flex";
    loginLink.style.display = "block";
}


// --------------------------------------------------------------------------------------------------
// FONCTION CHECKAUTH POUR VERIFICATION D'AUTHENTIFICATION ET DECISION DE LOGIN OU LOGOUT EN FONCTION 
// --------------------------------------------------------------------------------------------------


export function checkAuth(tokenValue) {
    // APPLICATION des modifications du mode logIN ou logOUT avec une condition if/else
    if (tokenValue) {
        loginVersion(loginLink, logoutButton, modifProfile, modifWork, filters, topBlackNav);
    } else {
        logoutVersion(loginLink, logoutButton, modifProfile, modifWork, filters, topBlackNav);
    }
}