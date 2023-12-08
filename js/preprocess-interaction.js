var undoStack = [],
  redoStack = [];
var btnCheck = {};

//bugs: doesn't change on the first click; weird when i go between different .svg files
let clickCounter = 0; // Click counter to track the state
let originalBox; // Variable to keep track of the original box

function addAxisLevel(t) {
  let axis = t === "x" ? xAxis : yAxis;
  if (!axis) return;
  if (!("upperLevels" in axis)) {
    axis["upperLevels"] = [];
  }
  axis["upperLevels"].push([]);

  const axisDiv = d3.select("#" + t + "AxisDiv");

  // Add the button image
  const button = axisDiv
    .append("img")
    .attr("src", "img/plus.png")
    .attr("width", "16px")
    .attr("height", "16px")
    .attr("style", "position: absolute; right: 7px")
    .attr("class", "selectAreaBtn")
    .on("click", function () {
      // Increment the click counter
      clickCounter++;

      // Update the button image based on the click counter
      if (clickCounter % 2 === 1) {
        button.attr("src", "img/minus.png");
        updateAxisWidth(t, true); // Pass true to indicate minus.png state
      } else {
        button.attr("src", "img/plus.png");
        updateAxisWidth(t, false); // Pass false to indicate plus.png state
      }
    });

  // Add the axisLabels div
  axisDiv
    .append("div")
    .attr("class", "axisLabels")
    .attr("id", t + "Labels" + axis["upperLevels"].length)
    .on("drop", drop)
    .on("dragover", allowDrop);

  // Update the width of existing boxes
  updateAxisWidth(t, false);
}

function updateAxisWidth(t, isMinusState) {
  let axis = t === "x" ? xAxis : yAxis;
  if (!axis || !("upperLevels" in axis)) return;

  const axisDiv = d3.select("#" + t + "AxisDiv");
  const numLevels = axis["upperLevels"].length;

  // If it's the first update, store the original box
  if (!originalBox) {
    originalBox = axisDiv.select(".axisLabels");
  }

  // Remove all existing boxes
  axisDiv.selectAll(".axisLabels").remove();

  // Add the original box as the left box
  axisDiv
    .append(() => originalBox.node().cloneNode(true))
    .attr("id", t + "Labels1");

  // Add boxes based on the state
  for (let i = 1; i < (isMinusState ? numLevels + 1 : numLevels); i++) {
    const newBox = axisDiv
      .append("div")
      .attr("class", "axisLabels")
      .attr("id", t + "Labels" + (i + 1))
      .on("drop", drop)
      .on("dragover", allowDrop);

    // Set the opacity of the second-level labels
    newBox.style("opacity", isMinusState ? 1 : 0.1);
  }

  // Update the width of existing boxes
  const width = isMinusState ? 202.5 : 405;
  axisDiv
    .selectAll(".axisLabels")
    .style("width", ["calc(", (100 / (isMinusState ? numLevels + 1 : numLevels)).toFixed(1), "% - ", width, "px)"].join(""));
}

function fieldTypeChanged(xy) {
  let val = d3.select("#" + xy + "FieldType").property("value");
  let axis = xy == "x" ? xAxis : yAxis;
  if (val == "Null") {
    undoStack.push({
      xAxis: duplicate(xAxis),
      yAxis: duplicate(yAxis),
      legend: duplicate(legend),
      btnCheck: Object.assign({}, btnCheck),
    });
    let labels = axis.labels.map((d) => d);
    for (let l of labels) {
      removeAxisLabel(xy + "Labels", l);
    }
    axis.ticks = [];
    displayAxis(axis);
  }
  axis.fieldType = val;
}

