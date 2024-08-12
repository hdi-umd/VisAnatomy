var allSVGElementID = [];
var idMappings = {}; // To track original to new ID mappings
var indices = {}; // To track the number of each element type

function displaySVG(text) {
  allSVGElementID = [];
  idMappings = {}; // Reset ID mappings
  indices = {}; // Reset indices
  document.getElementById("rbox1").innerHTML = text;
  let vis = d3.select("#rbox1").select("svg").attr("id", "vis");

  const svgElement = document.querySelector("#vis");
  svgElement.removeAttribute("viewBox");
  addClassAndIdToLeaves(svgElement);
  updateUseElementReferences(svgElement);

  vis.style("height", "100%").style("width", "100%");
}

function addClassAndIdToLeaves(element) {
  // Set ID
  if (element.nodeType === Node.ELEMENT_NODE && element.nodeName !== "svg") {
    let originalId = element.getAttribute("id"); // Get original ID if exists
    if (!Object.keys(indices).includes(element.nodeName)) {
      indices[element.nodeName] = 0;
    }
    if (
      element.nodeName !== "linearGradient" &&
      element.nodeName !== "g" &&
      element.nodeName.indexOf(":") === -1
    ) {
      let newId = element.nodeName + indices[element.nodeName]++;
      element.setAttribute("id", newId);
      allSVGElementID.push(newId);
      if (originalId) {
        idMappings[originalId] = newId; // Track original to new ID
      }
    }
  }

  if (element.hasChildNodes()) {
    element.childNodes.forEach((childNode) => {
      addClassAndIdToLeaves(childNode);
    });
  } else {
    // Set class for specific elements
    setClassForSpecificElements(element);
  }
}

function setClassForSpecificElements(element) {
  if (
    [
      "rect",
      "circle",
      "ellipse",
      "text",
      "line",
      "polyline",
      "polygon", // Fixed typo 'polygon' to 'polygon'
      "path",
      "image",
      "use",
    ].includes(element.nodeName)
  ) {
    if (element.hasAttribute("class")) {
      const existingClasses = element.getAttribute("class").split(" ");
      if (!existingClasses.includes("mark")) {
        element.setAttribute("class", `${element.getAttribute("class")} mark`);
      }
    } else {
      element.setAttribute("class", "mark");
    }
  }
}

// After all elements have been processed, update <use> element references
function updateUseElementReferences(svgElement) {
  svgElement.querySelectorAll("use").forEach((use) => {
    let href = use.getAttribute("href") || use.getAttribute("xlink:href");
    if (href && href.includes("#")) {
      let originalId = href.split("#")[1];
      if (idMappings[originalId]) {
        let newHref = "#" + idMappings[originalId];
        use.setAttribute("href", newHref); // Update for modern browsers
        use.setAttribute("xlink:href", newHref); // Update for compatibility
      }
    }
  });
}

