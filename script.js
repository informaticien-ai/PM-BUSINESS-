const SUPABASE_URL = "https://jchxvkrgqntkjdfwcidn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjaHh2a3JncW50a2pkZndjaWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwMjA0NTksImV4cCI6MjEwMjU5NjQ1OX0.E21zodQvz-2zQbegwEnfMZgVb18ycYTAgQO510P_Hq4";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let categories = ["Vêtements Femme","Vêtements Homme","Vêtements Enfant","Pantalon","Chemise","Boucles d'oreilles","Bague","Chaînette","Chaussures","Babouche","Chapeau"];
let fournisseurConnecteID = null;
let fournisseurNomConnecte = "";

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

// ARTICLES
async function loadArticles(){
    let grid = document.getElementById('articles-grid'); 
    grid.innerHTML='<p>Chargement...</p>';
    const { data: articles, error } = await _supabase.from('articles').select('*').order('created_at', {ascending: false});
    grid.innerHTML='';
    if(articles) {
        articles.forEach((a)=>{
            grid.innerHTML += `<div class="card" onclick="openPopup('${a.nom}','${a.prix}','${a.image_url}')"><img src="${a.image_url || 'https://via.placeholder.com/150'}"><h4>${a.nom}</h4><p>${a.prix}</p></div>`
        });
    }
}

function openPopup(nom, prix, img){
    document.getElementById('popup').classList.add('active');
    document.getElementById('popup-content').innerHTML = `<img src="${img}" style="width:200px;height:200px;background:#ddd;border-radius:10px;object-fit:cover;"><h2>${nom}</h2><h3 style="color:var(--rouge)">${prix}</h3>`;
}

function closePopup(){document.getElementById('popup').classList.remove('active');}

// INSCRIPTION
async function inscription(){
    let nom = document.getElementById('nom').value;
    let tel = document.getElementById('tel').value;
    if(nom==="" || tel===""){alert("Remplissez Nom et Téléphone");return;}
    const { error } = await _supabase.from('fournisseurs').insert([{ nom, telephone: tel, email: document.getElementById('email').value, pays: document.getElementById('pays').value }]);
    if(!error) { alert("Inscription réussie"); closeForm(); loadFournisseurs(); }
}

async function loadFournisseurs(){
    let list = document.getElementById('liste-fournisseurs'); list.innerHTML='';
    const { data } = await _supabase.from('fournisseurs').select('*');
    if(data) {
        data.forEach((f)=>{
            list.innerHTML += `<div class="fournisseur" onclick="dashboardFournisseur('${f.id}', '${f.nom}')"><img><div><h3>${f.nom}</h3><p>Tel: ${f.telephone}</p></div></div>`
        })
    }
}

// DASHBOARD FOURNISSEUR
async function dashboardFournisseur(id, nom){
    fournisseurConnecteID = id;
    fournisseurNomConnecte = nom;
    document.getElementById('popup').classList.add('active');
    document.getElementById('popup-content').innerHTML = `<h3>Bonjour ${nom}</h3><button class="dash-btn" onclick="openFormArticle()">+ Publier un Article</button><h4>Messages Clients</h4><div id="client-list">Chargement...</div>`;

    const { data: msgs } = await _supabase.from('messages').select('nom_client').eq('fournisseur_id', id);
    let clientsUnique = [...new Set(msgs?.map(m => m.nom_client))];
    let listDiv = document.getElementById('client-list');
    listDiv.innerHTML = clientsUnique.length ? "" : "Aucun message";
    clientsUnique.forEach(client => {
        listDiv.innerHTML += `<div class="msg-client" onclick="openChatRoom('${id}', '${client}', 'fournisseur')">Discussion avec ${client}</div>`;
    });
}

function openFormArticle(){
    let options = categories.map(c=>`<option>${c}</option>`).join('');
    document.getElementById('popup-content').innerHTML = `<h3>Nouveau</h3><input type="text" id="art-nom" placeholder="Nom"><input type="text" id="art-prix" placeholder="Prix"><select id="art-cat">${options}</select><input type="text" id="art-img" placeholder="Lien Image"><button onclick="publierArticle()">Publier</button>`;
}

async function publierArticle(){
    const article = { nom: document.getElementById('art-nom').value, prix: document.getElementById('art-prix').value, categorie: document.getElementById('art-cat').value, image_url: document.getElementById('art-img').value, fournisseur_id: fournisseurConnecteID };
    const { error } = await _supabase.from('articles').insert([article]);
    if(!error){ alert("Publié !"); closePopup(); loadArticles(); }
}

// SYSTÈME DE CHAT AMÉLIORÉ
async function openChatList(){
    const { data } = await _supabase.from('fournisseurs').select('*');
    let html = '<h3>Choisir un fournisseur</h3>';
    data?.forEach((f)=>{ html += `<div class="fournisseur" onclick="clientInitialiseChat('${f.id}', '${f.nom}')"><img><div><h3>${f.nom}</h3></div></div>`; });
    document.getElementById('popup-content').innerHTML = html;
    document.getElementById('popup').classList.add('active');
}

function clientInitialiseChat(fId, fNom){
    let nomC = prompt("Ton nom :");
    if(nomC) openChatRoom(fId, nomC, 'client');
}

async function openChatRoom(fId, clientNom, role){
    fournisseurConnecteID = fId;
    let expediteurNom = (role === 'client') ? clientNom : "Fournisseur";
    
    document.getElementById('popup-content').innerHTML = `<h3>Chat: ${clientNom}</h3><div id="chat-box" style="height:250px;overflow-y:auto;background:#eee;padding:10px;margin:10px 0;border-radius:10px;"></div><input type="text" id="msg-input" placeholder="Message..."><button onclick="envoyerMessage('${clientNom}', '${expediteurNom}')">Envoyer</button>`;
    
    loadMessages(fId, clientNom);
    // Rafraichir les messages toutes les 3 secondes
    if(window.chatInterval) clearInterval(window.chatInterval);
    window.chatInterval = setInterval(() => loadMessages(fId, clientNom), 3000);
}

async function envoyerMessage(clientNom, expediteur){
    let txt = document.getElementById('msg-input').value;
    if(!txt) return;
    const { error } = await _supabase.from('messages').insert([{ fournisseur_id: fournisseurConnecteID, nom_client: clientNom, expediteur: expediteur, contenu: txt }]);
    if(!error){ document.getElementById('msg-input').value = ""; loadMessages(fournisseurConnecteID, clientNom); }
}

async function loadMessages(fId, clientNom){
    const { data } = await _supabase.from('messages').select('*').eq('fournisseur_id', fId).eq('nom_client', clientNom).order('created_at', { ascending: true });
    let box = document.getElementById('chat-box');
    if(box && data){
        box.innerHTML = data.map(m => `<p style="margin-bottom:5px;"><b>${m.expediteur}:</b> ${m.contenu}</p>`).join('');
        box.scrollTop = box.scrollHeight;
    }
}

function openForm(){document.getElementById('form-popup').classList.add('active');}
function closeForm(){document.getElementById('form-popup').classList.remove('active');}

loadArticles();
