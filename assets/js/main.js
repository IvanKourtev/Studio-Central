async function loadHTML(selector, file) {
    const element = document.querySelector(selector);
    if (element) {
        const basePath = window.location.pathname.includes('/teachers/') ? '../' : 
                         window.location.pathname.includes('/services/') ? '../' : '';
        const response = await fetch(basePath + file);
        const html = await response.text();
        element.innerHTML = html;
    }
}

loadHTML("header", "assets/partials/header.html");
loadHTML("footer", "assets/partials/footer.html");