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

// ARTICLES
async function loadArticles(){
    let grid = document.getElementById('articles-grid'); 
    grid.innerHTML='<p style="text-align:center;width:100%;">Chargement...</p>';
    const { data: articles } = await _supabase.from('articles').select('*').order('created_at', {ascending: false});
    grid.innerHTML='';
    if(articles) {
        articles.forEach((a)=>{
            grid.innerHTML += `<div class="card" onclick="openPopup('${a.nom.replace(/'/g, "\\'")}','${a.prix}','${a.image_url}')"><img src="${a.image_url || ''}"><h4>${a.nom}</h4><p>${a.prix}</p></div>`
        });
    }
}

function openPopup(nom, prix, img){
    document.getElementById('popup').classList.add('active');
    document.getElementById('popup-content').innerHTML = `<span class="close" onclick="closePopup()">×</span><img src="${img}" style="width:100%; height:250px; border-radius:10px; object-fit: contain; margin-bottom:15px;"><h2>${nom}</h2><h3 style="color:var(--rouge); font-size:1.5rem;">${prix}</h3><button style="margin-top:20px;" onclick="closePopup()">Fermer</button>`;
}

function closePopup(){
    document.getElementById('popup').classList.remove('active'); 
    if(window.chatInterval) clearInterval(window.chatInterval);
}

// PUBLIER
function openFormArticle(){
    let options = categories.map(c=>`<option>${c}</option>`).join('');
    document.getElementById('popup-content').innerHTML = `
        <span class="close" onclick="closePopup()">×</span>
        <h3>Publier un article</h3>
        <input type="text" id="art-nom" placeholder="Nom de l'article">
        <input type="text" id="art-prix" placeholder="Prix (ex: 25000 FC)">
        <select id="art-cat">${options}</select>
        <label style="display:block; margin-bottom:5px; font-size:12px; font-weight:700;">PHOTO DE L'ARTICLE :</label>
        <input type="file" id="art-file" accept="image/*" style="padding:5px; background:none; border:none;">
        <button id="btn-publier" onclick="publierArticle()">Mettre en ligne maintenant</button>`;
}

async function publierArticle(){
    const file = document.getElementById('art-file').files[0];
    const nom = document.getElementById('art-nom').value;
    const prix = document.getElementById('art-prix').value;
    if(!file || !nom || !prix) { alert("Veuillez remplir tous les champs"); return; }
    
    document.getElementById('btn-publier').innerText = "Téléchargement...";
    document.getElementById('btn-publier').disabled = true;

    const fileName = Date.now() + "_" + file.name;
    const { data: uploadData, error: uploadError } = await _supabase.storage.from('images').upload(fileName, file);
    
    if(uploadError) { alert("Erreur : " + uploadError.message); return; }
    
    const { data: urlData } = _supabase.storage.from('images').getPublicUrl(fileName);
    await _supabase.from('articles').insert([{ nom, prix, categorie: document.getElementById('art-cat').value, image_url: urlData.publicUrl, fournisseur_id: fournisseurConnecteID }]);
    
    alert("Article en ligne !");
    closePopup();
    loadArticles();
}

// CHAT STYLE GAUCHE / DROITE
async function openChatRoom(fId, clientNom, role){
    fournisseurConnecteID = fId;
    let expediteurNom = (role === 'client') ? clientNom : "Fournisseur";
    
    document.getElementById('popup-content').innerHTML = `
        <span class="close" onclick="closePopup()">×</span>
        <h3 style="margin-bottom:10px;">Chat avec ${clientNom}</h3>
        <div id="chat-box" class="msg-container" style="height:300px; overflow-y:auto;"></div>
        <div class="chat-input-area">
            <input type="text" id="msg-input" placeholder="Ecrire un message...">
            <button onclick="envoyerMessage('${clientNom}', '${expediteurNom}')">➤</button>
        </div>`;
    
    const refreshing = () => loadMessages(fId, clientNom);
    refreshing();
    if(window.chatInterval) clearInterval(window.chatInterval);
    window.chatInterval = setInterval(refreshing, 3000);
}

async function envoyerMessage(clientNom, expediteur){
    let txt = document.getElementById('msg-input').value;
    if(!txt) return;
    await _supabase.from('messages').insert([{ fournisseur_id: fournisseurConnecteID, nom_client: clientNom, expediteur: expediteur, contenu: txt }]);
    document.getElementById('msg-input').value = "";
    loadMessages(fournisseurConnecteID, clientNom);
}

