// Navigation du footer (Accueil, Message, À propos)
function navTo(dest, el) {
    document.querySelectorAll('.foot-link').forEach(l => l.classList.remove('active'));
    el.classList.add('active');
    
    const mainHeader = document.getElementById('main-header');
    const topNav = document.getElementById('top-nav');

    if(dest === 'message') {
        mainHeader.style.display = 'none';
        topNav.style.display = 'none';
        showPage('message-page');
    } else if(dest === 'propos') {
        mainHeader.style.display = 'none';
        topNav.style.display = 'none';
        showPage('propos-page');
    } else {
        mainHeader.style.display = 'flex';
        topNav.style.display = 'flex';
        showPage('articles'); // Revient sur articles par défaut
    }
}

// Navigation des onglets du haut (Articles, Fournisseur, Catégories)
function showTab(tabId, el) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    el.classList.add('active');
    showPage(tabId);
}

// Fonction pour afficher une page et cacher les autres
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// Fonction de paiement Airtel Money
function payer(montant) {
    alert("Redirection Airtel Money...\nMontant : " + montant + " FC\nVeuillez confirmer sur votre téléphone.");
}
