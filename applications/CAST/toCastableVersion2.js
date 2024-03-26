/*
 * This script is able to turn a annotation json from the tool into usable by the CAST animation tool.
 */
const SVGPathCommander = require('svg-path-commander');

const toPath = require('element-to-path')

const fs = require("fs");
const path = require("path");
const { text } = require("stream/consumers");
const { rejects } = require('assert');
const { prependListener } = require('process');

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
let axisArr = [];

let alreadyProcessed = [];
let rectangleArr = []

let fillArr = []
let groupArr = []
let otherArr = []

let lineSymbolArr = []
let lineLinkArr = []

// Check if the user has provided exactly one argument
if (process.argv.length !== 4) {
  console.log("Please provide exactly 2 arguments.");
  console.log("Usage: Node toCastable.js <path to json file> <path to svg file>");
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

    tool_svg = fs.readFileSync(svgFileName, "utf-8", (error, data) => {
      if (error) {
          throw error;
      }
    });

    // Use jsonObj to reference any of the different parts
    // Can use https://jsongrid.com/json-grid to see structure of JSON
    const jsonObj = JSON.parse(jsonString);

    const re = new RegExp("<svg [^>]*>");

    previous_svg_string = tool_svg.match(re)[0]

    const re_height = new RegExp(`height="([^"]+)"`)
    height = previous_svg_string.match(re_height)
    if (height) {
      height = height[1]
    }

    const re_width = new RegExp(`width="([^"]+)"`)
    width = previous_svg_string.match(re_width)
    if (width) {
      width = width[1]
    }

    const re_id = new RegExp(`id=".+".*>`)

    if (height && width) {
      width = parseInt(width)
      height = parseInt(height)
      new_svg_string = previous_svg_string.replace(re_id, `id="visChart" viewbox="0 0 ${width} ${height}">`)
    } else {

      re2 = /view(b|B)ox="[^,]*,[^,]*,([^,]*),([^"]*)"/
      
      match = previous_svg_string.match(re2)
      console.log(match)
      if (match) {
        new_svg_string = previous_svg_string.replace(match[0], `viewbox="0 0 ${parseInt(match[2]) + 15} ${parseInt(match[3]) + 15}"`)
      } else {
        new_svg_string = previous_svg_string
      }

    }


    // new_svg_string = previous_svg_string.replace(`id="vis"`, `id="visChart"`)


    newSVG += new_svg_string




    // Main group element
    newSVG += `<g id="chartContent">`

    
























    // Process all graphics elements
    const annotations = jsonObj.annotations
    const allGraphicElements = annotations.allGraphicsElement

    for (const key in allGraphicElements) {
        const markObj = allGraphicElements[key]

        if (markObj.tagName == "path") {
          // processPath(markObj, annotations)

        } else if (markObj.tagName == "circle") {
          processCircle(markObj, annotations)

        } else if (markObj.tagName == "rect") {
          processRect(markObj, annotations)

        } else if (markObj.tagName == "text") {
          processText(markObj, annotations)

        } else if (markObj.tagName == "line") {
          processLine(markObj, annotations)

        } else if (markObj.tagName == "polygon") {
          processPolygon(markObj, annotations)

        }
    }




    newSVG += `<g transform="translate(0,0)" opacity="1">`

    // Put all symbols in
    for (let i = 0; i < symbolArr.length; i++) {

      newSVG += `<g transform="translate(0,0)" opacity="1">`
      newSVG += symbolArr[i]
      newSVG += `</g>`

    }

    newSVG += `</g>`





    newSVG += `<g transform="translate(0,0)" class="axis" data-datum="{&quot;_TYPE&quot;:&quot;axis&quot;,&quot;type&quot;:&quot;x&quot;}" opacity="1">`

    for (let i = 0; i < axisArr.length; i++) {

      newSVG += `<g transform="translate(0,0)" opacity="1">`
      newSVG += axisArr[i]
      newSVG += `</g>`

    }

    // End of axis group
    newSVG += `</g>`








    for (let i = 0; i < otherArr.length; i++) {

      newSVG += `<g transform="translate(0,0)" opacity="1">`
      newSVG += otherArr[i]
      newSVG += `</g>`

    }

    




    



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


















