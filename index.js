import { fetchJSON, renderProjects } from './global.js';

async function displayLatestProjects() {
  const projects = await fetchJSON('./lib/projects.json');
  const latestProjects = projects.slice(0, 3);
  const projectsContainer = document.querySelector('.projects');

  if (latestProjects && Array.isArray(latestProjects) && projectsContainer) {
    renderProjects(latestProjects, projectsContainer, 'h2');
  } else {
    console.error('Error: Latest project data is not an array or is empty, or container not found.');
    if (projectsContainer) {
      projectsContainer.textContent = 'No latest projects available.';
    }
  }
}

displayLatestProjects();
