/*
 * This script is able to turn a annotation json from the tool into usable by the CAST animation tool.
 */
const SVGPathCommander = require('svg-path-commander');

const toPath = require('element-to-path')

const fs = require("fs");
const path = require("path");
const { text } = require("stream/consumers");
const { rejects } = require('assert');

let newSVG = "";
let legendCounter = 3001;
let axisCounter = 2001;
let vertexCounter = 1001;
let markCounter = 1;
let pathCounter = -1;

let linkArr = [];
let symbolArr = [];
let legendArr = [];
let legendStoreArr = [];
let axisTicksArr = [];
let axisLabelsArr = [];

// Check if the user has provided exactly one argument
if (process.argv.length !== 3) {
  console.log("Please provide exactly one argument.");
  console.log("Usage: Node toCastable.js <path to json file>");
} else {
  // The user has provided one argument, and it can be accessed using process.argv[2]
  const fileName = process.argv[2];
  console.log("JSON File Name:", fileName);

  // Get the data from the json file
  let jsonString;

    jsonString = fs.readFileSync(fileName, "utf-8", (error, data) => {
        if (error) {
            throw error;
        }
    });

    // Use jsonObj to reference any of the different parts
    // Can use https://jsongrid.com/json-grid to see structure of JSON
    const jsonObj = JSON.parse(jsonString);
    
    // Main svg element
    let {left, top, width, height} = jsonObj.bounds;

    newSVG += `<svg id="visChart" viewBox="${left} ${top} ${width + 200} ${height + 150}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve">`

    // Main group element
    newSVG += `<g id="chartContent">`

    let axisAndCollectionArr = jsonObj.children;
    let collectionArr = axisAndCollectionArr.filter(x => x.type == "collection")[0];
    let collectionArrChildren = collectionArr.children;

    collectionArrChildren = collectionArrChildren.reverse();
    
    let previousData = null;
    let data;
    let collection = false;

    let pathProcessSize = collectionArrChildren.filter(x => x.type === "path").length
    let verticesSize = collectionArrChildren.filter(x => x.type === "path")[0].vertices.length

    while (collectionArrChildren.length > 0) {

      data = collectionArrChildren.pop();

      if (data.type == "collection") {

        // If it is a collection, add the children to the end of the array to be processed first

        // Does this line do anything?
        let children = data.children.reverse();

        collectionArrChildren = [...collectionArrChildren, ...children];

        previousData = null;

      } else if (data.type == "rect") {
        processRect(data)
        
      } else if (data.type == "path") {
        //processPath(data);
        pathCounter++;
        processBump(data, pathProcessSize)
      } else if (data.type == "pie") {
        processPie(data, previousData);

        previousData = data;
      }

    }


    newSVG += `<g transform="translate(0,0)" opacity="1">`

    newSVG += `<g transform="translate(0,0)" opacity="1">`

    newSVG += `</g>`

    // Links Nested Grouping Start

    newSVG += `<g transform="translate(0,0)" opacity="1">`

    newSVG += `<g transform="translate(0,0)" opacity="1">`

    newSVG += `<g transform="translate(0,0)" opacity="1">`

    let j = 0;

    for (let i = 0; i < pathProcessSize; i++) {
        newSVG += `<g transform="translate(0,0)" opacity="1">`

        while ((j < verticesSize * (i + 1)) && j < linkArr.length) {
            newSVG += linkArr[j]

            j++;
        }

        newSVG += `</g>`
    }

    newSVG += `</g>`

    newSVG += `</g>`

    // Links Nested Grouping End

    newSVG += `</g>`


    let axisArr = axisAndCollectionArr.filter(x => x.type == "axis");

    for (let axisObj of axisArr) {

      let axisChildren = axisObj.children;

      for (let child of axisChildren) {
        if (child.type == "group") {

          for (let childChild of child.children) {

            if (childChild.type == "line") {
              processLine(childChild)
            } else if (childChild.type == "pointText") {
              processPointText(childChild)
            }

          }

        } else if (child.type == "line") {

          processLine(child)

        } else if (child.type == "pointText") {

          processPointText(child)

        }

      }
      
    }


    // Symbol and Axis Group Start

    newSVG += `<g transform="translate(0,0)" opacity="1">`

    newSVG += `<g transform="translate(0,0)" opacity="1">`

    newSVG += `<g transform="translate(0,0)" opacity="1">`

    newSVG += `<g transform="translate(0,0)" opacity="1">`

    newSVG += `</g>`

    newSVG += `<g transform="translate(0,0)" opacity="1">`

    for (let i = 0; i < symbolArr.length; i++) {

        newSVG += `<g transform="translate(0,0)" opacity="1">`
        newSVG += symbolArr[i]
        newSVG += `</g>`

    }

    newSVG += `</g>`

    newSVG += `<g transform="translate(0,0)" opacity="1">`

    // This is where some labels would go

    newSVG += `</g>`

    newSVG += `</g>`

    newSVG += `<g transform="translate(0,0)" opacity="1">`

    // Need to add data-datum to group
    newSVG += `<g transform="translate(0,0)" class="axis" data-datum="{&quot;_TYPE&quot;:&quot;axis&quot;,&quot;type&quot;:&quot;x&quot;,&quot;position&quot;:&quot;Year&quot;}" opacity="1">`

    //Axis Ticks and Axis Labels with Groups
    for (let i = 0; i < axisTicksArr.length; i++) {
      newSVG += axisTicksArr[i]
    }

    for (let i = 0; i < axisLabelsArr.length; i++) {
      newSVG += `<g transform="translate(0,0)" opacity="1">`
      newSVG += axisLabelsArr[i]
      newSVG += `</g>`
    }

    newSVG += `</g>`

    newSVG += `</g>`

    newSVG += `</g>`

    // Symbol and Axis Group End

    newSVG += `</g>`

    // Start of Title Group

    newSVG += `<g transform="translate(0,0)" opacity="1">`

    newSVG += `<g transform="translate(0,0)" opacity="1">`

    // Title Would Go Here

    newSVG += `</g>`

    // End of Title Group

    newSVG += `</g>`


    let legendArr = axisAndCollectionArr.filter(x => x.type == "legend")[0];

    if (legendArr) {

    let legendChildren = legendArr.children

    while (legendChildren.length > 0) {

      data = legendChildren.pop()

      if (data.type == "collection" || data.type == "glyph") {

        legendChildren = [...legendChildren, ...data.children]

      } else if (data.type == "pointText") {

        processPointTextLegend(data)

      } else if (data.type == "rect") {

        processRectLegend(data)

      }
    }

    }

    // Start of Legend Group

    newSVG += `<g transform="translate(0,0)" opacity="1">`

    // Need to add data-datum attribute

    newSVG += `<g transform="translate(0,0)" opacity="1">`

    for (let i = 0; i < legendStoreArr.length; i++) {
      newSVG += `<g transform="translate(0,0)" opacity="1">`

      newSVG += legendStoreArr[i]
      newSVG += legendStoreArr[i + 1]

      newSVG += `</g>`
    }

    newSVG += `</g>`

    newSVG += `</g>`








    


    newSVG += `</g>`

    // Close main group element
    newSVG += `</g>`

    // Close main svg element
    newSVG += `</svg>`

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
  const filePathDownload = path.join(downloadsFolderPath, `CASTable${date}.dsvg`);

  // Write the file
  fs.writeFile(filePathDownload, newSVG, (err) => {
    if (err) {
      console.log("Error while saving the file:", err);
    } else {
      console.log(`File saved in the downloads folder: ${filePathDownload}`);
    }
  });
}

