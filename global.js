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
    : "/portfolio/";         // GitHub Pages repo name

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

    url = !url.startsWith('http') ? BASE_PATH + url : url;

    let targetAttribute = p.target ? ` target="${p.target}"` : '';

    // Create link and add it to nav
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);

    // Highlight the current page
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }

    // Open external links in a new tab
    if (p.target === '_blank') {
        a.target = '_blank';
    }

    // Append the <a> element to the <nav>
    nav.append(a);
}

// Step 4 - Light Dark Modes
document.body.insertAdjacentHTML(
    'afterbegin',
    `
        <div class="color-scheme">
            <label for="theme-select">Theme:</label>
            <select id="theme-select">
                <option value="light dark">Automatic</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
        </div>`,
  );

const themeSelect = document.querySelector('#theme-select');

function setColorScheme(scheme) {
  document.documentElement.style.setProperty('color-scheme', scheme);
  localStorage.setItem('colorScheme', scheme);
}

themeSelect.addEventListener('input', function(event) {
  setColorScheme(event.target.value);
});

const storedColorScheme = localStorage.getItem('colorScheme');
if (storedColorScheme) {
  setColorScheme(storedColorScheme);
  // Update the select dropdown to reflect the loaded preference
  themeSelect.value = storedColorScheme;
}

// Step 5: Better contact form
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form'); // Using the variable name "form" as in the directions

    form?.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const email = 'jop037@ucsd.edu';
        const data = new FormData(form); // Using the variable name "data" as in the directions
        let params = [];

        for (let [name, value] of data) {
            params.push(`${name}=${encodeURIComponent(value)}`);
            console.log(name, value); // See what's being submitted (unencoded)
            console.log(name, encodeURIComponent(value)); // See the encoded value
        }

        const url = `mailto:${email}?${params.join('&')}`; // Using the variable name "url" as in the directions
        location.href = url; // Using location.href as in the directions
    });
});