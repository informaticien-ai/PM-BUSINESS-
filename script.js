function showHeaderNav(pageId, element) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    element.classList.add('active');
    loadHeader('simple');
}

function showFooterPage(pageId, element) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
    document.querySelectorAll('.footer-item').forEach(f => f.classList.remove('active'));
    element.classList.add('active');
    loadHeader(pageId === 'message' ? 'grand' : 'simple');
}

function loadHeader(type) {
    const headerContainer = document.getElementById('header-container');
    if(type === 'grand') {
        headerContainer.innerHTML = '';
    } else {
        headerContainer.innerHTML = `
        <header class="header-simple">
            <div class="header-top">
                <div class="logo">PM</div>
                <div class="brand-name">PM BUSINESS</div>
            </div>
            <div class="header-nav">
                <div class="nav-item active" onclick="showHeaderNav('articles', this)">Articles</div>
                <div class="nav-item" onclick="showHeaderNav('fournisseurs', this)">Fournisseurs</div>
                <div class="nav-item" onclick="showHeaderNav('categories', this)">Catégories</div>
            </div>
            <div class="search-bar">
                <input type="text" placeholder="Recherche un produit">
            </div>
        </header>`;
    }
}

// Charger le header au démarrage
window.onload = function() {
    loadHeader('simple');
};
