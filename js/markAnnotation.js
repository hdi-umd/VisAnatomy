markAnnotations = {};
markSelection = [];
graphicsElementTypes = [
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
var allLeftNodes = [];

function initilizeMarkAnnotation() {
  referenceElements.forEach((rid) => {
    d3.select("#" + rid).style("opacity", "0.1");
  });

  allLeftNodes = Object.keys(mainContent)
    .map((key) => mainContent[key])
    .flat();

  leafNodeTypes = Object.keys(mainContent).filter((key) =>
    graphicsElementTypes.includes(key)
  );

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

  let batchSelections = ["All_marks"];
  leafNodeTypes.forEach((type) => {
    switch (type) {
      case "line":
        batchSelections.push("All_lines");
        break;
      case "polyline":
        batchSelections.push("All_polylines");
        break;
      case "rect":
        batchSelections.push("All_rects");
        batchSelections.push(
          ...mainContent[type]
            .map((r) => r.element.attributes.fill?.value)
            .filter(onlyUnique)
            .filter((fill) => fill !== undefined)
            .map((fill) => "All_rects_fill_" + fill.slice(1)) // TBD: need to handle cases where (1) fill is in their parent values, and (2) fill values contain special characters
        );
        break;
      case "circle":
        break;
      case "ellipse":
        break;
      case "ploygon":
        break;
      case "path":
        batchSelections.push("All_paths");
        batchSelections.push(
          ...mainContent[type]
            .map((r) => r.element.attributes.fill?.value)
            .filter(onlyUnique)
            .filter((fill) => fill !== undefined)
            .map((fill) => "All_paths_fill_" + fill.slice(1))
        );
        break;
      case "image":
        break;
      case "text":
        break;
      case "use":
        break;
      default:
        break;
    }
  });
  batchSelections.forEach((selection) => {
    let selectionDiv = document.createElement("div");
    selectionDiv.classList.add("selectionDiv");
    selectionDiv.id = selection;
    selectionDiv.innerHTML = selection.replaceAll("_", " ");
    selectionDiv.style.display = "inline-block";
    selectionDiv.style.width = "100%";
    selectionDiv.style.height = "fit-content";
    selectionDiv.style.border = "1px solid #000";
    selectionDiv.style.padding = "2px";
    selectionDiv.style.margin = "2px";
    selectionDiv.style.cursor = "pointer";
    document.getElementById("markSelections").appendChild(selectionDiv);
    d3.select("#" + selection).on("click", () => {
      selectionOnClick(selection);
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

function selectionOnClick(selectionID) {
  disableAllMarkSelections();
  d3.select("#" + selectionID)
    .style("background-color", "#000000")
    .style("color", "white");
  if (selectionID == "All_marks") {
    markSelection = allLeftNodes.map((element) => element.id);
  } else {
    let selectionMetaInfo = selectionID.split("_");
    if (selectionMetaInfo.length == 2) {
      markSelection = mainContent[selectionMetaInfo[1].slice(0, -1)].map(
        (element) => element.id
      );
    } else {
      // selectionMetaInfo.length == 4
      let channel = selectionMetaInfo[2];
      let value = selectionMetaInfo[3];
      console.log(channel, value);
      markSelection = mainContent[selectionMetaInfo[1].slice(0, -1)]
        .filter(
          (element) =>
            element.element.attributes[channel]?.value ===
            (channel === "fill" ? "#" + value : value)
        )
        .map((element) => element.id);
    }
  }
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
