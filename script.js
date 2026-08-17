/**
 * Gère la navigation du menu du bas (Footer)
 */
function navTo(destination, element) {
    // 1. Mettre à jour l'apparence des boutons du footer
    document.querySelectorAll('.foot-link').forEach(link => link.classList.remove('active'));
    element.classList.add('active');

    // 2. Récupérer les éléments de navigation du haut
    const mainHeader = document.getElementById('main-header');
    const topNav = document.getElementById('top-nav');
    const searchBox = document.getElementById('search-box');

    // 3. Logique de changement de page
    if (destination === 'message') {
        // Mode Message : On cache tout le haut
        mainHeader.style.display = 'none';
        topNav.style.display = 'none';
        showPage('message-page');
    } 
    else if (destination === 'propos') {
        // Mode À propos : Header simple, pas d'onglets ni recherche
        mainHeader.style.display = 'flex';
        topNav.style.display = 'none';
        searchBox.style.display = 'none';
        showPage('propos-page');
    } 
    else {
        // Mode Accueil : On réaffiche tout
        mainHeader.style.display = 'flex';
        topNav.style.display = 'flex';
        searchBox.style.display = 'block';
        showPage('articles'); // Revient aux articles par défaut
        
        // Reset des onglets du haut
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.querySelector('.nav-link').classList.add('active');
    }
}

/**
 * Gère les onglets du haut (Articles, Fournisseurs, Catégories)
 */
function showTab(tabId, element) {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    element.classList.add('active');
    showPage(tabId);
}

/**
 * Fonction interne pour afficher une section spécifique
 */
function showPage(id) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) {
        target.classList.add('active');
    }
}

/**
 * Simulation de paiement Airtel Money
 */
function initierPaiement(montant) {
    const confirmation = confirm("Voulez-vous payer " + montant + " FC via Airtel Money ?");
    if (confirmation) {
        alert("Demande de paiement envoyée sur votre téléphone...\nVeuillez saisir votre code PIN Airtel Money.");
        // Ici, vous pourriez intégrer l'API de MaishaPay ou FlexPay RDC
    }
      }
