var markSelection = [];
var graphicsElementTypes = [
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
var channelBasedBatchSelections4AllMarks = {};
var allLeftNodes = [];

function initilizeMarkAnnotation() {
  referenceElements.forEach((rid) => {
    d3.select("#" + rid).style("opacity", "0.1");
  });
  markSelection = []; // reset mark selection
  channelBasedBatchSelections4AllMarks = {}; // reset channel based batch selections

  allLeftNodes = Object.keys(mainContentElements)
    .map((key) => mainContentElements[key])
    .flat();

  // to be complete: handle invisible elements
  let invisibleElements = allLeftNodes.filter(
    (element) =>
      element.element.attributes["visibility"]?.value === "hidden" ||
      element.element.attributes["display"]?.value === "none" ||
      element.element.attributes["opacity"]?.value === "0" ||
      (element.element.attributes.localName === "line" &&
        (element.element.attributes["stroke-width"]?.value === "0" ||
          element.element.attributes["stroke"]?.value === "transparent")) ||
      element.element.attributes["fill"]?.value === "transparent" ||
      element.element.attributes["font-size"]?.value === "0" ||
      element.element.parentNode?.nodeName.toLowerCase() === "clippath"
  );

  allLeftNodes = allLeftNodes.filter(
    (element) => !invisibleElements.includes(element)
  );
  Object.keys(mainContentElements).forEach((key) => {
    // remove invisible elements from contentMarks
    mainContentElements[key] = mainContentElements[key].filter(
      (element) => !invisibleElements.includes(element)
    );
    if (mainContentElements[key].length === 0) delete mainContentElements[key];
  });

  leafNodeTypes = Object.keys(mainContentElements).filter((key) =>
    graphicsElementTypes.includes(key)
  );

  document.getElementById("allMarks").innerHTML = "";

  if (Object.keys(markInfo).length === 0) {
    leafNodeTypes.forEach((type) => {
      // initialize the type and role of each graphical element
      mainContentElements[type].forEach((element) => {
        markInfo[element.id] = {
          // Type: type === "path" ? "none" : type,
          Type: "none",
          Role: "none",
        };
      });
    });
  }

  leafNodeTypes.forEach((type) => {
    // then add the mark annotation divs
    mainContentElements[type].forEach((element) => {
      let markDiv = document.createElement("div");
      markDiv.classList.add("markDiv");
      markDiv.id = "mark_" + element.id;
      markDiv.innerHTML = element.id;
      let markID = element.id;
      if (!markInfo[markID])
        markInfo[markID] = {
          Type: type === "path" ? "none" : type,
          Role: "none",
        };
      if (markInfo[markID]["Type"] !== "none") {
        let typeTag = document.createElement("span");
        typeTag.innerHTML = "&nbsp;" + markInfo[markID]["Type"];
        typeTag.style.color = "#E69F00";
        markDiv.appendChild(typeTag);
      }
      if (markInfo[markID]["Role"] !== "none") {
        let roleTag = document.createElement("span");
        roleTag.innerHTML = "&nbsp;" + markInfo[markID]["Role"];
        roleTag.style.color = "#009E73";
        markDiv.appendChild(roleTag);
      }
      markDiv.style.display = "inline-block";
      markDiv.style.width = "95%";
      markDiv.style.height = "fit-content";
      markDiv.style.border = "1px solid #000";
      markDiv.style.padding = "2px";
      markDiv.style.margin = "2px";
      markDiv.style.cursor = "pointer";
      document.getElementById("allMarks").appendChild(markDiv);
      d3.select("#mark_" + element.id).on("click", () => {
        markOnClick(element.id);
      });
    });
  });

  // then populate all possible mark batch selections
  console.log(leafNodeTypes);
  leafNodeTypes.forEach((elementType) => {
    channelBasedBatchSelections4AllMarks[elementType] =
      dertermineChannelBasedBatchSelections(elementType);
  });
  console.log(channelBasedBatchSelections4AllMarks);

  document.getElementById("markSelections").innerHTML = "";

  Object.keys(channelBasedBatchSelections4AllMarks).forEach((elementType) => {
    // batch selection based on type
    let typeDiv = document.createElement("div");
    typeDiv.classList.add("selectionDiv");
    typeDiv.id = elementType + "_all";
    typeDiv.innerHTML = "Select all " + elementType + "s";
    document.getElementById("markSelections").appendChild(typeDiv);
    d3.select("#" + typeDiv.id).on("click", () => {
      selectionOnClick(
        typeDiv.id,
        mainContentElements[elementType].map((r) => r.id)
      );
    });

    // batch selection based on channels
    let channelBasedBatchSelections =
      channelBasedBatchSelections4AllMarks[elementType];
    Object.keys(channelBasedBatchSelections).forEach((channel) => {
      let valueJson = channelBasedBatchSelections[channel];
      let values = Object.keys(valueJson);
      for (let value of values) {
        let selectionDiv = document.createElement("div");
        selectionDiv.classList.add("selectionDiv");
        selectionDiv.id =
          elementType + "_" + channel + "_value" + values.indexOf(value);
        selectionDiv.innerHTML =
          "Select " + elementType + "s whose " + channel + " is " + value;
        if (channel === "fill") {
          // If the channel is 'fill', create a colored rectangle with the same fill color
          selectionDiv.innerHTML +=
            ' <div class="inline-container"><div class="inline-rectangle" style="background-color: ' +
            value +
            '; border: 2px solid black;"></div></div>';
        }

        document.getElementById("markSelections").appendChild(selectionDiv);
        d3.select("#" + selectionDiv.id).on("click", () => {
          selectionOnClick(selectionDiv.id, valueJson[value]);
        });
      }
    });
  });

  d3.selectAll(".selectionDiv")
    .style("display", "inline-block")
    .style("width", "95%")
    .style("height", "fit-content")
    .style("border", "1px solid #000")
    .style("padding", "2px")
    .style("margin", "2px")
    .style("cursor", "pointer");
}

function markOnClick(markID) {
  disableAllMarkSelections();
  d3.select("#mark_" + markID)
    .style("background-color", "#000000")
    .style("color", "white");
  markSelection = [markID];
  document.getElementById("numberOfMarksSelected").innerHTML = "1";
  document.getElementById("markTypeSelection").value = markInfo[markID].Type;
  document.getElementById("markRoleSelection").value = markInfo[markID].Role;
  svgHighlighting();
}

function selectionOnClick(selectionID, selection) {
  disableAllMarkSelections();

  selection.forEach((markID) => {
    const markDiv = document.getElementById("mark_" + markID);
    document
      .getElementById("allMarks")
      .insertBefore(markDiv, document.getElementById("allMarks").firstChild);
  });

  d3.select("#" + selectionID)
    .style("background-color", "#000000")
    .style("color", "white");
  markSelection = selection;
  document.getElementById("numberOfMarksSelected").innerHTML =
    markSelection.length.toString();
  markSelection.forEach((markID) => {
    d3.select("#mark_" + markID)
      .style("background-color", "#000000")
      .style("color", "white");
  });
  document.getElementById("markTypeSelection").value =
    "none"; /* reset mark type selection */
  document.getElementById("markRoleSelection").value =
    "none"; /* reset mark role selection */
  svgHighlighting();
}

function disableAllMarkSelections() {
  d3.selectAll(".markDiv")
    .style("background-color", "white")
    .style("color", "black");
  d3.selectAll(".selectionDiv")
    .style("background-color", "white")
    .style("color", "black");
  markSelection = [];
}

function svgHighlighting() {
  d3.selectAll(".highlightRect").remove(); // remove all previous highlight rectangles
  allLeftNodes
    .map((node) => node.id)
    .forEach((r) => {
      if (r.length > 0) d3.select("#" + r).style("opacity", "1");
    }); // need to recover to full opacity first
  allLeftNodes
    .map((node) => node.id)
    .filter((r) => !markSelection.includes(r))
    .forEach((r) => {
      if (r.length > 0) d3.select("#" + r).style("opacity", "0.2");
    }); // set opacity to 0.2 for all non-selected elements
  allLeftNodes
    .map((node) => node.id)
    .filter((r) => markSelection.includes(r))
    .forEach((r) => {
      // // set selected elements to have a red rectangle around them
      // const tempDiv = document.getElementById("rbox1");
      // const svgElement = tempDiv.querySelector("svg");
      // const svgBBox = svgElement.getBoundingClientRect();
      // const bbox = document.getElementById(r).getBoundingClientRect();
      // const left = bbox.x - svgBBox.x;
      // const top = bbox.y - svgBBox.y;
      // const width = bbox.width;
      // const height = bbox.height;
      // const highlightRect = document.createElementNS(
      //   "http://www.w3.org/2000/svg",
      //   "rect"
      // );
      // highlightRect.setAttribute("x", left - 3);
      // highlightRect.setAttribute("y", top - 3);
      // highlightRect.setAttribute("width", width + 6);
      // highlightRect.setAttribute("height", height + 6);
      // highlightRect.setAttribute("stroke", "red");
      // highlightRect.setAttribute("stroke-width", "2");
      // highlightRect.setAttribute("fill", "none");
      // highlightRect.classList.add("highlightRect");
      // svgElement.appendChild(highlightRect);
    });
}

function markAnnotationChanged(attr) {
  if (markSelection.length === 0) return;
  console.log(markInfo);
  markSelection.map((selectedMarkID) => {
    let thisValue = document.getElementById("mark" + attr + "Selection").value;
    markInfo[selectedMarkID][attr] = thisValue;
    // switch (thisValue) {
    //   case "Horizontal Gridline":
    //     xGridlines.push(selectedMarkID);
    //     break;
    //   case "Vertical Gridline":
    //     yGridlines.push(selectedMarkID);
    //     break;
    //   case "X Axis Line":
    //     xAxis["line"] = selectedMarkID;
    //     break;
    //   case "Y Axis Line":
    //     yAxis["line"] = selectedMarkID;
    //     break;
    //   case "X Axis Tick":
    //     if (xAxis["ticks"]) xAxis["ticks"].push(selectedMarkID);
    //     else xAxis["ticks"] = [selectedMarkID];
    //     break;
    //   case "Y Axis Tick":
    //     if (yAxis["ticks"]) yAxis["ticks"].push(selectedMarkID);
    //     else yAxis["ticks"] = [selectedMarkID];
    //     break;
    //   case "Legend Mark":
    //     legend.marks.push(selectedMarkID);
    //     break;
    //   case "Legend Label":
    //     legend.labels.push(selectedMarkID);
    //     break;
    // }
  });
  reflectChanges();
}

function reflectChanges() {
  markSelection.forEach((markID) => {
    let markDiv = document.getElementById("mark_" + markID);
    markDiv.innerHTML = markID;
    if (markInfo[markID]["Type"] !== "none") {
      let typeTag = document.createElement("span");
      typeTag.innerHTML = "&nbsp;" + markInfo[markID]["Type"];
      typeTag.style.color = "#E69F00";
      markDiv.appendChild(typeTag);
    }
    if (markInfo[markID]["Role"] !== "none") {
      let roleTag = document.createElement("span");
      roleTag.innerHTML = "&nbsp;" + markInfo[markID]["Role"];
      roleTag.style.color = "#009E73";
      markDiv.appendChild(roleTag);
    }
  });
}

function dertermineChannelBasedBatchSelections(elementType) {
  let marks = mainContentElements[elementType];
  let channelBasedBatchSelections = {};
  let values;

  function getBatches(channel, marks, channelBasedBatchSelections) {
    channelBasedBatchSelections[channel] = {};
    values = marks
      .map((r) =>
        r.element.attributes[channel]
          ? r.element.attributes[channel].value
          : channel === "fill"
          ? r.element.parentNode.attributes[channel]?.value
            ? r.element.parentNode.attributes[channel]?.value
            : "undefined"
          : "undefined"
      )
      .filter(onlyUnique);
    values.forEach((value, index) => {
      channelBasedBatchSelections[channel][value] = marks
        .filter(
          (r) =>
            r.element.attributes[channel]?.value === value ||
            (value === "undefined" && !r.element.attributes[channel]) ||
            (channel === "fill" &&
              r.element.parentNode.attributes[channel]?.value === value)
        )
        .map((r) => r.id);
    });

    if (Object.keys(channelBasedBatchSelections[channel]).length === 1) {
      // if all marks have the same value for this channel
      delete channelBasedBatchSelections[channel];
    }

    return channelBasedBatchSelections;
  }

  let typeBasedChannels = [];
  switch (elementType) {
    case "line":
      typeBasedChannels = ["stroke", "stroke-dasharray", "stroke-width"];
      break;
    case "polyline":
      break;
    case "rect":
    case "circle":
    case "ellipse":
    case "ploygon":
    case "path":
      typeBasedChannels = ["fill"];
      break;
    case "image":
    case "text":
      // TBD: handle when font-family, font-size, and fill are not specified or specificed in the style attribute
      typeBasedChannels = ["font-family", "font-size", "fill"];
      break;
    case "use":
      break;
    default:
      break;
  }

  typeBasedChannels.forEach((channel) => {
    channelBasedBatchSelections = getBatches(
      channel,
      marks,
      channelBasedBatchSelections
    );
  });

  return channelBasedBatchSelections;
}
