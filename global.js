// Step 1 - Lab 3
console.log("IT'S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// // Step 2 Section - Lab 3
// // Step 2.1 - array of NavLinks
// const navLinks = $$("nav a");
// console.log(navLinks);//verification

// // Step 2.2 - Finding link to the current page
// const currentLink = navLinks.find(a => a.host === location.host && a.pathname === location.pathname);
// console.log(currentLink);//verification

// // Step 2.3 - add current class to current page link
// currentLink?.classList.add('current');

// Step 3 Section - Lab 3
const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"                  // Local server
    : "/jordipham/";         // GitHub Pages repo name (CHANGE THIS IF NEEDED)

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'resume/', title: 'Resume' },
    { url: 'contact/', title: 'Contact' },
    { url: 'https://github.com/jordipham', title: 'GitHub', target: '_blank' }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    let href;

    if (!url.startsWith('http')) {
        href = BASE_PATH + url;
        if (!href.endsWith('/')) {
            href += '/';
        }
        href += 'index.html';
    } else {
        href = url; // Keep absolute URLs as they are
    }

    let targetAttribute = p.target ? ` target="${p.target}"` : '';

    // Create link and add it to nav
    nav.insertAdjacentHTML('beforeend', `<a href="${href}"${targetAttribute}>${title}</a>`);
}