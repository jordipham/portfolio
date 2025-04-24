import { fetchJSON, renderProjects } from '../global.js';

// IIFE to allow use of top-level await in environments that don't support it
(async () => {
  try {
    // 3. Fetching Project Data
    const projects = await fetchJSON('../lib/projects.json');

    // 4. Selecting the Projects Container
    const projectsContainer = document.querySelector('.projects');
    if (!projectsContainer) {
      throw new Error("Container with class '.projects' not found in the DOM.");
    }

    // 5. Rendering the Projects
    renderProjects(projects, projectsContainer, 'h2');

    // ✅ Update project count display
    const titleElement = document.querySelector('.projects-title');
    if (titleElement) {
      titleElement.textContent = `${projects.length} Projects`;
    }

  } catch (error) {
    console.error('Error loading or rendering projects:', error);
  }
})();
