var groupSelection = false,
  isDragging = false;
var theGroup;
var possibleOtherGroups;

function initilizeGroupAnnotation() {
  // TBD: variable initilization
  theGroup = [];
  const leafGroups = getLeafGroups();
  VA.marksHaveGroupAnnotation = leafGroups.flat();
  d3.select("#specifiedGroups").selectAll("label").remove();
  leafGroups.forEach((group) => {
    let groupDiv = document.createElement("div");
    let label = document.createElement("label");
    label.classList.add("specifiedGroup");
    label.innerHTML = group.join(", ");
    d3.select(label)
      // .style("font-family", "'Arial', sans-serif")
      // .style("font-size", "16px")
      // .style("color", "#333")
      // .style("background-color", "#CCFFFF")
      // .style("padding", "8px 12px")
      // .style("border-radius", "4px")
      // .style("display", "inline-block")
      // .style("margin-bottom", "5px")
      .on("mouseover", function () {
        // d3.select(this)
        //   .style("background-color", "#e9e9e9")
        //   .style("cursor", "pointer");
        highlightOnePossibleGroup(group);
      })
      .on("mouseout", function () {
        //d3.select(this).style("background-color", "#f0f0f0");
        unhighlightOnePossibleGroup(group);
      });
    groupDiv.appendChild(label);
    document.getElementById("specifiedGroups").appendChild(groupDiv);
  });

  // To be completed
  mainChartMarks = Object.keys(VA.allElements).filter(
    (m) => VA.allElements[m].role === "Main Chart Mark"
  ); // main chart marks

  allSVGElementID.forEach((id) => {
    d3.select("#" + id).style(
      "opacity",
      theGroup.length === 0
        ? mainChartMarks.includes(id)
          ? "1"
          : "0.3"
        : theGroup.map((e) => e.id).includes(id)
        ? "1"
        : "0.3"
    );
  });

  groupSelection = true;
  enableAreaSelection4GroupAnnotation();

  const colorBasedSelection = document.getElementById(
    "colorBasedGroupSelection"
  );
  colorBasedSelection.innerHTML = "";
  mainChartMarks
    .map((id) => VA.allElements[id].fill)
    .filter(onlyUnique)
    .forEach((color) => {
      let button = document.createElement("button");
      button.setAttribute("class", "btn btn-outline-secondary selectionBtn");
      button.setAttribute("type", "button");
      // hover event TBD
      button.onclick = function () {
        theGroup = mainChartMarks
          .filter((thisMarkID) => VA.allElements[thisMarkID].fill === color)
          .map((id) => document.getElementById(id));
        showSelectedMarks();
        theGroup.forEach((element) => {
          element.classList.add("selected4Group");
          element.classList.remove("unselected4Group");
          // set element opacity to be 1
          d3.select("#" + element.id).style("opacity", "1");
        });
      };
      //button.innerHTML = color;
      button.innerHTML = "Select all marks whose fill is " + color;
      button.innerHTML +=
        ' <div class="inline-container"><div class="inline-rectangle" style="background-color: ' +
        color +
        '; border: 2px solid black; margin-bottom:4px;"></div></div>';
      colorBasedSelection.appendChild(button);
    });

  const typeBasedSelection = document.getElementById("typeBasedSelection");
  typeBasedSelection.innerHTML = "";
  mainChartMarks
    .map((id) => VA.allElements[id].type)
    .filter(onlyUnique)
    .forEach((type) => {
      let button = document.createElement("button");
      button.setAttribute("class", "btn btn-outline-secondary selectionBtn");
      button.setAttribute("type", "button");
      // hover event TBD
      button.onclick = function () {
        theGroup = mainChartMarks
          .filter((thisMarkID) => VA.allElements[thisMarkID].type === type)
          .map((id) => document.getElementById(id));
        showSelectedMarks();
        theGroup.forEach((element) => {
          element.classList.add("selected4Group");
          element.classList.remove("unselected4Group");
          // set element opacity to be 1
          d3.select("#" + element.id).style("opacity", "1");
        });
      };
      // button.innerHTML = type;
      button.innerHTML = "Select all " + type.toLowerCase() + " marks";
      typeBasedSelection.appendChild(button);
    });
}

