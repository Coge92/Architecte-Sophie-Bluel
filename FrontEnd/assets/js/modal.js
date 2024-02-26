export async function modal() {

    console.log("Hello Modal ! ");

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


    let works = await fetch("http://localhost:5678/api/works").then(response => response.json()) // Appel à l'API Get Works et désérialisation
    let categories = await fetch("http://localhost:5678/api/categories").then(response => response.json())
   
    const galleryContainer = document.querySelector(".gallery") // Recup du parent Div Class gallery

    const fileInput = document.querySelector(".input-file")
    const nameFileBloc = document.getElementById("fileName")

    let fileSizeStatus = false
    let fileTypeStatus = false
    let inputTitleStatus = false

    let optionCategoriesAPI = ""

    let alertSize = ""
    let alertType = ""
    let infoText = ""





    formAddRealisation.reset()



    modifyButton.addEventListener("click", () => { 

        openModal()
    })

    xcrossButton.addEventListener("click", () => {

        closeModal()

    })

    window.addEventListener("keydown", function(e) { 

        if (e.key === "Escape" || e.key === "Esc") {
            closeModal()
        }
    })
    
    modalWindow.addEventListener("click", (event) => { // click on aside pour fermer

        if (event.target.id === "modal1") {
            closeModal()
        }
        
    })

    buttonAddPhoto.addEventListener("click", () => {

        modal1ToModal2()
        
    })


    iconArrowLeftModale2.addEventListener("click", () => {

        modal2ToModale1()

        formAddRealisation.reset()

        nameFileBloc.innerHTML = ""
        

    })

// Trigers Modale 2 

    buttonAddARealisation.addEventListener("click", (event) => {

        console.log("bouton cliqué");
        event.preventDefault()
        sendNewReal()

    })


// Trigers Modale 3

    // iconArrowLeftModale3.addEventListener("click", () => {

    //     modal3ToModale2()

    // })


    async function openModal() {

        modalWindow.removeAttribute("style");
        modalWindow.removeAttribute("aria-hidden");
        modalWindow.setAttribute("aria-modal","true")

        deleteGalleryModal1()

        galleryModal1()

        pageModal1.removeAttribute("style")
        pageModal2.setAttribute("style", "display: none;") // Enleve la modale 2
        // pageModal3.setAttribute("style", "display: none;") // Enleve la modale 3

        // addRealisation()

    }
  
    async function closeModal(event) {


        modalWindow.setAttribute("style","display: none;");
        modalWindow.setAttribute("aria-hidden","true")
        modalWindow.removeAttribute("aria-modal")

        deleteGalleryModal1() // supprime toutes les images générées par galleryModal1 

        formAddRealisation.reset()
        nameFileBloc.innerHTML = ""
        //deleteOptionsCategoriesApi()

        pageModal2.setAttribute("style", "display: none;") // Enleve la modale 2
        // pageModal3.setAttribute("style", "display: none;") // Enleve la modale 3

        resetDisplayWorks()

        generatedDomInsideGalleryContainer(works)

        modal2ToModale1()
       
    
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

        console.log("lancement de la fonction deleteRealisation");

        let binSelection = document.querySelectorAll(".bin")

        console.log(binSelection);

        binSelection.forEach(element => {
            element.addEventListener("click", (event) => {
            event.preventDefault()
            console.log(`Corbeille cliquée avec ID : ${element.id}`);
            deleteRealisationAPI(element.id)
            })
        })

    }



    function deleteGalleryModal1() {

        let editableContainerChild = document.querySelectorAll(".editableGallery figure")

        console.log(editableContainerChild);

        for (let i = 0 ; i < editableContainerChild.length ; i++) {

            editableContainer.removeChild(editableContainerChild[i])
        }


        console.log("Contenu de la modal 1 deleted")
        console.log(editableContainer);
    }


    async function deleteRealisationAPI(idreal) {

        let token = window.sessionStorage.getItem("token")

        console.log(token);


        let returnApiForDeleteResponse = await fetch(`http://localhost:5678/api/works/${idreal}`, {
            
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }

        })
        console.log(`http://localhost:5678/api/works/${idreal}`);
        console.log(`${token}`);
        console.log(returnApiForDeleteResponse);

        closeModal()


        
    } 
  

    // ajout d'une photo

    let file = {}

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
                console.log(fileSizeStatus);
                
                
            } else {
                alertSize = "<br><span>Fichier trop volumineux, supérieur à 4mo !</span>"  
                console.log("taille sup à 4096");
                fileSizeStatus = false
                console.log(fileSizeStatus);
            }

        }

        function checkTypeFile(type) {

            console.log("test type activé, format : "+ type);

            if (type === "image/jpeg" || type === "image/png") {
                alertType = ""
                fileTypeStatus = true
                console.log(fileTypeStatus);
            
            }
            else {         
                console.log("fichier diff de jpg");
                alertType = "<br><span>Fichier non valide, format accepté : .jpg ou .png !</span>"
                fileTypeStatus = false
                console.log(fileTypeStatus);
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


    let selectedIndexMenuCategories = 0

    let menuSelectCategorieStatus = false

    menuSelectCategorie.addEventListener("change", (event) => {

        console.log(menuSelectCategorie.value);

        if (menuSelectCategorie !== null) {
            menuSelectCategorieStatus = true
        }

        console.log(menuSelectCategorieStatus);
        activeButtonModal2()

        selectedIndexMenuCategories = menuSelectCategorie.selectedIndex

        console.log(selectedIndexMenuCategories);
    })


    function activeButtonModal2() {

        if (fileSizeStatus && fileTypeStatus && inputTitleStatus && menuSelectCategorieStatus) {

            buttonAddARealisation.removeAttribute("style")
            buttonAddARealisation.removeAttribute("disabled")

        } else {

            buttonAddARealisation.setAttribute("style", "background-color: grey; cursor: not-allowed;")
            buttonAddARealisation.setAttribute("disabled", "")
        }
    }


    async function sendNewReal() {

        let token = window.sessionStorage.getItem("token")

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

        console.log(returnApiForPushRealisation);
        closeModal()

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

        console.log("generatedDomInsideGalleryContainer HomePage");
    }
            
    function resetDisplayWorks() {

        console.log("resetDisplayWorks");

        console.log(galleryContainer.firstChild);

        while (galleryContainer.firstChild) { // tant qu'il y a un firstchild
        
            galleryContainer.removeChild(galleryContainer.firstChild) // supprimer le first child -- Permet de supprimer tous les "figure" générer dans la fonction generatedDomInsideGalleryContainer
        }
    }

}
