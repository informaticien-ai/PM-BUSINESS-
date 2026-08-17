// Navigation principale (Footer)
function navTo(page, element) {
    // UI Footer
    document.querySelectorAll('footer a').forEach(a => a.classList.remove('active'));
    element.classList.add('active');

    // Visibilité des Headers
    document.getElementById('header-accueil').style.display = 'none';
    document.getElementById('header-simple').style.display = 'none';
    document.getElementById('header-message').style.display = 'none';
    document.getElementById('accueil-tabs').style.display = 'none';

    // Logique des Pages
    if (page === 'accueil') {
        document.getElementById('header-accueil').style.display = 'flex';
        document.getElementById('accueil-tabs').style.display = 'block';
        showTab('articles-grid', document.querySelector('.nav-tabs a:first-child'));
    } else if (page === 'message') {
        document.getElementById('header-message').style.display = 'block';
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('page-message').classList.add('active');
    } else if (page === 'propos') {
        document.getElementById('header-simple').style.display = 'flex';
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('page-propos').classList.add('active');
    }
}

// Navigation Onglets (Articles / Fournisseur / Catégories)
function showTab(id, element) {
    // UI Tabs
    document.querySelectorAll('.nav-tabs a').forEach(a => a.classList.remove('active'));
    element.classList.add('active');

    // Headers conditionnels
    if (id === 'articles-grid') {
        document.getElementById('header-accueil').style.display = 'flex';
        document.getElementById('header-simple').style.display = 'none';
    } else {
        document.getElementById('header-accueil').style.display = 'none';
        document.getElementById('header-simple').style.display = 'flex';
    }

    // Affichage section
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}
