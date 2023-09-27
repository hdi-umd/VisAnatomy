markAnnotations = {};
markSelection = [];

function initilizeMarkAnnotation() {
  mainContent.rects.forEach(
    (rect) => (markAnnotations[rect.id] = { Type: "none", Role: "none" })
  );

  // first load processed marks into div.allMarks
  mainContent.rects.forEach((mark) => {
    let markDiv = document.createElement("div");
    markDiv.classList.add("markDiv");
    markDiv.id = "mark_" + mark.id;
    markDiv.innerHTML = mark.id;
    markDiv.style.display = "inline-block";
    markDiv.style.width = "fit-content";
    markDiv.style.height = "fit-content";
    markDiv.style.border = "1px solid #000";
    markDiv.style.padding = "2px";
    markDiv.style.margin = "2px";
    markDiv.style.cursor = "pointer";
    document.getElementById("allMarks").appendChild(markDiv);
    d3.select("#mark_" + mark.id).on("click", () => {
      markOnClick(mark.id);
    });
  });

  // then populate all possible mark batch selections
  [
    "All_Marks",
    ...mainContent.rects
      .map((r) => r.fill)
      .filter(onlyUnique)
      .map((fill) => "All_Marks_of_" + fill.slice(1)),
  ].forEach((selection) => {
    let selectionDiv = document.createElement("div");
    selectionDiv.classList.add("selectionDiv");
    selectionDiv.id = selection;
    selectionDiv.innerHTML = selection.replaceAll("_", " ");
    selectionDiv.style.display = "inline-block";
    selectionDiv.style.width = "fit-content";
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
  if (selectionID == "All_Marks") {
    markSelection = mainContent.rects.map((r) => r.id);
  } else {
    let fill = selectionID.split("_").pop();
    markSelection = mainContent.rects
      .filter((r) => r.fill == "#" + fill)
      .map((r) => r.id);
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
  mainContent.rects
    .map((r) => r.id)
    .forEach((r) => {
      d3.select("#" + r).style("opacity", "1");
    }); // need to recover to full opacity first
  mainContent.rects
    .map((r) => r.id)
    .filter((r) => !markSelection.includes(r))
    .forEach((r) => {
      d3.select("#" + r).style("opacity", "0.1");
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
  markSelection.forEach((rectID) => {
    let markDiv = document.getElementById("mark_" + rectID);
    markDiv.innerHTML = rectID;
    if (markAnnotations[rectID]["Type"] !== "none") {
      let typeTag = document.createElement("span");
      typeTag.innerHTML = " " + markAnnotations[rectID]["Type"];
      typeTag.style.color = "#E69F00";
      markDiv.appendChild(typeTag);
    }
    if (markAnnotations[rectID]["Role"] !== "none") {
      let roleTag = document.createElement("span");
      roleTag.innerHTML = " " + markAnnotations[rectID]["Role"];
      roleTag.style.color = "#009E73";
      markDiv.appendChild(roleTag);
    }
  });
}
