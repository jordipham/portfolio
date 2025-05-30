// first three projects to home page
import { fetchJSON, renderProjects, fetchGitHubData } from "./global.js";

async function displayLatestProjects() {
  const projects = await fetchJSON("./lib/projects.json");
  const latestProjects = projects.slice(0, 3);
  const projectsContainer = document.querySelector(".projects");

  if (latestProjects && Array.isArray(latestProjects) && projectsContainer) {
    renderProjects(latestProjects, projectsContainer, "h2");
  } else {
    console.error(
      "Error: Latest project data is not an array or is empty, or container not found."
    );
    if (projectsContainer) {
      projectsContainer.textContent = "No latest projects available.";
    }
  }
}

// github stats OG
async function displayGithubStats() {
  const profileStats = document.querySelector("#profile-stats");
  if (profileStats) {
    try {
      const githubData = await fetchGitHubData("jordipham");
      profileStats.innerHTML = `
          <h3>My GitHub Stats</h3>
          <div class="github-stats-grid">
              <div class="stat-item">
                  <div class="stat-label">FOLLOWERS</div>
                  <div class="stat-value">${githubData.followers}</div>
              </div>
              <div class="stat-item">
                  <div class="stat-label">FOLLOWING</div>
                  <div class="stat-value">${githubData.following}</div>
              </div>
              <div class="stat-item">
                  <div class="stat-label">PUBLIC REPOS</div>
                  <div class="stat-value">${githubData.public_repos}</div>
              </div>
              <div class="stat-item">
                  <div class="stat-label">PUBLIC GISTS</div>
                  <div class="stat-value">${githubData.public_gists}</div>
              </div>
          </div>
        `;
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
      profileStats.innerHTML = `
          <h3>My GitHub Stats</h3>
          <p class="error">Failed to load GitHub stats.</p>
        `;
    }
  }
}

// tester div dropdown for github stats
// async function displayGithubStats() {
//     const profileStatsDiv = document.querySelector('#profile-stats');
//     const statsContentDiv = profileStatsDiv.querySelector('.stats-content');

//     if (statsContentDiv) {
//         try {
//             const githubData = await fetchGitHubData('jordipham');
//             statsContentDiv.innerHTML = `
//                 <div class="github-stats-grid">
//                     <div class="stat-item">
//                         <div class="stat-label">FOLLOWERS</div>
//                         <div class="stat-value">${githubData.followers}</div>
//                     </div>
//                     <div class="stat-item">
//                         <div class="stat-label">FOLLOWING</div>
//                         <div class="stat-value">${githubData.following}</div>
//                     </div>
//                     <div class="stat-item">
//                         <div class="stat-label">PUBLIC REPOS</div>
//                         <div class="stat-value">${githubData.public_repos}</div>
//                     </div>
//                     <div class="stat-item">
//                         <div class="stat-label">PUBLIC GISTS</div>
//                         <div class="stat-value">${githubData.public_gists}</div>
//                     </div>
//                 </div>
//             `;
//         } catch (error) {
//             console.error('Error fetching GitHub data:', error);
//             statsContentDiv.innerHTML = `<p class="error">Failed to load GitHub stats.</p>`;
//         }
//     }
// }

displayLatestProjects();
displayGithubStats();
