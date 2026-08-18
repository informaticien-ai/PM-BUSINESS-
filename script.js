// CONFIGURATION SUPABASE
const SUPABASE_URL = "https://jchxvkrgqntkjdfwcidn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjaHh2a3JncW50a2pkZndjaWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwMjA0NTksImV4cCI6MjEwMjU5NjQ1OX0.E21zodQvz-2zQbegwEnfMZgVb18ycYTAgQO510P_Hq4";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let categories = ["Vêtements Femme","Vêtements Homme","Vêtements Enfant","Pantalon","Chemise","Boucles d'oreilles","Bague","Chaînette","Chaussures","Babouche","Chapeau"];
let fournisseurConnecteID = null;

async function showPage(id, el){
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(id === 'articles'){document.getElementById('search-bar').classList.add('show');} else {document.getElementById('search-bar').classList.remove('show');}
    document.querySelectorAll('.nav button').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('footer div').forEach(b=>b.classList.remove('active'));
    if(el) el.classList.add('active');
    
    if(id==='categories') loadCategories();
    if(id==='articles') loadArticles();
    if(id==='fournisseurs') loadFournisseurs();
}

// CHARGER LES ARTICLES
async function loadArticles(){
    let grid = document.getElementById('articles-grid'); 
    grid.innerHTML='Chargement...';
    
    const { data: articles, error } = await _supabase.from('articles').select('*');
    
    grid.innerHTML='';
    if(articles) {
        articles.forEach((a)=>{
            grid.innerHTML += `<div class="card" onclick="openPopup('${a.nom}','${a.prix}','${a.image_url}')"><img src="${a.image_url}"><h4>${a.nom}</h4><p>${a.prix}</p></div>`
        });
    }
}

function openPopup(nom, prix, img){
    document.getElementById('popup').classList.add('active');
    document.getElementById('popup-content').innerHTML = `<img src="${img}" style="width:200px;height:200px;background:#ddd;border-radius:10px;"><h2>${nom}</h2><h3 style="color:var(--rouge)">${prix}</h3>`;
}

function closePopup(){document.getElementById('popup').classList.remove('active');}

// CATEGORIES
function loadCategories(){
    let side = document.getElementById('sidebar-cat'); side.innerHTML='';
    categories.forEach((c,i)=>{side.innerHTML += `<div onclick="filterCat('${c}',this)">${c}</div>`})
    filterCat(categories[0], side.children[0]);
}

async function filterCat(cat, el){
    document.querySelectorAll('.sidebar div').forEach(d=>d.classList.remove('active'));
    el.classList.add('active');
    let grid = document.getElementById('cat-products'); grid.innerHTML='Chargement...';
    
    const { data: filtered } = await _supabase.from('articles').select('*').eq('categorie', cat);
    
    grid.innerHTML='';
    if(filtered) {
        filtered.forEach(a=>{
            grid.innerHTML += `<div class="card" onclick="openPopup('${a.nom}','${a.prix}','${a.image_url}')"><img src="${a.image_url}"><h4>${a.nom}</h4><p>${a.prix}</p></div>`
        });
    }
}

// FOURNISSEURS
function openForm(){document.getElementById('form-popup').classList.add('active');}
function closeForm(){document.getElementById('form-popup').classList.remove('active');}

async function inscription(){
    let nom = document.getElementById('nom').value;
    let tel = document.getElementById('tel').value;
    let email = document.getElementById('email').value;
    let pays = document.getElementById('pays').value;
    if(nom==="" || tel===""){alert("Remplissez au moins Nom et Téléphone");return;}

    const { error } = await _supabase.from('fournisseurs').insert([{ nom, telephone: tel, email, pays }]);
    
    if(!error) {
        alert("Inscription réussie");
        closeForm();
        loadFournisseurs();
    }
}

async function loadFournisseurs(){
    let list = document.getElementById('liste-fournisseurs'); list.innerHTML='Chargement...';
    const { data: fournisseurs } = await _supabase.from('fournisseurs').select('*');
    
    list.innerHTML='';
    if(fournisseurs) {
        fournisseurs.forEach((f)=>{
            list.innerHTML += `<div class="fournisseur" onclick="dashboardFournisseur('${f.id}', '${f.nom}')"><img><div><h3>${f.nom}</h3><p>Tel: ${f.telephone}</p></div></div>`
        })
    }
}

