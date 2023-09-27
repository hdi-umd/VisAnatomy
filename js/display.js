function displaySVG(text, chartName) {
  // text = IDadder(text);
  // let svgInfo = text.substring(0, text.indexOf('>')+1);
  // if (svgInfo.indexOf('width') == -1) {
  //     text = text.substring(0, text.indexOf('>')) + " width=\"50%\"" + text.substring(text.indexOf('>'))
  // }
  // if (svgInfo.indexOf('height') == -1) {
  //     text = text.substring(0, text.indexOf('>')) + " height=\"100%\"" + text.substring(text.indexOf('>'))
  // }
  // if (svgInfo.indexOf('viewBox') > -1) {
  //     text = text.substring(0, text.indexOf('viewBox')) + "viewBox_old" + text.substring(text.indexOf('viewBox')+7)
  // }
  // if (svgInfo.indexOf('preserveAspectRatio') > -1) {
  //     text = text.substring(0, text.indexOf('preserveAspectRatio')) + "preserveAspectRatio_old" + text.substring(text.indexOf('preserveAspectRatio')+19)
  // }
  // text = text.substring(0, text.indexOf('>')) + " viewBox=\"-50 -50 1000 750\" preserveAspectRatio=\"xMinYMid\"" + text.substring(text.indexOf('>'))
  // if (text.indexOf("<a") > 0) {
  //     text = text.substring(0, text.indexOf('<a')) + text.substring(text.indexOf('</a>')+4)
  // }

  document.getElementById("rbox1").innerHTML = text;
  let vis = d3.select("#rbox1").select("svg").attr("id", "vis");

  let indices = {};

  function addClassAndIdToLeaves(element) {
    // set ID
    if (element.nodeType === Node.ELEMENT_NODE && element.nodeName !== "svg") {
      if (!Object.keys(indices).includes(element.nodeName)) {
        indices[element.nodeName] = 0;
      }
      element.setAttribute(
        "id",
        element.nodeName + indices[element.nodeName]++
      );
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
          "text",
          "line",
          "polyline",
          "path",
          "image",
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
        element.addEventListener("contextmenu", (event) => {
          event.preventDefault();
          console.log('Right-clicked on leaf node with class "mark"');
          // Your code to handle the right-click event goes here
        });
      }
    }
  }

  const svgElement = document.querySelector("#vis");
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
  if (axis.upperLevels) {
    for (let [i, level] of axis.upperLevels.entries()) {
      for (let label of level) {
        displayAxisLabel(label, axis.type + "Labels" + (i + 1));
      }
    }
  }

  // updating annotations object
  if (axis.type == "x") {
    annotations["xAxis"] = axis;
  } else if (axis.type == "y") {
    annotations["yAxis"] = axis;
  }

  console.log("annotations", annotations);
}

function displayAxisLabel(label, divID) {
  let btn = d3
    .select("#" + divID)
    .append("button")
    .datum(label)
    .attr("type", "button")
    .attr("class", "labelButton")
    .attr("id", "IDinSVG" + label["id"])
    .attr("draggable", true)
    .text(label["content"])
    .on("dragstart", drag);
  //   if (label["id"] in btnCheck) {
  //     let message = btnCheck[label["id"]];
  //     btn
  //       .attr("style", "background-color: #FC6F51")
  //       .on("mouseover", function (event) {
  //         d3.select("body")
  //           .append("div")
  //           .attr("class", "tooltip")
  //           .style("opacity", 0.75)
  //           .html(message.substring(0, message.length - 1) + ".")
  //           .style("left", event.pageX + "px")
  //           .style("top", event.pageY - 28 + "px");
  //       })
  //       .on("mouseout", function () {
  //         d3.select(".tooltip").remove();
  //       });
  //   }
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
    let btn = d3
      .select("#legendLabels")
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
    if (label["id"] in btnCheck) {
      let message = btnCheck[label["id"]];
      btn
        .attr("style", "background-color: #FC6F51")
        .on("mouseover", function (event) {
          d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0.75)
            .html(message.substring(0, message.length - 1) + ".")
            .style("left", event.pageX + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", function () {
          d3.select(".tooltip").remove();
        });
    }
  }
}

function displayTitleXLabel(thisText, mode) {
  if (mode === "delete") {
    d3.select("#xTitle")
      .select("#" + "xTItleIDinSVG" + thisText["id"])
      .remove();
    return;
  } else {
    if (titleXaxis.includes(thisText)) return;
    else titleXaxis.push(thisText);
  }

  console.log(titleXaxis);
  let text = thisText["content"];
  let btn = d3
    .select("#xTitle")
    .append("button")
    .datum(thisText)
    .attr("type", "button")
    .attr("class", "titleXbutton")
    .attr("style", "position: absolute; top: 1px; left: 200px")
    .attr("style", "width: 100%")
    .attr("id", "xTItleIDinSVG" + thisText["id"]) // this ID is important!!
    .attr("draggable", true)
    .text(text)
    .on("dragstart", drag);
  btn
    .attr("style", "background-color: #f2f2f2")
    .on("mouseover", function (event) {
      d3.select(this) // Select the hovered button
        .attr("style", "color: #fff");

      d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0.75)
        .style("width", "100%")
        .style("background-color: black");
    })
    .on("mouseout", function () {
      d3.select(this) // Select the hovered button
        .attr("style", "background-color: #f2f2f2; width: 100%")
        .attr("style", "color: black");

      d3.select(".tooltip").remove();
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

  console.log(titleYaxis);
  let text = thisText["content"];
  let btn = d3
    .select("#yTitle")
    .append("button")
    .datum(thisText)
    .attr("type", "button")
    .attr("class", "titleYbutton")
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

      d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0.75)
        .style("width", "100%")
        .style("background-color: black");
    })
    .on("mouseout", function () {
      d3.select(this) // Select the hovered button
        .attr("style", "background-color: #f2f2f2; width: 100%")
        .attr("style", "color: black");
      d3.select(".tooltip").remove();
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

  console.log(titleLegend);
  let text = thisText["content"];
  console.log(text);
  console.log("Display legend");

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

      d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0.75)
        .style("width", "100%")
        .style("background-color: black");
    })
    .on("mouseout", function () {
      d3.select(this) // Select the hovered button
        .attr("style", "background-color: #f2f2f2; width: 100%")
        .attr("style", "color: black");
      d3.select(".tooltip").remove();
    });
}

/**
 * Unhandled:
 * horizontalbar_highchart (rect3, rect4), stacked_highchart (rect8, rect13), highcharts_grouped_3
 */
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
