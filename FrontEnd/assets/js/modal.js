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
    const menuSelectCategorie = document.getElementById("image-categorie") // Modale 2 : 
    const inputTitleModale2 = document.getElementById("image-title") // Modale 2 : Input Titre
    const buttonAddARealisation = document.getElementById("buttonAddARealisation") // Modale 2 : Bouton Ajouter une réalisation

    const pageModal3 = document.querySelector(".addConfirmRealisation") // Modale 3 : "confirmer ajout de la photo"
    const iconArrowLeftModale3 = document.getElementById("arrow-left-add-confirm") // Modale 3 : Icone Left pour revenir à la modale 2 depuis la modale 3
    const menuSelectCategorieConfirm = document.getElementById("image-categorie-confirm")
    const inputTitleModale3 = document.getElementById("image-title-confirm")
    const buttonAddARealisationFinal = document.getElementById("buttonAddARealisationFinal")


    const imgPreviewUpload = document.getElementById("photo-preview")
    const imgTitleConfirm = document.getElementById("image-title-confirm")

    
    const displayPhotoContainer = document.querySelector(".addConfirmRealisation .insertPhotoContainer") // Modale 3 : "insertPhotoContainer"



    const fileInput = document.querySelector(".input-file")
    const nameFileBloc = document.getElementById("fileName")

    let fileSizeStatus = false
    let fileTypeStatus = false
    let inputTitleStatus = false
    let menuSelectCategorieStatus = false

    let optionCategoriesAPI = ""

    let alertSize = ""
    let alertType = ""
    let infoText = ""

    const adminWorks = await fetch("http://localhost:5678/api/works").then(response => response.json()) // Appel à l'API Get Works et désérialisation
    const categories = await fetch("http://localhost:5678/api/categories").then(response => response.json())


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
        deleteOptionsCategoriesApi() 

    })

// Trigers Modale 2 

    buttonAddARealisation.addEventListener("click", (event) => {

        console.log("bouton cliqué");
        event.preventDefault()
        modal2ToModale3()
        activeButtonModal3()

    })


