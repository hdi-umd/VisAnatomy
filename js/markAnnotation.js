var markSelection = [];
var channelBasedBatchSelections4AllMarks = {};
var allLeftNodes = [];

function toggleDropdown() {
  const optionList = document.getElementById("optionList");
  optionList.style.display =
    optionList.style.display === "block" ? "none" : "block";
  hideAllSublists();
}

function toggleSublist(event, optionValue) {
  const sublistId = getSublistId(optionValue);
  const sublist = document.getElementById(sublistId);

  if (sublist.style.display === "block") {
    sublist.style.display = "none";
  } else {
    hideAllSublists();
    populateSublist(sublist);
    sublist.style.display = "block";
  }

  event.stopPropagation();
}

function hideAllSublists() {
  const sublists = document.getElementsByClassName("sublist");
  for (let i = 0; i < sublists.length; i++) {
    sublists[i].style.display = "none";
  }
}

function populateSublist(sublist) {
  sublist.innerHTML = "";

  for (let i = 1; i <= Object.keys(axes).length; i++) {
    const subOption = document.createElement("div");
    subOption.className = "sub-option";
    subOption.textContent = "axis " + i;
    subOption.onclick = () => {
      markAnnotationChanged("Axis " + i + " " + sublist.id.substring(3));
      d3.selectAll(".highlightRect").remove();
    };
    subOption.onmouseover = () => {
      // get axes[i].labels and fetch their positions through allGraphicsElement using their IDs and draw a rectangle around them, with padding 5px
      let axis = axes[i];
      let labels = axis.labels;
      let labelPositions = labels.map((label) => {
        let labelElement = allGraphicsElement[label.id];
        return {
          x: labelElement.left,
          y: labelElement.top,
          width: labelElement.width,
          height: labelElement.height,
        };
      });
      let x = Math.min(...labelPositions.map((pos) => pos.x));
      let y = Math.min(...labelPositions.map((pos) => pos.y));
      let width = Math.max(...labelPositions.map((pos) => pos.x + pos.width));
      let height = Math.max(...labelPositions.map((pos) => pos.y + pos.height));
      let svg = document.getElementById("rbox1").querySelector("svg");
      let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      try {
        rect.setAttribute("x", x - 5);
        rect.setAttribute("y", y - 5);
        rect.setAttribute("width", width - x + 10);
        rect.setAttribute("height", height - y + 10);
        rect.setAttribute("stroke", "red");
        rect.setAttribute("stroke-width", "2");
        rect.setAttribute("fill", "none");
        rect.classList.add("highlightRect");
        svg.appendChild(rect);
      } catch (e) {
        console.log(e);
      }
    };
    subOption.onmouseout = () => {
      d3.selectAll(".highlightRect").remove();
    };

    sublist.appendChild(subOption);
  }
}

function getSublistId(optionValue) {
  switch (optionValue) {
    case "Axis Label":
      return "sublabel";
    case "Axis Title":
      return "subtitle";
    case "Axis Path":
      return "subpath";
    case "Axis Ticks":
      return "subticks";
    default:
      return "";
  }
}

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
      (element.element.attributes["fill"]?.value === "transparent" &&
        !element.element.attributes["stroke-width"] &&
        !element.element.attributes["stroke-width"]) ||
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

  document.getElementById("totalNumberOfMarks").innerHTML = leafNodeTypes
    .map((type) => mainContentElements[type].length)
    .reduce((a, b) => a + b);
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
      showMarkTypeRole(markInfo[markID], markDiv);
      // if (markInfo[markID]["Type"] !== "none") {
      //   let typeTag = document.createElement("span");
      //   typeTag.innerHTML = "&nbsp;" + markInfo[markID]["Type"];
      //   typeTag.style.color = "#E69F00";
      //   markDiv.appendChild(typeTag);
      // }
      // if (markInfo[markID]["Role"] !== "none") {
      //   let roleTag = document.createElement("span");
      //   roleTag.innerHTML = "&nbsp;" + markInfo[markID]["Role"];
      //   roleTag.style.color = "#009E73";
      //   markDiv.appendChild(roleTag);
      // }
      markDiv.style.display = "inline-block";
      markDiv.style.width = "99%";
      markDiv.style.height = "fit-content";
      markDiv.style.border = "0px solid #eee";
      markDiv.style.padding = "3px";
      markDiv.style.margin = "0px";
      markDiv.style.cursor = "pointer";
      document.getElementById("allMarks").appendChild(markDiv);
      d3.select("#mark_" + element.id)
        .on("mouseover", () => {
          d3.select("#" + element.id).style("opacity", "1");
        })
        .on("mouseout", () => {
          if (!markSelection.includes(element.id))
            d3.select("#" + element.id).style("opacity", "0.2");
        })
        .on("click", (event) => {
          markOnClick(element.id, event);
        });
    });
  });

  // then populate all possible mark batch selections
  leafNodeTypes.forEach((elementType) => {
    channelBasedBatchSelections4AllMarks[elementType] =
      dertermineChannelBasedBatchSelections(elementType);
  });

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
            '; border: 2px solid black; margin-bottom:4px;"></div></div>';
        }

        document.getElementById("markSelections").appendChild(selectionDiv);
        d3.select("#" + selectionDiv.id)
          .on("mouseover", () => {
            valueJson[value].forEach((markID) => {
              d3.select("#" + markID).style("opacity", "1");
            });
          })
          .on("mouseout", () => {
            valueJson[value].forEach((markID) => {
              if (!markSelection.includes(markID))
                d3.select("#" + markID).style("opacity", "0.2");
            });
          })
          .on("click", () => {
            selectionOnClick(selectionDiv.id, valueJson[value]);
          });
      }
    });
  });

  d3.selectAll(".selectionDiv")
    .style("display", "inline-block")
    .style("width", "95%")
    .style("height", "fit-content")
    .style("border", "1px solid #ccc")
    .style("padding", "2px")
    .style("margin", "4px")
    .style("cursor", "pointer")
    .style("background", "#FAFAFA")
    .style("border-radius", "5px");

  svgHighlighting();
}

