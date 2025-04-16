// Step 1 - Lab 3
console.log("IT'S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Step 2.1 - NavLinks
const navLinks = $$("nav a");
console.log(navLinks);//verification

// Step 2.2 - Finding the current page
const currentLink = navLinks.find(a => a.host === location.host && a.pathname === location.pathname);
console.log(currentLink);//verification