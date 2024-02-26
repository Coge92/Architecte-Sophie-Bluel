console.log("Hello Works ! ");

let works = await fetch("http://localhost:5678/api/works").then(response => response.json()) // Appel à l'API Get Works et désérialisation
const categories = await fetch("http://localhost:5678/api/categories").then(response => response.json())
let token = window.sessionStorage.getItem("token")
console.log(token);

const filtersContainer = document.querySelector(".menu-filter") // Recup du parent Div Class menu-filter
const galleryContainer = document.querySelector(".gallery") // Recup du parent Div Class gallery
const btnTous = document.querySelector(".menu-filter #reset") // recup du bouton reset 

const modalWindow = document.getElementById("modal1") // aside
const modifyButton = document.getElementById("lien-modifier") // Lien "Modifier" sur la home

const iconContainer = document.querySelector(".iconContainer") // Container des icones en TOP de la modale
const xcrossButton = document.querySelector(".fa-xmark") // Croix pour fermer dans la modale

const pageModal1 = document.querySelector(".editableGalleryContainer") // Modale 1 : Galerie photo avec suppression possible 
const editableContainer = document.querySelector(".editableGallery") // Gallery editable dans la modale 1
const buttonAddPhoto = document.getElementById("btn-add-photo") // Modale 1 : bouton "ajouter une photo"

const pageModal2 = document.querySelector(".addRealisation") // Modale 2 : "ajouter une photo"
const iconArrowLeftModale2 = document.getElementById("arrow-left-add-real") // Modale 2 : Icone Left pour revenir à la modale 1 depuis la modale 2
const formAddRealisation = document.querySelector(".addRealisation form") // Modale 2 : Formulaire
const insertPhotoContainer = document.querySelector(".insertPhotoContainer")
const photoContainerPreview = document.querySelector(".photoContainerPreview")
const menuSelectCategorie = document.getElementById("image-categorie") // Modale 2 : 
const inputTitleModale2 = document.getElementById("image-title") // Modale 2 : Input Titre
const buttonAddARealisation = document.getElementById("buttonAddARealisation") // Modale 2 : Bouton Ajouter une réalisation


const imgPreviewUpload = document.getElementById("photo-preview")
const imgTitleConfirm = document.getElementById("image-title-confirm")

const logout = document.getElementById("logout")
let btnFilters = "" // initialisation de la variable filtre qui contiendra le numero de la categorie à afficher

checkLogin()
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

        let newFigCaption = document.createElement("figcaption") // Création de l'HTML Element Figcaption
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


function removeSelected() { // Supprime la class "Selected" de tous les boutons

    const allFiltersButton = document.querySelectorAll(".menu-filter button")
    allFiltersButton.forEach((button) => button.classList.remove("selected"))

}

///****\\\ Modal ///***\\\

const fileInput = document.querySelector(".input-file")
const nameFileBloc = document.getElementById("fileName")

let fileSizeStatus = false
let fileTypeStatus = false
let inputTitleStatus = false

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
    closeModal()
})

window.addEventListener("keydown", function(e) {  // Pression clavier sur Echape => Ferme la modal et reset
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal()
    }
})

modalWindow.addEventListener("click", (event) => { // click en dehors de la modale => Ferme la modal et reset
    if (event.target.id === "modal1") {
        closeModal()
    }
})

buttonAddPhoto.addEventListener("click", () => { // click sur le bouton "Ajouter une photo" => passage à la modale 2
    modal1ToModal2()
})


iconArrowLeftModale2.addEventListener("click", () => { // click sur la flèche en haut à gauche => retour à la modale 1
    modal2ToModale1()
    formAddRealisation.reset()
    nameFileBloc.innerHTML = ""
})

// Trigers Modale 2 

buttonAddARealisation.addEventListener("click", (event) => {

    event.preventDefault()

    if (fileSizeStatus && fileTypeStatus && inputTitleStatus && menuSelectCategorieStatus) {
        errorMessage.innerText = ""
        sendNewReal()

    } else {
        console.log("conditions ne sont pas reunies");
        errorMessage.innerText = ""
        errorMessage.removeAttribute("style")
        errorMessage.innerText = "Erreur : Fichier non conforme ou champs non complété"
        errorMessage.setAttribute("style", "color:red;")

        buttonAddARealisation.insertAdjacentElement("afterend", errorMessage)

    }
    console.log("click");

})


async function openModal() {

    modalWindow.removeAttribute("style");
    modalWindow.removeAttribute("aria-hidden");
    modalWindow.setAttribute("aria-modal","true")

    deleteGalleryModal1()
    galleryModal1()

    pageModal1.removeAttribute("style")
    pageModal2.setAttribute("style", "display: none;") // Enleve la modale 2

}

async function closeModal(event) {


    modalWindow.setAttribute("style","display: none;");
    modalWindow.setAttribute("aria-hidden","true")
    modalWindow.removeAttribute("aria-modal")

    deleteGalleryModal1() // supprime toutes les images générées par galleryModal1 

    resetFormAddReal() // reset le formulaire pour que les données renseignées précédement soient supprimées

    pageModal2.setAttribute("style", "display: none;") // Enleve la modale 2

    resetButtonAllCategories() // Affiche toutes les réalisations sans filtre

    modal2ToModale1()

}