function clearGrouping() {
  d3.select("#specifiedGroups").selectAll("label").remove();
  d3.select("#possibleOtherGroups").selectAll("div").remove();
  d3.select("#higherLevelGroups").selectAll("label").remove();
  document.getElementById("possibleOtherGroupsContainer").style.visibility =
    "hidden";
  document.getElementById("higherLevelGroups").style.visibility = "hidden";
  resetGrouping();
  VA.marksHaveGroupAnnotation = [];
  possibleOtherGroups = [];
  theGroup = [];
  groupSelection = true;
  isDragging = false;
  allSVGElementID.forEach((id) => {
    d3.select("#" + id).style(
      "opacity",
      theGroup.length === 0
        ? mainChartMarks.includes(id)
          ? "1"
          : "0.3"
        : theGroup.map((e) => e.id).includes(id)
        ? "1"
        : "0.3"
    );
  });
}

function clickEvent4FormingGroupButton(e) {
  e.stopPropagation();
  if (theGroup.length === 0) return;
  // display the new group
  console.log(theGroup.map((e) => e.id));
  let markIds = theGroup.map((e) => e.id);
  addLeafGroup(markIds); // Use helper to add to hierarchical structure
  VA.marksHaveGroupAnnotation = VA.marksHaveGroupAnnotation.concat(markIds);
  let groupDiv = document.createElement("div");
  let label = document.createElement("label");
  label.classList.add("specifiedGroup");
  label.innerHTML = markIds.join(", ");
  d3.select(label)
    // .style("font-family", "'Arial', sans-serif")
    // .style("font-size", "16px")
    // .style("color", "#333")
    // .style("background-color", "#f0f0f0")
    // .style("padding", "8px 12px")
    // .style("border-radius", "4px")
    // .style("display", "inline-block")
    // .style("margin-bottom", "5px")
    .on("mouseover", function () {
      // d3.select(this)
      //   .style("background-color", "#e9e9e9")
      //   .style("cursor", "pointer");
      highlightOnePossibleGroup(label.innerHTML.split(", "));
    })
    .on("mouseout", function () {
      //d3.select(this).style("background-color", "#f0f0f0");
      unhighlightOnePossibleGroup(label.innerHTML.split(", "));
    });
  groupDiv.appendChild(label);
  document.getElementById("specifiedGroups").appendChild(groupDiv);

  // if the group is the first one, infer other groups
  // we may also allow inferrence when we have >1 groups
  if (getLeafGroups().length === 1) {
    possibleOtherGroups = inferOtherGroups();
    if (possibleOtherGroups.length > 0) {
      document.getElementById("possibleOtherGroupsContainer").style.visibility =
        "visible";
      possibleOtherGroups.forEach((group) => {
        let groupDiv = document.createElement("div");
        let label = document.createElement("label");
        label.classList.add("possibleGroup");
        label.innerHTML = group.join(", ");
        d3.select(label)
          .style("font-family", "'Arial', sans-serif")
          .style("font-size", "16px")
          .style("color", "#333")
          .style("background-color", "#f0f0f0")
          .style("padding", "8px 12px")
          .style("border-radius", "4px")
          .style("display", "inline-block")
          .style("margin-bottom", "5px")
          .on("mouseover", function () {
            d3.select(this)
              .style("background-color", "#e9e9e9")
              .style("cursor", "pointer");
            highlightOnePossibleGroup(group);
          })
          .on("mouseout", function () {
            d3.select(this).style("background-color", "#f0f0f0");
            unhighlightOnePossibleGroup(group);
          });
        groupDiv.appendChild(label);
        document.getElementById("possibleOtherGroups").appendChild(groupDiv);
      });
    }
  }

  theGroup = [];
  document.getElementById("selectedGroup").innerHTML = "";

  console.log(VA.marksHaveGroupAnnotation);
  console.log(getLeafGroups()); // Show current leaf groups
}

