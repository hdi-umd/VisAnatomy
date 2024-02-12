var rects4Grouping;
var numOfColor;

function extract() {
  let rects = groupedGraphicsElement["rects"]
    ? groupedGraphicsElement["rects"]
    : [];
  let originalRects = [...rects];
  rects = rects.filter(filterRect);

  let texts = textProcessor([...groupedGraphicsElement["texts"]]);

  let thisColors;
  thisColors = rects
    .map((rect) => rect.fill)
    .filter(
      (f) =>
        f !== undefined &&
        f !== null &&
        f !== "" &&
        f !== "none" &&
        f !== "transparent"
    )
    .filter(onlyUnique);
  numOfColor = thisColors.length;

  legend = findLegend(texts, groupedGraphicsElement["rects"], numOfColor);
  console.log("legend", legend);
  displayLegend(legend);
  texts = texts.filter((text) => !legend.labels.includes(text));

  // X axis
  xAxis = findxAxis(texts);
  console.log("x axis", xAxis);
  displayAxis(xAxis);
  texts = texts.filter((text) => !xAxis.labels.includes(text));

  // Y axis
  yAxis = findyAxis(texts);
  console.log("y axis", yAxis);
  displayAxis(yAxis);

  return { rects: rects, texts: texts };
}

function findLegendInArea(tl, br, texts, rects) {
  // TBD: need to update this
  let labels = [],
    marks = [];
  for (let text of texts) {
    let left = "left" in text ? text.left : text.x;
    if (
      left >= tl.x &&
      left + text.width <= br.x &&
      text.y >= tl.y &&
      text.y + text.height <= br.y
    ) {
      labels.push(text);
    }
  }

  if (labels.length == 0) return;

  for (let r of rects) {
    if (
      r.x >= tl.x &&
      r.x + r.width <= br.x &&
      r.y >= tl.y &&
      r.y + r.height <= br.y
    ) {
      marks.push(r);
    }
  }
  let result = { labels: labels, marks: marks };

  //todo: find ticks
  if (marks.length == 1) result["type"] = "continuous";
  else result["type"] = "discrete";

  //todo: determine orientation and mapping
  let left = d3.min(labels.map((d) => ("left" in d ? d.left : d.x))),
    right = d3.max(
      labels.map((d) => ("left" in d ? d.left + d.width : d.x + d.width))
    ),
    top = d3.min(labels.map((d) => d.y)),
    btm = d3.max(labels.map((d) => d.y + d.height));
  let xDiffs = labels.map((d) =>
      "left" in d ? Math.abs(d.left - left) : Math.abs(d.x - left)
    ),
    yDiffs = labels.map((d) => Math.abs(d.y - btm));
  if (d3.sum(xDiffs) < d3.sum(yDiffs)) {
    result["orientation"] = "vert";
    if ((result["type"] = "discrete")) {
      labels.sort((a, b) => a.y - b.y);
      marks.sort((a, b) => a.y - b.y);
      result.mapping = {};
      for (let i = 0; i < labels.length; i++) {
        result.mapping[labels[i].content] = marks[i] ? marks[i].fill : "white";
      }
    }
  } else {
    result["orientation"] = "horz";
    if ((result["type"] = "discrete")) {
      labels.sort((a, b) => a.x - b.x);
      marks.sort((a, b) => a.x - b.x);
      result.mapping = {};
      for (let i = 0; i < labels.length; i++) {
        result.mapping[labels[i].content] = marks[i] ? marks[i].fill : "white";
      }
    }
  }
  result["x"] = d3.min(result["marks"].map((d) => d.x));
  result["y"] = d3.min(result["marks"].map((d) => d.y));

  legend = result;
  console.log(legend);

  for (let l of labels) {
    if (contentMarks.texts.indexOf(l) >= 0)
      contentMarks.texts.splice(contentMarks.texts.indexOf(l), 1);
    if (xAxis.labels.indexOf(l) >= 0)
      xAxis.labels.splice(xAxis.labels.indexOf(l), 1);
    if (yAxis.labels.indexOf(l) >= 0)
      yAxis.labels.splice(yAxis.labels.indexOf(l), 1);
  }

  for (let r of marks) {
    if (contentMarks.rects.indexOf(r) >= 0)
      contentMarks.rects.splice(contentMarks.rects.indexOf(r), 1);
  }
}

