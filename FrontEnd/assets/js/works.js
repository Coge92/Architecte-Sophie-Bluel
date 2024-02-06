console.log("Hello Works ! ");

const galleryContainer = document.querySelector(".gallery") // Recup du parent Div Class Gallery



const works = await fetch("http://localhost:5678/api/works").then(response => response.json())

for (let i = 0 ; i < works.length ; i++ ) {

    let newImage = document.createElement("img") // Création de l'HTML Element img
    newImage.src = `${works[i].imageUrl}` // ajout de la source de l'img
    newImage.alt = `${works[i].title}` // ajout de l'attribut alt

    let newFigCaption = document.createElement("figcaption") // Création de l'HTML Element Figcaption
    newFigCaption.innerText = `${works[i].title}` // ajout du texte dans la balise figcaption


    let newFigure = document.createElement("figure") // Création de l'HTML Element figure
    newFigure.id = `${works[i].id}`
    newFigure.appendChild(newImage) // ajout de l'enfant img à figure
    newFigure.appendChild(newFigCaption) // ajout de figcaption à figure
    galleryContainer.appendChild(newFigure) // ajout de figure au parent Div Class Gallery
    
    

}




    