function inferOtherGroups() {
  possibleOtherGroups = [];
  let leafGroups = getLeafGroups();
  let referenceGroup = sortByEndingNumber(leafGroups[0]);
  if (referenceGroup.length === 0) return;
  let remainingMarks = sortByEndingNumber(
    mainChartMarks.filter((m) => !VA.marksHaveGroupAnnotation.includes(m))
  );
  let remainingGroups = [];
  while (remainingMarks.length > 0) {
    let thisGroup = [];
    referenceGroup.forEach((mark, i) => {
      let matchingString;
      if (
        i === 0 ||
        extractNonNumeric(mark) !== extractNonNumeric(referenceGroup[i - 1])
      )
        matchingString = findMatchingString(mark, remainingMarks);
      else {
        matchingString =
          extractNonNumeric(mark) +
          (extractNumber(thisGroup[i - 1]) +
            (extractNumber(referenceGroup[i]) -
              extractNumber(referenceGroup[i - 1])));
      }
      if (remainingMarks.includes(matchingString)) {
        thisGroup.push(matchingString);
        remainingMarks = remainingMarks.filter((m) => m !== matchingString);
      } else {
        return [];
      }
    });
    if (thisGroup.length === 0) return [];
    remainingGroups.push(thisGroup);
  }
  return remainingGroups;
}

function findMatchingString(exampleString, stringArray) {
  // Extract the character part from the example string
  let charPart = exampleString.match(/[a-zA-Z]+/)[0];

  // Find the first string in the array that starts with the same character part
  return stringArray.find((str) => str.startsWith(charPart));
}

function checkIntersection(element, rect) {
  // TBD: can store the bounding box and reuse it if the element's position never changes
  // Get the CTM (Current Transformation Matrix) of the SVG element
  let ctm = element.getCTM();

  // Get the bounding box of the element
  let bbox = element.getBBox();

  // Calculate the position within the SVG
  let x = bbox.x * ctm.a + ctm.e;
  let y = bbox.y * ctm.d + ctm.f;

  // Calculate the right and bottom positions
  var width = bbox.width * ctm.a;
  var height = bbox.height * ctm.d;

  return isOverlap({ x, y, width, height }, rect);
}

function updateSelection(bbox4Selection) {
  mainChartMarks
    .filter((id) => !VA.marksHaveGroupAnnotation.includes(id))
    .forEach((elementID) => {
      let element = document.getElementById(elementID);
      if (checkIntersection(element, bbox4Selection)) {
        element.classList.add("selected4Group");
        element.classList.remove("unselected4Group");
        if (!theGroup.includes(element)) {
          theGroup.push(element);
        }
        d3.select("#" + elementID).style("opacity", "1");
      } else {
        element.classList.add("unselected4Group");
        element.classList.remove("selected4Group");
        theGroup = theGroup.filter((item) => item !== element);
        d3.select("#" + elementID).style("opacity", "0.3");
      }
    });
  showSelectedMarks();
}