function findLegend(texts, rects, numOfColor) {
  if (!texts || !rects) return { labels: [], marks: [] };
  if (texts.length === 0 || rects.length === 0)
    return { labels: [], marks: [] };
  let LegendExist = false,
    legendArea = { elements: [], type: null },
    colorMapping = {};
  let result = { labels: [], marks: [] };
  let allY, uniqueY, allX, uniqueX;
  if (numOfColor > 20) {
    let legendBar = rects.filter(function (rect) {
      if (document.getElementById(rect["id"]).attributes["fill"].value) {
        if (
          document
            .getElementById(rect["id"])
            .attributes["fill"].value.indexOf("url") !== -1
        )
          return rect;
      }
    })[0]; // assuming there is only one bar
    if (legendBar) {
      LegendExist = true;
      let legendLabel = [],
        legendTick = [];
      if (legendBar["width"] > legendBar["height"]) {
        allY = texts.map((text) => text["y"]);
        uniqueY = texts
          .map((text) => text["y"])
          .filter(onlyUnique)
          .filter(function (y) {
            if (
              Math.abs(y - legendBar["y"]) < 30 ||
              Math.abs(y - legendBar["y"] - legendBar["height"]) < 30
            )
              return y;
          });
        for (let y of uniqueY) {
          texts4legend = texts.filter(function (text) {
            if (text["y"] == y) return text;
          });
          if (texts4legend.length <= 1) {
            continue;
          }
          if (
            (Math.abs(y - legendBar["y"]) < 30 ||
              Math.abs(y - legendBar["y"] - legendBar["height"]) < 30) &&
            Math.max(...texts4legend.map((text) => text["x"])) -
              Math.min(...texts4legend.map((text) => text["x"])) <
              legendBar["width"] + 20
          ) {
            legendLabel = texts4legend;
            legendTick = [];
            break;
          }
        }
      } else {
        allX = texts.map((text) => text["x"]);
        uniqueX = texts
          .map((text) => text["x"])
          .filter(onlyUnique)
          .filter(function (x) {
            if (
              Math.abs(x - legendBar["x"]) < 30 ||
              Math.abs(x - legendBar["x"] - legendBar["width"]) < 30
            )
              return x;
          });
        for (let x of uniqueX) {
          texts4legend = texts.filter(function (text) {
            if (text["x"] == x) return text;
          });
          if (texts4legend.length <= 1) {
            continue;
          }
          if (
            (Math.abs(x - legendBar["x"]) < 30 ||
              Math.abs(x - legendBar["x"] - legendBar["width"]) < 30) &&
            Math.max(...texts4legend.map((text) => text["y"])) -
              Math.min(...texts4legend.map((text) => text["y"])) <
              legendBar["height"] + 20
          ) {
            legendLabel = texts4legend;
            legendTick = [];
            break;
          }
        }
      }

      for (let label of legendLabel) {
        texts.splice(texts.indexOf(label), 1);
      }

      result["type"] = "continuous";
      result["ticks"] = legendTick;
      result["labels"] = legendLabel;
      result["marks"] = [legendBar];
      result["orientation"] =
        result["marks"][0].width > result["marks"][0].height ? "horz" : "vert";
      return result;
    }
  }
  if (LegendExist == false) {
    // there is not a continous legend
    candidateRects = [];
    // assuming the legend rects are square or circles
    for (let rect of rects) {
      if (Math.abs(rect["width"] - rect["height"]) < 0.1) {
        candidateRects.push(rect);
      }
    }
    let alllegendElements = [],
      isLegend;
    if (candidateRects != []) {
      // find any horizontal legend
      allY = candidateRects.map((c) => c["top"]);
      uniqueY = allY.filter(onlyUnique);
      for (let y of uniqueY) {
        if (countInArray(allY, y) >= 2) {
          // sort the texts
          rectOfy = rects
            .filter(function (rect) {
              if (Math.abs(rect["top"] - y) < 1) return rect;
            })
            .sort((a, b) => (a["left"] > b["left"] ? 1 : -1));
          if (
            rectOfy.map((r) => r.fill).filter(onlyUnique).length ==
            rectOfy.length
          ) {
            isLegend = true;
          } else {
            continue;
          }
          let legendElements = [];
          for (let i = 0; i < rectOfy.length - 1; i++) {
            legendElements.push(rectOfy[i]);
            finding = findBetween(rectOfy[i], rectOfy[i + 1], texts);
            if (finding) {
              legendElements.push(finding);
              continue;
            } else {
              isLegend = false;
              break;
            }
          }
          if (isLegend == true) {
            legendElements.push(rectOfy[rectOfy.length - 1]);
            lastText = texts.filter(
              (text) =>
                Math.abs(text["top"] - legendElements[1]["top"]) < 10 &&
                (text["left"] >
                  legendElements[legendElements.length - 1]["left"] ||
                  text["left"] < legendElements[0]["left"])
            );
            legendElements.push(lastText[0]);
            alllegendElements = alllegendElements.concat(legendElements);
          }
        }
      }

      if (alllegendElements.length > 0) {
        result["type"] = "discrete";
        result["mapping"] = {};
        result["labels"] = alllegendElements.filter((d) => d.tagName == "text");
        result["marks"] = alllegendElements.filter((d) => d.tagName != "text");
        result["orientation"] = "horz";
        for (let i = 0; i < alllegendElements.length - 1; i += 2) {
          result["mapping"][alllegendElements[i + 1]["content"]] =
            alllegendElements[i]["fill"];
        }
        return result;
        // calculating bounding box
      } else {
        LegendExist == false;
        // find any vertical legend
        allX = texts.map((text) => text["left"]);
        uniqueX = texts.map((text) => text["left"]).filter(onlyUnique);
        // finding the legend area
        for (let x of uniqueX) {
          legendElements = [];
          if (countInArray(allX, x) >= 2) {
            // sort the texts
            textOfx = texts
              .filter(function (text) {
                if (Math.abs(text["left"] - x) < 1) return text;
              })
              .sort((a, b) => (a["top"] > b["top"] ? 1 : -1));
            isLegend = true;
            firstFinding = candidateRects.filter(function (rect) {
              if (
                ((rect["left"] - textOfx[0]["right"] > 0 &&
                  rect["left"] - textOfx[0]["right"] < 30) ||
                  (textOfx[0]["left"] - rect["right"] > 0 &&
                    textOfx[0]["left"] - rect["right"] < 30)) &&
                Math.abs(rect["top"] - textOfx[0]["top"]) < 30
              ) {
                return rect;
              }
            });
            if (firstFinding == []) {
              continue;
            }
            legendElements = legendElements.concat(textOfx);
            if (firstFinding.length >= 1) {
              firstFinding = firstFinding[0];
            }
            findings = candidateRects.filter(
              (rect) =>
                Math.abs(
                  parseFloat(rect["left"]) - parseFloat(firstFinding["left"])
                ) < 1
            );
            if (
              findings.length !== textOfx.length ||
              findings.map((r) => r["fill"]).filter(onlyUnique).length !==
                findings.length
            ) {
              // tbd: check the relation positioning of the rects
              isLegend = false;
            } else {
              legendElements = legendElements.concat(findings);
            }
            if (isLegend == true) {
              result["type"] = "discrete";
              result["mapping"] = {};
              result["orientation"] = "vert";
              result["labels"] = legendElements.filter(
                (d) => d.tagName == "text"
              );
              result["marks"] = legendElements.filter(
                (d) => d.tagName != "text"
              );
              for (let i = 0; i < legendElements.length / 2; i += 1) {
                result["mapping"][legendElements[i]["content"]] =
                  legendElements[i + legendElements.length / 2]["fill"];
              }
              return result;
            }
          }
        }
      }
    }
  }
  return { labels: [], marks: [] };
}