function processLine(obj) {

  let {strokeColor, strokeWidth, visibility} = obj.args

  if (visibility != "hidden") {

  let x1 = obj.vertices[0].x
  let y1 = obj.vertices[0].y
  let x2 = obj.vertices[1].x
  let y2 = obj.vertices[1].y

  let ans = ""

  ans += `<line id="mark${axisCounter++}" class=" mark axis-tick" `

  ans += `x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" `

  ans += `data-datum="{&quot;_TYPE&quot;:&quot;axis-tick&quot;}" `

  ans += `stroke="${strokeColor}" stroke-width="${strokeWidth}"`

  ans += `></line>`

  axisTicksArr.push(ans)
  }
}

function processPointText(obj) {

  let {x, y, text, fontSize, fontFamily, fillColor, fontWeight} = obj.args

  let ans = ""

  ans += `<text id="mark${axisCounter++}" class=" mark axis-label" `

  ans += `x="${x}" y="${y}" `

  ans += `data-datum="{&quot;_TYPE&quot;:&quot;axis-label&quot;,&quot;text&quot;:&quot;${text}&quot;}" `

  ans += `fill="${fillColor}" font-weight="${fontWeight}" font-family="${fontFamily}" font-size="${fontSize}" `

  if (obj.args.anchor[0] == "right") {
    ans += `text-anchor="end" `
  } else if (obj.args.anchor[0] == "center") {
    ans += `text-anchor="middle" `
  } else {
    ans += `text-anchor="start" `
  }

  if (obj.args.anchor[1] == "middle") {
    ans += `alignment-baseline="middle" dominant-baseline="middle" `
  } else if (obj.args.anchor[1] == "top") {
    ans += `alignment-baseline="text-before-edge" dominant-baseline="text-before-edge" `
  }

  ans += `>${text}</text>`

  axisLabelsArr.push(ans)
}