function enableAreaSelection4GroupAnnotation() {
  let clickHold = false,
    layerX,
    layerY,
    clientX,
    clientY;
  d3.select("#vis")
    .on("mousedown", function (e) {
      e.preventDefault();
      isDragging = false;
      allSVGElementID.forEach((id) => {
        d3.select("#" + id).style("opacity", "0.3");
      }); // set opacity
      clickHold = true;
      clientX = e.clientX;
      clientY = e.clientY;
      layerX = e.layerX;
      layerY = e.layerY;
    })
    .on("mousemove", function (e) {
      e.preventDefault();
      if (!clickHold || !groupSelection) return;
      let x = e.layerX,
        y = e.layerY;
      if (x !== layerX || y !== layerY) isDragging = true;
      let left = Math.min(x, layerX),
        top = Math.min(y, layerY),
        wd = Math.abs(layerX - x),
        ht = Math.abs(layerY - y);
      d3.select("#overlaySelection")
        .attr("width", wd)
        .attr("height", ht)
        .attr("x", left)
        .attr("y", top)
        .style("visibility", "visible");
      updateSelection({ x: left, y: top, width: wd, height: ht });
    })
    .on("mouseup", function (e) {
      e.preventDefault();
      clickHold = false;
      if (isDragging) {
        d3.select("#overlaySelection").style("visibility", "hidden");
      } else {
        // find which SVG element within mainChartMarks is clicked on
        let x = e.layerX,
          y = e.layerY;
        let clickedElement = mainChartMarks.find((elementID) => {
            let element = document.getElementById(elementID);
            return checkIntersection(element, { x, y, width: 1, height: 1 });
          }), // clicked element
          element = document.getElementById(clickedElement);
        if (element === null || VA.marksHaveGroupAnnotation.includes(element.id)) {
          theGroup.forEach((ele) => {
            ele.classList.add("unselected4Group");
            ele.classList.remove("selected4Group");
          });
          theGroup = [];
        } else {
          if (theGroup.includes(element)) {
            element.classList.add("unselected4Group");
            element.classList.remove("selected4Group");
            theGroup = theGroup.filter((item) => item !== element);
          } else {
            element.classList.add("selected4Group");
            element.classList.remove("unselected4Group");
            theGroup.push(element);
          }
        }
        mainChartMarks.forEach((id) => {
          d3.select("#" + id).style(
            "opacity",
            theGroup.includes(document.getElementById(id)) ? "1" : "0.3"
          );
        }); // set opacity
        showSelectedMarks();
      }
    });
}

// function showSelectedMarks() {
//   document.getElementById("selectedGroup").innerHTML = "";
//   theGroup.forEach((element) => {
//     // for each selected mark, append a button whose text is the mark's ID in the selectedGroup div
//     let markID = element.id;
//     let button = document.createElement("button");
//     button.setAttribute("class", "btn btn-outline-secondary");
//     button.setAttribute("type", "button");
//     button.setAttribute("data-toggle", "tooltip");
//     button.setAttribute("data-placement", "top");
//     button.setAttribute("padding-right", "5px");
//     button.innerHTML = markID;
//     document.getElementById("selectedGroup").appendChild(button);
//   });
// }

function selectAllMarks() {
  theGroup = mainChartMarks.map((id) => document.getElementById(id));
  showSelectedMarks();
  mainChartMarks.forEach((id) => {
    let element = document.getElementById(id);
    element.classList.add("selected4Group");
    element.classList.remove("unselected4Group");
    d3.select("#" + id).style("opacity", "1");
  });
}

function showSelectedMarks() {
  document.getElementById("selectionForGrouping").innerHTML = theGroup.length;
  document.getElementById("selectedGroup").innerHTML = "";
  theGroup.forEach((element) => {
    let markID = element.id;

    // Create a container div for each button and its cross mark
    let container = document.createElement("div");
    container.setAttribute("class", "button-container");
    container.style.position = "relative";
    container.style.display = "inline-block"; // Ensure buttons are in a line
    container.style.marginRight = "10px"; // Gap between buttons

    // Create the button
    let button = document.createElement("button");
    button.setAttribute("class", "btn btn-outline-secondary");
    button.setAttribute("type", "button");
    button.setAttribute("data-toggle", "tooltip");
    button.setAttribute("data-placement", "top");
    button.innerHTML = markID;

    // Create the cross mark
    let crossMark = document.createElement("span");
    crossMark.innerHTML = "&times;"; // Cross symbol
    crossMark.setAttribute("id", "cross-mark_" + markID);
    crossMark.style.color = "red";
    crossMark.style.position = "absolute";
    crossMark.style.top = "4px";
    crossMark.style.right = "4px";
    crossMark.style.cursor = "pointer";
    crossMark.style.fontSize = "20px"; // Adjust size as needed
    crossMark.style.transform = "translate(50%, -50%)"; // Center the cross mark

    // Add click event to the cross mark for removing the button
    crossMark.onclick = function (e) {
      e.stopPropagation();
      let thisMarkID = e.target.id.split("_")[1];
      e.target.parentElement.remove();
      theGroup = theGroup.filter((item) => item.id !== thisMarkID);
      d3.select("#" + thisMarkID).style("opacity", "0.3");
    };

    container.appendChild(button);
    container.appendChild(crossMark);
    document.getElementById("selectedGroup").appendChild(container);
  });
}

