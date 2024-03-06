var undoStack = [],
  redoStack = [];
var btnCheck = {};

function addAxisLevel(t) {
  let axis = t === "x" ? xAxis : yAxis;
  if (!axis) return;
  if (!("upperLevels" in axis)) {
    axis["upperLevels"] = [];
  }
  axis["upperLevels"].push([]);
  d3.select("#" + t + "AxisDiv")
    .append("div")
    .attr("class", "axisLabels")
    .attr("id", t + "Labels" + axis["upperLevels"].length)
    .on("drop", drop)
    .on("dragover", allowDrop);
  let size = [
    "calc(",
    (100 / (axis["upperLevels"].length + 1)).toFixed(1),
    "% - ",
    405 / (axis["upperLevels"].length + 1),
    "px)",
  ].join("");
  d3.select("#" + t + "AxisDiv")
    .selectAll(".axisLabels")
    .style("width", size);
  //d3.select("#" + t + "AxisDiv").append("<div class="axisLabels" id="xLabels" ondrop="drop(event)" ondragover="allowDrop(event)"></div>")
}

function legendFieldTypeChanged() {
  let val = d3.select("#legendFieldType").property("value");
  legend.fieldType = val;
  if (val == "Null") {
    let labels = legend.labels.map((d) => d);
    for (let l of labels) {
      removeLegendLabel(l);
    }
    legend.ticks = [];
    legend.marks = [];
    legend.mapping = {};
    displayLegend(legend);
  }
}

function fieldTypeChanged(index) {
  let val = d3.select("#fieldType_" + index).property("value");
  index = parseInt(index);
  if (val == "Null") {
    let labels = axes[index].labels.map((d) => d);
    for (let l of labels) {
      removeAxisLabel("axisLabel_" + index, l);
    }
    axes[index] = { labels: [], fieldType: "Null" };
  }

  axes[index].fieldType = val;
  displayAxis(index);
}

function axisTypeChanged(index) {
  let val = d3.select("#axisType_" + index).property("value");
  axes[index].type = val;
  displayAxis(index);
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
        if (areaSelection == "legend") {
          findLegendInArea(topLeft, btmRight, groupedGraphicsElement.texts);
        } else {
          findAxisInArea(
            areaSelection,
            topLeft,
            btmRight,
            groupedGraphicsElement.texts
          );
        }

        Object.keys(axes).forEach((k) => {
          let index = parseInt(k);
          displayAxis(index);
        });
        displayLegend(legend);
        deactivateAreaSelect();
      }
      clickHold = false;
      d3.select("#overlaySelection").style("visibility", "hidden");
    });
}

function activateAreaSelect(index) {
  areaSelection = index;
  document.body.style.cursor = "crosshair";
  d3.selectAll(".selectAreaBtn").style("background", "#eee");
  d3.select("#" + index + "Area").style("background", "#c8e6fa");
}

function deactivateAreaSelect() {
  areaSelection = undefined;
  document.body.style.cursor = "default";
  d3.selectAll(".selectAreaBtn").style("background", "#eee");
}

