import {modal} from "./modal.js";

modal()

window.localStorage.removeItem("token")

console.log("Hello Works ! ");

const works = await fetch("http://localhost:5678/api/works").then(response => response.json()) // Appel à l'API Get Works et désérialisation

const categories = await fetch("http://localhost:5678/api/categories").then(response => response.json())

const filtersContainer = document.querySelector(".menu-filter") // Recup du parent Div Class menu-filter

const galleryContainer = document.querySelector(".gallery") // Recup du parent Div Class gallery

// Boutons filtres

let btnFilters = "" // initialisation de la variable filtre qui contiendra le numero de la categorie à afficher

const btnTous = document.querySelector(".menu-filter #reset") // recup du bouton reset 

btnTous.addEventListener("click", () => { 

    resetDisplayWorks() // au clic sur le btn reset, suppression des enfants du container "GalleryContainer"
    generatedDomInsideGalleryContainer(works) // affichage de tous les travaux

    removeSelected()
    btnTous.classList.add("selected")

})

console.log(btnTous);



for (let i = 0; i  < categories.length; i++) { // pour chaque catégorie (élement de la liste réponse provenant de l'API via la route categories)

    let newButton = document.createElement("button") // création d'un bouton pour chaque élement (catégorie)
    newButton.innerText = `${categories[i].name}` // ajout d'un nom pour chaque bouton (nom de la categorie)
    newButton.id = `${categories[i].id}` // ajout de l'ID de la catégorie en attribue ID 

    newButton.addEventListener("click", () => {
        btnFilters = newButton.id // recupération du numero de la categorie
        displayWorks(btnFilters) // affichage des travaux ayant le numero de la categorie 

        removeSelected()
        newButton.classList.add("selected")
        
        
    })

    filtersContainer.appendChild(newButton) // attachement du bouton au parent Div Class menu-filter   

}

generatedDomInsideGalleryContainer(works) // Afficher tous les travaux par defaut (au chargement de la page)


// Works

async function displayWorks(filterNumber) {  // fonction pour reset l'affichage des travaux et filtrer les travaux par categorie

    resetDisplayWorks() // Suppression de tous les travaux
    
    const worksFiltered = works.filter (function (work) { //création de la liste filtrer par numero de categorie (works = tous les travaux) 
        return work.categoryId == filterNumber // recupère les travaux qui ont le meme numero de catégorie que le numero du bouton cliqué
    })

    generatedDomInsideGalleryContainer(worksFiltered) // générer les enfants de la "galleryContainer" avec les travaux de la catégorie choisie


console.log(btnFilters)
console.log(worksFiltered);

}


async function generatedDomInsideGalleryContainer(worksList) {
    for (let i = 0 ; i < worksList.length ; i++ ) { // Pour chaque réalisation (élément de la liste réponse provenant de l'API via la route works)

        let newImage = document.createElement("img") // Création de l'HTML Element img
        newImage.src = `${worksList[i].imageUrl}` // ajout de la source de l'img 
        newImage.alt = `${worksList[i].title}` // ajout de l'attribut alt

        let newFigCaption = document.createElement("figcaption") // Création de l'HTML Element Figcaption
        newFigCaption.innerText = `${worksList[i].title}` // ajout du texte dans la balise figcaption


        let newFigure = document.createElement("figure") // Création de l'HTML Element figure
        newFigure.id = `${worksList[i].id}` // ajout d'un ID à figure correspondant à l'ID de la réalisation
        newFigure.appendChild(newImage) // attachement de l'enfant img à figure
        newFigure.appendChild(newFigCaption) // attachement de figcaption à figure
        galleryContainer.appendChild(newFigure) // attachement de figure au parent Div Class Gallery
        
    }
}

    
function resetDisplayWorks() {

    console.log(galleryContainer.firstChild);

    while (galleryContainer.firstChild) { // tant qu'il y a un firstchild
    
        galleryContainer.removeChild(galleryContainer.firstChild) // supprimer le first child -- Permet de supprimer tous les "figure" générer dans la fonction generatedDomInsideGalleryContainer
    }
}

function removeSelected() {

    const allFiltersButton = document.querySelectorAll(".menu-filter button")

    allFiltersButton.forEach((button) => button.classList.remove("selected"))

    console.log(allFiltersButton);


}