highlightOnePossibleGroup = (group) => {
  VA.marksHaveGroupAnnotation.forEach((id) => {
    d3.select("#" + id).style("opacity", "0.3");
  });
  group.forEach((id) => {
    d3.select("#" + id).style("opacity", "1");
  });
};

unhighlightOnePossibleGroup = (group) => {
  group.forEach((id) => {
    d3.select("#" + id).style("opacity", "0.3");
  });
  document.getElementById("selectedGroup").childNodes.forEach((button) => {
    let markID = button.innerHTML;
    d3.select("#" + markID).style("opacity", "1");
  });
};

acceptInferredGroups = () => {
  possibleOtherGroups.forEach((group) => {
    addLeafGroup(group); // Use helper to add to hierarchical structure
    VA.marksHaveGroupAnnotation = VA.marksHaveGroupAnnotation.concat(group);
    let groupDiv = document.createElement("div");
    let label = document.createElement("label");
    label.classList.add("specifiedGroup");
    label.innerHTML = group.join(", ");
    d3.select(label)
      // .style("font-family", "'Arial', sans-serif")
      // .style("font-size", "16px")
      // .style("color", "#333")
      // .style("background-color", "#CCFFFF")
      // .style("padding", "8px 12px")
      // .style("border-radius", "4px")
      // .style("display", "inline-block")
      // .style("margin-bottom", "5px")
      .on("mouseover", function () {
        // d3.select(this)
        //   .style("background-color", "#e9e9e9")
        //   .style("cursor", "pointer");
        highlightOnePossibleGroup(group);
      })
      .on("mouseout", function () {
        //d3.select(this).style("background-color", "#f0f0f0");
        unhighlightOnePossibleGroup(group);
      });
    groupDiv.appendChild(label);
    document.getElementById("specifiedGroups").appendChild(groupDiv);
  });
  possibleOtherGroups = [];
  document.getElementById("possibleOtherGroupsContainer").style.visibility =
    "hidden";
};

rejectInferredGroups = () => {
  possibleOtherGroups = [];
  document.getElementById("possibleOtherGroupsContainer").style.visibility =
    "hidden";
};

function createLabel(text) {
  let label = document.createElement("label");
  label.classList.add("specifiedGroup");
  label.innerHTML = text;
  // label.style.fontFamily = "'Arial', sans-serif";
  // label.style.fontSize = "16px";
  // label.style.color = "#333";
  // // label.style.backgroundColor = "#f0f0f0";
  // label.style.backgroundColor = "#CCFFFF";
  // label.style.padding = "3px";
  // label.style.margin = "40px 5px 5px 5px";
  label.style.border = "2.5px solid black";
  // label.style.borderRadius = "4px";
  // label.style.display = "inline-block";
  return label;
}

function processGroup(group, parentElement) {
  let thisLabel;
  console.log(group);
  if (Array.isArray(group)) {
    // Create a parent label if the group is an array (nested structure)
    thisLabel = createLabel("");
    group.forEach((subGroup) => processGroup(subGroup, thisLabel));
    parentElement.appendChild(thisLabel);
  } else {
    // group is a node with {id, children, layout}
    // Create a label for individual group node
    let marks = getGroupMarks(group.id);
    thisLabel = createLabel(marks.join(", "));
    parentElement.appendChild(thisLabel);
  }

  let thisGroup = Array.isArray(group)
    ? group
        .flat(Infinity)
        .map((node) => getGroupMarks(node.id))
        .flat(Infinity)
    : getGroupMarks(group.id);
  d3.select(thisLabel)
    .on("mouseover", function (e) {
      e.stopPropagation();
      // d3.select(this)
      //   .style("background-color", "#e9e9e9")
      //   .style("cursor", "pointer");
      thisGroup.forEach((id) => {
        d3.select("#" + id).style("opacity", "1");
      });
    })
    .on("mouseout", function () {
      //d3.select(this).style("background-color", "#f0f0f0");
      if (d3.select(this).style("border") === "2.5px solid black")
        thisGroup.forEach((id) => {
          d3.select("#" + id).style("opacity", "0.3");
        });
    });
  if (parentElement.id === "higherLevelGroups") {
    d3.select(thisLabel).on("click", function () {
      let newBorder =
        d3.select(this).style("border") === "2.5px solid black"
          ? "2.5px solid red"
          : "2.5px solid black";
      d3.select(this).style("border", newBorder);
      if (newBorder === "2.5px solid red") {
        thisGroup.forEach((id) => {
          d3.select("#" + id).style("opacity", "1");
        });
      } else {
        thisGroup.forEach((id) => {
          d3.select("#" + id).style("opacity", "0.3");
        });
      }
    });
  }
}