function processPath(markObj, annotations) {
    console.log("process path")
    const mark_id = markObj.id
    let is_main_mark = false
    if (annotations.markInfo[mark_id] != null) {
      is_main_mark = annotations.markInfo[mark_id].Role == "Main Chart Mark"
    }

    let is_axis_mark = false
    if (annotations.markInfo[mark_id] != null) {
      is_axis_mark = annotations.markInfo[mark_id].Role == "X Axis Line" 
      || annotations.markInfo[mark_id].Role == "X Axis Tick" 
      || annotations.markInfo[mark_id].Role == "Y Axis Line" 
      || annotations.markInfo[mark_id].Role == "Y Axis Tick"
    }


    ans = ""


    // Add a . after for the ending >
    // const re = new RegExp(".*id=\"" + markObj.id + "\"");
    const re = new RegExp("<[^<]+id=\"" + markObj.id + "\"");
    previous_svg_string = tool_svg.match(re)

    // console.log(previous_svg_string[0])



    if (is_main_mark) {
      console.log("process main path")
      // If it is a main mark, we replace id, add data-datum, add class
      // const re2 = new RegExp("id=\"" + markObj.id + "\"");
      previous_svg_string = previous_svg_string[0]
      previous_svg_string = previous_svg_string.replace(`id="${markObj.id}"`, `id="mark${markCounter++}"`)

      // Get group value
      let group = 0
      if (annotations.groupInfo.length > 0) {
        for (let i = 0; i < annotations.groupInfo.length; i++) {
          if (annotations.groupInfo[i].includes(mark_id)) {
            group = i+1
            break
          }
        }
      }

      let group_num
      if (groupArr.includes(group)) {
        group_num = groupArr.indexOf(group) + 1
      } else {
        groupArr.push(group)
        group_num = groupArr.indexOf(group) + 1
      }



      // Get fill value
      let fill_num
      if (fillArr.includes(markObj.fill)) {
        fill_num = fillArr.indexOf(markObj.fill) + 1
      } else {
        fillArr.push(markObj.fill)
        fill_num = fillArr.indexOf(markObj.fill) + 1
      }
      
      
      
      
      data_datum = `data-datum="`
      data_datum += `{&quot;_TYPE&quot;:&quot;rectangle&quot;,&quot;_MARKID&quot;:&quot;Shape1&quot;,&quot;fill&quot;:&quot;${fill_num}&quot;`
      data_datum += `,&quot;Group&quot;:&quot;${group_num}&quot;`
      data_datum += `}`

      // data_datum += `{&quot;_TYPE&quot;:&quot;rectangle&quot;,&quot;_MARKID&quot;:&quot;Shape1&quot;,&quot;_id&quot;:&quot;${markCounter - 2}&quot;,&quot;fill&quot;:&quot;${markObj.fill}&quot;}`
      data_datum += `"`

      ans += previous_svg_string
      ans += ` class=" mark Shape1 rectangle" `
      ans += data_datum

      ans += "/>"

      console.log(ans)

      symbolArr.push(ans)

    // } else if (is_axis_mark) {
    //   console.log("process axis path")

    //   previous_svg_string = previous_svg_string[0]
    //   previous_svg_string = previous_svg_string.replace(`id="${markObj.id}"`, `id="mark${axisCounter++}"`)

    //   data_datum = ` data-datum="{&quot;_TYPE&quot;:&quot;axis-tick&quot;}"`


    //   ans += previous_svg_string
    //   ans += ` class=" mark axis-tick"`
    //   ans += data_datum
    //   ans += `/>`

    //   console.log(ans)

    //   axisArr.push(ans)

    } else {
      console.log("process other path")

      // Previous
      // previous_svg_string = previous_svg_string[0]
      // ans += previous_svg_string
      // ans += `/>`
      // otherArr.push(ans)

      // Trying to make symbol2 stuff work
      // previous_svg_string = previous_svg_string[0]
      // previous_svg_string = previous_svg_string.replace(`id="${markObj.id}"`, `id="mark${axisCounter++}"`)

      // data_datum = ` data-datum="{&quot;counter&quot;:&quot;${axisCounter-2001}&quot;}"`

      // ans += previous_svg_string
      // ans += ` class="mark Symbol2 symbol"`
      // ans += data_datum
      // ans += `/>`

      // symbolArr.push(ans)


      // Stealing from axis to test
      previous_svg_string = previous_svg_string[0]
      previous_svg_string = previous_svg_string.replace(`id="${markObj.id}"`, `id="mark${axisCounter++}"`)

      re2 = /transform="translate\(([^ ]*) ([^)]*)\)"/
      match = previous_svg_string.match(re2)

      if (match) {
        // Can you do an x and y here?
        // previous_svg_string = previous_svg_string.replace(match[0], ``)
        previous_svg_string = previous_svg_string.replace(match[0], `x="${match[1]}" y="${match[2]}"`)
      }



      data_datum = ` data-datum="{&quot;_TYPE&quot;:&quot;axis-tick&quot;}"`


      ans += previous_svg_string
      ans += ` class=" mark axis-tick"`
      ans += data_datum
      ans += `/>`

      console.log(ans)

      axisArr.push(ans)



    }



    

}

