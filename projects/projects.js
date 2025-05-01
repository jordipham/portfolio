// importing functions
import { fetchJSON, renderProjects } from '../global.js';
// importing d3
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// declarations
let query = '';
let allProjects = [];

(async () => {
  try {
    // Fetch project data
    allProjects = await fetchJSON('../lib/projects.json');
    let projects = allProjects;  // initial render uses full list

    // Render project cards
    const projectsContainer = document.querySelector('.projects');
    if (!projectsContainer) throw new Error("'.projects' container not found.");
    renderProjects(projects, projectsContainer, 'h2');

    // Set project count title
    const titleElement = document.querySelector('.projects-title');
    if (titleElement) titleElement.textContent = `${projects.length} Projects`;

    // ========== D3 PIE CHART LOGIC ==========
    // Function to update pie chart and legend
    const updatePieChart = (projects) => {
      // Roll up project data by year
      let rolledData = d3.rollups(
        projects,
        v => v.length,
        (d) => String(d.year)
      );

      // Convert to array of { label, value } objects
      let data = rolledData.map(([year, count]) => ({
        label: year,
        value: count
      }));

      data.sort((a, b) => +a.label - +b.label);

      // Set up SVG
      const svg = d3.select('#projects-pie-plot');
      svg.selectAll('*').remove(); // Clear previous chart

      const sliceGenerator = d3.pie().value(d => d.value);
      const arcData = sliceGenerator(data);

      const arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(50);

      const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

      // Draw pie slices
      svg.selectAll('path')
        .data(arcData)
        .enter().append('path')
        .attr('d', arcGenerator)
        .attr('fill', (d, i) => colorScale(i));

      // Update legend
      const legend = d3.select('.legend');
      legend.selectAll('*').remove(); // Clear previous legend

      data.forEach((d, i) => {
        legend.append('li')
          .attr('class', 'legend-item')
          .attr('style', `--color:${colorScale(i)}`)
          .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
      });
    };

    // Initial pie chart render
    updatePieChart(projects);

    // Set up search input
    const searchInput = document.querySelector('.searchBar');
    if (searchInput) {
      searchInput.addEventListener('input', (event) => {
        query = event.target.value.toLowerCase();
    
        // Search across all metadata
        let filteredProjects = allProjects.filter((project) => {
          let values = Object.values(project).join('\n').toLowerCase();
          return values.includes(query);
        });
    
        // Re-render filtered project cards
        renderProjects(filteredProjects, document.querySelector('.projects'), 'h2');
    
        // Update project count
        const titleElement = document.querySelector('.projects-title');
        if (titleElement) {
          titleElement.textContent = `${filteredProjects.length} Projects`;
        }

        // Update pie chart and legend dynamically
        updatePieChart(filteredProjects);
      });
    }
  } catch (error) {
    console.error('Error loading or rendering projects:', error);
  }
})();
