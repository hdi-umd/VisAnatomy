var allSVGElementID = [];
var idMappings = {}; // To track original to new ID mappings
var indices = {}; // To track the number of each element type

function displaySVG(text) {
  allSVGElementID = [];
  idMappings = {}; // Reset ID mappings
  indices = {}; // Reset indices
  const parent = document.getElementById("bkModalContentsvg")
  parent.innerHTML=text
  let vis = d3.select("#bkModalContentsvg").select("svg")
  const width = vis.attr("width").match(/(\d+)/)[0]
  const height = vis.attr("height").match(/(\d+)/)[0]
  var viewBox='0 0 1500 1000'
  if (width && width>500){
    // console.log(width, height)
    viewBox='0 0 '+width+' '+height
  }
  // console.log("viewbox", viewBox)
  vis.attr("id", "vis")
  .attr("viewBox", viewBox)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .attr("width", "100%")
  .style("position", "absolute")
  

  const svgElement = document.querySelector("#vis");
//   svgElement.removeAttribute("viewBox");
    // svgElement.removeAttribute("width")
    svgElement.removeAttribute("height")
   
// TODO: uncomment the follwoing to add ids to svg elements when working on highlighting stuff
//   addClassAndIdToLeaves(svgElement);
//   updateUseElementReferences(svgElement);


  vis //sanity check to make sure height doesn't become 1
  .style("height", null);
}

function addClassAndIdToLeaves(element) {
  // Set ID
  if (element.nodeType === Node.ELEMENT_NODE && element.nodeName !== "svg") {
    let originalId = element.getAttribute("id"); // Get original ID if exists
    if (!Object.keys(indices).includes(element.nodeName)) {
      indices[element.nodeName] = 0;
    }
    if (
      element.nodeName !== "linearGradient" &&
      element.nodeName !== "g" &&
      element.nodeName.indexOf(":") === -1
    ) {
      let newId = element.nodeName + indices[element.nodeName]++;
      element.setAttribute("id", newId);
      allSVGElementID.push(newId);
      if (originalId) {
        idMappings[originalId] = newId; // Track original to new ID
      }
    }
  }

  if (element.hasChildNodes()) {
    element.childNodes.forEach((childNode) => {
      addClassAndIdToLeaves(childNode);
    });
  } else {
    // Set class for specific elements
    setClassForSpecificElements(element);
  }
}

function setClassForSpecificElements(element) {
  if (
    [
      "rect",
      "circle",
      "ellipse",
      "text",
      "line",
      "polyline",
      "polygon", // Fixed typo 'ploygon' to 'polygon'
      "path",
      "image",
      "use",
    ].includes(element.nodeName)
  ) {
    if (element.hasAttribute("class")) {
      const existingClasses = element.getAttribute("class").split(" ");
      if (!existingClasses.includes("mark")) {
        element.setAttribute("class", `${element.getAttribute("class")} mark`);
      }
    } else {
      element.setAttribute("class", "mark");
    }
  }
}

// After all elements have been processed, update <use> element references
function updateUseElementReferences(svgElement) {
  svgElement.querySelectorAll("use").forEach((use) => {
    let href = use.getAttribute("href") || use.getAttribute("xlink:href");
    if (href && href.includes("#")) {
      let originalId = href.split("#")[1];
      if (idMappings[originalId]) {
        let newHref = "#" + idMappings[originalId];
        use.setAttribute("href", newHref); // Update for modern browsers
        use.setAttribute("xlink:href", newHref); // Update for compatibility
      }
    }
  });
}