function processCircle(markObj, annotations) {
  // console.log("process circle")

  const mark_id = markObj.id
  let is_main_mark = false
  if (annotations.markInfo[mark_id] != null) {
    is_main_mark = annotations.markInfo[mark_id].Role == "Main Chart Mark"
  }

  let is_axis_mark = false
  if (annotations.markInfo[mark_id] != null) {
    is_axis_mark = annotations.markInfo[mark_id].Role == "X Axis Line" 
    || annotations.markInfo[mark_id].Role == "X Axis Tick" 
    || annotations.markInfo[mark_id].Role == "Y Axis Line" 
    || annotations.markInfo[mark_id].Role == "Y Axis Tick"
  }

  // const re = new RegExp(".*id=\"" + mark_id + "\".*");
  const re = new RegExp("<[^<]+id=\"" + markObj.id + "\"");
  previous_svg_string = tool_svg.match(re)[0]

  ans = ``



  if (is_main_mark) {
    previous_svg_string = previous_svg_string.replace(`id="${markObj.id}"`, `id="mark${vertexCounter++}"`)

      // Get group value
      let group = 0
      if (annotations.groupInfo.length > 0) {
        for (let i = 0; i < annotations.groupInfo.length; i++) {
          if (annotations.groupInfo[i].includes(mark_id)) {
            group = i+1
            break
          }
        }
      }

      let group_num
      if (groupArr.includes(group)) {
        group_num = groupArr.indexOf(group) + 1
      } else {
        groupArr.push(group)
        group_num = groupArr.indexOf(group) + 1
      }

      // Get fill value
      let fill_num
      if (fillArr.includes(markObj.fill)) {
        fill_num = fillArr.indexOf(markObj.fill) + 1
      } else {
        fillArr.push(markObj.fill)
        fill_num = fillArr.indexOf(markObj.fill) + 1
      }

      data_datum = `data-datum="`
      data_datum += `{&quot;counter&quot;:&quot;${vertexCounter-1001}&quot;`
      // data_datum += `,&quot;fill&quot;:&quot;${fill_num}&quot;`
      // data_datum += `,&quot;group&quot;:&quot;${group_num}&quot;`
      data_datum += `}"`

      ans += previous_svg_string
      ans += ` class="mark Symbol1 symbol" `
      ans += data_datum
      ans += "/>"

      symbolArr.push(ans)



  } else if (is_axis_mark) {

  } else {

    previous_svg_string = previous_svg_string.replace(`id="${mark_id}" class="mark"`, `id="mark${axisCounter++}" class=" mark axis-tick"  data-datum="{&quot;_TYPE&quot;:&quot;axis-tick&quot;}"`)

    ans += previous_svg_string
    ans += "/>"

    otherArr.push(ans)

  }




}

