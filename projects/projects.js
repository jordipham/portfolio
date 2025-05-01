// importing functions
import { fetchJSON, renderProjects } from '../global.js';
// importing d3
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

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

document.addEventListener('DOMContentLoaded', () => {
  // Select the SVG element using its ID
  const svg = d3.select('#projects-pie-plot');

  // Create the arc generator AND generate the path data in one step
  const arcPath = d3.arc()
    .innerRadius(0)
    .outerRadius(50)({
      startAngle: 0,
      endAngle: 2 * Math.PI,
    });

  // Append the path to the SVG and set its attributes
  svg.append('path')
     .attr('d', arcPath)
     .attr('fill', 'red');

  // static <path> element from your index.html is removed/commented out
});
