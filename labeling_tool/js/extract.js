var rects4Grouping;
var numOfColor;

function extract() {
  let rects = VA.groupedGraphicsElement["rects"]
    ? VA.groupedGraphicsElement["rects"]
    : [];
  rects = rects.filter(filterRect);

  let texts;
  try {
    texts = textProcessor([...VA.groupedGraphicsElement["texts"]]);
  } catch (e) {
    VA.legend = { labels: [], marks: [], mapping: {} };
    VA.xAxis = {
      labels: [],
      ticks: [],
      path: [],
      attrType: undefined,
      channel: "x",
    };
    VA.yAxis = {
      labels: [],
      ticks: [],
      path: [],
      attrType: undefined,
      channel: "y",
    };
    return;
  }

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

  VA.legend = findLegend(texts, VA.groupedGraphicsElement["rects"], numOfColor);
  if (VA.legend.labels?.length === 0)
    VA.legend = findLegend(texts, VA.groupedGraphicsElement["circles"], numOfColor);
  console.log("legend", VA.legend);
  displayLegend(VA.legend);
  texts = texts.filter((text) => !VA.legend.labels.includes(text));

  // X axis
  VA.xAxis = findxAxis(texts);
  console.log("x axis", VA.xAxis);
  VA.axes[0] = VA.xAxis;
  // see if an axis div is there
  if (d3.select("#axis_0").empty()) addAxisConfiguration();
  displayAxis(0);
  texts = texts.filter((text) => !VA.xAxis.labels.includes(text));

  // Y axis
  VA.yAxis = findyAxis(texts);
  console.log("y axis", VA.yAxis);
  if (d3.select("#axis_1").empty()) addAxisConfiguration();
  VA.axes[1] = VA.yAxis;
  displayAxis(1);

  [...VA.legend.labels, ...VA.legend.marks, ...VA.xAxis.labels, ...VA.yAxis.labels].forEach(
    (object) => {
      VA.allElements[object.id].isReferenceElement = true;
    }
  );

  console.log("allGraphicsElement", VA.allElements);
}

function findLegendInArea(tl, br, texts) {
  // Below only works for discrete legends
  let legendLabels = [],
    legendMarks = [];
  if (!texts || texts.length === 0) return;
  for (let text of texts) {
    if (
      !(
        text.left > br.x ||
        text.right < tl.x ||
        text.top > br.y ||
        text.bottom < tl.y
      )
    ) {
      legendLabels.push(text);
    }
  }
  if (legendLabels.length === 0) return;

  ["rects", "circles", "paths"].forEach((tag) => {
    let marksInArea = VA.groupedGraphicsElement[tag]
      ? VA.groupedGraphicsElement[tag].filter((mark) => {
          if (
            !(
              mark.left > br.x ||
              mark.right < tl.x ||
              mark.top > br.y ||
              mark.bottom < tl.y
            ) &&
            mark.fill !== undefined &&
            mark.fill !== null &&
            mark.fill !== "" &&
            mark.fill !== "none" &&
            mark.fill !== "transparent" &&
            mark.fill !== "rgb(255, 255, 255)" &&
            mark.fill !== "#ffffff" &&
            mark.fill !== "#FFFFFF" &&
            mark.fill !== "white"
          ) {
            return true;
          }
        })
      : [];
    if (marksInArea.length === legendLabels.length) {
      legendMarks = marksInArea;
    }
  });

  legendLabels.sort((a, b) => a.y - b.y).sort((a, b) => a.x - b.x);
  legendMarks.sort((a, b) => a.y - b.y).sort((a, b) => a.x - b.x);
  let result = {
    labels: legendLabels,
    marks: legendMarks,
    type: "discrete",
    orientation: "horz",
    mapping: {},
  };

  console.log(legendMarks, legendLabels);

  if (legendMarks.length > 0) {
    // TBD: consider display info for legend marks and labels in the UI
    console.log(legendMarks, legendLabels);
    for (let i = 0; i < legendLabels.length; i++) {
      result.mapping[legendLabels[i].content] = legendMarks[i].fill;
    }
  }

  result.orientation =
    legendMarks.map((m) => m.left).filter(onlyUnique).length >
    legendMarks.map((m) => m.top).filter(onlyUnique).length
      ? "horz"
      : "vert";

  VA.legend = result;

  for (let l of legendLabels) {
    VA.allElements[l.id].isReferenceElement = true;
    if (VA.xAxis.labels.indexOf(l) >= 0)
      VA.xAxis.labels.splice(VA.xAxis.labels.indexOf(l), 1);
    if (VA.yAxis.labels.indexOf(l) >= 0)
      VA.yAxis.labels.splice(VA.yAxis.labels.indexOf(l), 1);
  }

  for (let r of legendMarks) {
    VA.allElements[r.id].isReferenceElement = true;
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
      if (document.getElementById(rect["id"]).attributes["fill"]?.value) {
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

      alllegendElements = alllegendElements.filter(onlyUnique).filter((d) => d);

      if (alllegendElements.length > 0) {
        console.log(alllegendElements);
        result["type"] = "discrete";
        result["mapping"] = {};
        result["labels"] = alllegendElements.filter(
          (d) => d.tagName === "text"
        );
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

function findAxisInArea(o, tl, br, texts) {
  let labels = [];
  if (!texts || texts.length === 0) return;
  for (let text of texts) {
    let left = text.left;
    if (
      !(
        text.left > br.x ||
        text.right < tl.x ||
        text.top > br.y ||
        text.bottom < tl.y
      )
    ) {
      labels.push(text);
    }
  }
  if (labels.length == 0) return;
  // filter labels by their IDs, onlyUnique doesn't work here
  labels = labels
    .map((l) => l.id)
    .filter(onlyUnique)
    .map((id) => VA.allElements[id]);

  let axis = VA.axes[o];
  axis["channel"] = axis["channel"] ? axis["channel"] : o;
  axis["labels"] = labels;
  axis["ticks"] = [];
  axis["path"] = [];
  axis["title"] = [];
  axis["attrType"] = typeByAtlas(_inferType(labels.map((xl) => xl.content)));

  //remove from main content and the other axis/legend
  for (let l of labels) {
    VA.allElements[l.id].isReferenceElement = true;
  }
  Object.keys(VA.axes).forEach((key) => {
    if (key != o) {
      VA.axes[key].labels = VA.axes[key].labels.filter((l) => !labels.includes(l));
    }
  });

  // we leave the ticks and path to the mark annotation stage
}

function findxAxis(texts) {
  // find the set of texts whose y coordinates are very close and they form the largest set among all possible sets
  let allY = texts.map((text) => text["top"]).filter(onlyUnique);
  let xAxis = {
    labels: [],
    channel: "x",
    ticks: [],
    path: [],
    title: [],
    attrType: undefined,
  };
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
  let yAxis = {
    labels: [],
    channel: "y",
    ticks: [],
    path: [],
    title: [],
    attrType: undefined,
  };
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
