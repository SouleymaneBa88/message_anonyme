// Configuration Supabase
const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let idees = [];

const CATEGORIES = {
    PEDAGOGIE: 'pedagogie',
    EVENEMENT: 'evenement',
    CAMPUS: 'vie-de-campus',
    AMELIORATION: 'amelioration'
};

// ============ FORMULAIRE ============
function getForm(form) {
    const formData = new FormData(form);
    const titre = formData.get("titre")?.toString().trim();
    const description = formData.get("description")?.toString().trim();

    if (!titre || titre.length < 5) {
        throw new Error("Le titre doit contenir au moins 5 caractères");
    }
    if (!description || description.length < 15) {
        throw new Error("La description doit contenir au moins 15 caractères");
    }

    return { titre, description };
}

// ============ VALIDATION SÉMANTIQUE ============
async function verifierSens(titre, description) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer ",
                "Content-Type": "application/json"
            },
            signal: controller.signal,
            body: JSON.stringify({
                model: "openai/gpt-oss-120b",
                messages: [
                    {
                        role: "system",
                        content: `Tu es un validateur de contenu. Réponds UNIQUEMENT avec "VALIDE" ou "INVALIDE".
                        Un texte est INVALIDE s'il est :
                        - Du charabia sans sens (ex: "ewrexer", "ssss", "abc123")
                        - Trop vague (ex: "idée", "truc", "chose")
                        - Un test évident

                        Réponds "VALIDE" seulement si le texte décrit une vraie idée/action/projet.`
                    },
                    {
                        role: "user",
                        content: `Titre: "${titre}"\nDescription: "${description}"\n\nCe texte a-t-il du sens ?`
                    }
                ]
            })
        });

        clearTimeout(timeout);

        if (!response.ok) return false;

        const result = await response.json();
        // On récupère uniquement le premier mot pour éviter les phrases explicatives de l'IA
        const reponse = result.choices[0].message.content.trim().toUpperCase().split(/\s+/)[0];
        
        // Utilisation d'une égalité stricte car "INVALIDE" contient "VALIDE"
        return reponse === "VALIDE";

    } catch (e) {
        console.error("Erreur validation:", e);
        return true;
    }
}

// ============ AJOUT IDÉE ============
async function addIdee(data) {
    const tempIdee = {
        titre: data.titre,
        categorie: 'en-attente',
        description: data.description,
    };
    
    const { data: insertedData, error } = await supabaseClient
        .from('idees')
        .insert([tempIdee])
        .select();

    if (error) throw error;

    genericCategorie(data.titre, data.description)
        .then(async (categorie) => {
            await supabaseClient
                .from('idees')
                .update({ categorie })
                .eq('id', insertedData[0].id);
            await fetchIdees();
        })
        .catch(err => {
            console.error("Erreur catégorisation:", err);
        });

    return insertedData;
}

// ============ AFFICHAGE ============
function afficherCartes(data = idees) {
    const cards = document.getElementById("card");
    const total = document.getElementById("Total_idee");

    if (!data.length) {
        cards.innerHTML = `<p class="text-gray-500 text-center col-span-full py-8">Aucune idée pour le moment</p>`;
        total.textContent = 0;
        return;
    }

    cards.innerHTML = data.map((idee) => `
        <div class="bg-[#111a2e] border border-[#26324a] p-4 rounded-xl">
            <span class="text-orange-400 text-xs font-bold">
                ${(idee.categorie || 'non-classé').toUpperCase().replace(/-/g, ' ')}
            </span>
            <h3 class="font-bold mt-2 text-white">${escapeHtml(idee.titre)}</h3>
            <p class="text-gray-400 text-sm mt-1">${escapeHtml(idee.description)}</p>
            <p class="text-gray-500 text-xs mt-2">
                ${idee.created_at ? new Date(idee.created_at).toLocaleDateString() : ''}
            </p>
            <div class="flex gap-2 mt-3">
                <button onclick="editIdee(${idee.id})" class="rounded-md px-2.5 py-1.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20">
                    Modifier
                </button>
                <button onclick="openDeleteModal(${idee.id})" class="rounded-md px-2.5 py-1.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20">
                    Supprimer
                </button>
            </div>
        </div>
    `).join("");

    total.textContent = data.length;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============ CHARGEMENT ============
async function fetchIdees() {
    const { data, error } = await supabaseClient
        .from('idees')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error("Erreur fetch:", error);
        return;
    }
    idees = data;
    afficherCartes(idees);
}

