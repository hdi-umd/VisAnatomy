/*
 * This script is able to turn a annotation json from the tool into usable by the CAST animation tool.
 */
const fs = require("fs");
const path = require("path");

const { JSDOM } = require("jsdom");

const graphicsElementTypes = [
  "line",
  "polyline",
  "rect",
  "circle",
  "ellipse",
  "polygon",
  "path",
  "image",
  "text",
  "use",
];

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function extractNumber(str) {
  // Extract the number from the end of the string
  let matches = str?.match(/(\d+)$/);
  return matches ? parseInt(matches[0], 10) : 0;
}

let newSVG = "";

// Check if the user has provided exactly one argument
if (process.argv.length !== 4) {
  console.log("Please provide exactly 2 arguments.");
  console.log(
    "Usage: Node toCastable.js <path to json file> <path to svg file>"
  );
} else {
  // The user has provided one argument, and it can be accessed using process.argv[2]
  const fileName = process.argv[2];
  const svgFileName = process.argv[3];
  console.log("JSON File Name:", fileName);

  // Get the data from the json file
  let jsonString;

  jsonString = fs.readFileSync(fileName, "utf-8", (error, data) => {
    if (error) {
      throw error;
    }
  });
  const jsonObj = JSON.parse(jsonString);

  tool_svg = fs.readFileSync(svgFileName, "utf-8", (error, data) => {
    if (error) {
      throw error;
    }
  });

  function parseSVG(svgString) {
    const dom = new JSDOM(svgString, { contentType: "image/svg+xml" });
    const svgElement = dom.window.document.documentElement;
    const { Node } = dom.window;

    function traverseSVG(element, depth = 0) {
      // console.log(element.tagName.toLowerCase());
      // if the element is just the SVG root
      if (element.tagName === "svg") {
        let width = Math.max(
          ...Object.values(allGraphicElements).map((e) => parseFloat(e.right))
        );
        let height = Math.max(
          ...Object.values(allGraphicElements).map((e) => parseFloat(e.bottom))
        );
        // clear all attributes
        for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes[i];
          element.removeAttribute(attr.name);
        }
        // set new attributes
        element.setAttribute("viewBox", `0 0 ${width} ${height}`);
        element.setAttribute("id", "visChart");
        element.setAttribute("width", width);
        element.setAttribute("height", height);
        element.setAttribute("perserveAspectRatio", "xMidYMid");
      }
      if (element.nodeType === Node.TEXT_NODE) {
        console.log("removing a text!", element.id);
        element.remove();
      }
      // form dSVG attributes
      if (markInfo[element.id]?.Role === "Main Chart Mark") {
        console.log("a main chart mark", element.id);
        thisShape =
          "Shape" + (shapeTypes.indexOf(markInfo[element.id].Type) + 1);
        element.classList.add("mark", thisShape);
        data_datum = `{"_TYPE":"${markInfo[element.id].Type.split(" ").join(
          ""
        )}","_MARKID":"${thisShape}","fill":"${allColors.indexOf(
          allGraphicElements[element.id].fill
        )}","year":"${extractNumber(element.id)}"}`;
        element.setAttribute("data-datum", data_datum);
      }

      // Recursively traverse child elements
      let childNode = element.firstChild;
      while (childNode) {
        const nextNode = childNode.nextSibling;
        traverseSVG(childNode, depth + 1);
        childNode = nextNode;
      }
    }

    traverseSVG(svgElement);

    // group elements into <g> elements
    let group0 = dom.window.document.createElement("g");
    group0.setAttribute("class", "data-group");
    group0.setAttribute("id", "mark-group");
    svgElement.appendChild(group0);
    for (let g of groupInfo) {
      let group = dom.window.document.createElement("g");
      group.setAttribute("class", "data-group");
      for (let mark of g) {
        let element = svgElement.querySelector(`#${mark}`);
        group.appendChild(element);
      }
      group0.appendChild(group);
    }
    // // add reference <g> elements
    // add x axis
    let groupRef = dom.window.document.createElement("g");
    groupRef.setAttribute("class", "axis");
    groupRef.setAttribute(
      "data-datum",
      '{"_TYPE":"Axis", "type":"x", "position":"year"}'
    );
    for (let label of [
      ...xAxisLabels,
      ...referenceElements.axes[1].title.map((t) => t.id),
    ]) {
      let element = svgElement.querySelector(`#${label}`);
      if (!element) continue;
      // element.innerHTML = allGraphicElements[label].content;
      if (element.tagName === "text") {
        element.innerHTML = allGraphicElements[label].content;
        element.setAttribute("class", "axis-text");
        element.setAttribute("data-datum", `{"_TYPE":"axis-text"}`);
      } else {
        element.setAttribute("class", "axis-symbol");
        element.setAttribute("data-datum", `{"_TYPE":"axis-symbol"}`);
      }
      element.removeAttribute("xmlns");
      groupRef.appendChild(element);
    }
    group0.appendChild(groupRef);

    // add y axis
    groupRef = dom.window.document.createElement("g");
    groupRef.setAttribute("class", "axis");
    groupRef.setAttribute(
      "data-datum",
      '{"_TYPE":"Axis", "type":"y", "position":"year"}'
    );
    for (let label of [
      ...yAxisLabels,
      ...referenceElements.axes[2].title.map((t) => t.id),
    ]) {
      let element = svgElement.querySelector(`#${label}`);
      if (!element) continue;
      // element.innerHTML = allGraphicElements[label].content;
      if (element.tagName === "text") {
        element.innerHTML = allGraphicElements[label].content;
        element.setAttribute("class", "axis-text");
        element.setAttribute("data-datum", `{"_TYPE":"axis-text"}`);
      } else {
        element.setAttribute("class", "axis-symbol");
        element.setAttribute("data-datum", `{"_TYPE":"axis-symbol"}`);
      }
      element.removeAttribute("xmlns");
      groupRef.appendChild(element);
    }
    group0.appendChild(groupRef);

    // remove all elements before group0 form svgElement
    let childNode = svgElement.firstChild;
    while (childNode) {
      const nextNode = childNode.nextSibling;
      if (childNode !== group0) {
        childNode.remove();
      }
      childNode = nextNode;
    }

    tool_svg = svgElement.outerHTML;
    // remove all "&amp" from tool_svg
    tool_svg = tool_svg.replaceAll("amp;", "");
  }

  const annotations = jsonObj.annotations;
  const allGraphicElements = annotations.allGraphicsElement;
  const markInfo = annotations.markInfo;
  const groupInfo = annotations.groupInfo;
  const shapeTypes = Object.keys(markInfo)
    .filter((k) => markInfo[k].Role === "Main Chart Mark")
    .map((k) => markInfo[k].Type)
    .filter(onlyUnique);
  console.log(shapeTypes);
  const allColors = Object.values(allGraphicElements)
    .map((e) => e.fill)
    .filter(onlyUnique)
    .filter((f) => f !== undefined);
  console.log(allColors);
  const referenceElements = annotations.referenceElement;
  const axisLabels = Object.values(referenceElements.axes)
    .map((axis) => axis.labels.map((l) => (typeof l === "string" ? l : l.id)))
    .flat();
  const xAxisLabels = referenceElements.axes[1].labels.map((l) =>
    typeof l === "string" ? l : l.id
  );
  const yAxisLabels = referenceElements.axes[2].labels.map((l) =>
    typeof l === "string" ? l : l.id
  );
  const axisTicks = Object.values(referenceElements.axes)
    .map((axis) => axis.ticks)
    .flat();
  const axisDomain = Object.values(referenceElements.axes)
    .map((axis) => axis.path)
    .flat();
  const legendLabels = referenceElements.legend.labels.map((l) =>
    typeof l === "string" ? l : l.id
  );
  const legendMarks = referenceElements.legend.marks.map((m) =>
    typeof m === "string" ? m : m.id
  );
  parseSVG(tool_svg);
  newSVG = tool_svg;

  // Temporary file save for development
  fs.writeFile("development.svg", newSVG, (err) => {
    if (err) {
      console.log("Error while saving the file:", err);
    }
  });

  // Get the user's downloads folder path
  const downloadsFolderPath = path.join(require("os").homedir(), "Downloads");

  // File path to save the text file in the downloads folder
  let date = new Date().toISOString();
  date = date.replaceAll(":", "-");
  const filePathDownload = path.join(
    downloadsFolderPath,
    `CASTable${date}.dsvg`
  );

  // Write the file
  fs.writeFile(filePathDownload, newSVG, (err) => {
    if (err) {
      console.log("Error while saving the file:", err);
    } else {
      console.log(`File saved in the downloads folder: ${filePathDownload}`);
    }
  });
}