function processRectLegend(obj) {
  let ans = "";
  let id = obj.id;
  let {fillColor, strokeWidth, strokeColor, strokeDash, width, height, top, left} = obj.args;

  if (width < 0) {
    left += width;
    width = Math.abs(width);
  }

  let idNum = Number(id.match(/(\d+)/)[0]) + 1;

  ans += `<rect id="mark${legendCounter++}" class=" mark legend-symbol" x="${left}" y="${top}" width="${width}" height="${height}" style="fill: ${fillColor}; stroke-width: ${strokeWidth}; stroke: ${strokeColor}; stroke-dasharray: ${strokeDash};" text-anchor="start" cursor="pointer" pointer-events="all" `;


  ans += `data-datum="{&quot;_TYPE&quot;:&quot;legend-symbol&quot;}">`;

  ans += `</rect>`;


  legendStoreArr.push(ans)

}

function processLineLegend(obj) {

  let {strokeColor, strokeWidth, visibility} = obj.args

  if (visibility != "hidden") {

  let x1 = obj.vertices[0].x
  let y1 = obj.vertices[0].y
  let x2 = obj.vertices[1].x
  let y2 = obj.vertices[1].y

  let ans = ""

  ans += `<line id="mark${legendCounter++}" class=" mark legend-symbol" `

  ans += `x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" `

  ans += `data-datum="{&quot;_TYPE&quot;:&quot;legend-symbol&quot;}" `

  ans += `stroke="${strokeColor}" stroke-width="${strokeWidth}"`

  ans += `></line>`

  legendStoreArr.push(ans)
  }
}

function processPointTextLegend(obj) {

  let {x, y, text, fontSize, fontFamily, fillColor, fontWeight} = obj.args

  let ans = ""

  ans += `<text id="mark${legendCounter++}" class=" mark legend-text" `

  ans += `x="${x}" y="${y}" `

  ans += `data-datum="{&quot;_TYPE&quot;:&quot;legend-text&quot;}" `

  ans += `fill="${fillColor}" font-weight="${fontWeight}" font-family="${fontFamily}" font-size="${fontSize}" `

  if (obj.args.anchor[0] == "right") {
    ans += `text-anchor="end" `
  } else if (obj.args.anchor[0] == "center") {
    ans += `text-anchor="middle" `
  } else {
    ans += `text-anchor="start" `
  }

  if (obj.args.anchor[1] == "middle") {
    ans += `alignment-baseline="middle" dominant-baseline="middle" `
  } else if (obj.args.anchor[1] == "top") {
    ans += `alignment-baseline="text-before-edge" dominant-baseline="text-before-edge" `
  }

  ans += `>${text}</text>`

  legendStoreArr.push(ans)
}

