var allSVGElementID = [];
function displaySVG(text) {
  allSVGElementID = [];
  document.getElementById("rbox1").innerHTML = text;
  let vis = d3.select("#rbox1").select("svg").attr("id", "vis");

  let indices = {};

  function addClassAndIdToLeaves(element) {
    // set ID
    if (element.nodeType === Node.ELEMENT_NODE && element.nodeName !== "svg") {
      if (!Object.keys(indices).includes(element.nodeName)) {
        indices[element.nodeName] = 0;
      }
      if (
        element.nodeName !== "linearGradient" &&
        element.nodeName !== "g" &&
        element.nodeName.indexOf(":") === -1
      ) {
        element.setAttribute(
          "id",
          element.nodeName + indices[element.nodeName]++
        );
        allSVGElementID.push(element.id);
      }
    }

    if (element.hasChildNodes()) {
      element.childNodes.forEach((childNode) => {
        addClassAndIdToLeaves(childNode);
      });
    } else {
      // set class
      if (
        [
          "rect",
          "circle",
          "ellipse",
          "text",
          "line",
          "polyline",
          "ploygon",
          "path",
          "image",
          "use",
        ].includes(element.nodeName)
      ) {
        if (element.hasAttribute("class")) {
          const existingClasses = element.getAttribute("class").split(" ");
          if (!existingClasses.includes("mark")) {
            element.setAttribute(
              "class",
              `${element.getAttribute("class")} mark`
            );
          }
        } else {
          element.setAttribute("class", "mark");
        }
        // element.addEventListener("contextmenu", (event) => {
        //   event.preventDefault();
        //   console.log('Right-clicked on leaf node with class "mark"');
        //   // Your code to handle the right-click event goes here
        // });
      }
    }
  }

  const svgElement = document.querySelector("#vis");
  svgElement.removeAttribute("viewBox");
  addClassAndIdToLeaves(svgElement);

  vis.style("height", "100%").style("width", "100%");
}

function displayAxis(axis) {
  if (Object.keys(axis) === 0) return;
  d3.select("#" + axis.type + "Labels")
    .selectAll("button")
    .remove();
  if (axis.upperLevels) {
    for (let [i, level] of axis.upperLevels.entries()) {
      d3.select("#" + axis.type + "Labels" + (i + 1))
        .selectAll("button")
        .remove();
    }
  }

  let labels = axis["labels"];
  let type;
  if (labels.length === 0) {
    type = "Null";
  } else {
    type = typeByAtlas(_inferType(labels.map((xl) => xl.content)));
  }
  if (axis.fieldType) {
    type = axis.fieldType;
  }
  d3.select("#" + axis.type + "FieldType").property("value", type);

  labels = labels.sort((a, b) =>
    parseFloat(a.id.substring(4)) > parseFloat(b.id.substring(4)) ? 1 : -1
  );

  for (let label of labels) {
    displayAxisLabel(label, axis.type + "Labels");
  }

  [1, 2, 3].forEach((i) => {
    d3.select("#" + axis.type + "Labels" + i).remove();
  });
  d3.select("#" + axis.type + "Labels").style("width", "calc(100% - 405px)");

  if (axis.upperLevels) {
    let size = [
      "calc(",
      (100 / (axis["upperLevels"].length + 1)).toFixed(1),
      "% - ",
      405 / (axis["upperLevels"].length + 1),
      "px)",
    ].join("");
    for (let [i, level] of axis.upperLevels.entries()) {
      d3.select("#" + axis.type + "AxisDiv")
        .append("div")
        .attr("class", "axisLabels")
        .attr("id", axis.type + "Labels" + (i + 1))
        .on("drop", drop)
        .on("dragover", allowDrop);
      d3.select("#" + axis.type + "AxisDiv")
        .selectAll(".axisLabels")
        .style("width", size);
      for (let label of level) {
        displayAxisLabel(label, axis.type + "Labels" + (i + 1));
      }
    }
  }
}

function displayAxisLabel(label, divID) {
  d3.select("#" + divID)
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

function displayTitleXLabel(thisText, mode) {
  if (mode === "delete") {
    d3.select("#xTitle")
      .select("#" + "xTitleIDinSVG" + thisText["id"])
      .remove();
    return;
  } else {
    if (titleXaxis.includes(thisText)) return;
    else titleXaxis.push(thisText);
  }

  let text = thisText["content"];
  let btn = d3
    .select("#xTitle")
    .append("button")
    .datum(thisText)
    .attr("type", "button")
    .attr("class", "xTitleButton")
    .attr("style", "position: absolute; top: 1px; left: 200px")
    .attr("style", "width: 100%")
    .attr("id", "xTitleIDinSVG" + thisText["id"]) // this ID is important!!
    .attr("draggable", true)
    .text(text)
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

function displayTitleYLabel(thisText, mode) {
  if (mode === "delete") {
    d3.select("#yTitle")
      .select("#" + "yTitleIDinSVG" + thisText["id"])
      .remove();
    return;
  } else {
    if (titleYaxis.includes(thisText)) return;
    else titleYaxis.push(thisText);
  }

  let text = thisText["content"];
  let btn = d3
    .select("#yTitle")
    .append("button")
    .datum(thisText)
    .attr("type", "button")
    .attr("class", "yTitleButton")
    .attr("style", "position: absolute; top: 1px; left: 200px")
    .attr("id", "yTitleIDinSVG" + thisText["id"])
    .attr("draggable", true)
    .text(text)
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
    .attr("class", "titleLegendButton")
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
    d3.select("#chartTitle")
      .select("#" + "chartTitleIDinSVG" + thisText["id"])
      .remove();
    return;
  } else {
    if (chartTitle.includes(thisText)) return;
    else chartTitle.push(thisText);
  }

  let text = thisText["content"];

  let btn = d3
    .select("#chartTitle")
    .append("button")
    .datum(thisText)
    .attr("type", "button")
    .attr("class", "chartTitleButton")
    .attr("id", "chartTitleIDinSVG" + thisText["id"])
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

function disPlayTitles(chartTitle, legendTitle, xTitle, yTitle) {
  let allTitles = [chartTitle, legendTitle, xTitle, yTitle];
  ["chartTitle", "legendTitle", "xTitle", "yTitle"].forEach((id) => {
    d3.select("#" + id)
      .selectAll("button")
      .remove();
    for (let title of allTitles[
      ["chartTitle", "legendTitle", "xTitle", "yTitle"].indexOf(id)
    ]) {
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
      let tickPos = legend.ticks.map((tick) =>
        document.getElementById(tick.id).getBoundingClientRect()
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
  let allBBoxes = groupSVGElementsByTypeWithCoordinates();
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