function enableAreaSelection() {
  var clickHold = false,
    layerX,
    layerY,
    clientX,
    clientY;
  d3.select("#vis")
    .on("mousedown", function (e) {
      // e.stopImmediatePropagation();
      e.preventDefault();
      clickHold = true;
      clientX = e.clientX;
      clientY = e.clientY;
      layerX = e.layerX;
      layerY = e.layerY;
    })
    .on("mousemove", function (e) {
      // e.stopImmediatePropagation();
      e.preventDefault();
      if (!clickHold || !areaSelection) return;
      let x = e.layerX,
        y = e.layerY;
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
    })
    .on("mouseup", function (e) {
      // e.stopImmediatePropagation();
      e.preventDefault();
      if (clickHold && areaSelection) {
        let x = e.clientX,
          y = e.clientY;
        let left = Math.min(x, clientX),
          top = Math.min(y, clientY),
          right = Math.max(x, clientX),
          btm = Math.max(y, clientY);
        const topLeft = clientPt2SVGPt(left, top),
          btmRight = clientPt2SVGPt(right, btm);
        if (areaSelection == "x" || areaSelection == "y") {
          findAxisInArea(
            areaSelection,
            topLeft,
            btmRight,
            mainContent.texts,
            mainContent.rects,
            mainContent.lines
          );
        } else if (areaSelection == "legend") {
          let rects = mainContent.rects;
          if (xAxis.path) rects = rects.concat([xAxis.path]);
          if (yAxis.path) rects = rects.concat([yAxis.path]);
          findLegendInArea(
            topLeft,
            btmRight,
            mainContent.texts.concat(xAxis.labels).concat(yAxis.labels),
            rects
          );
        }

        displayAxis(xAxis);
        displayAxis(yAxis);
        displayLegend(legend);
        deactivateAreaSelect();
      }
      clickHold = false;
      d3.select("#overlaySelection").style("visibility", "hidden");
    });
}

function activateAreaSelect(type) {
  areaSelection = type;
  document.body.style.cursor = "crosshair";
  d3.selectAll(".selectAreaBtn").style("background", "#eee");
  d3.select("#" + type + "Area").style("background", "#c8e6fa");
}

function deactivateAreaSelect() {
  areaSelection = undefined;
  document.body.style.cursor = "default";
  d3.selectAll(".selectAreaBtn").style("background", "#eee");
}

function proceed() {
  xAxis.fieldType = d3.select("#xFieldType").property("value");
  yAxis.fieldType = d3.select("#yFieldType").property("value");
  legend.fieldType = d3.select("#legendFieldType").property("value");
  chartDecomposition = {};
  d3.select("#preprocessUI").style("visibility", "hidden");
  d3.select("#reuseUI").style("visibility", "visible");
  bottomUpGrouping();
  // if (!finalGroups) {
  //     if (allHoriColls) {
  //       if (allHoriColls.length > 0) finalGroups = allHoriColls;
  //     } else if (allVertColls) {
  //       if (allVertColls.length > 0) finalGroups = allVertColls;
  //     }
  //   }
  //   if (newColls) {
  //     if (newColls.length > 0) atlasSceneGraph = getAtlasScene();
  //   } else {
  //     newColls = [];
  //     newColls.push({});
  //     newColls[0].collections = finalGroups;
  //     atlasSceneGraph = getAtlasScene();
  //   }
  inferEncodings();
  chartDecomposition.objects = newColls[0];
  chartDecomposition.encodings = encodings;
  chartDecomposition.alignments = alignments;
  console.log("Chart Decomposition Results: ", chartDecomposition);
  atlasSceneGraph = getAtlasScene();
  console.log("Atlas Scene Graph: ", atlasSceneGraph);

  schema = inferTblSchema(atlasSceneGraph);
  console.log("table columns", schema);
  d3.select("#tblSchemaInfo").text(
    "Your dataset should have at least " +
      schema["categorical"] +
      " categorical columns and at least " +
      schema["quantitative"] +
      " quantitative columns."
  );
  loadReuseUI();
}

function inferTblSchema(scene) {
  let collections = scene.children.filter((d) => d.type === "collection");
  let levels = 0;
  for (let c of collections) {
    let item = c.firstChild,
      l = 1;
    while (item.type === "collection") {
      item = item.firstChild;
      l++;
    }
    if (l > levels) {
      levels = l;
    }
  }
  let encodedFields = { categorical: 0, quantitative: 0 };
  for (let l = 0; l < encodings.length; l++) {
    let e = encodings[l];
    for (let channel of e) {
      switch (channel) {
        case "width":
        case "height":
        case "fill-opacity":
        case "x":
        case "y":
        case "area":
          encodedFields["quantitative"] += 1;
          break;
        default:
          encodedFields["categorical"] += 1;
          break;
      }
    }
  }
  return {
    categorical: Math.max(levels, encodedFields["categorical"]),
    quantitative: encodedFields["quantitative"],
  };
}

