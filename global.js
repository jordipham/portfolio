// Step 1 - Lab 3
console.log("IT'S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Step 2 Section
// Step 2.1 - array of NavLinks
const navLinks = $$("nav a");
console.log(navLinks);//verification

// Step 2.2 - Finding link to the current page
const currentLink = navLinks.find(a => a.host === location.host && a.pathname === location.pathname);
console.log(currentLink);//verification

// Step 2.3 - add current class to current page link
currentLink?.classList.add('current');