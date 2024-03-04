console.log("Hello Works ! ");

let works = await fetch("http://localhost:5678/api/works").then(response => response.json()) // Appel à l'API Get Works et désérialisation
const categories = await fetch("http://localhost:5678/api/categories").then(response => response.json())

const filtersContainer = document.querySelector(".menu-filter") // HomePage : Recupération du parent Div Class menu-filter
const galleryContainer = document.querySelector(".gallery") // HomePage : Recup du parent Div Class gallery
const btnTous = document.querySelector(".menu-filter #reset") // HomePage : recup du bouton reset 
const modalWindow = document.getElementById("aside-modal") // HomePage : aside
const modifyButton = document.getElementById("lien-modifier") // HomePage : Lien "Modifier" sur la home
const logout = document.getElementById("logout") // HomePage : Lien "logout" en pied de page

const iconContainer = document.querySelector(".iconContainer") // Container des icones en TOP de la modale
const xcrossButton = document.querySelector(".fa-xmark") // Croix pour fermer dans la modale

const pageModal1 = document.querySelector(".editableGalleryContainer") // Modale 1 : Galerie photo avec suppression possible 
const editableContainer = document.querySelector(".editableGallery") // Modale 1 : Gallery editable dans la modale 1
const buttonAddPhoto = document.getElementById("btn-add-photo") // Modale 1 : bouton "ajouter une photo"

const pageModal2 = document.querySelector(".addRealisation") // Modale 2 : "ajouter une photo"
const iconArrowLeftModale2 = document.getElementById("arrow-left-add-real") // Modale 2 : Icone Left pour revenir à la modale 1 depuis la modale 2
const formAddRealisation = document.querySelector(".addRealisation form") // Modale 2 : Formulaire
const insertPhotoContainer = document.querySelector(".insertPhotoContainer") // Modale 2 : Div pour Uploader une image 
const photoContainerPreview = document.querySelector(".photoContainerPreview") // Modale 2 : Div pour Visualisé l'image avant de l'envoyer à l'API
const menuSelectCategorie = document.getElementById("image-categorie") // Modale 2 : 
const inputTitleModale2 = document.getElementById("image-title") // Modale 2 : Input Titre
const buttonAddARealisation = document.getElementById("buttonAddARealisation") // Modale 2 : Bouton Ajouter une réalisation

const imgPreviewUpload = document.getElementById("photo-preview")
const imgTitleConfirm = document.getElementById("image-title-confirm")

const bannerTop = document.getElementById("banner")
const btnLogin = document.getElementById("login") 

let btnFilters = "" // initialisation de la variable filtre qui contiendra le numero de la categorie à afficher

let token = window.sessionStorage.getItem("token")

checkLogin() // Check si token est stocké, si token présent => Lien modifié activé sur la HomePage
dynamicGalleryHomePage() // Afficher tous les travaux par defaut (au chargement de la page)

// Boutons filtres \\

btnTous.addEventListener("click", () => { 
    resetButtonAllCategories() // Affiche toutes les réalisations sans filtre
})

function resetButtonAllCategories() { // Affiche toutes les réalisations sans filtre

    resetDynamicGalleryHomePage() // au clic sur le btn "tous", suppression des enfants du container "GalleryContainer"
    dynamicGalleryHomePage() // affichage de tous les travaux
    removeSelected() // Supprime la class "Selected" de tous les boutons
    btnTous.classList.add("selected") // ajoute la class "selected" au bouton "Tous" pour changer la mise en forme

}

for (let i = 0; i  < categories.length; i++) { // pour chaque catégorie (élement de la liste réponse provenant de l'API via la route categories)

    let newButton = document.createElement("button") // création d'un bouton pour chaque élement (catégorie)
    newButton.innerText = `${categories[i].name}` // ajout d'un nom pour chaque bouton (nom de la categorie)
    newButton.id = `${categories[i].id}` // ajout de l'ID de la catégorie en attribue ID 

    newButton.addEventListener("click", () => {
        btnFilters = newButton.id // recupération du numero de la categorie
        filteredDynamicGalleryHomePage(btnFilters) // affichage des travaux ayant le numero de la categorie 

        removeSelected() // Supprime la class "Selected" de tous les boutons
        newButton.classList.add("selected") // // ajoute la class "selected" au bouton clické
        
    })

    filtersContainer.appendChild(newButton) // attachement du bouton au parent Div Class menu-filter   
}

