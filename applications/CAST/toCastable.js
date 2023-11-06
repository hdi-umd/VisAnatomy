/*
 * This script is able to turn a annotated json from the tool into usable by the CAST animation tool.
 * toCastable.js script usage: "node toCastable.js [path to file]"
 */
const SVGPathCommander = require('svg-path-commander');
// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// global.document = new JSDOM(html).window.document;
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

    // Next main group element for the content of the chart
    newSVG += `<g transform="translate(0,0)" opacity="1">`

    let axisAndCollectionArr = jsonObj.children;
    let collectionArr = axisAndCollectionArr.filter(x => x.type == "collection")[0];
    let collectionArrChildren = collectionArr.children;

    collectionArrChildren = collectionArrChildren.reverse();
    
    let previousData = null;
    let data;
    let collection = false;

    let pathProcessSize = collectionArrChildren.filter(x => x.type === "path").length

    while (collectionArrChildren.length > 0) {

      data = collectionArrChildren.pop();

      if (data.type == "collection") {

        // If it is a collection, add the children to the end of the array to be processed first

        // Does this line do anything?
        let children = data.children.reverse();

        collectionArrChildren = [...collectionArrChildren, ...children];

        previousData = null;


        if (collection) {
          newSVG += `</g>`
          collection = false;
        } else {
          newSVG += `<g transform="translate(0,0)" opacity="1">`
          collection = true;
        }

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

    if (collection) {
      newSVG += `</g>`
    }

    // End of the content group
    newSVG += `</g>`

    // Start of the axis group
    // newSVG += `<g transform="translate(0,0)" opacity="1">`
    newSVG += `<g transform="translate(0,0)" class="axis" data-datum="{&quot;_TYPE&quot;:&quot;axis&quot;,&quot;type&quot;:&quot;x&quot;}" opacity="1">`

    let axisArr = axisAndCollectionArr.filter(x => x.type == "axis");

    for (let axisObj of axisArr) {

      // First deal with showing the title of the group
      /*
      let {showTitle} = axisObj.args;

      if (showTitle) {

        processAxisTitle(axisObj);

      }
      */

      let axisChildren = axisObj.children;

      if (isIterable(axisChildren)){
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
      } else {
        // In the case it is not an iterable, should filter for all of the objects that have type axis:
        // let axisObjs = axisAndCollectionArr.filter(x => x.type == "axis")
        // for (axisObj in axisObjs){
        //   let {strokeColor, textColor, }
        // }
      }

    }

    // Close end of axis group
    newSVG += `</g>`;

    // Start of the legend group
    newSVG += `<g transform="translate(0,0)" opacity="1">`

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

    // Close end of legend group
    newSVG += `</g>`;

    // Close main group element
    newSVG += `</g>`

    // Close main svg element
    newSVG += `</svg>`

    // newSVG = btoa(unescape(encodeURIComponent(newSVG)))
    // newSVG = 'data:text/plain;charset=utf-8,' + encodeURIComponent(newSVG)

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



function processRect(obj) {
  let ans = "";
  let id = obj.id;
  let {fillColor, strokeWidth, strokeColor, strokeDash, width, height, top, left} = obj.args;

  ans += `<g transform="translate(0,0)" opacity="1">`;

  if (width < 0) {
    left += width;
    width = Math.abs(width);
  }

  let idNum = Number(id.match(/(\d+)/)[0]) + 1;

  // ans += `<rect id="mark${idNum}" class=" mark Shape1 rectangle" x="${left}" y="${top}" width="${width}" height="${height}" style="fill: ${fillColor}; stroke-width: ${strokeWidth}; stroke: ${strokeColor}; stroke-dasharray: ${strokeDash};" text-anchor="start" cursor="pointer" pointer-events="all" `;

  const rect = {
    type: "element",
    name: "rect",
    attributes: {
      x: left,
      y: top,
      width: width,
      height: height,
    }
  }

  console.log(rect)

  const path = toPath(rect)

  console.log(path)

  console.log("-----------------")

  ans += `<path id="mark${idNum}" class=" mark Shape1 rectangle" d="${path}" style="fill: ${fillColor}; stroke-width: ${strokeWidth}; stroke: ${strokeColor}; stroke-dasharray: ${strokeDash};" text-anchor="start" cursor="pointer" pointer-events="all" `;



  // const circle = {
  //   type: "element",
  //   name: "circle",
  //   attributes: {
  //     cx: vertex.x,
  //     cy: vertex.y,
  //     r: vertex.radius
  //   }
  // }

  // const path = toPath(circle)



  // ans += `data-datum="{&quot;_TYPE&quot;:&quot;rectangle&quot;,&quot;_MARKID&quot;:&quot;Shape1&quot;,&quot;_x&quot;:${left},&quot;_y&quot;:${top},&quot;_id&quot;:&quot;${idNum}&quot;}">`;
  ans += `data-datum="{&quot;_TYPE&quot;:&quot;rectangle&quot;,&quot;_MARKID&quot;:&quot;Shape1&quot;`
  
  ans = processDataDatum(obj, ans)
  
  ans += `}">`



  // ans += `</rect>`;
  ans += `</path>`;

  ans += `</g>`;

  newSVG += ans;

  // Can also go through the dataScope for other qualities for data-datum
}

function processPath(obj) {
  let ans = "";
  let id = obj.id;
  let {strokeWidth, strokeColor, strokeDash, fillColor} = obj.args;

  ans += `<g transform="translate(0,0)" opacity="1">`;

  ans += `<path id="mark${markCounter++}" class=" mark Link1 link" `;

  ans += `d="M ${obj.vertices[0].x},${obj.vertices[0].y}`;

  for (let i = 1; i < obj.vertices.length; i++) {
    ans += ` L ${obj.vertices[i].x},${obj.vertices[i].y}`;
  }

  
  if (!fillColor) {
    fillColor = "none";
  }
  

  ans += `" style="fill: ${fillColor}; stroke-width: ${strokeWidth}; stroke: ${strokeColor}; stroke-dasharray: ${strokeDash}" `;

  let idNum = id.match(/(\d+)/);

  ans += `data-datum="{&quot;_TYPE&quot;:&quot;link&quot;,&quot;_MARKID&quot;:&quot;Link1&quot;,&quot;_x&quot;:${obj.vertices[0].x},&quot;_y&quot;:${obj.vertices[0].y},&quot;_id&quot;:&quot;${idNum}&quot;}">`;

  ans += `</path>`;

  ans += `</g>`;



  // Start of verticies
  ans += `<g transform="translate(0,0)" opacity="1">`;


  for (let vertex of obj.vertices) {
    ans += `<g transform="translate(0,0)" opacity="1">`;

    if (vertex.shape == "circle") {
      ans += `<circle id="mark${vertexCounter++}" class=" mark Symbol1 symbol" cx="${vertex.x}" cy="${vertex.y}" r="${vertex.radius}" `

      ans += `style="stroke-linecap: round; stroke-linejoin: round; text-anchor: start; cursor: pointer; pointer-events: all;" `

      ans += `fill="${vertex.fillColor}" `

      ans += `data-datum="{&quot;_TYPE&quot;:&quot;symbol&quot;,&quot;_MARKID&quot;:&quot;Symbol1&quot;,&quot;_x&quot;:${vertex.x},&quot;_y&quot;:${vertex.y},&quot;_id&quot;:&quot;${vertexCounter}&quot;}">`

      ans += `</circle>`
    }

    ans += `</g>`;
  }

  ans += `</g>`;
  // End of verticies

  newSVG += ans;
}

function processPie(obj, previousObj) {
  let ans = "";
  let id = obj.id;
  let {strokeWidth, strokeColor, strokeDash, fillColor, x, y, innerRadius, outerRadius, startAngle, endAngle, vxFillColor, vxStrokeColor, vxStrokeWidth, vxOpacity} = obj.args;

  ans += `<g transform="translate(0,0)" opacity="1">`;

  ans += `<path id="mark${markCounter++}" class=" mark Shape1 rectangle" `;

  ans += `d="M ${x}, ${y}`;

  let coordinateArr = getCoordinates(x, y, startAngle, innerRadius, outerRadius);

  ans += ` L ${coordinateArr[0]}, ${coordinateArr[1]}`;

  let oldX;
  let oldY;

  if (previousObj) {

    let oldCoordinateArr = getCoordinates(previousObj.args.x, previousObj.args.y, previousObj.args.startAngle, previousObj.args.innerRadius, previousObj.args.outerRadius);
    oldX = oldCoordinateArr[0];
    oldY = oldCoordinateArr[1];

  } else {
    
    oldX = x;

    // Should this be outerRadius to be dynamic?
    oldY = y - 100;
  }

  let newAngle = endAngle - startAngle;

  if (newAngle < 0) {
    newAngle = newAngle + 360;
  }

  ans += ` A ${outerRadius} ${outerRadius} ${newAngle} 0 0 ${oldX} ${oldY}`;


  ans += ` L ${x}, ${y}`;
  ans += ` A 0 0 ${newAngle} 0 1 ${x} ${y}"`;

  ans += ` style="fill: ${fillColor}; stroke-width: ${strokeWidth}; stroke: ${strokeColor}; stroke-dasharray: ${strokeDash};" `;


  // Tried adding other (seemingly irrelevant) attributes to make sure it wasn't the problem
  // ans += `stroke-linecap="round" stroke-linejoin="miter" text-anchor="start" cursor="pointer" pointer-events="all" `;


  let idNum = id.match(/(\d+)/);

  //ans += `data-datum="{&quot;_TYPE&quot;:&quot;rectangle&quot;,&quot;_MARKID&quot;:&quot;Shape1&quot;,&quot;_x&quot;:${x},&quot;_y&quot;:${y},&quot;_id&quot;:&quot;${markCounter - 2}&quot;}">`;


  ans += `data-datum="{&quot;_TYPE&quot;:&quot;rectangle&quot;,&quot;_MARKID&quot;:&quot;Shape1&quot;`
  
  ans = processDataDatum(obj, ans)
  
  ans += `}">`



  ans += `</path>`;

  ans += `</g>`;

  newSVG += ans;
}


function getCoordinates(x, y, angle, innerRadius, outerRadius) {
  angle = toRadians(angle);

  x += outerRadius * Math.cos(angle);
  y -= outerRadius * Math.sin(angle);

  return [x, y];
}

function toRadians (angle) {
  return angle * (Math.PI / 180);
}

/*
function processAxisTitle(axisObj) {

  let {strokeColor, textColor, tickVisible, pathVisible, labelOffset, titleOffset, rotateTitle} = axisObj.args;
  let {left, top, width, height} = axisObj.bounds
  let {field} = axisObj

  let ans = "";

  ans += `<text id="mark${axisCounter++}" class=" mark axis-title" `

  ans += `x="${left + width/2}" y="${top + height}" `

  ans += `data-datum="{&quot;_TYPE&quot;:&quot;axis-title&quot;,&quot;text&quot;:&quot;${field}&quot;}" `

  // ans += `stroke="rgb(0,0,0)" stroke-opacity="1" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" fill="rgb(0,0,0)" fill-opacity="1" text-anchor="start" opacity="null" font-family="Arial" font-size="12px" `

  ans += `stroke="${textColor}" `

  ans += `>${field}</text>`

  newSVG += ans

}
*/

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

  newSVG += ans
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

  newSVG += ans
}

function processRectLegend(obj) {
  let ans = "";
  let id = obj.id;
  let {fillColor, strokeWidth, strokeColor, strokeDash, width, height, top, left} = obj.args;

  ans += `<g transform="translate(0,0)" opacity="1">`;

  if (width < 0) {
    left += width;
    width = Math.abs(width);
  }

  let idNum = Number(id.match(/(\d+)/)[0]) + 1;

  ans += `<rect id="mark${legendCounter++}" class=" mark legend-symbol" x="${left}" y="${top}" width="${width}" height="${height}" style="fill: ${fillColor}; stroke-width: ${strokeWidth}; stroke: ${strokeColor}; stroke-dasharray: ${strokeDash};" text-anchor="start" cursor="pointer" pointer-events="all" `;


  ans += `data-datum="{&quot;_TYPE&quot;:&quot;legend-symbol&quot;}">`;

  ans += `</rect>`;

  ans += `</g>`;

  newSVG += ans;

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

  newSVG += ans
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

  newSVG += ans
}

function processDataDatum(obj, ans) {
  let { dataScope } = obj
  let { f2v } = dataScope

  for (let key in f2v) {

    ans += `,&quot;${key}&quot;:&quot;${f2v[key]}&quot;`

  }

  return ans
}

// function updatedProcessRect(obj) {

//   let ans = "";
//   let id = obj.id;
//   let {fillColor, strokeWidth, strokeColor, strokeDash, width, height, top, left} = obj.args;

//   if (width < 0) {
//     left += width;
//     width = Math.abs(width);
//   }

//   let idNum = Number(id.match(/(\d+)/)[0]) + 1;

//   //ans += `<rect id="mark${idNum}" class=" mark Shape1 rectangle" x="${left}" y="${top}" width="${width}" height="${height}" style="fill: ${fillColor}; stroke-width: ${strokeWidth}; stroke: ${strokeColor}; stroke-dasharray: ${strokeDash};" text-anchor="start" cursor="pointer" pointer-events="all" `;

//   //ans += `data-datum="{&quot;_TYPE&quot;:&quot;rectangle&quot;,&quot;_MARKID&quot;:&quot;Shape1&quot;`
  
//   //ans = processDataDatum(obj, ans)

//   let newObj = {
//     type: "rect",
//     x: left,
//     y: top,
//     width: width,
//     height: height
//   }
  
//   ans += `}">`

//   ans += `</rect>`;

//   ans = SVGPathCommander.shapeToPath(newObj);

//   console.log(ans)

//   newSVG += ans;

//   // Can also go through the dataScope for other qualities for data-datum

// }

function processBump(obj, num) {

  let ans = "";
  let id = obj.id;
  let localIdCounter = 0;
  let {strokeWidth, strokeColor, strokeDash, fillColor} = obj.args;

  ans += `<g transform="translate(0,0)" opacity="1">`;

  let { vertices } = obj;

  for (let i = 0; i < vertices.length - 1 ; i++) {

    ans += `<path id="mark${markCounter++}" class=" mark Link1 link" `;

    ans += `d="M ${obj.vertices[i].x},${obj.vertices[i].y}`;

    ans += ` L ${obj.vertices[i + 1].x},${obj.vertices[i + 1].y}`;

    if (!fillColor) {
      fillColor = "none";
    }

    ans += `" style="fill: ${fillColor}; stroke-width: ${strokeWidth}; stroke: ${strokeColor}; stroke-dasharray: ${strokeDash}" `;

    ans += `data-datum="[{&quot;_TYPE&quot;:&quot;link&quot;,&quot;_MARKID&quot;:&quot;Link1&quot;,&quot;_x&quot;:${obj.vertices[i].x},&quot;_y&quot;:${obj.vertices[i].y},&quot;_id&quot;:&quot;${((localIdCounter) * num) + pathCounter}&quot;`;

    let { dataScope } = obj.vertices[i]
    let { f2v } = dataScope

    for (let key in f2v) {
      ans += `,&quot;${key}&quot;:&quot;${f2v[key]}&quot;`
    }

    ans += `},{&quot;_TYPE&quot;:&quot;link&quot;,&quot;_MARKID&quot;:&quot;Link1&quot;,&quot;_x&quot;:${obj.vertices[i + 1].x},&quot;_y&quot;:${obj.vertices[i + 1].y},&quot;_id&quot;:&quot;${((++localIdCounter) * num) + pathCounter}&quot;`

    dataScope = obj.vertices[i + 1].dataScope
    f2v = dataScope.f2v

    for (let key in f2v) {
      ans += `,&quot;${key}&quot;:&quot;${f2v[key]}&quot;`
    }

    ans += `}]">`

    ans += `</path>`;

  }

  ans += `</g>`;



  // // Start of verticies
  // ans += `<g transform="translate(0,0)" opacity="1">`;

  // for (let vertex of obj.vertices) {
  //   ans += `<g transform="translate(0,0)" opacity="1">`;

  //   if (vertex.shape == "circle") {
  //     ans += `<circle id="mark${vertexCounter++}" class=" mark Symbol1 symbol" cx="${vertex.x}" cy="${vertex.y}" r="${vertex.radius}" `

  //     ans += `style="stroke-linecap: round; stroke-linejoin: round; text-anchor: start; cursor: pointer; pointer-events: all;" `

  //     ans += `fill="${vertex.fillColor}" `

  //     ans += `data-datum="{&quot;_TYPE&quot;:&quot;symbol&quot;,&quot;_MARKID&quot;:&quot;Symbol1&quot;,&quot;_x&quot;:${vertex.x},&quot;_y&quot;:${vertex.y},&quot;_id&quot;:&quot;${vertexCounter - 1002}&quot;}">`

  //     ans += `</circle>`
  //   }

  //   ans += `</g>`;
  // }

  // ans += `</g>`;
  // // End of verticies



  // Start of verticies
  ans += `<g transform="translate(0,0)" opacity="1">`;

  for (let vertex of obj.vertices) {
    ans += `<g transform="translate(0,0)" opacity="1">`;

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

      console.log(circle)

      const path = toPath(circle)

      console.log(path)

      ans += `<path id="mark${vertexCounter++}" class=" mark Symbol1 symbol" `
      ans += `d="${path}" `
      ans += `data-datum="{&quot;_TYPE&quot;:&quot;symbol&quot;,&quot;_MARKID&quot;:&quot;Symbol1&quot;,&quot;_x&quot;:${vertex.x},&quot;_y&quot;:${vertex.y},&quot;_id&quot;:&quot;${vertexCounter - 1002}&quot;`

      dataScope = vertex.dataScope
      f2v = dataScope.f2v

      for (let key in f2v) {
        ans += `,&quot;${key}&quot;:&quot;${f2v[key]}&quot;`
      }

      ans += `}" `

      ans += `style="stroke-linecap: round; stroke-linejoin: round; text-anchor: start; cursor: pointer; pointer-events: all;" `

      ans += `fill="${vertex.fillColor}"> `

      ans += `</path>`

    } else {

      // Added to handle multiline graph

      const circle = {
        type: "element",
        name: "circle",
        attributes: {
          cx: vertex.x,
          cy: vertex.y,
          r: 1
        }
      }

      const path = toPath(circle)

      ans += `<path id="mark${vertexCounter++}" class=" mark Symbol1 symbol" `
      ans += `d="${path}" `
      ans += `data-datum="{&quot;_TYPE&quot;:&quot;symbol&quot;,&quot;_MARKID&quot;:&quot;Symbol1&quot;,&quot;_x&quot;:${vertex.x},&quot;_y&quot;:${vertex.y},&quot;_id&quot;:&quot;${vertexCounter - 1002}&quot;`

      dataScope = vertex.dataScope
      f2v = dataScope.f2v

      for (let key in f2v) {
        ans += `,&quot;${key}&quot;:&quot;${f2v[key]}&quot;`
      }

      ans += `}" `

      ans += `style="stroke-linecap: round; stroke-linejoin: round; text-anchor: start; cursor: pointer; pointer-events: all;" `

      ans += `fill="${vertex.fillColor}"> `

      ans += `</path>`

    }







    ans += `</g>`;
  }

  ans += `</g>`;
  // End of verticies

  newSVG += ans;

}


function isIterable(obj) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}