// Trigers Modale 3

    iconArrowLeftModale3.addEventListener("click", () => {

        modal3ToModale2()

    })


    function openModal() {

        modalWindow.removeAttribute("style");
        modalWindow.removeAttribute("aria-hidden");
        modalWindow.setAttribute("aria-modal","true")

        generatedDomInsideGalleryContainer(adminWorks)

        deleteRealisation()

        pageModal1.removeAttribute("style")
        pageModal2.setAttribute("style", "display: none;") // Enleve la modale 2
        pageModal3.setAttribute("style", "display: none;") // Enleve la modale 3

        // addRealisation()

    }
  
    function closeModal(event) {


        modalWindow.setAttribute("style","display: none;");
        modalWindow.setAttribute("aria-hidden","true")
        modalWindow.removeAttribute("aria-modal")

        deletegeneratedDomInsideGalleryContainer() // supprime toutes les images générées par generatedDomInsideGalleryContainer 

        formAddRealisation.reset()
        nameFileBloc.innerHTML = ""
        deleteOptionsCategoriesApi()

        pageModal2.setAttribute("style", "display: none;") // Enleve la modale 2
        pageModal3.setAttribute("style", "display: none;") // Enleve la modale 3
       


       
    
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

    }


    function modal2ToModale3() {

        iconArrowLeftModale2.setAttribute("style", "display: none;")
        iconArrowLeftModale3.removeAttribute("style")

        pageModal2.setAttribute("style", "display: none;")
        pageModal3.removeAttribute("style") // affiche la fenetre modale 3

        realisationPreview() // Visualisation des informations renseignées dans la modale 2

    }


    function modal3ToModale2() {

        iconArrowLeftModale3.setAttribute("style", "display: none;")
        iconArrowLeftModale2.removeAttribute("style")

        pageModal3.setAttribute("style", "display: none;")
        pageModal2.removeAttribute("style") 

        activeButtonModal2()

    }


    async function generatedDomInsideGalleryContainer(worksList) {
        for (let i = 0 ; i < worksList.length ; i++ ) { // Pour chaque réalisation (élément de la liste réponse provenant de l'API via la route works)
    
            let newImage = document.createElement("img") // Création de l'HTML Element img
            newImage.src = `${worksList[i].imageUrl}` // ajout de la source de l'img 
            newImage.alt = `${worksList[i].title}` // ajout de l'attribut alt

            let newTrashBin = document.createElement("i") // création de l'icone 
            newTrashBin.classList.add("fa-solid")  // ajout de la class pour avoir une icone pleine
            newTrashBin.classList.add("fa-trash-can") // ajout de la class pour avoir une corbeille
            newTrashBin.classList.add("bin") // ajout de la class .bin
            newTrashBin.id = `${worksList[i].id}` // ajout de l'ID de la réalisation
    
    
            let newFigure = document.createElement("figure") // Création de l'HTML Element figure
            newFigure.id = `${worksList[i].id}` // ajout d'un ID à figure correspondant à l'ID de la réalisation
            newFigure.appendChild(newImage) // attachement de l'enfant img à figure
            newFigure.appendChild(newTrashBin) // attachement de l'enfant icone trashBin à figure
            editableContainer.appendChild(newFigure) // attachement de figure au parent Div Class Gallery
        }
    console.log("contenu Modal généré");
    }

    function deletegeneratedDomInsideGalleryContainer() {

        while (editableContainer.firstChild) { // tant qu'il y a un firstchild
            editableContainer.removeChild(editableContainer.firstChild) // supprimer le first child -- Permet de supprimer tous les "figure"
        }
        console.log("Contenu de la modale deleted");
    }

    function deleteRealisation() {

        let binSelection = document.querySelectorAll(".bin")

        console.log(binSelection);

        binSelection.forEach(element => {
            element.addEventListener("click", (event) => {
                event.preventDefault()
                console.log(`Corbeille cliquée avec ID : ${element.id}`);
               //deleteRealisationAPI(element.id)
        })

        })

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
            
        } 
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

        infoText = "Fichier uploadé : "+ file[0].name
        nameFileBloc.innerHTML = infoText + alertSize + alertType

        activeButtonModal2()

    })

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

        for (let i = 0 ; i < categories.length; i++) { // pour chaque catégorie (élement de la liste réponse provenant de l'API via la route categories)

            let categorie = document.createElement("option") // création d'une option pour chaque catégorie
            categorie.innerText = `${categories[i].name}` // ajout d'un nom pour chaque bouton (nom de la categorie)
            categorie.id = `${categories[i].id}` // ajout de l'ID de la catégorie en attribue ID
            categorie.classList.add("options-API")
            categorie.setAttribute("value", `${categories[i].name}`)
            menuSelectCategorie.appendChild(categorie)

            optionCategoriesAPI = document.querySelectorAll(".options-API")

            let categorieConfirm = document.createElement("option") // création d'une option pour chaque catégorie
            categorieConfirm.innerText = `${categories[i].name}` // ajout d'un nom pour chaque bouton (nom de la categorie)
            categorieConfirm.id = `${categories[i].id}` // ajout de l'ID de la catégorie en attribue ID
            categorieConfirm.classList.add("options-API-confirm")
            categorieConfirm.setAttribute("value", `${categories[i].name}`)
            menuSelectCategorieConfirm.appendChild(categorieConfirm)


        }
    }



    function deleteOptionsCategoriesApi() {

        console.log(optionCategoriesAPI.length);

        if (optionCategoriesAPI !== null) {

            console.log("condition delete option reussi");
            console.log(menuSelectCategorie);

            for (let i = 0 ; optionCategoriesAPI.length; i++) {

                menuSelectCategorie.removeChild(optionCategoriesAPI[i])

                console.log(optionCategoriesAPI[i]);
            }
        }
    }


    let selectedIndexMenuCategories = 0

    menuSelectCategorie.addEventListener("change", (event) => {

        console.log(menuSelectCategorie.value);

        if (menuSelectCategorie !== null) {
            menuSelectCategorieStatus = true
        }

        console.log(menuSelectCategorieStatus);
        activeButtonModal2()

        console.log(menuSelectCategorie.selectedIndex); 

        selectedIndexMenuCategories = menuSelectCategorie.selectedIndex
    })


    function activeButtonModal2() {

        console.log("activebuton activé");

        if (fileSizeStatus && fileTypeStatus && inputTitleStatus && menuSelectCategorieStatus) {

            buttonAddARealisation.removeAttribute("style")
            buttonAddARealisation.removeAttribute("disabled")

        } else {

            buttonAddARealisation.setAttribute("style", "background-color: grey; cursor: not-allowed;")
            buttonAddARealisation.setAttribute("disabled", "")
        }
    }

    let inputTitleStatusFinal = true

    inputTitleModale3.addEventListener("change", (event) => {     

            if (inputTitleModale3.value === "") {
                inputTitleStatusFinal = false
            } else {
                inputTitleStatusFinal = true
            }

            activeButtonModal3()

    })


    function activeButtonModal3() {

        if (fileSizeStatus && fileTypeStatus && inputTitleStatusFinal) {

            buttonAddARealisationFinal.removeAttribute("style")
            buttonAddARealisationFinal.removeAttribute("disabled")
        } else {

            buttonAddARealisationFinal.setAttribute("style", "background-color: grey; cursor: not-allowed;")
            buttonAddARealisationFinal.setAttribute("disabled", "")
            
        }
    }


    function realisationPreview() {

        // imgPreviewUpload

        imgTitleConfirm.value = inputTitleModale2.value

        menuSelectCategorieConfirm.removeAttribute("selected")
        menuSelectCategorieConfirm[selectedIndexMenuCategories].setAttribute("selected", "selected")

        // console.log(imgTitleConfirm.value);
        // console.log(inputTitleModale2.value);
        // console.log(menuSelectCategorie.value);
        // console.log(selectedIndexMenuCategories);

    }




    
    buttonAddARealisationFinal.addEventListener("click", (event) => {

        event.preventDefault()
        sendNewReal()

    }) 

    async function sendNewReal() {

        let token = window.sessionStorage.getItem("token")

        let categorieNumber = menuSelectCategorieConfirm.selectedIndex 
        const contentRealisation = {
            image: file[0],
            title: inputTitleModale3.value,
            category: categorieNumber
        } 
    
        const bodyToSend = JSON.stringify(contentRealisation)

        console.log(file[0]);
        console.log(bodyToSend);

        let returnApiForPushRealisation = await fetch(`http://localhost:5678/api/works`, {
                
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            "content-Type": "application/json"
        },
        body: bodyToSend
        })

        console.log(returnApiForPushRealisation);

    }
    





        


}