// Fonctions pour générer la gallery en HomePage \\

async function dynamicGalleryHomePage() { // Affiche toutes es réalisations renvoyées par l'API

    works = await fetch("http://localhost:5678/api/works").then(response => response.json()) // Appel à l'API Get Works et désérialisation

    for (let i = 0 ; i < works.length ; i++ ) { // Pour chaque réalisation (élément de la liste réponse provenant de l'API via la route works)

        let newImage = document.createElement("img") // Création de l'HTML Element img
        newImage.src = `${works[i].imageUrl}` // ajout de la source de l'img 
        newImage.alt = `${works[i].title}` // ajout de l'attribut alt

        let newFigCaption = document.createElement("figcaption") // Création de l'HTML Element Figcaption - legende de la photo
        newFigCaption.innerText = `${works[i].title}` // ajout du texte dans la balise figcaption


        let newFigure = document.createElement("figure") // Création de l'HTML Element figure
        newFigure.id = `${works[i].id}` // ajout d'un ID à figure correspondant à l'ID de la réalisation
        newFigure.appendChild(newImage) // attachement de l'enfant img à figure
        newFigure.appendChild(newFigCaption) // attachement de figcaption à figure
        galleryContainer.appendChild(newFigure) // attachement de figure au parent Div Class Gallery    
    }
}

function resetDynamicGalleryHomePage() { // Supprime toutes les réalisations de la galerie en HomePage

    while (galleryContainer.firstChild) { // tant qu'il y a un firstchild
    
        galleryContainer.removeChild(galleryContainer.firstChild) // supprimer le first child -- Permet de supprimer tous les "figure" générés dans la fonction dynamicGalleryHomePage
    }
}

async function filteredDynamicGalleryHomePage(filterNumber) {  // fonction pour reset l'affichage des travaux et afficher les travaux filtrés par categorie

    resetDynamicGalleryHomePage() // Suppression de tous les travaux
    
    const worksFiltered = works.filter (function (work) { //création de la liste filtrer par numero de categorie (works = tous les travaux) 
        return work.categoryId == filterNumber // recupère les travaux qui ont le meme numero de catégorie que le numero du bouton cliqué
    })

    for (let i = 0 ; i < worksFiltered.length ; i++ ) { // Pour chaque réalisation (élément de la liste réponse provenant de l'API via la route works)

        let newImage = document.createElement("img") // Création de l'HTML Element img
        newImage.src = `${worksFiltered[i].imageUrl}` // ajout de la source de l'img 
        newImage.alt = `${worksFiltered[i].title}` // ajout de l'attribut alt

        let newFigCaption = document.createElement("figcaption") // Création de l'HTML Element Figcaption
        newFigCaption.innerText = `${worksFiltered[i].title}` // ajout du texte dans la balise figcaption


        let newFigure = document.createElement("figure") // Création de l'HTML Element figure
        newFigure.id = `${worksFiltered[i].id}` // ajout d'un ID à figure correspondant à l'ID de la réalisation
        newFigure.appendChild(newImage) // attachement de l'enfant img à figure
        newFigure.appendChild(newFigCaption) // attachement de figcaption à figure
        galleryContainer.appendChild(newFigure) // attachement de figure au parent Div Class Gallery
        
    }
}

function removeSelected() { // Supprime la class "Selected" de tous les boutons filtres

    const allFiltersButton = document.querySelectorAll(".menu-filter button")
    allFiltersButton.forEach((button) => button.classList.remove("selected"))

}

///****\\\ Modal ///***\\\

