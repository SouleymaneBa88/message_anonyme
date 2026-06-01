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
        categorie: formData.get("categorie"),
        description: formData.get("description")
    };
}

// Ajouter une idee
function addIdee(data) {
    const newIdee = {
        id: Date.now(),
        titre: data.titre,
        categorie: data.categorie,
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
                ${idee.categorie}
            </span>

            <h3 class="font-bold mt-2">
                ${idee.titre}
            </h3>

            <p class="text-gray-400 text-sm mt-1">
                ${idee.description} \n
            </p>

            <p  class="text-gray-400 text-sm mt-1>
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
filtreCategorie()

// Afficher tableau dans console (test)
// function showIdees() {
//     console.log("Tableau des idées :", idees);
// }

// Formulaire
document.getElementById("form")
.addEventListener("submit", (e) => {

    e.preventDefault();

    const form = e.target;
    const data = getForm(form);

    addIdee(data)

    afficherCartes();

    form.reset();
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