// function markOnClick(markID) { // the old function without the shift-click feature
//   // disableAllMarkSelections();
//   if (
//     markSelection.indexOf(markID) >= 0
//     //d3.select("#mark_" + markID).style("background-color") === "rgb(0, 0, 0)"
//   ) {
//     d3.selectAll("#mark_" + markID)
//       .style("background-color", "white")
//       .style("color", "black");
//     markSelection.splice(markSelection.indexOf(markID), 1);
//     document.getElementById("numberOfMarksSelected").innerHTML =
//       markSelection.length;
//     // parseInt(document.getElementById("numberOfMarksSelected").innerHTML) - 1;
//   } else {
//     d3.select("#mark_" + markID).style("background-color", "#eee");
//     // .style("color", "white");
//     if (markSelection.indexOf(markID) < 0) markSelection.push(markID);
//     document.getElementById("numberOfMarksSelected").innerHTML =
//       markSelection.length;
//     //parseInt(document.getElementById("numberOfMarksSelected").innerHTML) + 1;
//   }

//   document.getElementById("markTypeSelection").value =
//     markSelection.map((r) => markInfo[r].Type).filter(onlyUnique).length === 1
//       ? markInfo[markID].Type
//       : "none";
//   document.getElementById("markRoleSelection").value =
//     markSelection.map((r) => markInfo[r].Role).filter(onlyUnique).length === 1
//       ? markInfo[markID].Role
//       : "none";
//   svgHighlighting();
// }

function markOnClick(markID, event) {
  if (event.shiftKey) {
    // Shift-click: Select all marks between the last clicked mark and the current mark
    const markDivs = Array.from(document.getElementById("allMarks").children);
    const lastClickedMarkIndex = markDivs.findIndex(
      (markDiv) =>
        markDiv.id === "mark_" + markSelection[markSelection.length - 1]
    );
    const currentClickedMarkIndex = markDivs.findIndex(
      (markDiv) => markDiv.id === "mark_" + markID
    );

    const startIndex = Math.min(lastClickedMarkIndex, currentClickedMarkIndex);
    const endIndex = Math.max(lastClickedMarkIndex, currentClickedMarkIndex);

    for (let i = startIndex; i <= endIndex; i++) {
      const currentMarkID = markDivs[i].id.replace("mark_", "");
      if (!markSelection.includes(currentMarkID)) {
        markSelection.push(currentMarkID);
        d3.select("#mark_" + currentMarkID).style("background-color", "#eee");
      }
    }
  } else {
    // Regular click: Toggle the selection of the clicked mark
    if (markSelection.indexOf(markID) >= 0) {
      d3.selectAll("#mark_" + markID)
        .style("background-color", "white")
        .style("color", "black");
      markSelection.splice(markSelection.indexOf(markID), 1);
    } else {
      d3.select("#mark_" + markID).style("background-color", "#eee");
      if (markSelection.indexOf(markID) < 0) markSelection.push(markID);
    }
  }

  document.getElementById("numberOfMarksSelected").innerHTML =
    markSelection.length;

  document.getElementById("markTypeSelection").value =
    markSelection.map((r) => markInfo[r].Type).filter(onlyUnique).length === 1
      ? markInfo[markID].Type
      : "none";
  // document.getElementById("markRoleSelection").value =
  //   markSelection.map((r) => markInfo[r].Role).filter(onlyUnique).length === 1
  //     ? markInfo[markID].Role
  //     : "none";
  svgHighlighting();
}