function processText(markObj, annotations) {
  // console.log("texting")

  const re = new RegExp("<[^<]+id=\"" + markObj.id + "\"[^>]*>");
  previous_svg_string = tool_svg.match(re)[0]

  data_datum = `data-datum="{&quot;_TYPE&quot;:&quot;axis-label&quot;,&quot;text&quot;:&quot;${markObj.content}&quot;}" `

  new_svg_string = previous_svg_string.replace(`id="${markObj.id}"`, `id="mark${axisCounter++}" class=" mark axis-label" `)
  new_svg_string = new_svg_string.replace(">", ` ${data_datum}>${markObj.content}</text>`)


  let {left, top} = markObj

  re2 = new RegExp(`x="[^"]*"`)
  new_svg_string = new_svg_string.replace(re2, `x="${left}"`)

  re3 = new RegExp(`y="[^"]*"`)
  new_svg_string = new_svg_string.replace(re3, `y="${top}"`)

  re4 = /transform="translate\(([^ ]*) ([^)]*)\)"/
  match = new_svg_string.match(re4)

  if (match) {
    new_svg_string = new_svg_string.replace(match[0], `x="${match[1]}" y="${match[2]}"`)
  }


  axisArr.push(new_svg_string)
}





function processLine(markObj, annotations) {

  const mark_id = markObj.id
  let is_main_mark = false
  if (annotations.markInfo[mark_id] != null) {
    is_main_mark = annotations.markInfo[mark_id].Role == "Main Chart Mark"
  }

  let is_axis_mark = false
  if (annotations.markInfo[mark_id] != null) {
    is_axis_mark = annotations.markInfo[mark_id].Role == "X Axis Line" 
    || annotations.markInfo[mark_id].Role == "X Axis Tick" 
    || annotations.markInfo[mark_id].Role == "Y Axis Line" 
    || annotations.markInfo[mark_id].Role == "Y Axis Tick"
  }

  ans = ""

  const re = new RegExp("<[^<]+id=\"" + markObj.id + "\"");
  previous_svg_string = tool_svg.match(re)[0]

  if (is_main_mark) {
    previous_svg_string = previous_svg_string.replace(`id="${markObj.id}"`, `id="mark${markCounter++}"`)

      // Get group value
      let group = 0
      if (annotations.groupInfo.length > 0) {
        for (let i = 0; i < annotations.groupInfo.length; i++) {
          if (annotations.groupInfo[i].includes(mark_id)) {
            group = i+1
            break
          }
        }
      }

      let group_num
      if (groupArr.includes(group)) {
        group_num = groupArr.indexOf(group) + 1
      } else {
        groupArr.push(group)
        group_num = groupArr.indexOf(group) + 1
      }

      // Get fill value
      let fill_num
      if (fillArr.includes(markObj.fill)) {
        fill_num = fillArr.indexOf(markObj.fill) + 1
      } else {
        fillArr.push(markObj.fill)
        fill_num = fillArr.indexOf(markObj.fill) + 1
      }

      data_datum = `data-datum="`
      data_datum += `[{&quot;counter&quot;:&quot;${markCounter-1}&quot;`
      // data_datum += `,&quot;fill&quot;:&quot;${fill_num}&quot;`
      // data_datum += `,&quot;group&quot;:&quot;${group_num}&quot;`
      data_datum += `}]"`

      ans += previous_svg_string
      ans += ` class="mark Link1 link" `
      ans += data_datum
      ans += "/>"

      symbolArr.push(ans)
  } else if (is_axis_mark) {

  } else {

  }
}