function resetFormAddReal() {

    imgPreviewUpload.src = ""
    formAddRealisation.reset()
    nameFileBloc.innerHTML = ""
    fileSizeStatus = false
    fileTypeStatus = false
    inputTitleStatus = false
    menuSelectCategorieStatus = false

    insertPhotoContainer.removeAttribute("style")
    photoContainerPreview.setAttribute("style", "display:none;")

    errorMessage.innerText = ""

}

function modal1ToModal2() {

    iconContainer.setAttribute("style", "justify-content: space-between;") // changement du CSS pour mettre la fleche retour à gauche et la croix pour fermer la modale à droite
    iconArrowLeftModale2.removeAttribute("style") // affichage de la flèche gauche en supprimant l'attribut style="display:none" dans l'HTML
    
    pageModal1.setAttribute("style", "display: none;") // n'affiche plus la fenetre modale 1
    pageModal2.removeAttribute("style") // affiche la fenetre modale 2

    categoriesForNewRealisation() // génére les categories en faisant une requète à l'API
    activeButtonModal2()


}

function modal2ToModale1() {

    iconArrowLeftModale2.setAttribute("style", "display: none;") // Enleve la fléche gauche de la modale 2
    iconContainer.removeAttribute("style") 

    pageModal2.setAttribute("style", "display: none;") // Enleve la modale 2
    pageModal1.removeAttribute("style") // afiiche la modale 1

    resetFormAddReal()
    deleteOptionsCategoriesApi() 
    deleteGalleryModal1()
    galleryModal1()

}


async function galleryModal1() {

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

function deleteGalleryModal1() {

    let editableContainerChild = document.querySelectorAll(".editableGallery figure")
    for (let i = 0 ; i < editableContainerChild.length ; i++) {
        editableContainer.removeChild(editableContainerChild[i])
    }
}


async function deleteRealisationAPI(idreal) {

    await fetch(`http://localhost:5678/api/works/${idreal}`, {
        
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    closeModal()
    
} 


// ajout d'une photo

fileInput.addEventListener("change", (event) => {

    file = event.target.files
    console.log(file[0]);
    console.log(file[0].name);

    imgPreviewUpload.src = URL.createObjectURL(file[0])    
    nameFileBloc.innerHTML = ""

    checkSizeFile(file[0].size)
    checkTypeFile(file[0].type)

    displayPreview()
    activeButtonModal2()

})

function displayPreview() {

    if (fileSizeStatus && fileTypeStatus) {

        insertPhotoContainer.setAttribute("style", "display:none;")
        photoContainerPreview.removeAttribute("style")

    } else {

        nameFileBloc.innerHTML = alertSize + alertType
    }
}

    function checkSizeFile(size) {

        let fileSizeKByte = Math.round(size / 1024)
        

        console.log(size);
        console.log(fileSizeKByte);


        if (fileSizeKByte > 0 && fileSizeKByte < 4096) {
            console.log("taille sup à 0 et inférieur à 4096");
            alertSize = ""
            fileSizeStatus = true

        } else {
            alertSize = "<br><span>Fichier trop volumineux, supérieur à 4mo !</span>"  
            console.log("taille sup à 4096");
            fileSizeStatus = false
        }

    }

    function checkTypeFile(type) {

        console.log("test type activé, format : "+ type);

        if (type === "image/jpeg" || type === "image/png") {
            alertType = ""
            fileTypeStatus = true       
        } else {         
            console.log("fichier diff de jpg");
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

    activeButtonModal2()

})

function categoriesForNewRealisation() {

    console.log("Regénération des options de cateogries");

    let catogieDisabled = document.createElement("option")
    catogieDisabled.value = ""
    catogieDisabled.setAttribute("Disabled", "disabled")
    catogieDisabled.setAttribute("selected", "selected")
    catogieDisabled.innerText = "Choisissez la catégorie -"
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

function deleteOptionsCategoriesApi() {

    let listCategories = document.querySelectorAll("option")

    for (let i = 0 ; i < listCategories.length ; i++) {
            menuSelectCategorie.removeChild(listCategories[i])
    }
    
}


let selectedIndexMenuCategories = null
let menuSelectCategorieStatus = false

menuSelectCategorie.addEventListener("change", (event) => {

    if (menuSelectCategorie !== null) {
        menuSelectCategorieStatus = true
    }

    activeButtonModal2()
    selectedIndexMenuCategories = menuSelectCategorie.selectedIndex
    console.log(selectedIndexMenuCategories);
})


function activeButtonModal2() {

    if (fileSizeStatus && fileTypeStatus && inputTitleStatus && menuSelectCategorieStatus) {

        buttonAddARealisation.removeAttribute("style")
        errorMessage.innerText = ""

    } else {

        buttonAddARealisation.setAttribute("style", "background-color: grey; cursor: not-allowed;")
    }
}


async function sendNewReal() {

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
        errorMessage.innerText = "Image ajouté !"
        buttonAddARealisation.insertAdjacentElement("afterend", errorMessage)
        console.log("Image ajouté !");

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

    setTimeout(() => { closeModal() }, 3000)

}

function checkLogin() {

    console.log("check login activé");

    let modifyLink = document.querySelector(".js-modal")

    if (token !== null) {
        modifyLink.removeAttribute("style")

    } else { 
        modifyLink.setAttribute("style", "display: none;")
    }

}
    
logout.addEventListener("click", () => {

    sessionStorage.removeItem("token")

    console.log(sessionStorage.getItem("token"));

    location.reload()

})