// ============ FILTRES ============
function filtreCategorie() {
    const boutons = document.querySelectorAll(".btn-filtre");

    boutons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const valeur = btn.dataset.categorie;

            boutons.forEach((b) => {
                b.classList.remove("bg-green", "text-black", "font-bold");
                b.classList.add("bg-[#111a2e]", "border", "border-[#26324a]");
            });

            btn.classList.add("bg-green", "text-black", "font-bold");
            btn.classList.remove("bg-[#111a2e]", "border", "border-[#26324a]");

            if (valeur === "tout") {
                afficherCartes(idees);
            } else {
                const resultat = idees.filter((idee) => idee.categorie === valeur);
                afficherCartes(resultat);
            }
        });
    });
}

// ============ FORMULAIRE SUBMIT ============
document.getElementById("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const bouton = document.getElementById("btnPublier");
    bouton.disabled = true;
    bouton.textContent = "Vérification...";

    try {
        const data = getForm(e.target);
        
        bouton.textContent = "Vérification IA...";
        const aDuSens = await verifierSens(data.titre, data.description);
        
        if (!aDuSens) {
            alert("Le titre ou la description n'a pas de sens. Veuillez décrire une vraie idée.");
            return; // Interrompt l'exécution pour empêcher addIdee()
        }

        bouton.textContent = "Publication...";
        await addIdee(data);
        e.target.reset();
        await fetchIdees();
        
    } catch (e) {
        alert(e.message);
        console.error(e);
    } finally {
        bouton.disabled = false;
        bouton.textContent = "Publier";
    }
});

// ============ SUPPRESSION ============
let deleteId = null;

async function deleteIdee(id) {
    const { error } = await supabaseClient
        .from('idees')
        .delete()
        .eq('id', id);

    if (error) console.error("Erreur suppression:", error);
    await fetchIdees();
}

function openDeleteModal(id) {
    deleteId = id;
    document.getElementById("dialog").showModal();
}

function confirmDelete() {
    if (deleteId) deleteIdee(deleteId);
    document.getElementById("dialog").close();
    deleteId = null;
}

function cancelDelete() {
    deleteId = null;
    document.getElementById("dialog").close();
}

// ============ MODIFICATION ============
function editIdee(id) {
    const idee = idees.find(item => item.id === id);
    if (!idee) return;

    document.getElementById("editId").value = idee.id;
    document.getElementById("editTitre").value = idee.titre;
    document.getElementById("editCategorie").value = idee.categorie;
    document.getElementById("editDescription").value = idee.description;
    document.getElementById("editDialog").showModal();
}

function closeEditModal() {
    document.getElementById("editDialog").close();
}

document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = Number(document.getElementById("editId").value);
    const titre = document.getElementById("editTitre").value.trim();
    const categorie = document.getElementById("editCategorie").value;
    const description = document.getElementById("editDescription").value.trim();

    if (!titre || !description) {
        alert("Tous les champs sont requis");
        return;
    }

    const { error } = await supabaseClient
        .from('idees')
        .update({ titre, categorie, description })
        .eq('id', id);

    if (error) console.error("Erreur update:", error);
    
    await fetchIdees();
    document.getElementById("editDialog").close();
});

// ============ IA CATÉGORISATION ============
async function genericCategorie(titre, description) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer ",
                "Content-Type": "application/json"
            },
            signal: controller.signal,
            body: JSON.stringify({
                model: "openai/gpt-oss-120b",
                messages: [
                    {
                        role: "system",
                        content: `Tu catégorises des idées étudiantes. Réponds UNIQUEMENT avec UN mot parmi: pedagogie, evenement, vie-de-campus, amelioration. Pas de ponctuation, pas d'explication.`
                    },
                    {
                        role: "user",
                        content: `Titre: ${titre}\nDescription: ${description}`
                    }
                ]
            })
        });

        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        let raw = result.choices[0].message.content
            .trim()
            .toLowerCase()
            .replace(/[.,;:!?]/g, '')
            .replace(/\s+/g, '-');

        if (raw.includes('pedagogie') || raw.includes('pédagogie')) return CATEGORIES.PEDAGOGIE;
        if (raw.includes('evenement') || raw.includes('événement') || raw.includes('event')) return CATEGORIES.EVENEMENT;
        if (raw.includes('campus') || raw.includes('vie-etudiante')) return CATEGORIES.CAMPUS;
        
        return CATEGORIES.AMELIORATION;

    } catch (e) {
        console.error("Erreur catégorisation IA:", e);
        return CATEGORIES.AMELIORATION;
    }
}
// ============ INIT ============
fetchIdees();
filtreCategorie();
