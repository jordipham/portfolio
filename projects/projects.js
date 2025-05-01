// importing functions
import { fetchJSON, renderProjects } from '../global.js';
// importing d3
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// declarations
let query = '';
let allProjects = [];
let selectedIndex = -1; // No slice is selected by default

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

      // Draw pie slices with click selection
      arcData.forEach((arc, i) => {
        const path = svg
          .append('path')
          .attr('d', arcGenerator(arc))
          .attr('fill', () => {
            // Brighten the selected wedge instead of using a fixed color
            return i === selectedIndex
              ? d3.color(colorScale(i)).brighter(1.5)
              : colorScale(i);
          })
          .style('cursor', 'pointer')  // Make the pie slice clickable
          .on('click', () => {
            // Toggle selectedIndex when a slice is clicked
            selectedIndex = (selectedIndex === i) ? -1 : i;
            updatePieChart(projects); // re-render with updated selection

            // Add or remove the 'selected' class to the clicked slice
            path.classed('selected', selectedIndex === i);
          });
      });

      // Update legend
      const legend = d3.select('.legend');
      legend.selectAll('*').remove(); // Clear previous legend

      data.forEach((d, i) => {
        const displayColor = i === selectedIndex
          ? d3.color(colorScale(i)).brighter(1.5)
          : colorScale(i);

        const legendItem = legend.append('li')
          .attr('class', 'legend-item')
          .attr('data-index', i)  // Store the index for each legend item
          .html(`<span class="swatch" style="background-color: ${displayColor};"></span> ${d.label} <em>(${d.value})</em>`)
          .on('click', function () {
            selectedIndex = selectedIndex === i ? -1 : i;
            updatePieChart(projects); // Re-render the chart and legend
          });

        // Add the 'selected' class to the legend item if it is the selected one
        legendItem.classed('selected', i === selectedIndex);
      });

      // Update pie slices and legend dynamically
      svg.selectAll('path')
        .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));

      legend.selectAll('li')
        .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));
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