function displayAxis(index) {
  let axis = axes[index];

  if (Object.keys(axis).length === 0) return;
  d3.select("#axis_" + index)
    .selectAll(".higerLevelLabelBox")
    .remove();
  d3.select("#axisLabel_" + index)
    .selectAll("button")
    .remove();
  // if (axis.upperLevels) {
  //   for (let [i, level] of axis.upperLevels.entries()) {
  //     console.log(i);
  //     d3.select("#" + "#axisLabel" + index + (i + 1))
  //       .selectAll("button")
  //       .remove();
  //   }
  // }

  let labels = axis["labels"];
  let type;
  if (axis.fieldType) {
    type = axis.fieldType;
  } else {
    if (labels.length === 0) {
      type = "Null";
    } else {
      type = typeByAtlas(_inferType(labels.map((xl) => xl.content)));
    }
    axis.fieldType = type;
  }

  d3.select("#fieldType_" + index).property("value", type);
  d3.select("#axisType_" + index).property(
    "value",
    axis.type ? axis.type : "x"
  );

  labels = labels.sort((a, b) =>
    parseFloat(a.id.substring(4)) > parseFloat(b.id.substring(4)) ? 1 : -1
  );

  for (let label of labels) {
    displayAxisLabel(label, "#axisLabel_" + index);
  }

  [1, 2, 3].forEach((i) => {
    d3.select("#" + "axisLabel_" + index + "_" + i).remove();
  });

  if (axis.upperLevels) {
    let size = [
      "calc(",
      (100 / (axis["upperLevels"].length + 1)).toFixed(1),
      "% - ",
      405 / (axis["upperLevels"].length + 1),
      "px)",
    ].join("");
    for (let [i, level] of axis.upperLevels.entries()) {
      let thisHigherLevelLabelBoxID = "#axisLabel_" + index + "_" + (i + 1);
      if (!document.getElementById(thisHigherLevelLabelBoxID)) {
        d3.select("#axis_" + index)
          .append("div")
          .attr("class", "axisLabels higerLevelLabelBox") // add another class to the div
          .attr("id", thisHigherLevelLabelBoxID)
          .on("drop", drop)
          .on("dragover", allowDrop);
      }
      d3.select("#axis_" + index)
        .selectAll(".axisLabels")
        .style("width", size);
    }

    for (let [i, level] of axis.upperLevels.entries()) {
      let thisHigherLevelLabelBoxID = "#axisLabel_" + index + "_" + (i + 1);

      document.getElementById(thisHigherLevelLabelBoxID).innerHTML = "";

      for (let label of level) {
        // this is pretty weird that using d3 won't work so has to use pure html
        let thisLabel = document.createElement("button");
        thisLabel.innerHTML = label.content;
        thisLabel.setAttribute("draggable", true);
        thisLabel.setAttribute("id", "IDinSVG" + label.id);
        thisLabel.setAttribute("type", "button");
        thisLabel.setAttribute("class", "labelButton");
        thisLabel.addEventListener("dragstart", drag);
        document
          .getElementById(thisHigherLevelLabelBoxID)
          .appendChild(thisLabel);
      }
    }
  }

  displayAxisTitle(axis.title, index, "load");
}

function displayAxisLabel(label, divID) {
  d3.select(divID)
    .append("button")
    .datum(label)
    .attr("type", "button")
    .attr("class", "labelButton")
    .attr("id", "IDinSVG" + label["id"])
    .attr("draggable", true)
    .text(label["content"])
    .on("dragstart", drag);
}

function displayLegend(legend) {
  if (Object.keys(legend) === 0) return;
  d3.select("#legendLabels").selectAll("button").remove();

  let labels = legend["labels"];
  let type;
  if (labels.length === 0) {
    type = "Null";
  } else {
    type = typeByAtlas(_inferType(labels.map((xl) => xl.content)));
  }
  d3.select("#legendFieldType").property("value", type);

  labels = labels.sort((a, b) =>
    parseFloat(a.id.substring(4)) > parseFloat(b.id.substring(4)) ? 1 : -1
  );

  for (let label of labels) {
    d3.select("#legendLabels")
      .append("button")
      .datum(label)
      .attr("type", "button")
      .attr("class", "labelButton")
      .attr("id", "IDinSVG" + label["id"])
      .attr("draggable", true) //
      .style("background-color", function (d, i) {
        if (legend.type == "continuous") {
          let rgbC;
          if (legend.colors)
            if (legend.colors.length > 0)
              rgbC = legend.colors[labels.indexOf(label)];
          return !legend.colors
            ? "#f2f2f2"
            : legend.colors.length == 0
            ? "#f2f2f2"
            : ConvertRGBtoHex(rgbC[0], rgbC[1], rgbC[2]);
        } else {
          return legend.mapping[d.content];
        }
      })
      .text(label["content"])
      .on("dragstart", drag);
  }
}

function displayAxisTitle(thisText, axisIndex, mode) {
  let axis = axes[axisIndex];

  if (mode === "delete") {
    let index = axis.title.indexOf(thisText);
    if (index > -1) axis.title.splice(index, 1);
  } else {
    if (mode !== "load" && axis.title.indexOf(thisText) < 0)
      axis.title.push(thisText);
  }

  let thisDiv = d3.select("#axisTitle_" + axisIndex);
  thisDiv.selectAll("button").remove();
  for (let title of axis.title) {
    let btn = thisDiv
      .append("button")
      .datum(title)
      .attr("type", "button")
      .attr("class", "labelButton")
      .attr("style", "position: absolute; top: 1px; left: 200px")
      .attr("style", "width: 100%")
      .attr("id", "axis_" + axisIndex + "_titleIDinSVG" + title["id"]) // TBD: make the ID consistent with the rest
      .attr("draggable", true)
      .text(title["content"])
      .on("dragstart", drag);
    btn
      .attr("style", "background-color: #f2f2f2")
      .on("mouseover", function (event) {
        d3.select(this) // Select the hovered button
          .attr("style", "color: #fff");
      })
      .on("mouseout", function () {
        d3.select(this) // Select the hovered button
          .attr("style", "background-color: #f2f2f2; width: 100%")
          .attr("style", "color: black");
      });
  }
}

