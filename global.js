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
const BASE_PATH =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "/" // Local server
    : "/portfolio/"; // GitHub Pages repo name

let pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "resume/", title: "Resume" },
  { url: "meta/", title: "Meta" },
  { url: "contact/", title: "Contact" },
  { url: "https://github.com/jordipham", title: "GitHub", target: "_blank" },
];

let nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  url = !url.startsWith("http") ? BASE_PATH + url : url;

  let targetAttribute = p.target ? ` target="${p.target}"` : "";

  // Create link and add it to nav
  let a = document.createElement("a");
  a.href = url;
  a.textContent = title;
  nav.append(a);

  // Highlight the current page
  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add("current");
  }

  // Open external links in a new tab
  if (p.target === "_blank") {
    a.target = "_blank";
  }

  // Append the <a> element to the <nav>
  nav.append(a);
}

// Step 4 - Light Dark Modes
document.body.insertAdjacentHTML(
  "afterbegin",
  `
        <div class="color-scheme">
            <label for="theme-select">Theme:</label>
            <select id="theme-select">
                <option value="light dark">Automatic</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
        </div>`
);

const themeSelect = document.querySelector("#theme-select");

function setColorScheme(scheme) {
  document.documentElement.style.setProperty("color-scheme", scheme);
  localStorage.setItem("colorScheme", scheme);

  // ✅ Add this to toggle 'dark' or 'light' class on <html>
  document.documentElement.classList.remove("light", "dark");
  if (scheme === "light" || scheme === "dark") {
    document.documentElement.classList.add(scheme);
  }
}

themeSelect.addEventListener("input", function (event) {
  setColorScheme(event.target.value);
});

const storedColorScheme = localStorage.getItem("colorScheme");
if (storedColorScheme) {
  setColorScheme(storedColorScheme);
  // Update the select dropdown to reflect the loaded preference
  themeSelect.value = storedColorScheme;
}

// Step 5: Better contact form
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form"); // Using the variable name "form" as in the directions

  form?.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const email = "jop037@ucsd.edu";
    const data = new FormData(form); // Using the variable name "data" as in the directions
    let params = [];

    for (let [name, value] of data) {
      params.push(`${name}=${encodeURIComponent(value)}`);
      console.log(name, value); // See what's being submitted (unencoded)
      console.log(name, encodeURIComponent(value)); // See the encoded value
    }

    const url = `mailto:${email}?${params.join("&")}`; // Using the variable name "url" as in the directions
    location.href = url; // Using location.href as in the directions
  });
});

// Step 1.2 for Lab 4
export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);

    // 2. Handling Errors
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    console.log(response); // Inspect the response in dev tools

    // 3. Parsing the Data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching or parsing JSON data:", error);
  }
}

// Step 1.4 for Lab 4
export function renderProjects(
  projects,
  containerElement,
  headingLevel = "h2"
) {
  // Validate the container element
  if (!(containerElement instanceof HTMLElement)) {
    console.error("Invalid containerElement provided to renderProjects");
    return;
  }

  // Validate the heading level to be h1 through h6 only
  const validHeadings = ["h1", "h2", "h3", "h4", "h5", "h6"];
  const headingTag = validHeadings.includes(headingLevel.toLowerCase())
    ? headingLevel.toLowerCase()
    : "h2";

  // Clear existing content
  containerElement.innerHTML = "";

  // Handle empty project array
  if (!Array.isArray(projects) || projects.length === 0) {
    containerElement.innerHTML =
      "<p>No projects available at the moment. Check back later!</p>";
    return;
  }

  // Loop through projects and render each one
  projects.forEach((project) => {
    const article = document.createElement("article");

    // Create elements dynamically
    const heading = document.createElement(headingTag);
    heading.textContent = project.title || "Untitled Project";

    const img = document.createElement("img");
    img.src = project.image || "https://via.placeholder.com/150";
    img.alt = project.title || "Project image";

    const desc = document.createElement("p");
    desc.textContent = project.description || "No description provided.";

    // const link = document.createElement("a");
    // link.href = project.link || "#";
    // link.textContent = project.linktext || "N/A";
    // link.target = "_blank"; // Open in a new tab

    // Adding in year element (Lab 5)
    const yearElement = document.createElement("p"); // Using a <p> tag for the year
    yearElement.textContent = `Year: ${project.year || "N/A"}`;
    yearElement.classList.add("project-year");

    // Div to wrap year and project desc (Lab 5)
    const textWrapper = document.createElement("div");
    textWrapper.classList.add("project-text-content");

    // Adding year and desc to text wrapper (Lab 5)
    textWrapper.appendChild(desc);

    // Only create link if project.link is not blank and then add to text wrapper
    if (project.link && project.link.trim() !== "") {
      const link = document.createElement("a");
      link.href = project.link;
      link.textContent = project.linktext || "View Project";
      link.target = "_blank"; // Open in a new tab
      textWrapper.appendChild(link);
    }

    textWrapper.appendChild(yearElement);

    // Append elements to the article
    article.appendChild(heading);
    article.appendChild(img);
    // article.appendChild(desc);
    // article.appendChild(yearElement);
    article.appendChild(textWrapper); // contains desc and year

    // Append article to the container
    containerElement.appendChild(article);
  });
}

// Github API - lab 4
export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}
