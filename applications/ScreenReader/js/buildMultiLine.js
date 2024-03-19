currentNode = "root";

function initilizeMultiLineChart() {
  chartName = "LineGraph17";
  currentNode = "root";
  // Fetch the corresponding annotation tool JSON file
  var jsonXhr = new XMLHttpRequest();
  jsonXhr.onreadystatechange = function () {
    if (jsonXhr.readyState === 4 && jsonXhr.status === 200) {
      var annotationData = JSON.parse(jsonXhr.responseText);
      // Process the annotation data as needed
      console.log(annotationData);
      builtTree_multiLine(annotationData.annotations);
    }
  };
  jsonXhr.open(
    "GET",
    "targeted SVGs with Annotations/" + chartName + ".json",
    true
  );
  jsonXhr.send();
}

function builtTree_multiLine(annotation) {
  markInfo = annotation["markInfo"];
  allElements = annotation["allGraphicsElement"];
  referenceElements = annotation["referenceElement"];
  mainChartMarks = Object.keys(markInfo)
    .filter(
      (key) =>
        markInfo[key]["Role"] === "Main Chart Mark" &&
        markInfo[key]["Type"] !== "Polyline"
    )
    .map((id) => allElements[id])
    .sort((a, b) => a.left - b.left);
  console.log(mainChartMarks);
  var treeRepresentation = {
    root: {
      level: 0,
      name: "Daily sessions and users at www.highcharts.com from 12/18/17 to 1/17/18.",
      marks: mainChartMarks,
      children: ["1_half", "2_half"],
      parent: null,
    },
  };
  const length = mainChartMarks.length;
  // add the first half month
  treeRepresentation["1_half"] = {
    level: 1,
    name: "The first half month",
    marks: mainChartMarks.slice(0, Math.floor(length / 2)),
    children: ["1_forth", "2_forth"],
    parent: "root",
  };

  // add the first forth month
  treeRepresentation["1_forth"] = {
    level: 2,
    name: "The first forth month",
    marks: mainChartMarks.slice(0, Math.floor(length / 4)),
    children: null,
    parent: "1_half",
  };

  // add the second forth month
  treeRepresentation["2_forth"] = {
    level: 2,
    name: "The second forth month",
    marks: mainChartMarks.slice(Math.floor(length / 4), Math.floor(length / 2)),
    children: null,
    parent: "1_half",
  };

  // add the second half month
  treeRepresentation["2_half"] = {
    level: 1,
    name: "The second half month",
    marks: mainChartMarks.slice(Math.floor(length / 2), length),
    children: ["3_forth", "4_forth"],
    parent: "root",
  };

  // add the third forth month
  treeRepresentation["3_forth"] = {
    level: 2,
    name: "The third forth month",
    marks: mainChartMarks.slice(
      Math.floor(length / 2),
      Math.floor(length / 2) + Math.floor(length / 4)
    ),
    children: null,
    parent: "2_half",
  };

  // add the fourth forth month
  treeRepresentation["4_forth"] = {
    level: 2,
    name: "The fourth forth month",
    marks: mainChartMarks.slice(
      Math.floor(length / 2) + Math.floor(length / 4),
      length
    ),
    children: null,
    parent: "2_half",
  };

  // add grid nodes
  horiGridLines = referenceElements.xGridlines
    .map((line) => allElements[line])
    .sort((a, b) => a.top - b.top);
  vetiGridLines = referenceElements.yGridlines
    .map((line) => allElements[line])
    .sort((a, b) => a.left - b.left);
  for (let i = 0; i < horiGridLines.length; i++) {
    for (let j = 0; j < vetiGridLines.length; j++) {
      treeRepresentation[i + "_" + j] = {
        level: 3,
        name: "The grid view, now at " + i + "," + j,
        marks: mainChartMarks.filter(
          (mark) =>
            parseFloat(mark.top) >= parseFloat(horiGridLines[i].top) &&
            parseFloat(mark.left) >= parseFloat(vetiGridLines[j].left) &&
            parseFloat(mark.top) <
              (horiGridLines[i + 1]
                ? parseFloat(horiGridLines[i + 1].top)
                : 10000000) &&
            parseFloat(mark.left) <
              (vetiGridLines[j + 1]
                ? parseFloat(vetiGridLines[j + 1].left)
                : 10000000)
        ),
        children: null,
        parent: "root",
      };
    }
  }

  console.log(treeRepresentation);
  addKeyBoardNavigation_multiLine(treeRepresentation, mainChartMarks);
}