function displayTitleLegendLabel(thisText, mode) {
  if (mode === "delete") {
    d3.select("#legendTitle")
      .select("#" + "legendTitleIDinSVG" + thisText["id"])
      .remove();
    return;
  } else {
    if (titleLegend.includes(thisText)) return;
    else titleLegend.push(thisText);
  }

  let text = thisText["content"];

  let btn = d3
    .select("#legendTitle")
    .append("button")
    .datum(thisText)
    .attr("type", "button")
    .attr("class", "labelButton")
    .attr("id", "legendTitleIDinSVG" + thisText["id"])
    .text(text)
    .attr("draggable", true)
    .on("dragstart", drag);

  btn
    .attr("style", "background-color: #f2f2f2")
    .on("mouseover", function (event) {
      d3.select(this) // Select the hovered button
        .attr("style", "color: #fff");
    })
    .on("mouseout", function () {
      d3.select(this) // Select the hovered button
        .attr("style", "background-color: #f2f2f2; width: 100%")
        .attr("style", "color: black");
    });
}

function displayChartTitle(thisText, mode) {
  if (mode === "delete") {
    chartTitle.splice(chartTitle.indexOf(thisText), 1);
  } else {
    if (!chartTitle.includes(thisText)) chartTitle.push(thisText);
  }

  d3.select("#chartTitle").selectAll("button").remove();

  for (let thisTitle of chartTitle) {
    let btn = d3
      .select("#chartTitle")
      .append("button")
      .datum(thisTitle)
      .attr("type", "button")
      .attr("class", "chartTitleButton")
      .attr("id", "chartTitleIDinSVG" + thisTitle["id"])
      .text(thisTitle["content"])
      .attr("draggable", true)
      .on("dragstart", drag);

    btn
      .attr("style", "background-color: #f2f2f2")
      .on("mouseover", function (event) {
        d3.select(this) // Select the hovered button
          .attr("style", "color: #fff");
      })
      .on("mouseout", function () {
        d3.select(this) // Select the hovered button
          .attr("style", "background-color: #f2f2f2; width: 100%")
          .attr("style", "color: black");
      });
  }
}

function displayTitles(chartTitle, legendTitle) {
  let allTitles = [chartTitle, legendTitle];
  ["chartTitle", "legendTitle"].forEach((id) => {
    d3.select("#" + id)
      .selectAll("button")
      .remove();
    for (let title of allTitles[["chartTitle", "legendTitle"].indexOf(id)].map(
      (e) => (typeof e === "string" ? allGraphicsElement[e] : e)
    )) {
      let btn = d3
        .select("#" + id)
        .append("button")
        .datum(title)
        .attr("type", "button")
        .attr("class", id + "Button")
        .attr("id", id + "IDinSVG" + title["id"])
        .text(title["content"])
        .attr("draggable", true)
        .on("dragstart", drag);

      btn
        .attr("style", "background-color: #f2f2f2")
        .on("mouseover", function (event) {
          d3.select(this) // Select the hovered button
            .attr("style", "color: #fff");
        })
        .on("mouseout", function () {
          d3.select(this) // Select the hovered button
            .attr("style", "background-color: #f2f2f2; width: 100%")
            .attr("style", "color: black");
        });
    }
  });
}