function go2HigherGrouping() {
  if (mainChartMarks.length !== VA.marksHaveGroupAnnotation.length) {
    alert(
      "Please make sure each main chart mark has been allocated to a group first."
    );
    return;
  }

  d3.select("#current-section").style("visibility", "hidden");
  d3.select("#specifiedGroups").style("visibility", "hidden");
  d3.select("#specifiedGroupsHeader").style("visibility", "hidden");
  d3.select("#higherGroupBtn").style("visibility", "hidden");
  d3.select("#higherLevelGroups").style("visibility", "visible");
  d3.select("#higherLevelGroups").selectAll("label").remove();

  // Display all top-level groups (leaf groups in the hierarchy)
  VA.grouping.forEach((group) => {
    processGroup(group, document.getElementById("higherLevelGroups"));
  });

  // groupAnnotations.forEach((group) => {
  //   let label = document.createElement("label");
  //   label.classList.add("specifiedGroup");
  //   label.innerHTML = group.join(", ");
  //   // TBD: unify the label style with the one in the previous section; can use a inficator nexted variable to control
  //   d3.select(label)
  //     .style("font-family", "'Arial', sans-serif")
  //     .style("font-size", "16px")
  //     .style("color", "#333")
  //     .style("background-color", "#f0f0f0")
  //     .style("padding", "3px")
  //     .style("margin", "5px")
  //     .style("border", "2.5px solid black")
  //     .style("border-radius", "4px")
  //     .style("display", "inline-block")
  //     .on("mouseover", function () {
  //       d3.select(this)
  //         .style("background-color", "#e9e9e9")
  //         .style("cursor", "pointer");
  //       group.forEach((id) => {
  //         d3.select("#" + id).style("opacity", "1");
  //       });
  //     })
  //     .on("mouseout", function () {
  //       d3.select(this).style("background-color", "#f0f0f0");
  //       if (d3.select(this).style("border") === "2.5px solid black")
  //         group.forEach((id) => {
  //           d3.select("#" + id).style("opacity", "0.3");
  //         });
  //     })
  //     .on("click", function () {
  //       let newBorder =
  //         d3.select(this).style("border") === "2.5px solid black"
  //           ? "2.5px solid red"
  //           : "2.5px solid black";
  //       d3.select(this).style("border", newBorder);
  //       if (newBorder === "2.5px solid red") {
  //         group.forEach((id) => {
  //           d3.select("#" + id).style("opacity", "1");
  //         });
  //       } else {
  //         group.forEach((id) => {
  //           d3.select("#" + id).style("opacity", "0.3");
  //         });
  //       }
  //     });
  //   document.getElementById("higherLevelGroups").appendChild(label);
  // });
}

var selectedGroups;

