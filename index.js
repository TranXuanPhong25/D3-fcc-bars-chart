import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const padding = 60;
const WIDTH = 1200;
const HEIGHT = 500;
const AXIS_Y_OFFSET = 10;
const TOOLTIP_PADDING = 20;
const URL_DATA = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

let moreInfoText = "";
let dataSet = [];

await fetch(URL_DATA)
   .then(response => {
      if (!response.ok) {
         throw new Error("Network response was not ok");
      }
      return response.json();
   })
   .then(data => {
      console.log(data);
      dataSet = data.data;
      moreInfoText = data.display_url;
   })
   .catch(error => console.error(error));


//resize dataset down to from 100 to end

const sizeOfData = dataSet.length;
//convert Date String to int
var yearsDate = dataSet.map(function (item) {
   return new Date(item[0]);
});

let xMax = new Date(d3.max(yearsDate));
xMax.setMonth(xMax.getMonth() + 3);

const xScale = d3.scaleTime()
   .domain([d3.min(yearsDate), xMax])
   .range([0, WIDTH]);
const yScale = d3.scaleLinear()
   .domain([0, d3.max(dataSet, d => d[1])])
   .range([HEIGHT, 0]);

const dataBarHeightScale = d3.scaleLinear()
   .domain([0, d3.max(dataSet, d => d[1])])
   .range([0, HEIGHT]);
const dataBarWidthScale = d3.scaleLinear()
   .domain([0, sizeOfData])
   .range([0, WIDTH]);

const svg = d3.select("svg").attr("width", WIDTH + padding * 2).attr("height", HEIGHT + padding);
const tooltip = d3.select("#tooltip")
const gx = svg.append("g")
   .call(d3.axisBottom(xScale))
   .attr("id", "x-axis")
   .attr("transform", `translate(${padding},${HEIGHT + AXIS_Y_OFFSET})`);

const gy = svg.append("g")
   .call(d3.axisLeft(yScale))
   .attr("id", "y-axis")
   .attr("transform", `translate(${padding},${AXIS_Y_OFFSET})`);

const dataBars = svg.selectAll("rect")
   .data(dataSet)
   .enter()
   .append("rect")
   .attr("width", dataBarWidthScale(1))
   .attr("height", d => dataBarHeightScale(d[1]))
   .attr("x", (_, i) => dataBarWidthScale(i) + padding)
   .attr("y", d => HEIGHT - dataBarHeightScale(d[1]) + AXIS_Y_OFFSET)
   //tailwindcss classes
   .attr("class", "bar hover:fill-white fill-sky-400/100 cursor-pointer transition-color")
   .attr("data-date", d => d[0])
   .attr("data-gdp", d => d[1])
   .on("mouseover", (e, d) => {
      d3.select(this).classed("hover", true);
      tooltip.style("opacity", 1)
         .attr("data-date", d[0])
         .html(`<p>${d[0]}</p><p>$${d[1]} Billion</p>`)
   })
   .on("mouseleave", () => {
      d3.select(this).classed("hover", false);
      d3.select("#tooltip").style("opacity", 0);
   })
   .on("mousemove", (e, d) => {
      tooltip.style("left", e.clientX + TOOLTIP_PADDING + "px")
         .style("top", e.clientY + TOOLTIP_PADDING + "px")
   })


const moreInfo = d3.select("#moreInfo").select("a").attr("href", moreInfoText);