function findAxisInArea(o, tl, br, texts, rects, lines) {
  let labels = [];
  for (let text of texts) {
    let left = "left" in text ? text.left : text.x;
    if (
      left >= tl.x &&
      left + text.width <= br.x &&
      text.y >= tl.y &&
      text.y + text.height <= br.y
    ) {
      labels.push(text);
    }
  }
  if (labels.length == 0) return;

  let axis = o == "x" ? xAxis : yAxis;
  axis["type"] = o;
  axis["labels"] = labels;
  axis["ticks"] = [];
  axis["path"] = [];

  //remove from main content and the other axis/legend
  let otherAxis = o == "y" ? xAxis : yAxis;
  for (let l of labels) {
    if (contentMarks.texts.indexOf(l) >= 0)
      contentMarks.texts.splice(contentMarks.texts.indexOf(l), 1);
    if (otherAxis.labels.indexOf(l) >= 0)
      otherAxis.labels.splice(otherAxis.labels.indexOf(l), 1);
    if (legend.labels.indexOf(l) >= 0)
      legend.labels.splice(legend.labels.indexOf(l), 1);
  }

  //todo: find axis path and ticks
  let candidateLines = [],
    ticks = [],
    path;
  for (let l of lines) {
    if (l.x1 >= tl.x && l.x2 <= br.x) {
      candidateLines.push(l);
    }
  }
  if (o == "x") {
    for (let l of candidateLines) {
      if (l.x1 == l.x2) {
        ticks.push(l);
        lines.splice(lines.indexOf(l), 1);
      }
      if (l.y1 == l.y2) {
        path = l;
        lines.splice(lines.indexOf(l), 1);
      }
    }
  } else if (o == "y") {
    for (let l of candidateLines) {
      if (l.y1 == l.y2) {
        ticks.push(l);
        lines.splice(lines.indexOf(l), 1);
      }
      if (l.x1 == l.x2) {
        path = l;
        lines.splice(lines.indexOf(l), 1);
      }
    }
  }
  axis.ticks = ticks;
  axis.path = path;
}

