// Configuration Supabase
const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let idees = [];

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
    const categorieOpenrouter = await genericCategorie(data.titre,data.description);
    const newIdee = {
        titre: data.titre,
        categorie: categorieOpenrouter,
        description: data.description,
    }
    
    const { data: insertedData, error } = await supabaseClient
        .from('idees')
        .insert([newIdee])
        .select();

    if (error) throw error;
    return insertedData;
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
                ${new Date(idee.created_at).toLocaleDateString()}
            </p>
            <button class="rounded-md  px-2.5 py-1.5 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20"  onclick="editIdee(${idee.id})">
               <i class="fa-solid fa-pen text-green"></i>
            </button>
            <button command="show-modal" commandfor="dialog" class="rounded-md  px-2.5 py-1.5 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20" onclick="openDeleteModal(${idee.id})">
                <i class="fa-solid fa-trash text-red-500"></i>
            </button>
        </div>
        `).join("");

        total.textContent = data.length;
}

// Charger les données depuis Supabase
async function fetchIdees() {
    const { data, error } = await supabaseClient
        .from('idees')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) console.error("Erreur fetch:", error);
    else { idees = data; afficherCartes(idees); }
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

// Formulaire
document.getElementById("form").addEventListener("submit", async (e) => {

    e.preventDefault();

    const form = e.target;
    const bouton = document.getElementById("btnPublier");

    // désactiver le bouton
    bouton.disabled = true;

    // changer le texte
    bouton.textContent = "Publication...";

    try {

        const data = getForm(form);

        await addIdee(data);

        await fetchIdees();

        form.reset();

    } catch (e) {

        console.error(e);

    } finally {

        // réactiver le bouton
        bouton.disabled = false;

        // remettre le texte
        bouton.textContent = "Publier";
    }

});

fetchIdees();
filtreCategorie();

// delete
let deleteId = null;
async function deleteIdee(id){
    const { error } = await supabaseClient
        .from('idees')
        .delete()
        .eq('id', id);

    if (error) console.error("Erreur suppression:", error);
    await fetchIdees();
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
// bouton annuler suppression
function cancelDelete(){
    deleteId = null;

    document
        .getElementById("dialog")
        .close();
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
document.getElementById("editForm").addEventListener("submit", async (e)=>{

    e.preventDefault();

    const id = Number(document.getElementById("editId").value);

    const titre =document.getElementById("editTitre").value;

    const categorie =document.getElementById("editCategorie").value;

    const description =document.getElementById("editDescription").value;

    const { error } = await supabaseClient
        .from('idees')
        .update({ titre, categorie, description })
        .eq('id', id);

    if (error) console.error("Erreur update:", error);
    
    await fetchIdees();
    document.getElementById("editDialog").close();
});

// ajouter une fonction async integrant l'ia pour categoriser automatiquement les idees
async function genericCategorie(titre, description) {
    try {

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + (window.OPENROUTER_API_KEY || ""),
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                model: "poolside/laguna-m.1:free",

                messages: [
                    {
                        role: "system",
                        content: `
                        Tu es un assistant qui catégorise les idées étudiantes.

                        Tu dois répondre uniquement avec UNE SEULE catégorie parmi :

                        Pédagogie
                        Événement
                        Vie de campus
                        Amélioration technique

                        Réponds uniquement avec un seul mot.
                        `
                    },

                    {
                        role: "user",
                        content: `
                        Titre : ${titre}

                        Description : ${description}
`
                    }
                ]
            })
        });

        const result = await response.json();

        console.log(result);

        if (!response.ok) {
            throw new Error(result.error?.message);
        }

        const rawCategory = result.choices[0].message.content
            .trim()
            .toLowerCase();
            
        // Fallback/Nettoyage pour s'assurer que ça matche nos catégories
        if (rawCategory.includes("pédagogie") || rawCategory.includes("pedagogie")) return "pedagogie";
        if (rawCategory.includes("événement") || rawCategory.includes("evenement")) return "evenement";
        if (rawCategory.includes("campus")) return "vie de campus";
        return "amelioration";

    } catch (e) {
        console.error(e);
        return "amelioration";
    }
}
