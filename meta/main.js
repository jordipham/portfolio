// imports
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// data reader
async function loadData() {
  const data = await d3.csv("loc.csv", (row) => ({
    ...row,
    line: Number(row.line), // or just +row.line
    depth: Number(row.depth),
    length: Number(row.length),
    date: new Date(row.date + "T00:00" + row.timezone),
    datetime: new Date(row.datetime),
  }));
  // console.log(data);
  return data;
}

// modifying the commits we read in
function processCommits(data) {
  return d3
    .groups(data, (d) => d.commit)
    .map(([commit, lines]) => {
      let first = lines[0];
      let { author, date, time, timezone, datetime } = first;
      let ret = {
        id: commit,
        url: "https://github.com/vis-society/lab-7/commit/" + commit,
        author,
        date,
        time,
        timezone,
        datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length,
      };

      Object.defineProperty(ret, "lines", {
        value: lines,
        configurable: false,
        writable: false,
        enumerable: false,
      });

      return ret;
    });
}

// rendering the commits onto the page
function renderCommitInfo(
  commits,
  numFiles,
  totalLoc,
  maxDepth,
  maxLinesInFile,
  mostActiveTimeOfDay,
  mostActiveDayOfWeek,
  daysWorked
) {
  const statsContainer = d3
    .select("#stats")
    .append("div")
    .attr("class", "summary-stats-grid");

  const statPairs = [
    { label: "COMMITS", value: commits.length },
    { label: "FILES", value: numFiles },
    { label: "TOTAL LOC", value: totalLoc },
    { label: "MAX DEPTH", value: maxDepth },
    { label: "MAX LINES", value: maxLinesInFile },
    { label: "PRODUCTIVE TIME", value: mostActiveTimeOfDay },
    { label: "PRODUCTIVE DAY", value: mostActiveDayOfWeek },
    { label: "DAYS WORKED", value: daysWorked },
  ];

  statPairs.forEach((stat) => {
    const statDiv = statsContainer.append("div").attr("class", "stat-item"); // Changed class name
    statDiv.append("div").attr("class", "stat-label").text(stat.label);
    statDiv.append("div").attr("class", "stat-value").text(stat.value);
  });
}

// data from csv
let data = await loadData();

// commits viewer
let commits = processCommits(data);

// calculate stats and render appropriately
const numFiles = d3.rollup(
  data,
  (v) => v.length,
  (d) => d.file
).size;
const maxDepth = d3.max(data, (d) => d.depth);
const files = d3.groups(data, (d) => d.file);
const maxLinesInFile = d3.max(files, (file) => file[1].length);
const timeOfDayCounts = d3.rollup(
  commits,
  (v) => v.length,
  (d) => {
    const hour = d.datetime.getHours();
    if (hour >= 6 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 18) return "Afternoon";
    if (hour >= 18 && hour < 24) return "Evening";
    return "Night";
  }
);
const mostActiveTimeOfDay = d3.greatest(
  timeOfDayCounts,
  ([key, value]) => value
)?.[0];

const dayOfWeekCounts = d3.rollup(
  commits,
  (v) => v.length,
  (d) => d.datetime.getDay()
); // 0=Sun, 1=Mon, ...
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const mostActiveDayOfWeekIndex = d3.greatest(
  dayOfWeekCounts,
  ([key, value]) => value
)?.[0];
const mostActiveDayOfWeek =
  mostActiveDayOfWeekIndex !== undefined
    ? days[mostActiveDayOfWeekIndex]
    : undefined;
const workDates = new Set();
for (const row of data) {
  const dateStr = row.date.toISOString().split('T')[0]; // get 'YYYY-MM-DD'
  workDates.add(dateStr);
}
const daysWorked = workDates.size;

renderCommitInfo(
  commits,
  numFiles,
  data.length,
  maxDepth,
  maxLinesInFile,
  mostActiveTimeOfDay,
  mostActiveDayOfWeek,
  daysWorked
);
