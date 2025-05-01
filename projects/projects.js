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


// working with D3 pie chart - Lab 5
document.addEventListener('DOMContentLoaded', () => {
  // Select the SVG element
  const svg = d3.select('#projects-pie-plot');

  // Our data (two slices)
  let data = [1, 2, 3, 4, 5, 5];

  // Create the pie generator
  const pieGenerator = d3.pie();

  // Generate the arc data using d3.pie()
  const arcData = pieGenerator(data);

  // Create the arc generator
  const arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(50);

// Create a D3 ordinal color scale
const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

// Generate the paths for each slice
let arcs = arcData.map((d) => arcGenerator(d));

// Append paths for each slice and use the color scale
arcs.forEach((arc, idx) => {
  svg.append('path')
    .attr('d', arc)
    .attr('fill', colorScale(idx)); // Use the color scale function
  });
});
