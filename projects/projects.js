// importing functions
import { fetchJSON, renderProjects } from '../global.js';

// load in the json
const projects = await fetchJSON('../lib/projects.json');

// projects containers
const projectsContainer = document.querySelector('.projects');

// render projects
renderProjects(projects, projectsContainer, 'h2');