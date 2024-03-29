
const form = document.querySelector("form")
const userField = document.getElementById("email")
const passwordField = document.getElementById("password")

const alertFormatEmail = document.createElement("p")
const alertFormatPassword = document.createElement("p")
const alertUserOrPassword = document.createElement("p")

userField.addEventListener("change", () => {
    verifierChampEmail(userField)
})

passwordField.addEventListener("change", () => {
    verifierChampPassword(passwordField)
})

form.addEventListener("submit", async (event) => {
    event.preventDefault()
    verifierChampEmail(userField)
    verifierChampPassword(passwordField)

    if (verifierChampEmail(userField) && verifierChampPassword(passwordField)) {

        connectionUser(userField, passwordField)
    } 
    // } else {
    //  console.log(`TEST EMAIL : ${verifierChampEmail(userField)} // TEST MDP : ${verifierChampPassword(passwordField)}` );
    // }
})

function verifierChampEmail(champ) {

    let regex = new RegExp("^[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+$")

    if (champ.value === "") { // si le champ est null

        champ.classList.add("error") // ajout de la class error (border rouge)
        champ.classList.remove("valide") // suppression de la class valide (border vert)

        if (alertFormatEmail.parentNode) { // si alertFormat (balise <p>) a deja été ajoutée à son parent (userfield) == il y a deja une balise <p>
            alertFormatEmail.parentNode.removeChild(alertFormatEmail) // alors supprimer alertFormat (balise <p>) car sinon il y a doublon (deux balises qui s'affiche)
            ajoutMessageAlertEmail(champ) // puis ajouter la balise p avec le contenu "format invalide"
        } else {
            ajoutMessageAlertEmail(champ) // sinon ajouter la balise p avec le contenu "format invalide"
        }

        return false

        } else if (regex.test(champ.value)) {

            champ.classList.add("valide") 
            champ.classList.remove("error")

            if (alertFormatEmail.parentNode) {
                alertFormatEmail.parentNode.removeChild(alertFormatEmail)
            }
            //console.log("test ok champ regex ");
            return true
        
        } else {

            champ.classList.add("error") // ajout de la class error (border rouge)
            champ.classList.remove("valide") // suppression de la class valide (border vert)

            // console.log("test email mauvais champ regex");

            if (alertFormatEmail.parentNode) { // si alertFormat (balise <p>) a deja été ajoutée à son parent (passwordFiled) == il y a deja une balise <p>
                alertFormatEmail.parentNode.removeChild(alertFormatEmail) // alors supprimer alertFormat (balise <p>) car sinon il y a doublon (deux balises qui s'affiche)
                ajoutMessageAlertEmail(champ) // puis ajouter la balise p avec le contenu "format invalide"
            } else {
                ajoutMessageAlertEmail(champ) // sinon ajouter la balise p avec le contenu "format invalide"
            }
            return false
        }

    function ajoutMessageAlertEmail(champ) {

            alertFormatEmail.innerHTML = `Format Email invalide`
            champ.insertAdjacentElement("afterend", alertFormatEmail) 
    }
}

function verifierChampPassword(champ) {

    if (champ.value === "") { // si le champ est null

        champ.classList.add("error") // ajout de la class error (border rouge)
        champ.classList.remove("valide") // suppression de la class valide (border vert)

        if (alertFormatPassword.parentNode) { // si alertFormat (balise <p>) a deja été ajoutée à son parent (userfield) == il y a deja une balise <p>
            alertFormatPassword.parentNode.removeChild(alertFormatPassword) // alors supprimer alertFormat (balise <p>) car sinon il y a doublon (deux balises qui s'affiche)
            ajoutMessageAlertPassword(champ) // puis ajouter la balise p avec le contenu "format invalide"
        } else {
            ajoutMessageAlertPassword(champ) // sinon ajouter la balise p avec le contenu "format invalide"
        }
        return false

    } else {

        champ.classList.add("valide") 
        champ.classList.remove("error")

        if (alertFormatPassword.parentNode) {
            alertFormatPassword.parentNode.removeChild(alertFormatPassword)
        }
        // console.log("test ok mot de passe non vide ");
        return true
    }

    function ajoutMessageAlertPassword(champ) {

        alertFormatPassword.innerHTML = `Veuillez renseigner un mot de passe`
        champ.insertAdjacentElement("afterend", alertFormatPassword)
    }
}

async function connectionUser(userField, passwordField) {

    const loginForm = {
        email: userField.value,
        password: passwordField.value
    } 

    const login = JSON.stringify(loginForm)

    const reponse = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {"content-Type": "application/json"},
    body: login
    })

    let reponseObjetJS = await reponse.json()
    let messageLogin = `Erreur dans l\’identifiant ou le mot de passe`

    if (reponse.status === 404) {  
        ajoutMessageAlertUserOrPassword(messageLogin)

    } else if (reponse.status === 401) { 
        ajoutMessageAlertUserOrPassword(messageLogin)

    } else if (reponse.status === 200) { 
        messageLogin = ""
        ajoutMessageAlertUserOrPassword(messageLogin)
        let tokenUser = reponseObjetJS.token
        sessionTokenised(tokenUser)
        
    } else { 
        ajoutMessageAlertUserOrPassword(messageLogin)
    }
}

async function ajoutMessageAlertUserOrPassword(messageLogin) {

    alertUserOrPassword.innerHTML = messageLogin
    form.insertAdjacentElement("afterend", alertUserOrPassword)
    alertUserOrPassword.setAttribute("style", "color: red;")
}

function sessionTokenised(token) {

    window.sessionStorage.setItem("token", token)
    document.location.href="./index.html"
}