async function loadMessages(fId, clientNom){
    const { data } = await _supabase.from('messages').select('*').eq('fournisseur_id', fId).eq('nom_client', clientNom).order('created_at', { ascending: true });
    let box = document.getElementById('chat-box');
    if(box && data){
        box.innerHTML = data.map(m => {
            const isMe = (m.expediteur !== "Fournisseur"); // On simplifie pour le style
            return `<div class="msg-bubble ${isMe ? 'msg-client' : 'msg-fournisseur'}">
                <span class="msg-name">${m.expediteur}</span>
                ${m.contenu}
            </div>`;
        }).join('');
        box.scrollTop = box.scrollHeight;
    }
}

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
    
    // MASQUER LE BOUTON SI 3 FOURNISSEURS OU PLUS
    let btnInscrire = document.querySelector('.btn-inscrire');
    if (data && data.length >= 3) {
        if (btnInscrire) btnInscrire.style.display = 'none';
    } else {
        if (btnInscrire) btnInscrire.style.display = 'block';
    }

    if(data) { data.forEach((f)=>{ list.innerHTML += `<div class="fournisseur" onclick="dashboardFournisseur('${f.id}', '${f.nom.replace(/'/g, "\\'")}')"><img><div><h3>${f.nom}</h3><p>Tel: ${f.telephone}</p></div></div>` }) }
}

async function dashboardFournisseur(id, nom){
    fournisseurConnecteID = id;
    document.getElementById('popup').classList.add('active');
    document.getElementById('popup-content').innerHTML = `<span class="close" onclick="closePopup()">×</span><h3>Bonjour ${nom}</h3><button onclick="openFormArticle()">+ Publier un Article</button><h4 style="margin-top:20px;">Messages reçus</h4><div id="client-list">Chargement...</div>`;
    const { data: msgs } = await _supabase.from('messages').select('nom_client').eq('fournisseur_id', id);
    let clientsUnique = [...new Set(msgs?.map(m => m.nom_client))];
    let listDiv = document.getElementById('client-list');
    listDiv.innerHTML = (clientsUnique.length === 0) ? "Aucun message" : "";
    clientsUnique.forEach(client => { listDiv.innerHTML += `<div class="msg-client" style="align-self:flex-start; cursor:pointer; margin-top:10px;" onclick="openChatRoom('${id}', '${client}', 'fournisseur')">Discussion avec ${client}</div>`; });
}
function loadCategories(){
    let side = document.getElementById('sidebar-cat'); 
    side.innerHTML='<div onclick="filterCat(\'TOUT\',this)" class="active">TOUT</div>';
    categories.forEach((c)=>{ side.innerHTML += `<div onclick="filterCat('${c}',this)">${c}</div>`; });
    filterCat("TOUT", side.children[0]);
}
async function filterCat(cat, el){
    document.querySelectorAll('.sidebar div').forEach(d=>d.classList.remove('active'));
    if(el) el.classList.add('active');
    let grid = document.getElementById('cat-products'); grid.innerHTML='Chargement...';
    let query = _supabase.from('articles').select('*');
    if(cat !== "TOUT") query = query.eq('categorie', cat);
    const { data: filtered } = await query;
    grid.innerHTML='';
    if(filtered) { filtered.forEach(a=>{ grid.innerHTML += `<div class="card" onclick="openPopup('${a.nom.replace(/'/g, "\\'")}','${a.prix}','${a.image_url}')"><img src="${a.image_url}"><h4>${a.nom}</h4><p>${a.prix}</p></div>` }); }
}
async function openChatList(){
    document.getElementById('popup').classList.add('active');
    document.getElementById('popup-content').innerHTML = "<h3>Chargement...</h3>";
    const { data } = await _supabase.from('fournisseurs').select('*');
    let html = '<span class="close" onclick="closePopup()">×</span><h3>Choisir un vendeur</h3>';
    if(data) { data.forEach((f)=>{ html += `<div class="fournisseur" onclick="clientInitialiseChat('${f.id}', '${f.nom.replace(/'/g, "\\'")}')"><img><div><h3>${f.nom}</h3></div></div>`; }); }
    document.getElementById('popup-content').innerHTML = html;
}
function clientInitialiseChat(fId, fNom){
    let nomC = prompt("Ton nom pour discuter :");
    if(nomC) openChatRoom(fId, nomC, 'client');
}
function openForm(){document.getElementById('form-popup').classList.add('active');}
function closeForm(){document.getElementById('form-popup').classList.remove('active');}
loadArticles();
