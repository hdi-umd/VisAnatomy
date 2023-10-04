var markAnnotations = {};
var markSelection = [];
var graphicsElementTypes = [
  "line",
  "polyline",
  "rect",
  "circle",
  "ellipse",
  "ploygon",
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

  allLeftNodes = Object.keys(mainContent)
    .map((key) => mainContent[key])
    .flat();

  // TBD: handle invisible elements and note their type as "general" and role as "invisible"
  let invisibleElements = allLeftNodes.filter(
    (element) =>
      element.element.attributes["visibility"]?.value === "hidden" ||
      element.element.attributes["display"]?.value === "none" ||
      element.element.attributes["opacity"]?.value === "0" ||
      element.element.attributes["stroke-width"]?.value === "0" ||
      element.element.attributes["fill"]?.value === "transparent" ||
      element.element.attributes["font-size"]?.value === "0" ||
      element.element.attributes["stroke"]?.value === "transparent"
  );
  console.log(invisibleElements);
  allLeftNodes = allLeftNodes.filter(
    (element) => !invisibleElements.includes(element)
  );
  Object.keys(mainContent).forEach((key) => {
    // remove invisible elements from mainContent
    mainContent[key] = mainContent[key].filter(
      (element) => !invisibleElements.includes(element)
    );
    if (mainContent[key].length === 0) delete mainContent[key];
  });

  leafNodeTypes = Object.keys(mainContent).filter((key) =>
    graphicsElementTypes.includes(key)
  );

  document.getElementById("allMarks").innerHTML = "";
  leafNodeTypes.forEach((type) => {
    // initialize the type and role of each graphical element
    mainContent[type].forEach((element) => {
      markAnnotations[element.id] = {
        Type: type === "path" ? "none" : type,
        Role: "none",
      };
    });

    // then add the mark annotation divs
    mainContent[type].forEach((element) => {
      let markDiv = document.createElement("div");
      markDiv.classList.add("markDiv");
      markDiv.id = "mark_" + element.id;
      markDiv.innerHTML = element.id;
      markDiv.style.display = "inline-block";
      markDiv.style.width = "100%";
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
  leafNodeTypes.forEach((elementType) => {
    channelBasedBatchSelections4AllMarks[elementType] =
      dertermineChannelBasedBatchSelections(elementType);
  });
  console.log(channelBasedBatchSelections4AllMarks);

  document.getElementById("markSelections").innerHTML = "";

  Object.keys(channelBasedBatchSelections4AllMarks).forEach((elementType) => {
    // need to add batch selection every mark of a certain type and all marks
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
        selectionDiv.innerHTML = elementType + "_" + channel + "_" + value;
        selectionDiv.style.display = "inline-block";
        selectionDiv.style.width = "100%";
        selectionDiv.style.height = "fit-content";
        selectionDiv.style.border = "1px solid #000";
        selectionDiv.style.padding = "2px";
        selectionDiv.style.margin = "2px";
        selectionDiv.style.cursor = "pointer";
        document.getElementById("markSelections").appendChild(selectionDiv);
        d3.select("#" + selectionDiv.id).on("click", () => {
          console.log(elementType + "_" + channel + "_" + value);
          selectionOnClick(selectionDiv.id, valueJson[value]);
        });
      }
    });
  });
}

function markOnClick(markID) {
  disableAllMarkSelections();
  d3.select("#mark_" + markID)
    .style("background-color", "#000000")
    .style("color", "white");
  markSelection = [markID];
  document.getElementById("markTypeSelection").value =
    markAnnotations[markID].Type;
  document.getElementById("markRoleSelection").value =
    markAnnotations[markID].Role;
  svgHighlighting();
}

function selectionOnClick(selectionID, selection) {
  disableAllMarkSelections();
  d3.select("#" + selectionID)
    .style("background-color", "#000000")
    .style("color", "white");
  markSelection = selection;
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
  // TBD: need to highlight the svg elements based on type
  allLeftNodes
    .map((node) => node.id)
    .forEach((r) => {
      d3.select("#" + r).style("opacity", "1");
    }); // need to recover to full opacity first
  allLeftNodes
    .map((node) => node.id)
    .filter((r) => !markSelection.includes(r))
    .forEach((r) => {
      d3.select("#" + r).style("opacity", "0.2");
    });
}

function markAnnotationChanged(attr) {
  if (markSelection.length === 0) return;
  console.log(markAnnotations);
  markSelection.map((selectedMarkID) => {
    markAnnotations[selectedMarkID][attr] = document.getElementById(
      "mark" + attr + "Selection"
    ).value;
  });
  reflectChanges();
}

function reflectChanges() {
  markSelection.forEach((markID) => {
    let markDiv = document.getElementById("mark_" + markID);
    markDiv.innerHTML = markID;
    if (markAnnotations[markID]["Type"] !== "none") {
      let typeTag = document.createElement("span");
      typeTag.innerHTML = " " + markAnnotations[markID]["Type"];
      typeTag.style.color = "#E69F00";
      markDiv.appendChild(typeTag);
    }
    if (markAnnotations[markID]["Role"] !== "none") {
      let roleTag = document.createElement("span");
      roleTag.innerHTML = " " + markAnnotations[markID]["Role"];
      roleTag.style.color = "#009E73";
      markDiv.appendChild(roleTag);
    }
  });
}

function dertermineChannelBasedBatchSelections(elementType) {
  let marks = mainContent[elementType];
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
              r.element.parentNode.attributes[channel].value === value)
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