function selectionOnClick(selectionID, selection) {
  // disableAllMarkSelections();

  // if (
  //   d3.select("#" + selectionID).style("background-color") === "rgb(0, 0, 0)"
  // ) {
  //   d3.select("#" + selectionID)
  //     .style("background-color", "white")
  //     .style("color", "black");
  //   markSelection = markSelection.filter((r) => !selection.includes(r));
  //   selection.forEach((markID) => {
  //     d3.select("#mark_" + markID)
  //       .style("background-color", "white")
  //       .style("color", "black");
  //   });
  //   document.getElementById("numberOfMarksSelected").innerHTML =
  //     markSelection.length;
  // } else {
  selection.forEach((markID) => {
    const markDiv = document.getElementById("mark_" + markID);
    document
      .getElementById("allMarks")
      .insertBefore(markDiv, document.getElementById("allMarks").firstChild);
    if (!markSelection.includes(markID)) markSelection.push(markID);
  });
  // d3.select("#" + selectionID)
  //   .style("background-color", "#000000")
  //   .style("color", "white");
  // markSelection.push(...selection);
  document.getElementById("numberOfMarksSelected").innerHTML =
    markSelection.length.toString();
  markSelection.forEach((markID) => {
    d3.select("#mark_" + markID).style("background-color", "#eee");
    // .style("color", "white");
  });
  // }
  document.getElementById("markTypeSelection").value =
    markSelection.map((r) => markInfo[r].Type).filter(onlyUnique).length === 1
      ? markInfo[markSelection[0]].Type
      : "none";
  // document.getElementById("markRoleSelection").value =
  //   markSelection.map((r) => markInfo[r].Role).filter(onlyUnique).length === 1
  //     ? markInfo[markSelection[0]].Role
  //     : "none";
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
  document.getElementById("numberOfMarksSelected").innerHTML = "0";
  document.getElementById("markTypeSelection").value = "none";
  // document.getElementById("markRoleSelection").value = "none";
  svgHighlighting();
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
  optionList.style.display = "none";
  if (markSelection.length === 0) {
    return;
  }
  console.log(markInfo);
  markSelection.map((selectedMarkID) => {
    if (attr === "Type") {
      let thisValue = document.getElementById(
        "mark" + attr + "Selection"
      ).value;
      markInfo[selectedMarkID][attr] = thisValue;
    } else {
      markInfo[selectedMarkID].Role = attr;
    }
  });
  if (attr.includes("Axis")) {
    let axisID = parseInt(attr.split(" ")[1]);
    let component = attr.split(" ")[2];
    axes[axisID][component] =
      component === "Label" || component === "title"
        ? markSelection.map((r) => allGraphicsElement[r])
        : markSelection;
  }
  reflectChanges();
}

function showMarkTypeRole(mark, markDiv) {
  let typeTag = document.createElement("span");
  typeTag.style.color = "#444";
  typeTag.style.fontSize = "12.5px";
  markDiv.appendChild(typeTag);
  if (mark["Type"] !== "none") {
    typeTag.innerHTML = "&nbsp;(" + mark["Type"] + ", ";
  } else {
    typeTag.innerHTML = "&nbsp;(?, ";
  }

  let roleTag = document.createElement("span");
  roleTag.style.color = "#444";
  roleTag.style.fontSize = "12.5px";
  markDiv.appendChild(roleTag);
  if (mark["Role"] !== "none") {
    roleTag.innerHTML = "&nbsp;" + mark["Role"] + ")";
  } else {
    roleTag.innerHTML = "&nbsp;?)";
  }
}

function reflectChanges() {
  markSelection.forEach((markID) => {
    let markDiv = document.getElementById("mark_" + markID);
    markDiv.innerHTML = markID;
    showMarkTypeRole(markInfo[markID], markDiv);
    // if (markInfo[markID]["Type"] !== "none") {
    //   let typeTag = document.createElement("span");
    //   typeTag.innerHTML = "&nbsp;(" + markInfo[markID]["Type"];
    //   typeTag.style.color = "#E69F00";
    //   markDiv.appendChild(typeTag);
    // }
    // if (markInfo[markID]["Role"] !== "none") {
    //   let roleTag = document.createElement("span");
    //   roleTag.innerHTML = "&nbsp;" + markInfo[markID]["Role"] + ")";
    //   roleTag.style.color = "#009E73";
    //   markDiv.appendChild(roleTag);
    // }
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
          ? allGraphicsElement[r.element.id].fill
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
              allGraphicsElement[r.element.id]?.fill === value)
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