function addKeyBoardNavigation_multiLine(treeRepresentation, allMarks) {
  var lastKeyPressedDiv = document.getElementById("last-key-pressed");
  // Listen to the keyboard event
  document.onkeydown = function (event) {
    switch (event.key) {
      case "ArrowUp":
        navigateUp_multiLine(treeRepresentation);
        lastKeyPressedDiv.textContent = "Last key pressed: ArrowUp";
        break;
      case "ArrowRight":
        navigateRight_multiLine(treeRepresentation);
        lastKeyPressedDiv.textContent = "Last key pressed: ArrowRight";
        break;
      case "ArrowDown":
        navigateDown_multiLine(treeRepresentation);
        lastKeyPressedDiv.textContent = "Last key pressed: ArrowDown";
        break;
      case "ArrowLeft":
        navigateLeft_multiLine(treeRepresentation);
        lastKeyPressedDiv.textContent = "Last key pressed: ArrowLeft";
        break;
      case "s":
        lastKeyPressedDiv.textContent = "Last key pressed: s";
        if (treeRepresentation[currentNode].level === 3) {
          nextNode =
            parseInt(currentNode.split("_")[0]) +
            1 +
            "_" +
            parseInt(currentNode.split("_")[1]);
          if (treeRepresentation[nextNode] !== undefined) {
            currentNode = nextNode;
            console.log("Navigated to:", treeRepresentation[currentNode].name);
          }
        } else {
          currentNode = "0_0";
          console.log("Navigated to: the grid view, now at 0,0");
        }
        break;
      case "w":
        lastKeyPressedDiv.textContent = "Last key pressed: w";
        nextNode =
          parseInt(currentNode.split("_")[0]) -
          1 +
          "_" +
          parseInt(currentNode.split("_")[1]);
        if (treeRepresentation[nextNode] !== undefined) {
          currentNode = nextNode;
          console.log("Navigated to:", treeRepresentation[currentNode].name);
        }
        break;
      case "a":
        lastKeyPressedDiv.textContent = "Last key pressed: a";
        nextNode =
          parseInt(currentNode.split("_")[0]) +
          "_" +
          (parseInt(currentNode.split("_")[1]) - 1);
        if (treeRepresentation[nextNode] !== undefined) {
          currentNode = nextNode;
          console.log("Navigated to:", treeRepresentation[currentNode].name);
        }
        break;
      case "d":
        lastKeyPressedDiv.textContent = "Last key pressed: d";
        nextNode =
          parseInt(currentNode.split("_")[0]) +
          "_" +
          (parseInt(currentNode.split("_")[1]) + 1);
        if (treeRepresentation[nextNode] !== undefined) {
          currentNode = nextNode;
          console.log("Navigated to:", treeRepresentation[currentNode].name);
        }
        break;
      default:
        break;
    }
    treeRepresentation[currentNode].marks.forEach((mark) => {
      document.getElementById(mark.id).style.opacity = 1;
    });
    allMarks.forEach((mark) => {
      if (!treeRepresentation[currentNode].marks.includes(mark)) {
        document.getElementById(mark.id).style.opacity = 0.3;
      }
    });
  };
}

function navigateUp_multiLine(treeRepresentation) {
  // Navigate to the parent node
  if (treeRepresentation[currentNode].parent !== null) {
    currentNode = treeRepresentation[currentNode].parent;
    console.log("Navigated to:", treeRepresentation[currentNode].name);
  }
}

function navigateDown_multiLine(treeRepresentation) {
  // Navigate to the right node
  if (treeRepresentation[currentNode].children !== null) {
    currentNode = treeRepresentation[currentNode].children[0];
    console.log("Navigated to:", treeRepresentation[currentNode].name);
  }
}

function navigateRight_multiLine(treeRepresentation) {
  // Navigate to the next sibling node
  var siblings = Object.keys(treeRepresentation)
    .filter(
      (key) =>
        treeRepresentation[key].level === treeRepresentation[currentNode].level
    )
    .sort((a, b) => parseInt(a.split("_")[0]) - parseInt(b.split("_")[0]));

  if (siblings === undefined) return;
  var currentIndex = siblings.indexOf(currentNode);
  if (currentIndex < siblings.length - 1) {
    currentNode = siblings[currentIndex + 1];
    console.log("Navigated to:", treeRepresentation[currentNode].name);
  }
}

function navigateLeft_multiLine(treeRepresentation) {
  // Navigate to the previous sibling node
  var siblings = Object.keys(treeRepresentation)
    .filter(
      (key) =>
        treeRepresentation[key].level === treeRepresentation[currentNode].level
    )
    .sort((a, b) => parseInt(a.split("_")[0]) - parseInt(b.split("_")[0]));
  if (siblings === undefined) return;
  var currentIndex = siblings.indexOf(currentNode);
  if (currentIndex > 0) {
    currentNode = siblings[currentIndex - 1];
    console.log("Navigated to:", treeRepresentation[currentNode].name);
  }
}