function setViewBox() {
  let vb = getViewBox();
  let margin = 15,
    vbString = [
      vb.left - margin,
      vb.top - margin,
      vb.right - vb.left + margin * 2,
      vb.bottom - vb.top + margin * 2,
    ].join(",");
  d3.select("#vis").attr("viewBox", vbString);
  //d3.select("#overlay").attr("viewBox", vbString);

  // let svgString = document.getElementById("vis").outerHTML;
  // svgString = setCorrectViewBox(svgString);
  // document.getElementById("vis").outerHTML = svgString;

  if (legend.type === "continuous") {
    let legendBar = legend.marks[0];
    let pos = document.getElementById(legendBar.id).getBoundingClientRect();
    let rbox1Pos = document.getElementById("rbox1").getBoundingClientRect();
    // console.log(rbox1Pos);
    html2canvas(document.getElementById("rbox1"), {
      width: rbox1Pos.width,
      height: rbox1Pos.height,
    }).then(function (canvas) {
      canvas.style.position = "absolute";
      canvas.style.left = rbox1Pos.x + "px";
      canvas.style.top = rbox1Pos.y + "px";
      canvas.style.opacity = 1;
      document.body.appendChild(canvas);

      var ctx = canvas.getContext("2d");
      ctx.strokeStyle = "#FF0000";
      ctx.fillStyle = "green";
      ctx.lineWidth = 1;
      ctx.beginPath();
      // ctx.rect(pos.left, pos.top, pos.width, pos.height);
      ctx.stroke();

      // console.log("Position of the legend bar from getBoundingClientRect() ", pos.left, pos.top, pos.width, pos.height)
      const hiddenX = (thisPos) => {
        return (
          thisPos.left -
          (rbox1Pos.x -
            (((thisPos.left - rbox1Pos.x) * parseFloat(canvas.width)) /
              parseFloat(canvas.style.width) -
              (thisPos.left - rbox1Pos.x)))
        );
      };
      const hiddenY = (thisPos) => {
        return (
          thisPos.top -
          (rbox1Pos.y -
            (((thisPos.top - rbox1Pos.y) * parseFloat(canvas.height)) /
              parseFloat(canvas.style.height) -
              (thisPos.top - rbox1Pos.y)))
        );
      };
      const hiddenW = (thisPos) => {
        return (
          (thisPos.width * parseFloat(canvas.width)) /
          parseFloat(canvas.style.width)
        );
      };
      const hiddenH = (thisPos) => {
        return (
          (thisPos.height * parseFloat(canvas.height)) /
          parseFloat(canvas.style.height)
        );
      };
      let hiddenLeft = hiddenX(pos); //pos.left - (281 - ((pos.left - 281) * parseFloat(canvas.width) / parseFloat(canvas.style.width) - (pos.left - 281)));
      let hiddenTop = hiddenY(pos); //pos.top - (281 - ((pos.top - 281) * parseFloat(canvas.height) / parseFloat(canvas.style.height) - (pos.top - 281)));
      let hiddenWidth = hiddenW(pos);
      let hiddenHeight = hiddenH(pos);
      // console.log("Hidden position of the legend bar: ", hiddenLeft, hiddenTop, hiddenWidth, hiddenHeight)

      let colors = [];
      let tickPos = legend.ticks.map((tickid) =>
        document.getElementById(tickid).getBoundingClientRect()
      );
      let labelPos = legend.labels.map((label) =>
        document.getElementById(label.id).getBoundingClientRect()
      );
      switch (legend.orientation) {
        case "horz":
          if (labelPos.length > 0) {
            for (let aLabel of labelPos) {
              let ratio = (aLabel.left - pos.left) / pos.width;
              ratio =
                ratio < 0 ? 0 : 1 - ratio < 0.01 || ratio >= 1 ? 1 : ratio;
              let p =
                ratio < 1
                  ? ctx.getImageData(
                      hiddenLeft + hiddenWidth * ratio + 3,
                      hiddenTop + hiddenHeight / 2,
                      1,
                      1
                    ).data
                  : ctx.getImageData(
                      hiddenLeft + hiddenWidth - 3,
                      hiddenTop + hiddenHeight / 2,
                      1,
                      1
                    ).data;
              colors.push([p[0], p[1], p[2]]);
            }
          } else if (tickPos.length > 0) {
            for (let aTick of tickPos) {
              let ratio = (aTick.left - pos.left) / pos.width;
              ratio =
                ratio < 0 ? 0 : 1 - ratio < 0.01 || ratio >= 1 ? 1 : ratio;
              let p =
                ratio < 1
                  ? ctx.getImageData(
                      hiddenLeft + hiddenWidth * ratio + 3,
                      hiddenTop + hiddenHeight / 2,
                      1,
                      1
                    ).data
                  : ctx.getImageData(
                      hiddenLeft + hiddenWidth - 3,
                      hiddenTop + hiddenHeight / 2,
                      1,
                      1
                    ).data;
              colors.push([p[0], p[1], p[2]]);
            }
          } else {
          }
          break;
        case "vert":
          if (labelPos.length > 0) {
            for (let aLabel of labelPos) {
              let ratio = (aLabel.top - pos.top) / pos.height;
              ratio =
                ratio < 0 ? 0 : 1 - ratio < 0.01 || ratio >= 1 ? 1 : ratio;
              let p =
                ratio < 1
                  ? ctx.getImageData(
                      hiddenLeft + hiddenWidth / 2,
                      hiddenTop + hiddenHeight * ratio + 3,
                      1,
                      1
                    ).data
                  : ctx.getImageData(
                      hiddenLeft + hiddenWidth / 2,
                      hiddenTop + hiddenHeight - 3,
                      1,
                      1
                    ).data;
              colors.push([p[0], p[1], p[2], p[3]]);
            }
          }
          if (tickPos.length > 0) {
            for (let aTick of tickPos) {
              let ratio = (aTick.top - pos.top) / pos.height;
              ratio =
                ratio < 0 ? 0 : 1 - ratio < 0.01 || ratio >= 1 ? 1 : ratio;
              let p =
                ratio < 1
                  ? ctx.getImageData(
                      hiddenLeft + hiddenWidth / 2,
                      hiddenTop + hiddenHeight * ratio + 3,
                      1,
                      1
                    ).data
                  : ctx.getImageData(
                      hiddenLeft + hiddenWidth / 2,
                      hiddenTop + hiddenHeight - 3,
                      1,
                      1
                    ).data;
              colors.push([p[0], p[1], p[2]]);
            }
          } else {
          }
          break;
      }
      legend.colors = colors; //colors.map(rgbC => ConvertRGBtoHex(rgbC[0], rgbC[1], rgbC[2]));
      displayLegend(legend);
      d3.select("canvas").remove();
    });
  }
}

