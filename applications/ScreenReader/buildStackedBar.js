/*
 * This will take in the path to a json of a visualization and create a tree
 * structure that matches the stacked bar chart example.
 * 
 */

const readline = require("readline")
const { getDefaultHighWaterMark } = require("stream");
const fs = require("fs");
const path = require("path");
const { text } = require("stream/consumers");
const { rejects } = require('assert');

// async function outer() {

// First 3 Values, supplied by user probably
higherLevel = []
lowerLevel = []
dataObjs = []

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
let jsonObj = JSON.parse(jsonString);

let axisAndCollectionArr = jsonObj.children;
let collectionArr = axisAndCollectionArr.filter(x => x.type == "collection")[0];
let collectionArrChildren = collectionArr.children;

while (collectionArrChildren.length > 0) {

    data = collectionArrChildren.pop();

    if (data.type == "collection" && data.children[0].type != "collection") {
        higherLevel.push(data.children)
    } else {
        for (let i = 0; i < data.children.length; i++) {
            data.push(data.children[i])
        }
    }

}

// Now we have an array of arrays - not sure if it will work if marks come directly from the collection though...
// console.log(higherLevel)

// Reset to do lower level marks only
jsonObj = JSON.parse(jsonString);
axisAndCollectionArr = jsonObj.children;
collectionArr = axisAndCollectionArr.filter(x => x.type == "collection")[0];
collectionArrChildren = collectionArr.children;

while (collectionArrChildren.length > 0) {

    data = collectionArrChildren.pop();

    if (data.type == "collection") {

      // If it is a collection, add the children to the end of the array to be processed first
      //let children = data.children.reverse();
      let children = data.children;
      collectionArrChildren = [...collectionArrChildren, ...children];

    } else {
        lowerLevel.push(data)
    }

}
lowerLevel.reverse()
// console.log(lowerLevel)

for(let i = 0; i < lowerLevel.length; i++) {
    let {dataScope} = lowerLevel[i]
    let {dt, fv2, tuples} = dataScope
    // console.log(tuples)

    let dataTable = jsonObj.tables[dt].data
    dataObjs.push(dataTable[i])
}

// Now we have a higher level, lower level, and data array
// console.log(dataObjs)
// console.log(lowerLevel)
// console.log(higherLevel)

class Node {
    constructor(data, parent = null) {
        this.data = data;
        this.parent = parent;
        this.children = [];
        this.siblings = [];
    }

    addChild(childData) {
        let childNode = new Node(childData, this);
        this.children.push(childNode);
        return childNode;
    }

    updateSiblings() {
        for(let i = 0; i < this.children.length; i++) {

        }
    }
}

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

let rootInput = "";
let legendInput = "";
let XAxisInput = "";

// rootInput = await askQuestion("Enter Root Text:\n")
// legendInput = await askQuestion("Enter Legend Text:\n")
// XAxisInput = await askQuestion("Enter X Axis Info Text:\n")

// Not sure which channel to search for?
let x_axis = axisAndCollectionArr.filter(x => x.type == "axis" && x.channel == "x")[0]
let {field: xfield} = x_axis

XAxisInput += `The X axis field is ${xfield}.`

let legend = axisAndCollectionArr.filter(x => x.type == "legend")[0]
let {field: legend_field} = legend

legendInput += `The legend field is ${legend_field}.`

rootInput += XAxisInput
rootInput += " "
rootInput += legendInput



let rootNode = new Node(rootInput)
let legendNode= rootNode.addChild(legendInput)
let XAxisNode = rootNode.addChild(XAxisInput)


let barArray = []
let highLevelSegmentNum;

// Loop through the higher level and do stuff
let dataObjsPos = 0;
for(let i = 0; i < higherLevel.length; i++) {
    // Each of these represents a bar, note that the lower level and data Objs should also correspond to the dataObjsPos
    let barInfo = "";
    let numSegments = higherLevel[i].length;
    barInfo = "Number of segments: " + numSegments;
    barInfo = `There are ${numSegments} in this bar. `;
    highLevelSegmentNum = numSegments;


    // Make corresponding data object array
    let dataObjArr = [];
    for (let i = 0; i < numSegments; i++) {
        dataObjArr.push(dataObjs[dataObjsPos++]);
    }


    // Find Similar Attributes
    function findCommonAttributesInList(objList) {
        if (objList.length < 2) {
          console.log('Need at least two objects for comparison.');
          return;
        }
      
        const commonAttributes = {};
      
        for (const key in objList[0]) {
          if (objList.every(obj => obj.hasOwnProperty(key) && obj[key] === objList[0][key])) {
            commonAttributes[key] = objList[0][key];
          }
        }
      
        return commonAttributes;
      }

    let similarKeys = findCommonAttributesInList(dataObjArr);

    console.log("Similar keys")
    console.log(similarKeys)

    for (key in similarKeys) {
        barInfo += `The value of ${key} is ${similarKeys[key]}. `
    }


    // Numeric Analysis
    let sumObj = {};
    for (object in dataObjArr) {
        for (key in dataObjArr[object]) {
            if (typeof dataObjArr[object][key] === 'number') {
                if (sumObj.hasOwnProperty(key)) {
                    sumObj[key] += dataObjArr[object][key]
                } else {
                    sumObj[key] = dataObjArr[object][key]
                }
            }
        }
    }

    console.log("Sum Object")
    console.log(sumObj)

    for (key in sumObj) {
        barInfo += `The sum of the ${key} variable is ${sumObj[key]}. `
    }



    let result = XAxisNode.addChild(barInfo);

    // Now Add Children to the Larger Bar Node
    dataObjsPos -= numSegments;
    for (let i = dataObjsPos; i < dataObjsPos + numSegments; i++) {
        let segmentInfo = "";
        for (key in dataObjs[i]) {
            segmentInfo += `The key ${key} has the value ${dataObjs[i][key]}. `
        }
        result.addChild(segmentInfo)
    }
    dataObjsPos += numSegments

}


// Legend stuff

let top_level = []
for (let i = 0; i < dataObjs.length; i++) {
    top_level.push(dataObjs[i][legend_field])
}
top_level = Array.from(new Set(top_level))
console.log(top_level)



for (let i = 0; i < top_level.length; i++) {
    console.log(top_level[i])
    let segmentInfo = "";
    segmentInfo += `The value of ${legend_field} is ${top_level[i]}. `
    let curr = legendNode.addChild(segmentInfo)

    // Add each subthing
    let of_this_thing = dataObjs.filter(x => x[legend_field] == top_level[i])
    // console.log(of_this_thing)
    // console.log(dataObjs[0][legend_field])
    // console.log(legend_field)
    // console.log(dataObjs[0])

    for (let j = 0; j < of_this_thing.length; j++) {

        let segmentInfo = "";
        for (key in of_this_thing[j]) {
            segmentInfo += `The key ${key} has the value ${of_this_thing[j][key]}. `
        }
        curr.addChild(segmentInfo)
        
    }

}








// for (let i = 0; i < dataObjs.length; i++) {
//     let segmentInfo = "";
//     segmentInfo += `The value of ${legend_field} is ${dataObjs[i][legend_field]}. `
//     legendNode.addChild(segmentInfo)
// }









// console.log(rootNode)
// console.log(XAxisNode)
console.log(legendNode.children[0])
// console.log(XAxisNode.children[0])




// Build Legend Side






// End of outer function
// }
// outer()