function findxAxis(texts) {
  // find the set of texts whose y coordinates are very close and they form the largest set among all possible sets
  let allY = texts.map((text) => text["top"]).filter(onlyUnique);
  let xAxis = { labels: [], type: "x", ticks: [], path: [] };
  for (let y of allY) {
    let thisLabels = texts.filter((text) => Math.abs(text["top"] - y) <= 1);
    let leftout = texts.filter(
      (text) =>
        thisLabels.includes(text) == false &&
        range(thisLabels.map((l) => l["height"]).concat(text["height"])) <= 1 &&
        range(thisLabels.map((l) => l["bottom"]).concat(text["bottom"])) <= 1 &&
        range(thisLabels.map((l) => l["top"]).concat(text["top"])) <= 1
    );
    thisLabels = thisLabels.concat(leftout);
    if (thisLabels.length > 1 && thisLabels.length > xAxis.labels.length) {
      xAxis.labels = thisLabels;
    }
  }
  return xAxis;
}

function findyAxis(texts) {
  // find the set of texts whose y coordinates are very close and they form the largest set among all possible sets
  let allX = texts.map((text) => text["left"]).filter(onlyUnique);
  let yAxis = { labels: [], type: "y", ticks: [], path: [] };
  for (let x of allX) {
    let thisLabels = texts.filter((text) => Math.abs(text["left"] - x) <= 1);
    let leftout = texts.filter(
      (text) =>
        thisLabels.includes(text) == false &&
        range(thisLabels.map((l) => l["height"]).concat(text["height"])) <= 1 &&
        (range(thisLabels.map((l) => l["left"]).concat(text["left"])) <= 1 ||
          range(thisLabels.map((l) => l["right"]).concat(text["right"])) <= 1)
    );
    thisLabels = thisLabels.concat(leftout);
    if (thisLabels.length > 1 && thisLabels.length > yAxis.labels.length) {
      yAxis.labels = thisLabels;
    }
  }
  return yAxis;
}

function filterRect(rect) {
  // consider stroke attrs
  // are stoke and fill-in independent?
  if (!rect["opacity"] || rect["opacity"] !== "0") {
    if (rect["stroke"]) {
      if (
        rect["stroke"] !== "#ffffff" &&
        rect["stroke"] !== "#FFFFFF" &&
        rect["stroke"] !== "white" &&
        rect["stroke"] !== "none" &&
        rect["stroke"] !== "transparent" &&
        rect["stroke"] !== "rgb(255, 255, 255)"
      ) {
        if (
          (rect["stroke-width"]
            ? !["0", "0px", "0%"].includes(removeSpace(rect["stroke-width"]))
            : true) &&
          (rect["stroke-opacity"]
            ? parseFloat(rect["stroke-opacity"]) > 0.05
            : true)
        ) {
          return rect;
        }
      }
    }
    if (!rect["fill-opacity"] || parseFloat(rect["fill-opacity"]) > 0.05) {
      if (rect["tag"] == "circle" || !rect["fill"]) return rect;
      if (
        (rect["width"] < 2000 || rect["height"] < 2000) &&
        rect["fill"] !== "#ffffff" &&
        rect["fill"] !== "#FFFFFF" &&
        rect["fill"] !== "white" &&
        rect["fill"] !== "none" &&
        rect["fill"] !== "transparent"
      ) {
        return rect;
        // to-dos: to avoid deleting white rects in heatmaps or matrix charts
      }
    }
  }
}