function getViewBox() {
  let allBBoxes = Object.values(allGraphicsElement);
  return {
    left: allBBoxes.map((bbox) => bbox.left).reduce((a, b) => Math.min(a, b)),
    top: allBBoxes.map((bbox) => bbox.top).reduce((a, b) => Math.min(a, b)),
    right: allBBoxes.map((bbox) => bbox.right).reduce((a, b) => Math.max(a, b)),
    bottom: allBBoxes
      .map((bbox) => bbox.bottom)
      .reduce((a, b) => Math.max(a, b)),
  };
}

function setCorrectViewBox(svgString) {
  // Parse the SVG content
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = svgDoc.documentElement;

  // Extract width and height attributes from SVG
  const width = svgElement.getAttribute("width");
  const height = svgElement.getAttribute("height");

  // If width and height exist, set the viewBox
  if (width && height) {
    const widthValue = parseFloat(width);
    const heightValue = parseFloat(height);

    // Set or update the viewBox attribute
    svgElement.setAttribute("viewBox", `0 0 ${widthValue} ${heightValue}`);
  }

  // Serialize the updated SVG back to a string
  const serializer = new XMLSerializer();
  const updatedSvgString = serializer.serializeToString(svgElement);

  return updatedSvgString;
}

function getBoundingBox(node) {
  switch (node.tag) {
    case "rect":
      return {
        left: node.x,
        top: node.y,
        right: node.right,
        bottom: node.bottom,
      };
    case "text":
      return {
        left: "left" in node ? node.left : node.x,
        top: node.y,
        right: "left" in node ? node.left + node.width : node.x + node.width,
        bottom: node.y + node.height,
      };
    case "line":
      return {
        left: Math.min(node.x1, node.x2),
        right: Math.max(node.x1, node.x2),
        top: Math.min(node.y1, node.y2),
        bottom: Math.max(node.y1, node.y2),
      };
    case "circle":
      return {
        left: node.x - node.radius,
        top: node.y - node.radius,
        right: node.x + node.radius,
        bottom: node.y + node.radius,
      };
  }
}
