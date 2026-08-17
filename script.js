document.addEventListener('DOMContentLoaded', function() {
    
    // Sélection des éléments
    const btnArticles = document.getElementById('tab-articles-btn');
    const btnAccueil = document.getElementById('btn-footer-accueil');
    
    const headerHome = document.getElementById('header-home');
    const headerArticles = document.getElementById('header-articles');
    const navTabs = document.querySelector('.nav-tabs');
    const separator = document.querySelector('.separator');
    
    const viewHome = document.getElementById('view-home');
    const viewArticles = document.getElementById('view-articles');
    const contentArea = document.querySelector('.content');

    // Fonction pour afficher la page Articles
    btnArticles.addEventListener('click', function(e) {
        e.preventDefault();

        // 1. Cacher le header accueil et montrer le header simple
        headerHome.classList.add('hidden');
        headerArticles.classList.remove('hidden');

        // 2. Cacher les onglets et le séparateur (comme sur ton design Articles)
        navTabs.classList.add('hidden');
        separator.classList.add('hidden');

        // 3. Basculer le contenu
        viewHome.classList.add('hidden');
        viewArticles.classList.remove('hidden');

        // 4. Ajuster le padding du contenu (car le header simple est moins haut)
        contentArea.style.paddingTop = "80px";
    });

    // Optionnel : Retour à l'accueil via le footer
    btnAccueil.addEventListener('click', function(e) {
        e.preventDefault();
        headerHome.classList.remove('hidden');
        headerArticles.classList.add('hidden');
        navTabs.classList.remove('hidden');
        separator.classList.remove('hidden');
        viewHome.classList.remove('hidden');
        viewArticles.classList.add('hidden');
        contentArea.style.paddingTop = "140px";
    });
});