function save() {
  xAxis["fieldType"] = d3.select("#xFieldType").property("value");
  yAxis["fieldType"] = d3.select("#yFieldType").property("value");
  legend["fieldType"] = d3.select("#legendFieldType").property("value");
  let result = {
    xAxis: xAxis,
    yAxis: yAxis,
    legend: legend,
    mainContent: mainContent,
  };
  var file = new Blob([JSON.stringify(result)], { type: "json" });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, demoName + ".json");
  else {
    // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = demoName + ".json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

function undo() {
  if (undoStack.length > 0) {
    let h = undoStack.pop();
    xAxis = h["xAxis"];
    yAxis = h["yAxis"];
    legend = h["legend"];
    btnCheck = h["btnCheck"];
    redoStack.unshift(h);
    displayAxis(xAxis);
    displayAxis(yAxis);
    displayLegend(legend);
  }
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  // defined on the text elements in the label display boxes
  ev.dataTransfer.setData("text", ev.target.id);
  draggedFromID = ev.srcElement.parentNode.id;
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  let thisText = d3.select("#" + data).datum();

  draggedToID = ev.srcElement.id;
  console.log("Dragging from " + draggedFromID + "to " + draggedToID);

  /* dropping from a x/y axis label box into xtitle box */
  if (
    draggedToID.startsWith("xTitle") ||
    draggedToID.startsWith("yTitle") ||
    draggedToID.startsWith("legendTitle")
  ) {
    if (
      draggedFromID.startsWith("xLabels") ||
      draggedFromID.startsWith("yLabels")
    ) {
      let thisAxis = draggedFromID.startsWith("xLabels") ? xAxis : yAxis;
      if (thisAxis["labels"].indexOf(thisText) >= 0) {
        thisAxis["labels"].splice(thisAxis["labels"].indexOf(thisText), 1);
      }
      if (thisAxis["upperLevels"]) {
        for (let level of thisAxis.upperLevels) {
          if (level.indexOf(thisText) >= 0) {
            level.splice(level.indexOf(thisText), 1);
          }
        }
      }

      let thisTitle = draggedToID.startsWith("xTitle")
        ? "x"
        : draggedToID.startsWith("yTitle")
        ? "y"
        : "legend";

      switch (thisTitle) {
        case "x":
          displayTitleXLabel(thisText);
          break;
        case "y":
          displayTitleYLabel(thisText);
          break;
        case "Legend":
          displayTitleLegendLabel(thisText);
          break;
      }

      displayAxis(xAxis);
      displayAxis(yAxis);
    } else if (
      draggedFromID.startsWith("legendTitle") ||
      draggedFromID.startsWith("xTitle") ||
      draggedFromID.startsWith("yTitle")
    ) {
      let sourceTitle = draggedFromID.startsWith("xTitle")
        ? "x"
        : draggedFromID.startsWith("yTitle")
        ? "y"
        : "legend";

      switch (sourceTitle) {
        case "x":
          titleXaxis.splice(titleXaxis.indexOf(thisText), 1);
          displayTitleXLabel(thisText, "delete");
          break;
        case "y":
          titleYaxis.splice(titleYaxis.indexOf(thisText), 1);
          displayTitleYLabel(thisText, "delete");
          break;
        case "legend":
          titleLegend.splice(titleLegend.indexOf(thisText), 1);
          displayTitleLegendLabel(thisText, "delete");
          break;
      }

      let thisTitle = draggedToID.startsWith("xTitle")
        ? "x"
        : draggedToID.startsWith("yTitle")
        ? "y"
        : "legend";

      switch (thisTitle) {
        case "x":
          displayTitleXLabel(thisText);
          break;
        case "y":
          displayTitleYLabel(thisText);
          break;
        case "legend":
          displayTitleLegendLabel(thisText);
          break;
      }
    }
  } else if (
    draggedToID.startsWith("xLabels") ||
    draggedToID.startsWith("yLabels")
  ) {
    // need to handle legend label
    let thisText = d3.select("#" + data).datum();
    // when the element is dropped in the detected region
    /*dropping from title region into y label region */
    if (
      draggedFromID.startsWith("xTitle") ||
      draggedFromID.startsWith("yTitle") ||
      draggedFromID.startsWith("legendTitle")
    ) {
      let thisTitle = draggedFromID.startsWith("xTitle")
        ? "x"
        : draggedFromID.startsWith("yTitle")
        ? "y"
        : "legend";

      switch (thisTitle) {
        case "x":
          titleXaxis.splice(titleXaxis.indexOf(thisText), 1);
          displayTitleXLabel(thisText, "delete");
          break;
        case "y":
          titleYaxis.splice(titleYaxis.indexOf(thisText), 1);
          displayTitleYLabel(thisText, "delete");
          break;
        case "legend":
          titleLegend.splice(titleLegend.indexOf(thisText), 1);
          displayTitleLegendLabel(thisText, "delete");
          break;
      }

      let thisAxis = draggedToID.startsWith("xLabels") ? xAxis : yAxis;

      thisAxis["labels"].push(thisText); // TBD: need to handle upper levels [IMPORTANT]

      displayAxis(xAxis);
      displayAxis(yAxis);
    }
    if (
      draggedFromID.startsWith("xLabels") ||
      draggedFromID.startsWith("yLabels")
    ) {
      // check if the dragged element is also from an axis display box
      undoStack.push({
        xAxis: duplicate(xAxis),
        yAxis: duplicate(yAxis),
        legend: duplicate(legend),
        btnCheck: Object.assign({}, btnCheck),
      });
      moveAxisLabel(draggedFromID, draggedToID, d3.select("#" + data).datum());
      buttonCheck(draggedToID, d3.select("#" + data).datum());
      displayAxis(xAxis);
      displayAxis(yAxis);
      ev.stopImmediatePropagation(); // stop the event from bubbling up to the SVG element
    }
  } else {
    // when an label from detected region are dropped outside, delete it
    undoStack.push({
      xAxis: duplicate(xAxis),
      yAxis: duplicate(yAxis),
      legend: duplicate(legend),
      btnCheck: Object.assign({}, btnCheck),
    });
    if (
      draggedFromID.startsWith("xLabels") ||
      draggedFromID.startsWith("yLabels")
    ) {
      removeAxisLabel(draggedFromID, d3.select("#" + data).datum());
      displayAxis(xAxis);
      displayAxis(yAxis);
    } else if (draggedFromID == "legendLabels") {
      removeLegendLabel(d3.select("#" + data).datum());
      displayLegend(legend);
    } else if (
      draggedFromID.startsWith("xTitle") ||
      draggedFromID.startsWith("yTitle") ||
      draggedFromID.startsWith("legendTitle")
    ) {
      let thisTitle = draggedFromID.startsWith("xTitle")
        ? "x"
        : draggedFromID.startsWith("yTitle")
        ? "y"
        : "legend";

      switch (thisTitle) {
        case "x":
          titleXaxis.splice(titleXaxis.indexOf(thisText), 1);
          displayTitleXLabel(thisText, "delete");
          break;
        case "y":
          titleYaxis.splice(titleYaxis.indexOf(thisText), 1);
          displayTitleYLabel(thisText, "delete");
          break;
        case "legend":
          titleLegend.splice(titleLegend.indexOf(thisText), 1);
          displayTitleLegendLabel(thisText, "delete");
          break;
      }
    } else if (draggedFromID.startsWith("chartTitle")) {
      chartTitle.splice(chartTitle.indexOf(thisText), 1);
      displayChartTitle(thisText, "delete");
    }
    ev.stopImmediatePropagation();
  }
}

function addAxisLabel(TargetID, text) {
  let axis = TargetID.startsWith("xLabels") ? xAxis : yAxis,
    otherAxis = TargetID.startsWith("xLabels") ? yAxis : xAxis;
  let accessor = TargetID.split("Labels")[1];
  if (otherAxis["labels"].indexOf(text) >= 0) {
    otherAxis["labels"].splice(otherAxis["labels"].indexOf(text), 1);
  }
  if (otherAxis["upperLevels"]) {
    for (let level of otherAxis.upperLevels) {
      if (level.indexOf(text) >= 0) {
        level.splice(level.indexOf(text), 1);
      }
    }
  }
  if (accessor) {
    let level = axis["upperLevels"][parseInt(accessor) - 1];
    if (level.indexOf(text) < 0) level.push(text);
  } else {
    if (axis["labels"].indexOf(text) < 0) axis["labels"].push(text);
  }
  if (mainContent.texts.indexOf(text) >= 0)
    mainContent.texts.splice(mainContent.texts.indexOf(text), 1);
}

function addLegendLabel(text) {
  if (legend["labels"].indexOf(text) < 0) legend["labels"].push(text);
  if (mainContent.texts.indexOf(text) >= 0)
    mainContent.texts.splice(mainContent.texts.indexOf(text), 1);
}

function moveAxisLabel(fromID, toID, text) {
  let from = fromID.startsWith("xLabels") ? xAxis : yAxis,
    to = toID.startsWith("xLabels") ? xAxis : yAxis;
  if (from["labels"].indexOf(text) >= 0) {
    from["labels"].splice(from["labels"].indexOf(text), 1);
  } else if (from.upperLevels) {
    for (let level of from.upperLevels) {
      if (level.indexOf(text) >= 0) level.splice(level.indexOf(text), 1);
    }
  }
  let accessor = toID.split("Labels")[1];
  if (accessor) {
    let level = to["upperLevels"][parseInt(accessor) - 1];
    if (level.indexOf(text) < 0) level.push(text);
  } else if (to["labels"].indexOf(text) < 0) to["labels"].push(text);
}

function removeAxisLabel(fromID, text) {
  let axis = fromID.startsWith("xLabels") ? xAxis : yAxis;
  if (axis["labels"].indexOf(text) >= 0) {
    axis["labels"].splice(axis["labels"].indexOf(text), 1);
  } else if (axis.upperLevels) {
    for (let level of axis.upperLevels) {
      if (level.indexOf(text) >= 0) level.splice(level.indexOf(text), 1);
    }
  }
  mainContent.texts.push(text);
}

function removeLegendLabel(text) {
  if (legend["labels"].indexOf(text) >= 0) {
    legend["labels"].splice(legend["labels"].indexOf(text), 1);
  }
  mainContent.texts.push(text);
}

/**
 * bug: waterfall_04
 */
function enableDragDrop(texts) {
  let svg = d3.select("#rbox1");
  let dragHandler = d3
    .drag()
    .on("start", function (event) {
      if (areaSelection) return;
      let current = d3.select(this);
      let thisText = texts.filter((t) => t["id"] == current.attr("id"))[0];
      d3.select("body")
        .append("div")
        .attr("class", "div4text")
        .attr(
          "style",
          "display: block; position:absolute; top: " +
            (event.sourceEvent.pageY - 12.5) +
            "px; left: " +
            (event.sourceEvent.pageX - 50) +
            "px; height: " +
            25 +
            "px; width: " +
            100 +
            "px"
        )
        .html(thisText["content"]);
    })
    .on("drag", function (event) {
      if (areaSelection) return;
      let current = d3.select(this);
      let thisText = texts.filter((t) => t["id"] == current.attr("id"))[0];
      d3.select(".div4text").attr(
        "style",
        "display: block; position:absolute; top: " +
          (event.sourceEvent.pageY - 12.5) +
          "px; left: " +
          (event.sourceEvent.pageX - 50) +
          "px; height: " +
          25 +
          "px; width: " +
          100 +
          "px"
      );
    })
    .on("end", function (event) {
      if (areaSelection) return;
      let current = d3.select(this);
      let TargetID;
      let thisText = texts.filter((t) => t["id"] == current.attr("id"))[0];
      d3.select(".div4text").remove();

      //getting the place where you drop the element
      let elements = document.elementsFromPoint(
        event.sourceEvent.pageX,
        event.sourceEvent.pageY
      );
      //check where the element is being dropped
      for (let e of elements) {
        if (e.tagName !== "DIV") continue;
        if (e.id == "legendLabels") {
          undoStack.push({
            xAxis: duplicate(xAxis),
            yAxis: duplicate(yAxis),
            legend: duplicate(legend),
            btnCheck: Object.assign({}, btnCheck),
          });
          addLegendLabel(thisText);
          displayLegend(legend);
        } else if (e.id.startsWith("xLabels") || e.id.startsWith("yLabels")) {
          TargetID = e.id;
          undoStack.push({
            xAxis: duplicate(xAxis),
            yAxis: duplicate(yAxis),
            legend: duplicate(legend),
            btnCheck: Object.assign({}, btnCheck),
          });
          addAxisLabel(TargetID, thisText);
          displayAxis(xAxis);
          displayAxis(yAxis);

          if (
            TargetID.startsWith("xLabels")
              ? !("baseline" in xAxis) ||
                Math.abs(xAxis["baseline"] - thisText.y) <= 30
              : !("baseline" in yAxis) ||
                Math.abs(yAxis["baseline"] - thisText.x) <= 30
          ) {
            let thisOri = TargetID.startsWith("xLabels") ? "y" : "x";
            let thisHtml =
              "Add the other texts sharing the same " +
              thisOri +
              " coordinate as axis labels?";
            d3.select("body")
              .append("div")
              .attr("class", "tooltip2")
              .style("border", "#ccc 1px solid")
              .style("padding", "20px")
              .html(thisHtml)
              .style("left", event.sourceEvent.pageX + "px")
              .style("top", event.sourceEvent.pageY - 60 + "px");
            d3.select(".tooltip2")
              .append("button")
              .attr("type", "button")
              .attr("id", "yes")
              .style("fill", "white")
              .style("margin-top", "10px")
              .style("width", "100px")
              .html("yes")
              .on("click", function (e) {
                let toAdd = texts.filter(
                  (d) => d[thisOri] == thisText[thisOri] && d.id != thisText.id
                );
                if (toAdd.length > 0) {
                  undoStack.push({
                    xAxis: duplicate(xAxis),
                    yAxis: duplicate(yAxis),
                    legend: duplicate(legend),
                    btnCheck: Object.assign({}, btnCheck),
                  });
                  for (let t of toAdd) {
                    addAxisLabel(TargetID, t);
                  }
                  displayAxis(xAxis);
                  displayAxis(yAxis);
                }
                d3.selectAll(".tooltip2").remove();
              });
            d3.select(".tooltip2")
              .append("button")
              .attr("type", "button")
              .attr("id", "no")
              .style("fill", "white")
              .style("margin-top", "10px")
              .style("width", "100px")
              .html("no")
              .on("click", function (e) {
                d3.selectAll(".tooltip2").remove();
              });
          }

          // buttonCheck(TargetID, thisText);
          break;
        } else if (e.id.startsWith("legendTitle")) {
          //check if the dragged element is present in the xAxis label
          //and remove it from the label if present
          for (let i = 0; i < xAxis["labels"].length; i++) {
            if (xAxis["labels"][i]["content"] === thisText["content"]) {
              xAxis["labels"].splice(i, 1);
              displayAxis(xAxis);
              break;
            }
          }

          //check if the dragged element is present in the yAxis label
          //and remove it from the label if present
          for (let i = 0; i < yAxis["labels"].length; i++) {
            if (yAxis["labels"][i]["content"] === thisText["content"]) {
              yAxis["labels"].splice(i, 1);
              displayAxis(yAxis);
              break;
            }
          }

          //check if the dragged element is present in the legend label
          //and remove it from the label if present

          for (let i = 0; i < legend["labels"].length; i++) {
            if (legend["labels"][i]["content"] === thisText["content"]) {
              legend["labels"].splice(i, 1);
              displayLegend(legend);
              break;
            }
          }

          if (titleYaxis.includes(thisText)) {
            titleYaxis.splice(titleYaxis.indexOf(thisText), 1);
            displayTitleYLabel(thisText, "delete");
          }

          if (titleXaxis.includes(thisText)) {
            titleXaxis.splice(titleXaxis.indexOf(thisText), 1);
            displayTitleXLabel(thisText, "delete");
          }

          displayTitleLegendLabel(thisText);
        }

        //if we drop the dragged element in the title box region
        else if (e.id.startsWith("xTitle")) {
          //check if the dragged element is present in the xAxis label
          //and remove it from the label if present
          for (let i = 0; i < xAxis["labels"].length; i++) {
            if (xAxis["labels"][i]["content"] === thisText["content"]) {
              xAxis["labels"].splice(i, 1);
              displayAxis(xAxis);
              break;
            }
          }

          //check if the dragged element is present in the yAxis label
          //and remove it from the label if present
          for (let i = 0; i < yAxis["labels"].length; i++) {
            if (yAxis["labels"][i]["content"] === thisText["content"]) {
              yAxis["labels"].splice(i, 1);
              displayAxis(yAxis);
              break;
            }
          }

          //check if the dragged element is present in the legend label
          //and remove it from the label if present

          for (let i = 0; i < legend["labels"].length; i++) {
            if (legend["labels"][i]["content"] === thisText["content"]) {
              legend["labels"].splice(i, 1);
              displayLegend(legend);
              break;
            }
          }

          //if the dragged element is already present in the y title display
          //remove the button from there and display the dragged element in x title
          if (titleYaxis.includes(thisText)) {
            titleYaxis.splice(titleYaxis.indexOf(thisText), 1);
            displayTitleYLabel(thisText, "delete");
          }
          if (titleLegend.includes(thisText)) {
            titleLegend.splice(titleLegend.indexOf(thisText), 1);
            displayTitleLegendLabel(thisText, "delete");
          }

          displayTitleXLabel(thisText);
        } else if (e.id.startsWith("yTitle")) {
          //check if the dragged element is present in the xAxis label
          //and remove it from the label if present
          for (let i = 0; i < xAxis["labels"].length; i++) {
            if (xAxis["labels"][i]["content"] === thisText["content"]) {
              xAxis["labels"].splice(i, 1);
              displayAxis(xAxis);
              break;
            }
          }

          //check if the dragged element is present in the yAxis label
          //and remove it from the label if present
          for (let i = 0; i < yAxis["labels"].length; i++) {
            if (yAxis["labels"][i]["content"] === thisText["content"]) {
              yAxis["labels"].splice(i, 1);
              displayAxis(yAxis);
              break;
            }
          }

          //check if the dragged element is present in the legend label
          //and remove it from the label if present

          for (let i = 0; i < legend["labels"].length; i++) {
            if (legend["labels"][i]["content"] === thisText["content"]) {
              legend["labels"].splice(i, 1);
              displayLegend(legend);
              break;
            }
          }

          //if the dragged element is already present in the y title display
          //remove the button from there and display the dragged element in x title
          if (titleXaxis.includes(thisText)) {
            titleXaxis.splice(titleXaxis.indexOf(thisText), 1);
            displayTitleXLabel(thisText, "delete");
          }

          if (titleLegend.includes(thisText)) {
            titleLegend.splice(titleLegend.indexOf(thisText), 1);
            displayTitleLegendLabel(thisText, "delete");
          }

          displayTitleYLabel(thisText);
        } else if (e.id.startsWith("chartTitle")) {
          displayChartTitle(thisText);
        }
      }
    });

  dragHandler(svg.selectAll("text"));

  svg
    .selectAll("text")
    .style("pointer-events", "auto")
    .style("cursor", "pointer")
    .on("mouseover", function () {
      thisText = d3.select(this);
      thisText.style("fill", "#ff0000").style("font-weight", "bold");
    })
    .on("mouseout", function () {
      thisText = d3.select(this);
      let thisT = texts.filter((t) => t["id"] == thisText.attr("id"))[0];
      thisText
        .style("fill", thisT ? thisT["fill"] : texts[0]["fill"])
        .style(
          "font-weight",
          thisT ? thisT["font-weight"] : texts[0]["font-weight"]
        );
    });
}

function duplicate(axis) {
  // make a copy of an array or object
  let copy = {};
  for (let k in axis) {
    if (Array.isArray(axis[k])) copy[k] = axis[k].map((d) => d);
    else copy[k] = axis[k];
  }
  return copy;
}

function buttonCheck(TargetID, thisText) {
  if (TargetID.split("Labels")[1]) return;
  let message = "Warnings: ";
  let attrCond =
    xAxis["attrX"].length > 0 && TargetID == "xLabels"
      ? !arrayCompare(Object.keys(thisText), xAxis["attrX"])
      : !arrayCompare(Object.keys(thisText), yAxis["attrY"]);
  let levelCond =
    TargetID == "xLabels"
      ? !(
          xAxis["labels"].length == 0 ||
          thisText.level == xAxis["labels"][0].level
        )
      : !(
          yAxis["labels"].length == 0 ||
          thisText.level == yAxis["labels"][0].level
        );
  let axisCond =
    TargetID == "xLabels"
      ? !(
          !("baseline" in xAxis) ||
          Math.abs(thisText.y - xAxis["baseline"]) < 200
        )
      : !(
          !("baseline" in xAxis) ||
          Math.abs(thisText.x - yAxis["baseline"]) < 200
        );
  if (attrCond) {
    message =
      message +
      "this text's attribute set is different from that of the detected labels;";
  }

  if (levelCond) {
    message =
      message +
      "this text's hierarchy level within the SVG is different from that of the detected labels; ";
  }

  if (axisCond) {
    message = message + "this text is not close to the detected labels.";
  }

  if (message != "Warnings: ") {
    btnCheck[thisText["id"]] = message;
  } else {
    if (thisText["id"] in btnCheck) delete btnCheck[thisText["id"]];
  }
}
