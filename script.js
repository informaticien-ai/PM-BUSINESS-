// CONFIGURATION SUPABASE
const SUPABASE_URL = 'https://TON_URL_ICI.supabase.co';
const SUPABASE_KEY = 'TON_ANON_KEY_ICI';
const supabase = supabasejs.createClient(SUPABASE_URL, SUPABASE_KEY);

// Gérer la navigation
function showFooterPage(pageId, element) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
    document.querySelectorAll('.footer-item').forEach(f => f.classList.remove('active'));
    element.classList.add('active');
}

// Preview de la photo lors du choix
document.getElementById('f-photo').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            document.getElementById('photo-preview').innerHTML = `<img src="${event.target.result}">`;
        }
        reader.readAsDataURL(file);
    }
});

// INSCRIPTION FOURNISSEUR (Upload photo + Sauvegarde SQL)
document.getElementById('form-add-supplier').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = "Inscription en cours...";
    btn.disabled = true;

    const photoFile = document.getElementById('f-photo').files[0];
    const fileName = `${Date.now()}_${photoFile.name}`;

    // 1. Upload de la photo dans le Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('supplier_photos')
        .upload(fileName, photoFile);

    if (uploadError) return alert("Erreur photo: " + uploadError.message);

    // Récupérer l'URL publique de la photo
    const photoUrl = supabase.storage.from('supplier_photos').getPublicUrl(fileName).data.publicUrl;

    // 2. Sauvegarde des données dans la table 'suppliers'
    const supplierData = {
        last_name: document.getElementById('f-nom').value,
        post_name: document.getElementById('f-postnom').value,
        first_name: document.getElementById('f-prenom').value,
        phone: document.getElementById('f-phone').value,
        email: document.getElementById('f-email').value,
        country: document.getElementById('f-pays').value,
        photo_url: photoUrl
    };

    const { error: dbError } = await supabase.from('suppliers').insert([supplierData]);

    if (dbError) {
        alert("Erreur base de données: " + dbError.message);
    } else {
        alert("Félicitations ! Vous êtes inscrit.");
        location.reload();
    }
});

// CHARGER ET AFFICHER LES FOURNISSEURS
async function fetchSuppliers() {
    const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });

    if (data) {
        const list = document.getElementById('suppliers-list');
        list.innerHTML = data.map(f => `
            <div class="fournisseur-card">
                <div class="fournisseur-photo">
                    <img src="${f.photo_url || 'https://via.placeholder.com/100'}">
                </div>
                <div class="fournisseur-info">
                    <p class="nom-complet">${f.last_name} ${f.post_name}</p>
                    <p><strong>Prénom:</strong> ${f.first_name}</p>
                    <p><strong>Tel:</strong> ${f.phone}</p>
                    <p><strong>Pays:</strong> ${f.country}</p>
                    <p><strong>Email:</strong> ${f.email}</p>
                </div>
            </div>
        `).join('');
    }
}

window.onload = fetchSuppliers;
