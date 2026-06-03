let idees = JSON.parse(
        localStorage.getItem("idees")
    ) || [];
// sauvegarde dans le localstorage
function save(){
    localStorage.setItem(
        "idees",
        JSON.stringify(idees)
    );
}

// Recuperer les données du formulaire
function getForm(form) {
    const formData = new FormData(form);
    return {
        titre: formData.get("titre"),
        // categorie: formData.get("categorie"),
        description: formData.get("description")
    };
}

// Ajouter une idee
async function addIdee(data) {
    const categorieOllama = await genericCategorie(data.titre,data.description);
    const newIdee = {
        id: Date.now(),
        titre: data.titre,
        categorie: categorieOllama,
        description: data.description,
        date :new Date().toLocaleDateString()
    }
    idees.unshift(newIdee);
    save();
}

// Afficher les cartes
function afficherCartes(data = idees) {
    const cards = document.getElementById("card");
    const total = document.getElementById("Total_idee")
    
        cards.innerHTML = data.map((idee)=>`
        <div class="bg-[#111a2e] border border-[#26324a] p-4 rounded-xl">
            <span class="text-orange-400 text-xs">
                ${idee.categorie.toUpperCase()}
            </span>

            <h3 class="font-bold mt-2">
                ${idee.titre}
            </h3>

            <p class="text-gray-400 text-sm mt-1">
                ${idee.description} \n
            </p>

            <p  class="text-gray-400 text-sm mt-1">
                ${idee.date}
            </p>
            <button class="rounded-md  px-2.5 py-1.5 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20"  onclick="editIdee(${idee.id})">
               <i class="fa-solid fa-pen text-green"></i>
            </button>
            <button command="show-modal" commandfor="dialog" class="rounded-md  px-2.5 py-1.5 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20" onclick="openDeleteModal(${idee.id})">
                <i class="fa-solid fa-trash text-red-500"></i>
            </button>
        </div>
        `).join("");

        total.textContent = idees.length;
}
//filtrer par categorie
 function filtreCategorie() {

    const boutons = document.querySelectorAll(".btn-filtre");

    boutons.forEach((btn) => {

        btn.addEventListener("click", () => {

            const valeur = btn.dataset.categorie;

            //  RESET couleur de tous les boutons
            boutons.forEach((b) => {
                b.classList.remove("bg-green", "text-black", "font-bold");
                b.classList.add("bg-[#111a2e]", "border", "border-[#26324a]");
            });

            //  ACTIVER bouton clique
            btn.classList.add("bg-green", "text-black", "font-bold");
            btn.classList.remove("bg-[#111a2e]", "border", "border-[#26324a]");

            // FILTRAGE
            if (valeur === "tout") {
                afficherCartes(idees);
            } else {
                const resultat = idees.filter(
                    (idee) =>
                        idee.categorie.toLowerCase() === valeur
                );

                afficherCartes(resultat);
            }

        });

    });

}

const input = document.getElementById('titre')
// fonction de validation du titre de l'idee
function validationTitre(){
const inputError = document.getElementById('titre-error')
    const titre = input.value.trim()
    const regex = /^[A-Za-zÀ-ÿ\s]{3,}$/;
    if(!regex.test(titre)){
        inputError.textContent="Veillez bien saisir votre idee qui a plus de 3lettres"
        inputError.style.color="red"
        input.classList.add('border-red-500')
        return false
    }

    if(/(.)\1{2,}/.test(titre)){
        inputError.textContent="Trop de caractere identique repeter"
        inputError.style.color="red"
        input.classList.add('border-red-500')
        return false
    }

    inputError.textContent=""
    input.classList.remove('border-red-500')
    input.classList.add('border-green')
    return true
}

const description = document.querySelector('textarea')

// fonction de validation de la description
function validationDescription(){
    const erreurDescription = document.getElementById('textarea-error')
    const nombreSaisi = document.getElementById('count')
    const maxlettre = 255
    const valeur = description.value.trim()

    // oblige au user de saisir
    if(valeur.length===0){
        erreurDescription.textContent="Vous devez saisir obligatoirement"
        erreurDescription.style.color="red"
        description.classList.add('border-red-500')
        return false
    }

    // evite la repetition de lettre identique
    if(/(.)\1{2,}/.test(valeur)){
        erreurDescription.textContent="Trop de caractere identique repeter"
        erreurDescription.style.color="red"
        description.classList.add('border-red-500')
        nombreSaisi.textContent=`${valeur.length} / ${maxlettre}`
        nombreSaisi.classList.add('text-white')
        return false
    }

    // evite de saisir moins de 15 caracters
    if(valeur.length < 15){
        erreurDescription.textContent="Minimum vous devez saisir plus de 15"
        erreurDescription.style.color="red"
        description.classList.add('border-red-500')
        nombreSaisi.textContent=`${valeur.length} / ${maxlettre}`
        nombreSaisi.classList.add('text-white')

        return false
    }

    // evite de saisir plus de 255 caracteres
    if(valeur.length > 255){
        erreurDescription.textContent="Oups vous avez depasse la limite de saisie"
        erreurDescription.style.color="red"
        description.classList.add('border-red-500')
        nombreSaisi.textContent=`${valeur.length} / ${maxlettre}`
        nombreSaisi.classList.remove('text-white')
        nombreSaisi.classList.add('text-red-500')

        return false
    }

    erreurDescription.textContent=""
    description.classList.remove('border-red-500')
    description.classList.add('border-green')
    nombreSaisi.textContent=`${valeur.length} / ${maxlettre}`
    nombreSaisi.classList.remove('text-red-500')
    nombreSaisi.classList.remove('text-white')
    return true
}