const fileInput = document.querySelector(".input-file")
const nameFileBloc = document.getElementById("fileName")

let fileSizeStatus = false
let fileTypeStatus = false
let inputTitleStatus = false
let menuSelectCategorieStatus = false
let selectedIndexMenuCategories = null

let optionCategoriesAPI = ""

let alertSize = ""
let alertType = ""
let infoText = ""

let errorMessage = document.createElement("p")
errorMessage.id = "errorMessage"

let file = {}


modifyButton.addEventListener("click", () => { // click sur le lien "modifier" => Ouvre la Modal
    openModal()
})

xcrossButton.addEventListener("click", () => { // click sur la croix dans la Modal => Ferme la modal et reset
    closeModal() // ferme et reset la Modale
})

window.addEventListener("keydown", function(e) {  // Pression clavier sur Echape => Ferme la modal et reset
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal() // ferme et reset la Modale
    }
})

modalWindow.addEventListener("click", (event) => { // click en dehors de la modale => Ferme la modal et reset
    if (event.target.id === "aside-modal") {
        closeModal() // ferme et reset la Modale
    }
})

buttonAddPhoto.addEventListener("click", () => { // click sur le bouton "Ajouter une photo" => passage à la modale 2
    modal1ToModal2()
})


iconArrowLeftModale2.addEventListener("click", () => { // click sur la flèche en haut à gauche => retour à la modale 1
    modal2ToModale1() // Cache la Modale 2 et affiche la Modale 1
    formAddRealisation.reset()
    nameFileBloc.innerHTML = ""
})

// Trigers Modale 2 

buttonAddARealisation.addEventListener("click", (event) => {

    event.preventDefault()

    if (fileSizeStatus && fileTypeStatus && inputTitleStatus && menuSelectCategorieStatus) {
        errorMessage.innerText = ""
        sendNewReal() // Envoie le fichier à l'API, avec sa catégorie et son titre, affiche un message si ok ou si erreur

    } else {
        // console.log("conditions ne sont pas reunies");
        errorMessage.innerText = ""
        errorMessage.removeAttribute("style")
        errorMessage.innerText = "Erreur : Fichier non conforme ou champs non renseigné"
        errorMessage.setAttribute("style", "color:red;")

        buttonAddARealisation.insertAdjacentElement("afterend", errorMessage)

    }
 })


async function openModal() { 

    modalWindow.removeAttribute("style"); // Supprime atr style="display:none" => Affiche la Modale
    modalWindow.removeAttribute("aria-hidden"); // supprime aria-hidden, la Modale est considérée visible pour les outils d'accessibilité
    modalWindow.setAttribute("aria-modal","true") // indique la modale est affichée pour les outils d'accessibilité

    deleteGalleryModal1() // Supprime toutes les réalisations de la galerie de la Modale 1
    galleryModal1() // Appel l'API et affiche toutes les réalisations dans la galerie de la Modale 1

    pageModal1.removeAttribute("style") // Supprime atr style="display:none" => Affiche la Modale 1
    pageModal2.setAttribute("style", "display: none;") // Cache la modale 2

}

async function closeModal() { // ferme et reset la Modale


    modalWindow.setAttribute("style","display: none;"); // Cache la Modale 
    modalWindow.setAttribute("aria-hidden","true") // la Modale est considérée cachée pour les outils d'accessibilité 
    modalWindow.removeAttribute("aria-modal") // indique la modale n'est pas affichée pour les outils d'accessibilité

    deleteGalleryModal1() // Supprime toutes les réalisations de la galerie de la Modale 1

    resetFormAddReal() // reset le formulaire de la modale 2 pour que les données renseignées précédement soient supprimées

    pageModal2.setAttribute("style", "display: none;") // Enleve la modale 2

    resetButtonAllCategories() // Affiche toutes les réalisations sans filtre

    modal2ToModale1() // Cache la Modale 2 et affiche la Modale 1

}

