function navTo(pageId, element) {
    document.querySelectorAll('.footer-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    
    const hAccueil = document.getElementById('header-accueil');
    const hSimple = document.getElementById('header-simple');
    const hGrand = document.getElementById('header-grand');
    const navCont = document.getElementById('accueil-nav-container');

    if(pageId === 'accueil') {
        document.getElementById('page-accueil').classList.add('active');
        hAccueil.style.display = 'flex';
        hSimple.style.display = 'none';
        hGrand.style.display = 'none';
        navCont.style.display = 'block';
    } else if(pageId === 'message') {
        document.getElementById('page-message').classList.add('active');
        hAccueil.style.display = 'none';
        hSimple.style.display = 'none';
        hGrand.style.display = 'block';
        navCont.style.display = 'none';
    } else if(pageId === 'propos') {
        document.getElementById('page-propos').classList.add('active');
        hAccueil.style.display = 'none';
        hSimple.style.display = 'flex';
        hGrand.style.display = 'none';
        navCont.style.display = 'none';
    }
}

function switchTab(tabId, element) {
    document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
    element.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    const hAccueil = document.getElementById('header-accueil');
    const hSimple = document.getElementById('header-simple');
    if(tabId === 'accueil-grid') {
        hAccueil.style.display = 'flex';
        hSimple.style.display = 'none';
    } else {
        hAccueil.style.display = 'none';
        hSimple.style.display = 'flex';
    }
}