// DASHBOARD
async function dashboardFournisseur(id, nom){
    fournisseurConnecteID = id;
    let html = `<h3>Bonjour ${nom}</h3>
    <button class="dash-btn" onclick="openFormArticle()">+ Publier un Article</button>
    <h4 style="margin-top:20px;">Messages Clients</h4><div id="client-list">Chargement messages...</div>`;
    
    document.getElementById('popup-content').innerHTML = html;
    document.getElementById('popup').classList.add('active');

    // Récupérer les noms de clients uniques ayant envoyé un message à ce fournisseur
    const { data: msgs } = await _supabase.from('messages').select('nom_client').eq('fournisseur_id', id);
    let clientsUnique = [...new Set(msgs?.map(m => m.nom_client))];
    
    let listDiv = document.getElementById('client-list');
    listDiv.innerHTML = clientsUnique.length ? "" : "Aucun message";
    clientsUnique.forEach(client => {
        listDiv.innerHTML += `<div class="msg-client" onclick="openChatFournisseur('${id}', '${client}')">Discussion avec ${client}</div>`;
    });
}

function openFormArticle(){
    let options = categories.map(c=>`<option>${c}</option>`).join('');
    let html = `<h3>Nouvel Article</h3>
    <input type="text" id="art-nom" placeholder="Nom de l'article">
    <input type="text" id="art-prix" placeholder="Prix ex: 15000 FC">
    <select id="art-cat">${options}</select>
    <input type="text" id="art-img" placeholder="Lien de l'image">
    <button onclick="publierArticle()">Publier</button>`;
    document.getElementById('popup-content').innerHTML = html;
}

async function publierArticle(){
    let nom = document.getElementById('art-nom').value;
    let prix = document.getElementById('art-prix').value;
    let cat = document.getElementById('art-cat').value;
    let img = document.getElementById('art-img').value;

    await _supabase.from('articles').insert([{ nom, prix, categorie: cat, image_url: img, fournisseur_id: fournisseurConnecteID }]);
    alert("Article publié!");
    closePopup();
    loadArticles();
}

// CHAT
async function openChatList(){
    const { data: fournisseurs } = await _supabase.from('fournisseurs').select('*');
    let html = '<h3>Choisir un fournisseur</h3>';
    fournisseurs?.forEach((f)=>{
        html += `<div class="fournisseur" onclick="startChat('${f.id}', '${f.nom}')"><img><div><h3>${f.nom}</h3></div></div>`;
    });
    document.getElementById('popup-content').innerHTML = html;
    document.getElementById('popup').classList.add('active');
}

function startChat(id, nomFournisseur){
    let nomClient = prompt("Entrez votre nom pour commencer la discussion:");
    if(!nomClient) return;
    openChatFournisseur(id, nomClient);
}

async function openChatFournisseur(fId, clientNom){
    fournisseurConnecteID = fId;
    let html = `<h3>Discussion avec ${clientNom}</h3>
    <div id="chat-box" style="height:250px;overflow-y:auto;background:#f5f5f5;padding:10px;border-radius:10px;margin:10px 0;text-align:left;"></div>
    <input type="text" id="msg-input" placeholder="Ecrire..." style="width:70%;padding:10px;">
    <button onclick="sendMsg('${clientNom}')" style="width:25%;padding:10px;background:var(--bleu);color:white;border:none;">Envoyer</button>`;
    
    document.getElementById('popup-content').innerHTML = html;
    loadMessages(fId, clientNom);
}

async function sendMsg(clientNom){
    let msg = document.getElementById('msg-input').value;
    if(msg === "") return;
    
    await _supabase.from('messages').insert([{ 
        fournisseur_id: fournisseurConnecteID, 
        nom_client: clientNom, 
        expediteur: clientNom, // Par défaut on considère que c'est le client qui écrit ici
        contenu: msg 
    }]);
    
    document.getElementById('msg-input').value = "";
    loadMessages(fournisseurConnecteID, clientNom);
}

async function loadMessages(fId, clientNom){
    let box = document.getElementById('chat-box');
    const { data: msgs } = await _supabase.from('messages')
        .select('*')
        .eq('fournisseur_id', fId)
        .eq('nom_client', clientNom)
        .order('created_at', { ascending: true });

    box.innerHTML = "";
    msgs?.forEach(m=>{
        box.innerHTML += `<p><b>${m.expediteur}:</b> ${m.contenu}</p>`;
    });
    box.scrollTop = box.scrollHeight;
}

// Lancement initial
loadArticles();