function processRect(markObj, annotations) {
  // console.log("recting")

  const mark_id = markObj.id
  let is_main_mark = false
  if (annotations.markInfo[mark_id] != null) {
    is_main_mark = annotations.markInfo[mark_id].Role == "Main Chart Mark"
  }

  let is_axis_mark = false
  if (annotations.markInfo[mark_id] != null) {
    is_axis_mark = annotations.markInfo[mark_id].Role == "X Axis Line" 
    || annotations.markInfo[mark_id].Role == "X Axis Tick" 
    || annotations.markInfo[mark_id].Role == "Y Axis Line" 
    || annotations.markInfo[mark_id].Role == "Y Axis Tick"
  }

  let {left, top, width, height, fill} = markObj

  const re = new RegExp("<[^<]+id=\"" + markObj.id + "\"");
  previous_svg_string = tool_svg.match(re)[0]

  ans = ``

  if (is_main_mark) {
    let stroke = ""
    re2 = new RegExp(`stroke="([^"]*)"`)
    match = previous_svg_string.match(re2)
    if (match) {
      stroke = match[1]
    }

    let stroke_width = ""
    re3 = new RegExp(`stroke-width="([^"]*)"`)
    match2 = previous_svg_string.match(re3)
    if (match2) {
      stroke_width = match2[1]
    }

    

    // Get group value
    let group = 0
    if (annotations.groupInfo.length > 0) {
      for (let i = 0; i < annotations.groupInfo.length; i++) {
        if (annotations.groupInfo[i].includes(mark_id)) {
          group = i+1
          break
        }
      }
    }

    let group_num
    if (groupArr.includes(group)) {
      group_num = groupArr.indexOf(group) + 1
    } else {
      groupArr.push(group)
      group_num = groupArr.indexOf(group) + 1
    }

    // Get fill value
    let fill_num
    if (fillArr.includes(markObj.fill)) {
      fill_num = fillArr.indexOf(markObj.fill) + 1
    } else {
      fillArr.push(markObj.fill)
      fill_num = fillArr.indexOf(markObj.fill) + 1
    }




    ans += `<rect id="mark${markCounter++}" class=" mark Shape1 rectangle" x="${left}" y="${top}" width="${width}" height="${height}" style="fill: ${fill}; stroke-width: ${stroke_width}; stroke: ${stroke};" `;

    data_datum = `data-datum="{&quot;_TYPE&quot;:&quot;rectangle&quot;,&quot;_MARKID&quot;:&quot;Shape1&quot;`
    // data_datum += `,&quot;counter&quot;:&quot;${markCounter-1}&quot;`
    data_datum += `,&quot;fill&quot;:&quot;${fill_num}&quot;`
    data_datum += `,&quot;group&quot;:&quot;${group_num}&quot;`
    data_datum += `}"`

    ans += data_datum
    ans += `/>`

    symbolArr.push(ans)

  } else if (is_axis_mark) {

  } else {

  }

}



function processPolygon(markObj, annotations) {

  const mark_id = markObj.id
  let is_main_mark = false
  if (annotations.markInfo[mark_id] != null) {
    is_main_mark = annotations.markInfo[mark_id].Role == "Main Chart Mark"
  }

  let is_axis_mark = false
  if (annotations.markInfo[mark_id] != null) {
    is_axis_mark = annotations.markInfo[mark_id].Role == "X Axis Line" 
    || annotations.markInfo[mark_id].Role == "X Axis Tick" 
    || annotations.markInfo[mark_id].Role == "Y Axis Line" 
    || annotations.markInfo[mark_id].Role == "Y Axis Tick"
  }

  // NEED TO FIX HERE
  const re = new RegExp("<[^<]+id=\"" + markObj.id + "\".+?/>")
  previous_svg_string = tool_svg.match(re)[0]

  ans = ``

  if (is_main_mark) {

    // Get group value
    let group = 0
    if (annotations.groupInfo.length > 0) {
      for (let i = 0; i < annotations.groupInfo.length; i++) {
        if (annotations.groupInfo[i].includes(mark_id)) {
          group = i+1
          break
        }
      }
    }

    let group_num
    if (groupArr.includes(group)) {
      group_num = groupArr.indexOf(group) + 1
    } else {
      groupArr.push(group)
      group_num = groupArr.indexOf(group) + 1
    }

    // Get fill value
    let fill_num
    if (fillArr.includes(markObj.fill)) {
      fill_num = fillArr.indexOf(markObj.fill) + 1
    } else {
      fillArr.push(markObj.fill)
      fill_num = fillArr.indexOf(markObj.fill) + 1
    }

    console.log(previous_svg_string)
    


    data_datum = `data-datum="{&quot;_TYPE&quot;:&quot;rectangle&quot;,&quot;_MARKID&quot;:&quot;Shape1&quot;`
    data_datum += `,&quot;counter&quot;:&quot;${markCounter-1}&quot;`
    data_datum += `,&quot;fill&quot;:&quot;${fill_num}&quot;`
    data_datum += `,&quot;group&quot;:&quot;${group_num}&quot;`
    data_datum += `}"`

    new_svg_string = previous_svg_string.replace(`id="${markObj.id}"`, `id="mark${markCounter++}" class=" mark Shape1 rectangle" ${data_datum}`)

    symbolArr.push(ans)

  }



}