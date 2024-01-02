var groupSelection = false,
  isDragging = false;
var theGroup;
var groupAnnotations = [];
var marksHaveGroupAnnotation;
var possibleOtherGroups;

function initilizeGroupAnnotation() {
  document
    .getElementById("button4FormingGroups")
    .addEventListener("click", (e) => {
      e.stopPropagation();
      if (theGroup.length === 0) return;
      // display the new group
      groupAnnotations.push(theGroup.map((e) => e.id)); //TBD: filter unique
      marksHaveGroupAnnotation = marksHaveGroupAnnotation.concat(
        theGroup.map((e) => e.id)
      );
      let groupDiv = document.createElement("div");
      let label = document.createElement("label");
      let thisID = "specifiedGroup" + groupAnnotations.length;
      label.setAttribute("id", thisID);
      label.innerHTML =
        "Group " +
        groupAnnotations.length +
        ": " +
        theGroup.map((e) => e.id).join(", ");
      groupDiv.appendChild(label);
      document.getElementById("specifiedGroups").appendChild(groupDiv);
      d3.select("#" + thisID)
        .style("font-family", "'Arial', sans-serif")
        .style("font-size", "16px")
        .style("color", "#333")
        .style("background-color", "#f0f0f0")
        .style("border", "1px solid #ddd")
        .style("padding", "8px 12px")
        .style("border-radius", "4px")
        .style("display", "inline-block")
        .style("margin-bottom", "5px")
        .on("mouseover", function () {
          d3.select(this)
            .style("background-color", "#e9e9e9")
            .style("cursor", "pointer");
          highlightOnePossibleGroup(label.innerHTML.split(": ")[1].split(", "));
        })
        .on("mouseout", function () {
          d3.select(this).style("background-color", "#f0f0f0");
          unhighlightOnePossibleGroup(
            label.innerHTML.split(": ")[1].split(", ")
          );
        });

      // if the group is the first one, infer other groups
      // we may also allow inferrence when we have >1 groups
      if (groupAnnotations.length === 1) {
        possibleOtherGroups = inferOtherGroups();
        if (possibleOtherGroups.length > 0) {
          document.getElementById(
            "possibleOtherGroupsContainer"
          ).style.visibility = "visible";
          possibleOtherGroups.forEach((group) => {
            let groupDiv = document.createElement("div");
            let label = document.createElement("label");
            let thisID =
              "possibleGroup" + (possibleOtherGroups.indexOf(group) + 1);
            label.setAttribute("id", thisID);
            label.innerHTML = group;
            groupDiv.appendChild(label);
            document
              .getElementById("possibleOtherGroups")
              .appendChild(groupDiv);
            d3.select("#" + thisID)
              .style("font-family", "'Arial', sans-serif")
              .style("font-size", "16px")
              .style("color", "#333")
              .style("background-color", "#f0f0f0")
              .style("border", "1px solid #ddd")
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
          });
        }
      }

      // for debugging
      theGroup = [];
      console.log(marksHaveGroupAnnotation);
      console.log(groupAnnotations);
    });

  // To be completed
  mainChartMarks = Object.keys(markInfo).filter(
    (m) => markInfo[m].Role === "Main Chart Mark"
  ); // main chart marks
  theGroup = [];

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
}

function inferOtherGroups() {
  let referenceGroup = sortByEndingNumber(groupAnnotations[0]);
  if (referenceGroup.length === 0) return;
  let remainingMarks = sortByEndingNumber(
    mainChartMarks.filter((m) => !marksHaveGroupAnnotation.includes(m))
  );
  let remainingGroups = [];
  while (remainingMarks.length > 0) {
    // TBD: check also the differences between the number part of corresponding marks
    let thisGroup = [];
    referenceGroup.forEach((mark) => {
      let matchingString = findMatchingString(mark, remainingMarks);
      if (matchingString !== undefined) {
        thisGroup.push(matchingString);
        remainingMarks = remainingMarks.filter((m) => m !== matchingString);
      } else {
        return [];
      }
    });
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
    .filter((id) => !marksHaveGroupAnnotation.includes(id))
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
        if (element === null) {
          theGroup.forEach((element) => {
            element.classList.add("unselected4Group");
            element.classList.remove("selected4Group");
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

function showSelectedMarks() {
  document.getElementById("selectedGroup").innerHTML = "";
  theGroup.forEach((element) => {
    // for each selected mark, append a button whose text is the mark's ID in the selectedGroup div
    let markID = element.id;
    let button = document.createElement("button");
    button.setAttribute("class", "btn btn-outline-secondary");
    button.setAttribute("type", "button");
    button.setAttribute("data-toggle", "tooltip");
    button.setAttribute("data-placement", "top");
    button.innerHTML = markID;
    document.getElementById("selectedGroup").appendChild(button);
  });
}

highlightOnePossibleGroup = (group) => {
  marksHaveGroupAnnotation.forEach((id) => {
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
    groupAnnotations.push(group);
    marksHaveGroupAnnotation = marksHaveGroupAnnotation.concat(group);
    let groupDiv = document.createElement("div");
    let label = document.createElement("label");
    let thisID = "specifiedGroup" + groupAnnotations.length;
    label.setAttribute("id", thisID);
    label.innerHTML =
      "Group " + groupAnnotations.length + ": " + group.join(", ");
    groupDiv.appendChild(label);
    document.getElementById("specifiedGroups").appendChild(groupDiv);
    d3.select("#" + thisID)
      .style("font-family", "'Arial', sans-serif")
      .style("font-size", "16px")
      .style("color", "#333")
      .style("background-color", "#f0f0f0")
      .style("border", "1px solid #ddd")
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