function mergeGroups() {
  selectedGroups = [];
  let selectedLabels = [];
  let selectedGroupNodes = [];
  let indices2beRemoved = [];
  document
    .getElementById("higherLevelGroups")
    .childNodes.forEach((label, i) => {
      if (label.nodeName !== "LABEL") return;
      if (label.style.border === "2.5px solid red") {
        selectedLabels.push(label);
        processLabelInnerHtml(label);
        indices2beRemoved.push(i - 5); // 3 is the number of divs before the first label by inspecting the DOM
        selectedGroupNodes.push(VA.grouping[i - 5]);
      }
    });

  if (selectedGroups.length === 0 || indices2beRemoved.length === 1) {
    alert("Please select at least one group.");
    return;
  }

  // Create a new parent group containing the selected groups
  let newGroupId = "g" + Date.now();
  let newParentGroup = {
    id: newGroupId,
    children: selectedGroupNodes,
    layout: null // Can be set later
  };

  // Remove selected groups from top level and add the new parent group
  VA.grouping = VA.grouping.filter((g, i) => !indices2beRemoved.includes(i));
  VA.grouping.push(newParentGroup);
  console.log(VA.grouping);

  let mergedGroup = [...selectedGroups.flat()];

  // TBD: design data structure to store nested grouping

  let label = document.createElement("label");
  label.classList.add("specifiedGroup");

  // TBD: unify the label style with the one in the previous section

  selectedLabels.forEach((selectedlabel) => {
    d3.select(selectedlabel)
      .style("border", "2.5px solid black")
      .on("click", null);
    label.appendChild(selectedlabel);
  });

  document.getElementById("higherLevelGroups").appendChild(label);

  d3.select(label)
    // .style("font-family", "'Arial', sans-serif")
    // .style("font-size", "16px")
    // .style("color", "#333")
    // .style("background-color", "#f0f0f0")
    // .style("padding", "3px")
    // .style("margin", "5px")
    // .style("border", "2.5px solid black")
    // .style("border-radius", "4px")
    // .style("display", "inline-block")
    .on("mouseover", function (e) {
      e.stopPropagation();
      // d3.select(this)
      //   .style("background-color", "#e9e9e9")
      //   .style("cursor", "pointer");
      mergedGroup.forEach((id) => {
        d3.select("#" + id).style("opacity", "1");
      });
    })
    .on("mouseout", function () {
      //d3.select(this).style("background-color", "#f0f0f0");
      if (d3.select(this).style("border") === "2.5px solid black")
        mergedGroup.forEach((id) => {
          d3.select("#" + id).style("opacity", "0.3");
        });
    })
    .on("click", function () {
      let newBorder =
        d3.select(this).style("border") === "2.5px solid black"
          ? "2.5px solid red"
          : "2.5px solid black";
      d3.select(this).style("border", newBorder);
      if (newBorder === "2.5px solid red") {
        mergedGroup.forEach((id) => {
          d3.select("#" + id).style("opacity", "1");
        });
      } else {
        mergedGroup.forEach((id) => {
          d3.select("#" + id).style("opacity", "0.3");
        });
      }
    });
}

function selectAllGroups() {
  document.getElementById("higherLevelGroups").childNodes.forEach((label) => {
    if (label.nodeName !== "LABEL") return;
    d3.select(label).style("border", "2.5px solid red");
  });
}

function processLabelInnerHtml(node) {
  if (node.childNodes.length >= 2) {
    node.childNodes.forEach((childNode) => processLabelInnerHtml(childNode));
  } else {
    selectedGroups.push(...node.innerHTML.split(", "));
  }
}

function clearMergedGroups() {
  // Flatten any nested groups back to top level
  // This essentially "unmerges" any groups that were merged
  let flattenedGroups = [];
  
  function flattenGroup(node) {
    if (Array.isArray(node.children) && typeof node.children[0] === 'string') {
      // Leaf group - just add it
      flattenedGroups.push(node);
    } else if (Array.isArray(node.children)) {
      // Parent group - flatten its children
      node.children.forEach(child => flattenGroup(child));
    }
  }
  
  VA.grouping.forEach(group => flattenGroup(group));
  VA.grouping = flattenedGroups;
  
  d3.select("#higherLevelGroups").selectAll("label").remove();
  VA.grouping.forEach((group) => {
    processGroup(group, document.getElementById("higherLevelGroups"));
  });
}