function save() {
  xAxis["fieldType"] = d3.select("#xFieldType").property("value");
  yAxis["fieldType"] = d3.select("#yFieldType").property("value");
  legend["fieldType"] = d3.select("#legendFieldType").property("value");
  let result = {
    xAxis: xAxis,
    yAxis: yAxis,
    legend: legend,
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
  console.log(thisText);

  draggedToID = ev.srcElement.id;
  if (draggedToID.includes("IDinSVG")) {
    // make it its parent ID
    draggedToID = ev.srcElement.parentNode.id;
  }
  console.log("Dragging from " + draggedFromID + " to " + draggedToID);

  if (
    draggedToID.startsWith("axisTitle") ||
    draggedToID.startsWith("legendTitle") ||
    draggedToID.startsWith("chartTitle")
  ) {
    console.log("dropping into title boxes");
    if (draggedFromID.startsWith("axisLabel")) {
      console.log("dropping from axis label to title boxes");
      let thisAxis = axes[draggedFromID.split("_")[1]];
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

      let thisTitle =
        draggedToID === "legendTitle"
          ? "legend"
          : draggedToID === "chartTitle"
          ? "chart"
          : "axis";

      switch (thisTitle) {
        case "axis":
          console.log("dropping from axis label to axis title");
          // need a new displayAxisTitle function
          displayAxisTitle(thisText, draggedToID.split("_")[1]);
          break;
        case "Legend":
          displayTitleLegendLabel(thisText);
          break;
        case "chart":
          displayChartTitle(thisText);
          break;
      }

      Object.keys(axes).forEach((k) => {
        let index = parseInt(k);
        displayAxis(index);
      });
    } else if (
      draggedFromID.startsWith("legendTitle") ||
      draggedFromID.startsWith("axisTitle") ||
      draggedFromID.startsWith("chartTitle")
    ) {
      console.log("dropping from title boxes to title boxes");
      let sourceTitle = draggedFromID.startsWith("legendTitle")
        ? "legend"
        : draggedFromID.startsWith("chartTitle")
        ? "chart"
        : "axis";

      switch (sourceTitle) {
        case "axis":
          let thisIndex = draggedFromID.split("_")[1];
          axes[thisIndex].title.splice(
            axes[thisIndex].title.indexOf(thisText),
            1
          );
          displayAxisTitle(thisText, thisIndex, "delete");
          break;
        case "legend":
          titleLegend.splice(titleLegend.indexOf(thisText), 1);
          displayTitleLegendLabel(thisText, "delete");
          break;
        case "chart":
          displayChartTitle(thisText, "delete");
          break;
      }

      let thisTitle = draggedToID.startsWith("axisTitle")
        ? "axis"
        : draggedToID.startsWith("legendTitle")
        ? "legend"
        : "chart";

      switch (thisTitle) {
        case "axis":
          displayAxisTitle(thisText, draggedToID.split("_")[1]);
          break;
        case "legend":
          displayTitleLegendLabel(thisText);
          break;
        case "chart":
          displayChartTitle(thisText);
          break;
      }
    }
  } else if (draggedToID.startsWith("axisLabel")) {
    console.log("dropping into axis label boxes");
    // need to handle legend label
    let thisText = d3.select("#" + data).datum();
    // when the element is dropped in the detected region
    /*dropping from title region into y label region */
    if (
      draggedFromID.startsWith("axisTitle") ||
      draggedFromID.startsWith("legendTitle") ||
      draggedFromID.startsWith("chartTitle")
    ) {
      console.log("dropping from title boxes to label boxes");
      let thisTitle = draggedFromID.startsWith("axisTitle")
        ? "axis"
        : draggedFromID.startsWith("chartTitle")
        ? "chart"
        : "legend";

      switch (thisTitle) {
        case "chart":
          displayChartTitle(thisText, "delete");
          break;
        case "axis":
          let thisIndex = draggedFromID.split("_")[1];
          axes[thisIndex].title.splice(
            axes[thisIndex].title.indexOf(thisText),
            1
          );
          displayAxisTitle(thisText, draggedFromID.split("_")[1], "delete");
          break;
        case "legend":
          titleLegend.splice(titleLegend.indexOf(thisText), 1);
          displayTitleLegendLabel(thisText, "delete");
          break;
      }

      axes[draggedToID.split("_")[1]]["labels"].push(thisText); // TBD: need to handle upper levels [IMPORTANT]

      Object.keys(axes).forEach((k) => {
        let index = parseInt(k);
        displayAxis(index);
      });
    }
    if (draggedFromID.startsWith("axisLabel")) {
      console.log("dropping from axis label to axis label");
      moveAxisLabel(draggedFromID, draggedToID, d3.select("#" + data).datum());
      Object.keys(axes).forEach((k) => {
        let index = parseInt(k);
        displayAxis(index);
      });
      ev.stopImmediatePropagation(); // stop the event from bubbling up to the SVG element
    }
  } else {
    if (draggedFromID.startsWith("axisLabel")) {
      console.log("dropping from axis label to other regions");
      removeAxisLabel(draggedFromID, d3.select("#" + data).datum());
      Object.keys(axes).forEach((k) => {
        let index = parseInt(k);
        displayAxis(index);
      });
    } else if (draggedFromID == "legendLabels") {
      removeLegendLabel(d3.select("#" + data).datum());
      displayLegend(legend);
    } else if (
      draggedFromID.startsWith("axisTitle") ||
      draggedFromID.startsWith("legendTitle")
    ) {
      let thisTitle = draggedFromID.startsWith("legendTitle")
        ? "legend"
        : "axis";

      switch (thisTitle) {
        case "axis":
          let thisIndex = draggedFromID.split("_")[1];
          axes[thisIndex].title.splice(
            axes[thisIndex].title.indexOf(thisText),
            1
          );
          displayAxisTitle(thisText, thisIndex, "delete");
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
  Object.keys(axes).forEach((k) => {
    let index = parseInt(k);
    if (axes[index]["labels"].indexOf(text) >= 0) {
      axes[index]["labels"].splice(axes[index]["labels"].indexOf(text), 1);
    }
  });
  axes[TargetID.split("_")[1]]["labels"].push(text);
  Object.keys(axes).forEach((k) => {
    let index = parseInt(k);
    displayAxis(index);
  });
  allGraphicsElement[text.id].isReferenceElement = true;
}

function addLegendLabel(text) {
  if (legend["labels"].indexOf(text) < 0) legend["labels"].push(text);
  allGraphicsElement[text.id].isReferenceElement = true;
}

function moveAxisLabel(fromID, toID, text) {
  let from = fromID.split("_")[1],
    to = toID.split("_")[1];
  if (axes[from]["labels"].indexOf(text) >= 0) {
    axes[from]["labels"].splice(axes[from]["labels"].indexOf(text), 1);
  } else if (from.upperLevels) {
    for (let level of from.upperLevels) {
      if (level.indexOf(text) >= 0) level.splice(level.indexOf(text), 1);
    }
  }
  if (axes[to]["labels"].indexOf(text) < 0) axes[to]["labels"].push(text);
}

function removeAxisLabel(fromID, text) {
  let axis = axes[fromID.split("_")[1]];
  if (axis["labels"].indexOf(text) >= 0) {
    axis["labels"].splice(axis["labels"].indexOf(text), 1);
  } else if (axis.upperLevels) {
    for (let level of axis.upperLevels) {
      if (level.indexOf(text) >= 0) level.splice(level.indexOf(text), 1);
    }
  }
  allGraphicsElement[text.id].isReferenceElement = false;
}

function removeLegendLabel(text) {
  if (legend["labels"].indexOf(text) >= 0) {
    legend["labels"].splice(legend["labels"].indexOf(text), 1);
  }
  allGraphicsElement[text.id].isReferenceElement = false;
}

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
          addLegendLabel(thisText);
          displayLegend(legend);
        } else if (e.id.startsWith("axisLabel")) {
          TargetID = e.id;
          addAxisLabel(TargetID, thisText);
          Object.keys(axes).forEach((k) => {
            let index = parseInt(k);
            displayAxis(index);
          });

          //// TBD: handle the batch add based on the x or y coordinates
          // if (
          //   TargetID.startsWith("xLabels")
          //     ? !("baseline" in xAxis) ||
          //       Math.abs(xAxis["baseline"] - thisText.y) <= 30
          //     : !("baseline" in yAxis) ||
          //       Math.abs(yAxis["baseline"] - thisText.x) <= 30
          // ) {
          //   let thisOri = TargetID.startsWith("xLabels") ? "top" : "left";
          //   let thisHtml =
          //     "Add the other texts sharing the same " +
          //     thisOri +
          //     " coordinate as axis labels?";
          //   d3.select("body")
          //     .append("div")
          //     .attr("class", "tooltip2")
          //     .style("border", "#ccc 1px solid")
          //     .style("padding", "20px")
          //     .html(thisHtml)
          //     .style("left", event.sourceEvent.pageX + "px")
          //     .style("top", event.sourceEvent.pageY - 60 + "px");
          //   d3.select(".tooltip2")
          //     .append("button")
          //     .attr("type", "button")
          //     .attr("id", "yes")
          //     .style("fill", "white")
          //     .style("margin-top", "10px")
          //     .style("width", "100px")
          //     .html("yes")
          //     .on("click", function (e) {
          //       let toAdd = texts.filter(
          //         (d) => d[thisOri] == thisText[thisOri] && d.id != thisText.id
          //       );
          //       if (toAdd.length > 0) {
          //         undoStack.push({
          //           xAxis: duplicate(xAxis),
          //           yAxis: duplicate(yAxis),
          //           legend: duplicate(legend),
          //           btnCheck: Object.assign({}, btnCheck),
          //         });
          //         for (let t of toAdd) {
          //           addAxisLabel(TargetID, t);
          //         }
          //         displayAxis(xAxis);
          //         displayAxis(yAxis);
          //       }
          //       d3.selectAll(".tooltip2").remove();
          //     });
          //   d3.select(".tooltip2")
          //     .append("button")
          //     .attr("type", "button")
          //     .attr("id", "no")
          //     .style("fill", "white")
          //     .style("margin-top", "10px")
          //     .style("width", "100px")
          //     .html("no")
          //     .on("click", function (e) {
          //       d3.selectAll(".tooltip2").remove();
          //     });
          // }

          break;
        } else if (e.id.startsWith("legendTitle")) {
          //check if the dragged element is present in the axis labels
          //and remove it from the label if present
          Object.keys(axes).forEach((k) => {
            let index = parseInt(k);
            if (axes[index]["labels"].indexOf(thisText) >= 0) {
              axes[index]["labels"].splice(
                axes[index]["labels"].indexOf(thisText),
                1
              );
            }
            if (axes[index]["title"].indexOf(thisText) >= 0) {
              axes[index]["title"].splice(
                axes[index]["title"].indexOf(thisText),
                1
              );
            }
          });

          //check if the dragged element is present in the legend label
          //and remove it from the label if present

          for (let i = 0; i < legend["labels"].length; i++) {
            if (legend["labels"][i]["content"] === thisText["content"]) {
              legend["labels"].splice(i, 1);
              displayLegend(legend);
              break;
            }
          }

          displayTitleLegendLabel(thisText);
        }

        //if we drop the dragged element in the title box region
        else if (e.id.startsWith("axisTitle")) {
          //check if the dragged element is present in the axis label
          //and remove it from the label if present
          Object.keys(axes).forEach((k) => {
            let index = parseInt(k);
            if (axes[index]["labels"].indexOf(thisText) >= 0) {
              axes[index]["labels"].splice(
                axes[index]["labels"].indexOf(thisText),
                1
              );
            }
            if (axes[index]["title"].indexOf(thisText) >= 0) {
              axes[index]["title"].splice(
                axes[index]["title"].indexOf(thisText),
                1
              );
            }
          });

          //check if the dragged element is present in the legend label
          //and remove it from the label if present

          for (let i = 0; i < legend["labels"].length; i++) {
            if (legend["labels"][i]["content"] === thisText["content"]) {
              legend["labels"].splice(i, 1);
              displayLegend(legend);
              break;
            }
          }

          displayAxisTitle(thisText, e.id.split("_")[1]);
        } else if (e.id.startsWith("chartTitle")) {
          displayChartTitle(thisText);
        }
      }
    });

  dragHandler(svg.selectAll("text"));

  svgTextHighlight(texts);
}

function svgTextHighlight(texts) {
  let svg = d3.select("#rbox1");
  svg.selectAll("text").style("pointer-events", "all");
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
