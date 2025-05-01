// importing functions
import { fetchJSON, renderProjects } from '../global.js';
// importing d3
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

(async () => {
  try {
    // Fetch project data
    const projects = await fetchJSON('../lib/projects.json');

    // Render project cards
    const projectsContainer = document.querySelector('.projects');
    if (!projectsContainer) throw new Error("'.projects' container not found.");
    renderProjects(projects, projectsContainer, 'h2');

    // Set project count title
    const titleElement = document.querySelector('.projects-title');
    if (titleElement) titleElement.textContent = `${projects.length} Projects`;

    // ========== D3 PIE CHART LOGIC ==========
    // Step 3.1: Roll up project data by year
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

    const sliceGenerator = d3.pie().value(d => d.value);
    const arcData = sliceGenerator(data);

    const arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(50);

    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    // Draw pie slices
    arcData.forEach((d, i) => {
      svg.append('path')
        .attr('d', arcGenerator(d))
        .attr('fill', colorScale(i));
    });

    // Draw legend
    const legend = d3.select('.legend');
    data.forEach((d, i) => {
      legend.append('li')
        .attr('class', 'legend-item')
        .attr('style', `--color:${colorScale(i)}`)
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });

  } catch (error) {
    console.error('Error loading or rendering projects:', error);
  }
})();
