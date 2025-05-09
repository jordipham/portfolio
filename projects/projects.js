// importing functions
import { fetchJSON, renderProjects } from "../global.js";
// importing d3
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// declarations
let query = "";
let allProjects = [];
let selectedIndex = -1; // No slice is selected by default

(async () => {
  try {
    // Fetch project data
    allProjects = await fetchJSON("../lib/projects.json");
    let projects = allProjects; // initial render uses full list

    // Render project cards
    const projectsContainer = document.querySelector(".projects");
    if (!projectsContainer) throw new Error("'.projects' container not found.");
    renderProjects(projects, projectsContainer, "h2");

    // Set project count title
    const titleElement = document.querySelector(".projects-title");
    if (titleElement) titleElement.textContent = `${projects.length} Projects`;

    // ========== D3 PIE CHART LOGIC ==========
    // Function to update pie chart and legend
    const updatePieChart = (projects) => {
      // Roll up project data by year
      let rolledData = d3.rollups(
        projects,
        (v) => v.length,
        (d) => String(d.year) // Ensure the year is a string
      );

      // Convert to array of { label, value } objects
      let data = rolledData.map(([year, count]) => ({
        label: year,
        value: count,
      }));

      data.sort((a, b) => +a.label - +b.label);

      // Set up SVG
      const svg = d3.select("#projects-pie-plot");
      svg.selectAll("*").remove(); // Clear previous chart

      const sliceGenerator = d3.pie().value((d) => d.value);
      const arcData = sliceGenerator(data);

      const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

      const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

      // Draw pie slices with click selection
      svg
        .selectAll("path")
        .data(arcData)
        .enter()
        .append("path")
        .attr("d", arcGenerator)
        .attr("fill", (d, i) => colorScale(i)) // Set initial fill color
        .style("cursor", "pointer")
        .classed("selected", (d, i) => i === selectedIndex)
        .on("click", (event, d) => {
          const index = arcData.indexOf(d);
          selectedIndex = selectedIndex === index ? -1 : index; // Toggle selection
          updatePieChart(projects); // Re-render with updated selection

          // Update the legend as well!
          updateLegend(data, selectedIndex);
        })
        .on("mouseover", (event, d) => {
          // Fade out all other slices except the hovered one
          svg
            .selectAll("path")
            .style("opacity", (p, i) => (i === arcData.indexOf(d) ? 1 : 0.5));
        })
        .on("mouseout", () => {
          // Reset opacity when mouse leaves the slice
          svg.selectAll("path").style("opacity", 1);
        });

      // Update legend
      const legend = d3.select(".legend");
      legend.selectAll("*").remove(); // Clear previous legend

      const legendItems = legend
        .selectAll("li")
        .data(data)
        .enter()
        .append("li")
        .attr("class", "legend-item")
        .attr("data-index", (d, i) => i)
        .html(
          (d, i) =>
            `<span class="swatch" style="background-color: ${colorScale(i)}"></span> ${d.label} <em>(${d.value})</em>`
        )
        .classed("selected", (d, i) => i === selectedIndex) // Set initial selected class
        .on("click", function (event, d) {
          const index = data.findIndex(
            (item) => item.label === d.label && item.value === d.value
          );
          selectedIndex = selectedIndex === index ? -1 : index; // Toggle selection
          updatePieChart(projects); // Re-render pie chart with new selection

          // Update the legend items to reflect selection
          updateLegend(data, selectedIndex);
        });

      // Function to update the legend based on selectedIndex
      function updateLegend(data, selectedIndex) {
        legend
          .selectAll("li")
          .attr("class", (_, i) => (i === selectedIndex ? "selected" : ""));
      }

      // Filter the projects based on the selected year
      if (selectedIndex !== -1) {
        const selectedYear = String(data[selectedIndex].label); // Ensure selected year is a string
        const filteredProjects = projects.filter(
          (project) => String(project.year) === selectedYear
        ); // Ensure project.year is a string
        renderProjects(
          filteredProjects,
          document.querySelector(".projects"),
          "h2"
        );
        const titleElement = document.querySelector(".projects-title");
        if (titleElement)
          titleElement.textContent = `${filteredProjects.length} Projects`;
      } else {
        renderProjects(projects, document.querySelector(".projects"), "h2");
        const titleElement = document.querySelector(".projects-title");
        if (titleElement)
          titleElement.textContent = `${projects.length} Projects`;
      }
    };

    // Initial pie chart render
    updatePieChart(allProjects);

    // Set up search input for dynamic filtering of projects
    const searchInput = document.querySelector(".searchBar");
    if (searchInput) {
      searchInput.addEventListener("input", (event) => {
        query = event.target.value.toLowerCase();

        // Search across all metadata
        let filteredProjects = allProjects.filter((project) => {
          let values = Object.values(project).join("\n").toLowerCase();
          return values.includes(query);
        });

        // Re-render filtered project cards
        renderProjects(
          filteredProjects,
          document.querySelector(".projects"),
          "h2"
        );

        // Update project count
        const titleElement = document.querySelector(".projects-title");
        if (titleElement) {
          titleElement.textContent = `${filteredProjects.length} Projects`;
        }

        // Update pie chart and legend dynamically
        updatePieChart(filteredProjects);
      });
    }
  } catch (error) {
    console.error("Error loading or rendering projects:", error);
  }
})();