function processBump(obj, num) {

  let ans = "";
  let id = obj.id;
  let localIdCounter = 0;
  let {strokeWidth, strokeColor, strokeDash, fillColor} = obj.args;

  let { vertices } = obj;

  for (let i = 0; i < vertices.length - 1 ; i++) {

    ans = ""

    ans += `<path id="mark${markCounter++}" class=" mark Link1 link" `;

    ans += `d="M ${obj.vertices[i].x},${obj.vertices[i].y}`;

    ans += ` L ${obj.vertices[i + 1].x},${obj.vertices[i + 1].y}`;

    if (!fillColor) {
      fillColor = "none";
    }

    ans += `" style="fill: ${fillColor}; stroke-width: ${strokeWidth}; stroke: ${strokeColor}; stroke-dasharray: ${strokeDash}" `;

    ans += `data-datum="[{&quot;_TYPE&quot;:&quot;link&quot;,&quot;_MARKID&quot;:&quot;Link1&quot;,&quot;_x&quot;:${obj.vertices[i].x},&quot;_y&quot;:${obj.vertices[i].y},&quot;_id&quot;:&quot;${((localIdCounter) * num) + pathCounter}&quot;`;

    let { dataScope } = obj.vertices[i]
    let { f2v, tuples } = dataScope

    for (let key in f2v) {
      ans += `,&quot;${key}&quot;:&quot;${f2v[key]}&quot;`
    }

    for (let key in tuples) {
      ans += `,&quot;Value&quot;:&quot;${tuples[key]}&quot;`
    }

    ans += `},{&quot;_TYPE&quot;:&quot;link&quot;,&quot;_MARKID&quot;:&quot;Link1&quot;,&quot;_x&quot;:${obj.vertices[i + 1].x},&quot;_y&quot;:${obj.vertices[i + 1].y},&quot;_id&quot;:&quot;${((++localIdCounter) * num) + pathCounter}&quot;`

    dataScope = obj.vertices[i + 1].dataScope
    f2v = dataScope.f2v
    tuples = dataScope.tuples

    for (let key in f2v) {
      ans += `,&quot;${key}&quot;:&quot;${f2v[key]}&quot;`
    }

    for (let key in tuples) {
      ans += `,&quot;Value&quot;:&quot;${tuples[key]}&quot;`
    }

    ans += `}]">`

    ans += `</path>`;

    linkArr.push(ans)

  }

  


  // Start of verticies

  for (let vertex of obj.vertices) {

    if (vertex.shape == "circle") {
      

      const circle = {
        type: "element",
        name: "circle",
        attributes: {
          cx: vertex.x,
          cy: vertex.y,
          r: vertex.radius
        }
      }

      const path = toPath(circle)

      ans = ""

      ans += `<path id="mark${vertexCounter++}" class=" mark Symbol1 symbol" `
      ans += `d="${path}" `
      ans += `data-datum="{&quot;_TYPE&quot;:&quot;symbol&quot;,&quot;_MARKID&quot;:&quot;Symbol1&quot;,&quot;_x&quot;:${vertex.x},&quot;_y&quot;:${vertex.y},&quot;_id&quot;:&quot;${vertexCounter - 1002}&quot;`

      dataScope = vertex.dataScope
      f2v = dataScope.f2v
      tuples = dataScope.tuples

      for (let key in f2v) {
        ans += `,&quot;${key}&quot;:&quot;${f2v[key]}&quot;`
      }

      for (let key in tuples) {
        ans += `,&quot;Value&quot;:&quot;${tuples[key]}&quot;`
      }

      ans += `}" `

      ans += `style="stroke-linecap: round; stroke-linejoin: round; text-anchor: start; cursor: pointer; pointer-events: all;" `

      ans += `fill="${vertex.fillColor}"> `

      ans += `</path>`

      symbolArr.push(ans)

    }

  }

  // End of verticies

}