// validation automatique
input.addEventListener("input",validationTitre)
description.addEventListener("input", validationDescription)
// Formulaire
const btn = document.getElementById("btn")
document.getElementById("form")
.addEventListener("submit",async (e) => {

    e.preventDefault();
    const titreOk = validationTitre()
    const descriptionOk = validationDescription()

    // empeche la validation du formulaire
    if(!titreOk || !description){
        btn.textContent="verifie d'abord ton erreur"
        btn.classList.add(
        "bg-red-500",
        );
        return
    }

    const form = e.target;
    const data = getForm(form);

    btn.disabled= true
    btn.textContent="Analyse de l'idee par l'IA..."
    btn.classList.remove(
        "bg-red-500",
        );
    btn.classList.add(
    "bg-gray-500",
    "cursor-not-allowed"
);
    

    try{
    await addIdee(data)

    afficherCartes();
    form.reset();


    }
    catch (error){
        console.error(error);
    }
    finally{
        btn.disabled= false
        btn.textContent="Ajouter une idee"
        btn.classList.remove(
        "bg-red-500",
        ); 
        btn.classList.remove(
    "bg-gray-500",
    "cursor-not-allowed"
);
        btn.classList.add("bg-green")

    }

});



afficherCartes();
filtreCategorie();

// delete
let deleteId = null;
function deleteIdee(id){
    idees = idees.filter(
        idee => idee.id !== id
    );

    save();
    afficherCartes();
}
//ouvrir le modal de suppression
function openDeleteModal(id){

    deleteId = id;

    document
        .getElementById("dialog")
        .showModal();
}

function confirmDelete(){

    deleteIdee(deleteId);

    document
        .getElementById("dialog")
        .close();

    deleteId = null;
}

//update
// ouvrir modal modification
function editIdee(id){

    const idee = idees.find(
        item => item.id === id
    );

    if(!idee) return;

    document.getElementById("editId").value =idee.id;

    document.getElementById("editTitre").value =idee.titre;

    document.getElementById("editCategorie").value =idee.categorie;

    document.getElementById("editDescription").value =idee.description;

    document.getElementById("editDialog").showModal();
}


// fermer modal
function closeEditModal(){

    document.getElementById("editDialog")
        .close();
}


// sauvegarder modification
document.getElementById("editForm")
.addEventListener("submit", (e)=>{

    e.preventDefault();

    const id = Number(document.getElementById("editId").value);

    const titre =document.getElementById("editTitre").value;

    const categorie =document.getElementById("editCategorie").value;

    const description =document.getElementById("editDescription").value;

    const index = idees.findIndex(item => item.id === id);

    if(index !== -1){

        idees[index] = {
            ...idees[index],
            titre,
            categorie,
            description
        };

        save();
        afficherCartes();

        document.getElementById("editDialog").close();
    }
});

// ajouter une fonction async integrant l'ia en ligne avec la cle de OpenRouter

async function genericCategorie(titre,description) {

    const prompt =`
    Tu es un assistant de classification.
    Tu es un assistant de classification.

    Choisis UNE SEULE catégorie :

    - pedagogie 
    - campus 
    - amelioration 
    - evenement

    Réponds uniquement par :
    evenement
    pedagogie
    campus
    amelioration
    Règles :
    - Répond uniquement avec un seul mot
    - Pas d'explication
    - Pas de texte en plus

    Titre: ${titre}
    Description: ${description}
        `;

    // const reponse = await fetch("http://localhost:11434/api/generate", {
    // method: "POST",
    // headers: { "Content-Type": "application/json" },
    // body: JSON.stringify({
    //     model: "llama3.2",
    //     prompt,
    //     stream: false,
    // })
    // });

    // const cle =process.env.OPENROUTER_API_KEY;
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions",{
        method:"POST",
        headers:{
            authorization:`Bearer `,
            "content-Type":"application/json"
        },
        body:JSON.stringify({
            model:"openai/gpt-4o-mini",
            messages: [
            {
                role: "system",
                content: "Return only one word: pedagogie, campus, amelioration, evenement."
            },
            {
                role: "user",
                content: `${titre} - ${description}`
            },
            {
                    role: "user",
                    content: prompt
            }
            ],
            temperature: 0
        })
    })
     const data = await response.json();
 console.log(response.status)
    console.log(data)
    const result = data.choices[0].message.content.trim();
   
    return result;

    
}