function resetFormAddReal() { // reset le formulaire de la modale 2 pour que les données renseignées précédement soient supprimées

    imgPreviewUpload.src = ""
    formAddRealisation.reset()
    nameFileBloc.innerHTML = ""
    fileSizeStatus = false
    fileTypeStatus = false
    inputTitleStatus = false
    menuSelectCategorieStatus = false

    insertPhotoContainer.removeAttribute("style") // Affiche la Div pour Uploader une image
    photoContainerPreview.setAttribute("style", "display:none;") // Cache la Div qui visualise l'image Uploadé

    errorMessage.innerText = ""

}

function modal1ToModal2() { // Cache la Modale 1 et affiche la Modale 2

    iconContainer.setAttribute("style", "justify-content: space-between;") // changement du CSS pour mettre la fleche retour à gauche et la croix pour fermer la modale à droite
    iconArrowLeftModale2.removeAttribute("style") // affichage de la flèche gauche en supprimant l'attribut style="display:none" dans l'HTML
    
    pageModal1.setAttribute("style", "display: none;") // n'affiche plus la fenetre modale 1
    pageModal2.removeAttribute("style") // affiche la fenetre modale 2

    categoriesForNewRealisation() // // Génère et affiche les catégories dans le menu "selectionné une catégorie" 
    activeButtonModal2() // Active le bouton si la taille et le type du fichier sont correctes, qu'un titre et une categorie sont renseignés dans le formulaire


}

function modal2ToModale1() { // Cache la Modale 2 et affiche la Modale 1

    iconArrowLeftModale2.setAttribute("style", "display: none;") // Enleve la fléche gauche de la modale 2
    iconContainer.removeAttribute("style") // supprime "justify-content : space-between;" pour remettre le CSS par defaut "flex-end" et laisser la croix reste à droite de la Modale

    pageModal2.setAttribute("style", "display: none;") // cache la modale 2
    pageModal1.removeAttribute("style") // affiche la modale 1

    resetFormAddReal() // reset le formulaire de la modale 2 pour que les données renseignées précédement soient supprimées
    deleteOptionsCategoriesApi() // Supprime les catégories du menu "selectionné une catégorie"
    deleteGalleryModal1() // Supprime toutes les réalisations de la galerie de la Modale 1
    galleryModal1() // Appel l'API et affiche toutes les réalisations dans la galerie de la Modale 1

}


async function galleryModal1() { // Appel l'API et affiche toutes les réalisations dans la galerie de la Modale 1

    works = await fetch("http://localhost:5678/api/works").then(response => response.json()) // Appel à l'API Get Works et désérialisation

    for (let i = 0 ; i < works.length ; i++ ) { // Pour chaque réalisation (élément de la liste réponse provenant de l'API via la route works)

        let newImage = document.createElement("img") // Création de l'HTML Element img
        newImage.src = `${works[i].imageUrl}` // ajout de la source de l'img 
        newImage.alt = `${works[i].title}` // ajout de l'attribut alt

        let newTrashBin = document.createElement("i") // création de l'icone 
        newTrashBin.classList.add("fa-solid")  // ajout de la class pour avoir une icone pleine
        newTrashBin.classList.add("fa-trash-can") // ajout de la class pour avoir une corbeille
        newTrashBin.classList.add("bin") // ajout de la class .bin
        newTrashBin.id = `${works[i].id}` // ajout de l'ID de la réalisation


        let newFigure = document.createElement("figure") // Création de l'HTML Element figure
        newFigure.id = `${works[i].id}` // ajout d'un ID à figure correspondant à l'ID de la réalisation
        newFigure.appendChild(newImage) // attachement de l'enfant img à figure
        newFigure.appendChild(newTrashBin) // attachement de l'enfant icone trashBin à figure
        editableContainer.appendChild(newFigure) // attachement de figure au parent Div Class Gallery
    }

    let binSelection = document.querySelectorAll(".bin")

    binSelection.forEach(element => {
        element.addEventListener("click", (event) => {
            event.preventDefault()
            deleteRealisationAPI(element.id)
        })
    })
}

function deleteGalleryModal1() { // Supprime toutes les réalisations de la galerie de la Modale 1

    let editableContainerChild = document.querySelectorAll(".editableGallery figure")
    for (let i = 0 ; i < editableContainerChild.length ; i++) {
        editableContainer.removeChild(editableContainerChild[i])
    }
}


async function deleteRealisationAPI(idreal) { // 

    await fetch(`http://localhost:5678/api/works/${idreal}`, {
        
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    closeModal() // ferme et reset la Modale
    
} 


// ajout d'une photo

fileInput.addEventListener("change", (event) => {

    file = event.target.files
    imgPreviewUpload.src = URL.createObjectURL(file[0])    
    nameFileBloc.innerHTML = ""

    checkSizeFile(file[0].size) // vérifie la taille du fichier
    checkTypeFile(file[0].type) // vérifie le type de fichier

    displayPreview() // Si la taille et le type de fichier est correcte => Visualise l'image 
    activeButtonModal2() // Active le bouton si la taille et le type du fichier sont correctes, qu'un titre et une categorie sont renseignés dans le formulaire

})

function displayPreview() { // Si la taille et le type de fichier sont correctes => Visualise l'image 

    if (fileSizeStatus && fileTypeStatus) {

        insertPhotoContainer.setAttribute("style", "display:none;") // Cache la Div pour uploadé l'image
        photoContainerPreview.removeAttribute("style") // Affiche la Div pour visualisé l'image

    } else {

        nameFileBloc.innerHTML = alertSize + alertType // Affiche un message d'alert
    }
}

function checkSizeFile(size) { // vérifie la taille du fichier

    let fileSizeKByte = Math.round(size / 1024) // convertie en KiloByte et arrondi à l'entier le plus proche

    if (fileSizeKByte > 0 && fileSizeKByte < 4096) {
        // console.log("taille sup à 0 et inférieur à 4096");
        alertSize = ""
        fileSizeStatus = true 

    } else {
        alertSize = "<br><span>Fichier trop volumineux, supérieur à 4mo !</span>"  
        // console.log("taille sup à 4096");
        fileSizeStatus = false
    }
}

function checkTypeFile(type) { // vérifie le type de fichier

    // console.log("test type activé, format : "+ type);

    if (type === "image/jpeg" || type === "image/png") {
        alertType = ""
        fileTypeStatus = true       
    } else {         
        console.log("fichier différent de jpg");
        alertType = "<br><span>Fichier non valide, format accepté : .jpg ou .png !</span>"
        fileTypeStatus = false
    }
}

inputTitleModale2.addEventListener("change", (event) => {     

    if (inputTitleModale2.value === "") {
        inputTitleStatus = false
    } else {
        inputTitleStatus = true
    }

    activeButtonModal2() // Active le bouton si la taille et le type du fichier sont correctes, qu'un titre et une categorie sont renseignés dans le formulaire

})

function categoriesForNewRealisation() { // Génère et affiche les catégories dans le menu "selectionné une catégorie" 

    let catogieDisabled = document.createElement("option") // ajout d'une première option désactivée qui s'appelle "- choisissez la catégorie -"
    catogieDisabled.value = ""
    catogieDisabled.setAttribute("Disabled", "disabled")
    catogieDisabled.setAttribute("selected", "selected")
    catogieDisabled.innerText = "- Choisissez la catégorie -"
    menuSelectCategorie.appendChild(catogieDisabled)


    for (let i = 0 ; i < categories.length; i++) { // pour chaque catégorie (élement de la liste réponse provenant de l'API via la route categories)

        let categorie = document.createElement("option") // création d'une option pour chaque catégorie
        categorie.innerText = `${categories[i].name}` // ajout d'un nom pour chaque bouton (nom de la categorie)
        categorie.id = `${categories[i].id}` // ajout de l'ID de la catégorie en attribue ID
        categorie.classList.add("options-API")
        categorie.setAttribute("value", `${categories[i].name}`)
        menuSelectCategorie.appendChild(categorie)

    }
}

function deleteOptionsCategoriesApi() { // Supprime les catégories du menu "selectionné une catégorie"

    let listCategories = document.querySelectorAll("option")

    for (let i = 0 ; i < listCategories.length ; i++) {
            menuSelectCategorie.removeChild(listCategories[i])
    }
    
}




menuSelectCategorie.addEventListener("change", (event) => {

    if (menuSelectCategorie !== null) {
        menuSelectCategorieStatus = true
    }

    activeButtonModal2() // Active le bouton si la taille et le type du fichier sont correctes, qu'un titre et une categorie sont renseignés dans le formulaire
    selectedIndexMenuCategories = menuSelectCategorie.selectedIndex
})


function activeButtonModal2() { // Active le bouton si la taille et le type du fichier sont correctes, qu'un titre et une categorie sont renseignés dans le formulaire

    if (fileSizeStatus && fileTypeStatus && inputTitleStatus && menuSelectCategorieStatus) {

        buttonAddARealisation.removeAttribute("style")
        errorMessage.innerText = ""

    } else {

        buttonAddARealisation.setAttribute("style", "background-color: grey; cursor: not-allowed;")
    }
}


async function sendNewReal() { // Envoie le fichier à l'API, avec sa catégorie et son titre, affiche un message si ok ou si erreur

    let formData = new FormData()
    formData.append("image", file[0])
    formData.append("category", selectedIndexMenuCategories)
    formData.append("title", inputTitleModale2.value)

    let returnApiForPushRealisation = await fetch(`http://localhost:5678/api/works`, {
            
    method: "POST",
    headers: {
        'Authorization': `Bearer ${token}`,
    },
    body: formData
    })
    

    if (returnApiForPushRealisation.status == 201) {

        errorMessage.removeAttribute("style")
        errorMessage.setAttribute("style", "color: green;")
        errorMessage.innerText = "Image ajoutée !"
        buttonAddARealisation.insertAdjacentElement("afterend", errorMessage)

    } else if (returnApiForPushRealisation.status == 400) {

        errorMessage.removeAttribute("style")
        errorMessage.setAttribute("style", "color: red;")
        errorMessage.innerText = "Erreur, problème technique"
        buttonAddARealisation.insertAdjacentElement("afterend", errorMessage)

    } else if (returnApiForPushRealisation.status == 401) {

        errorMessage.removeAttribute("style")
        errorMessage.setAttribute("style", "color: red;")
        errorMessage.innerText = "Utilisateur non autorisé ou non connecté"
        buttonAddARealisation.insertAdjacentElement("afterend", errorMessage)

    } else if (returnApiForPushRealisation.status == 500) {

        errorMessage.removeAttribute("style")
        errorMessage.setAttribute("style", "color: red;")
        errorMessage.innerText = "Erreur exceptionnelle, problème technique"
        buttonAddARealisation.insertAdjacentElement("afterend", errorMessage)

    } 

    setTimeout(() => { closeModal() }, 3000) // // ferme et reset la Modale après 3 secondes 

}

function checkLogin() { // Check si token est stocké, si token présent => Lien modifié activé sur la HomePage

    let modifyLink = document.querySelector(".js-modal")

    if (token !== null) {
        modifyLink.removeAttribute("style") // affiche le bouton "modifier"
        bannerTop.removeAttribute("style") // affiche la bannière TOP avec fond noir
        filtersContainer.setAttribute("style", "display: none;") // N'affiche pas les boutons filtres
        btnLogin.innerText = "logout"

    } else { 
        modifyLink.setAttribute("style", "display: none;") // n'affiche pas le bouton "modifier"
        bannerTop.setAttribute("style", "display: none;") // n'affiche pas la bannière TOP avec fond noir
        filtersContainer.removeAttribute("style") // affiche les boutons filtres

    }

}
    
btnLogin.addEventListener("click", () => {

if (btnLogin.innerText == "logout") {
    sessionStorage.removeItem("token")
    location.reload()
    checkLogin()
}
}) 
