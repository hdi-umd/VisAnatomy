function initilizeVariables() {
  annotations = {};
  xAxis = {};
  yAxis = {};
  legend = {};
  xGridlines = [];
  yGridlines = [];
  markInfo = {};
  chartTitle = [];
  titleLegend = [];
  titleXaxis = [];
  titleYaxis = [];
  annotationLoaded = false;
  nestedGrouping = [];
  groupAnnotations = [];
  marksHaveGroupAnnotation = [];
  groupLayouts = {};
  objectEncodings = {};
}

function tryLoadAnnotations(filename) {
  // filename = sessionStorage.getItem("fileName");
  console.log("loading from: " + filename);

  fetch("/annotations/" + filename + ".json")
    .then((response) => {
      if (!response.ok) {
        console.log("no annotation file found");

        // throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then((json) => {
      this.users = json;
      // loading the annotation data into the global variable
      annotations = json.annotations;
      annotationLoaded = true;

      // testing annotation was loaded
      console.log("loaded annotations", annotations);

      // alertBox.textContent =
      //   "Annotations loaded from: 'annotations / " + filename + ".json'!";
      // alertBox.style.visibility = "visible";
      // alertBox.style.opacity = "1";
      // update the values and the display boxes
      xAxis = annotations.referenceElement.xAxis;
      yAxis = annotations.referenceElement.yAxis;
      legend = annotations.referenceElement.legend;
      xGridlines = annotations.referenceElement.xGridlines;
      yGridlines = annotations.referenceElement.yGridlines;
      markInfo = annotations.markInfo ? annotations.markInfo : {};
      groupAnnotations = annotations.groupInfo ? annotations.groupInfo : [];
      nestedGrouping = annotations.nestedGrouping
        ? annotations.nestedGrouping
        : [];
      groupLayouts = annotations.layoutInfo ? annotations.layoutInfo : {};
      objectEncodings = annotations.encodingInfo
        ? annotations.encodingInfo
        : {};
      chartTitle = annotations.chartTitle ? annotations.chartTitle : [];
      contentMarks = annotations.contentMarks ? annotations.contentMarks : [];
      titleLegend = annotations.referenceElement.legend.title
        ? annotations.referenceElement.legend.title
        : [];
      titleXaxis = annotations.referenceElement.xAxis.title
        ? annotations.referenceElement.xAxis.title
        : [];
      titleYaxis = annotations.referenceElement.yAxis.title
        ? annotations.referenceElement.yAxis.title
        : [];
      displayAxis(xAxis);
      displayAxis(yAxis);
      displayLegend(legend);
      disPlayTitles(chartTitle, titleLegend, titleXaxis, titleYaxis);
    })
    .catch(function () {
      this.dataError = true;
    });
}

function post() {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/");
  xhr.overrideMimeType("text/plain");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        const alertBox = document.getElementById("alertBox");
        alertBox.textContent = `Annotations saved to 'annotations / ${sessionStorage.getItem(
          "fileName"
        )}.json'!`;
        alertBox.style.visibility = "visible";
        alertBox.style.opacity = "1";

        // Hide the alert box after 3 seconds
        setTimeout(function () {
          alertBox.style.visibility = "hidden";
          alertBox.style.opacity = "0";
        }, 3000);
        console.log(xhr.responseText);
      } else {
        console.error("Error: " + xhr.status);
        alertBox.textContent =
          "Error: '" + xhr.status + "' occurred while saving the annotations";
        alertBox.style.visibility = "visible";
        alertBox.style.opacity = "1";
      }
    }
  };
  let data = {};

  annotations.chartTitle = chartTitle;
  annotations.contentMarks = contentMarks;
  annotations.markInfo = markInfo;
  annotations.groupInfo = groupAnnotations;
  annotations.nestedGrouping = nestedGrouping;
  annotations.layoutInfo = groupLayouts;
  annotations.encodingInfo = objectEncodings;
  annotations.referenceElement = {};

  annotations.referenceElement["xGridlines"] = Object.keys(markInfo).filter(
    (mark) => markInfo[mark].Role === "Horizontal Gridline"
  );
  annotations.referenceElement["yGridlines"] = Object.keys(markInfo).filter(
    (mark) => markInfo[mark].Role === "Vertical Gridline"
  );

  // complete x axis elements
  xAxis.path = Object.keys(markInfo).filter(
    (mark) => markInfo[mark].Role === "X Axis Line"
  );
  xAxis.ticks = Object.keys(markInfo).filter(
    (mark) => markInfo[mark].Role === "X Axis Tick"
  );
  xAxis.title = titleXaxis;
  annotations.referenceElement["xAxis"] = xAxis;

  // complete y axis elements
  yAxis.path = Object.keys(markInfo).filter(
    (mark) => markInfo[mark].Role === "Y Axis Line"
  );
  yAxis.ticks = Object.keys(markInfo).filter(
    (mark) => markInfo[mark].Role === "Y Axis Tick"
  );
  yAxis.title = titleYaxis;
  annotations.referenceElement["yAxis"] = yAxis;

  // complete legend elements
  legend.title = titleLegend;
  annotations.referenceElement["legend"] = legend;

  data["chart"] = sessionStorage.getItem("fileName");
  data["annotations"] = annotations;
  xhr.send(JSON.stringify(data));
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function clientPt2SVGPt(x, y) {
  const svgVis = document.getElementById("vis");
  const pt = svgVis.createSVGPoint();
  pt.x = x;
  pt.y = y;
  return pt.matrixTransform(svgVis.getScreenCTM().inverse());
}

function isOverlap(bbox1, bbox2) {
  // Check if one rectangle is on left side of other
  if (bbox1.x + bbox1.width < bbox2.x || bbox2.x + bbox2.width < bbox1.x) {
    return false;
  }

  // Check if one rectangle is above other
  if (bbox1.y + bbox1.height < bbox2.y || bbox2.y + bbox2.height < bbox1.y) {
    return false;
  }

  return true;
}

function removeSpace(str) {
  while (str[0] == " ") {
    str = str.substring(1);
  }
  while (str[str.length - 1] == " ") {
    str = str.substring(0, str.length - 1);
  }
  return str;
}

function extractNumber(str) {
  // Extract the number from the end of the string
  let matches = str.match(/(\d+)$/);
  return matches ? parseInt(matches[0], 10) : 0;
}

function extractNonNumeric(str) {
  // Extract the non-numeric part of the string
  let nonNumeric = str.replace(/(\d+)$/, "");
  return nonNumeric;
}

function sortByEndingNumber(strings) {
  return strings.sort((a, b) => {
    // Extract non-numeric parts
    let nonNumericA = extractNonNumeric(a);
    let nonNumericB = extractNonNumeric(b);

    // Compare non-numeric parts
    if (nonNumericA < nonNumericB) return -1;
    if (nonNumericA > nonNumericB) return 1;

    // If non-numeric parts are equal, extract and compare numbers
    let numA = extractNumber(a);
    let numB = extractNumber(b);
    return numA - numB;
  });
}

function ColorToHex(color) {
  var hexadecimal = color.toString(16);
  return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
}

function ConvertRGBtoHex(red, green, blue) {
  return "#" + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue);
}

function rgbaToHex(r, g, b, a) {
  var outParts = [
    r.toString(16),
    g.toString(16),
    b.toString(16),
    Math.round(a * 255)
      .toString(16)
      .substring(0, 2),
  ];

  // Pad single-digit output values
  outParts.forEach(function (part, i) {
    if (part.length === 1) {
      outParts[i] = "0" + part;
    }
  });

  return "#" + outParts.join("");
}

function mode(arr) {
  // find most frequent element
  return arr
    .sort(
      (a, b) =>
        arr.filter((v) => v === a).length - arr.filter((v) => v === b).length
    )
    .pop();
}

function countInArray(array, what) {
  var count = 0;
  for (var i = 0; i < array.length; i++) {
    if (array[i] === what) {
      count++;
    }
  }
  return count;
}

function arrayCompare(_arr1, _arr2) {
  if (
    !Array.isArray(_arr1) ||
    !Array.isArray(_arr2) ||
    _arr1.length !== _arr2.length
  ) {
    return false;
  }

  // .concat() to not mutate arguments
  const arr1 = _arr1.concat().sort();
  const arr2 = _arr2.concat().sort();

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

function findBetween(left, right, candidate) {
  if (!candidate || candidate.length == 0) return false;
  finding = candidate.filter(function (rect) {
    if (rect) {
      if (rect["x"] > left["x"] && rect["x"] < right["x"]) {
        if (Math.abs(rect["y"] - left["y"]) < 30) {
          return rect;
        }
      }
    }
  });
  if (finding == []) {
    return false;
  } else {
    finding = finding.sort((a, b) =>
      Math.abs(a["y"] - left["y"]) > Math.abs(b["y"] - left["y"]) ? 1 : -1
    );
    return finding[0];
  }
}

function range(array) {
  return Math.max(...array) - Math.min(...array);
}

function FindKeysWithTheMostValues(dic) {
  let maxcount = Math.max(...Object.keys(dic).map((k) => dic[k].length));
  KeysWithTheMostValues = [];
  for (let k of Object.keys(dic)) {
    if (dic[k].length == maxcount) {
      KeysWithTheMostValues.push(k);
    }
  }
  return KeysWithTheMostValues;
}

function findNearesrParent(index, nodes, children) {
  let parents = children.map((c) => c["parent"]).filter(onlyUnique);
  while (parents.length > 1) {
    parents = parents
      .map((pID) => index[pID])
      .map((nID) => nodes[nID].parent)
      .filter(onlyUnique);
  }
  return parents[0];
}

function findleaves(index, nodes, parent, targets) {
  // consider adding a parameter specifying the node we can ignore
  if (parent == "canvas" || parent == "svg0") return targets;
  let selected = [];
  let childrenOfthisParent = nodes[index[parent]].children;
  while (childrenOfthisParent.length > 0) {
    selected.push(childrenOfthisParent.filter((c) => targets.includes(c)));
    targets = targets.filter((t) => !selected.includes(t));
    let newArr = [];
    for (let c of childrenOfthisParent) {
      newArr.concat(nodes[index[c]] ? nodes[index[c]].children : []);
    }
    childrenOfthisParent = newArr;
  }
  return selected;
}

function removeElementsByClass(className) {
  const elements = document.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

function textProcessor(texts) {
  if (texts.length == 0) return [];
  texts = texts.filter((text) =>
    text["opacity"] ? (text["opacity"] == 0 ? false : true) : true
  );
  texts = texts.filter(function (text) {
    if (text["x"] > -50 && text["y"] > -50) return text;
  }); // for the smallpox example, there are weird texts whose y is -9999
  for (let text of texts) {
    textElement = document.getElementById(text["id"]);
    let bbox = textElement.getBBox();
    text["width"] = bbox.width;
    text["height"] = bbox.height;
    if (text["text-anchor"]) {
      switch (text["text-anchor"]) {
        case "middle":
          text["left"] = text["x"] - bbox.width / 2;
          text["right"] = text["x"] + bbox.width / 2;
          break;
        case "end":
          text["left"] = text["x"] - bbox.width;
          text["right"] = text["x"];
          break;
        case "start":
        default:
          text["left"] = text["x"];
          text["right"] = text["x"] + bbox.width;
          break;
      }
    } else {
      text["left"] = text["x"];
      text["right"] = text["x"] + bbox.width;
    }
    text["top"] = text["y"] - bbox.height;
    text["bottom"] = text["y"];
  }
  texts = texts.sort((a, b) => (a["content"] > b["content"] ? 1 : -1));
  let results = [];
  results.push(texts[0]);
  for (let i = 1; i < texts.length; i++) {
    if (
      results.filter(
        (r) =>
          r["content"] == texts[i]["content"] &&
          r["x"] == texts[i]["x"] &&
          r["y"] == texts[i]["y"] &&
          r["height"] == texts[i]["height"] &&
          r["width"] == texts[i]["width"]
      ).length > 0
    ) {
      continue;
    } else {
      results.push(texts[i]);
    }
  }
  return results;
}

function KeyPress(e) {
  var evtobj = window.event ? event : e;
  if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
    undo();
  }
}

const DataType = {
  Boolean: "boolean",
  Integer: "integer",
  Number: "number",
  Date: "date",
  String: "string",
};

var isValidType = {
  boolean: function (x) {
    return (
      x === "true" ||
      x === "false" ||
      x === true ||
      x === false ||
      toString.call(x) == "[object Boolean]"
    );
  },
  integer: function (x) {
    return isValidType.number(x) && (x = +x) === ~~x;
  },
  number: function (x) {
    return !isNaN(+x) && toString.call(x) != "[object Date]";
  },
  date: function (x) {
    return !isNaN(Date.parse(x));
  },
  string: function (x) {
    return true;
  },
};

function _inferType(values) {
  //check for %
  let vals = values.map((d) => d.replace("%", ""));
  var types = Object.values(DataType);
  for (let i = 0; i < vals.length; i++) {
    let v = vals[i];
    if (v == null) continue;
    for (let j = 0; j < types.length; j++) {
      if (!isValidType[types[j]](v)) {
        types.splice(j, 1);
        j -= 1;
      }
    }
    if (types.length == 1) return types[0];
  }
  return types[0];
}

function findSubArray(arr, subarr, from_index) {
  var i = from_index >>> 0,
    sl = subarr.length,
    l = arr.length + 1 - sl;

  loop: for (; i < l; i++) {
    for (var j = 0; j < sl; j++) if (arr[i + j] !== subarr[j]) continue loop;
    return i;
  }
  return -1;
}

function typeByAtlas(type) {
  switch (type) {
    case "date":
      return "date";
    case "string":
    case "boolean":
      return "string";
    case "integer":
    case "number":
      return "number";
  }

  // if (XLabelsExist) {
  //     const dt = aq.fromCSV('a,b\n1,2\n3,4')
  //     // const atx = dt.toArrow();
  //     console.log(dt)
  // }
  // if (YLabelsExist) {
  //     const dt = aq.table({
  //         y: YLabelSet.map(y => removeSpace(y.content))
  //     });
  //     const aty = dt.toArrow();
  //     console.log(aty.U.children['0'].type)
  // }
}

// below are merged from the Mystique repo on 03/01/2022

function calculateBBox(Group) {
  let Left = Math.min(...Group.map((r) => r.x));
  let Right = Math.max(...Group.map((r) => r.right));
  let Top = Math.min(...Group.map((r) => r.y));
  let Bottom = Math.max(...Group.map((r) => r.bottom));
  return {
    Left: Left,
    Right: Right,
    Top: Top,
    Bottom: Bottom,
    Height: Bottom - Top,
    Width: Right - Left,
  };
}

function checkOverlap(Coll, Group) {
  let RectA = calculateBBox(Group.rects);
  for (let g of Coll) {
    let RectB = calculateBBox(g.rects);
    if (
      RectA.Left < RectB.Right - 0.01 &&
      RectA.Right - 0.01 > RectB.Left &&
      RectA.Top < RectB.Bottom - 0.01 &&
      RectA.Bottom - 0.01 > RectB.Top
    )
      return true;
  }
  return false;
}

function removeTooCloseValues(incomingList) {
  let returnList = [];
  incomingList.forEach((v, i) => {
    if (i == 0 || Math.abs(v - incomingList[i - 1]) > whDiff)
      returnList.push(v);
  });
  return returnList;
}

function findTwoStartingRects() {
  let tempRects = rects;
  let leftMostRects = tempRects.sort((a, b) => (a.x > b.x ? 1 : -1));
  let topLeftRect = leftMostRects
    .filter((r) => Math.abs(r.x - leftMostRects[0].x) <= 1)
    .sort((a, b) => (a.y > b.y ? 1 : -1))[0];
  tempRects = tempRects.filter((r) => r != topLeftRect);
  let rightClosestRectCandidates = tempRects
    .filter(
      (r) =>
        Math.min(r.bottom, topLeftRect.bottom) - Math.max(r.y, topLeftRect.y) >=
        -1
    )
    .sort((a, b) =>
      Math.abs(a.x - topLeftRect.right) > Math.abs(b.x - topLeftRect.right)
        ? 1
        : -1
    );
  let rightClosestRect = rightClosestRectCandidates
    .filter(
      (r) =>
        Math.abs(
          Math.abs(r.x - topLeftRect.right) -
            Math.abs(rightClosestRectCandidates[0].x - topLeftRect.right)
        ) < 0.1
    )
    .sort((a, b) =>
      Math.min(a.bottom, topLeftRect.bottom) - Math.max(a.y, topLeftRect.y) >
      Math.min(b.bottom, topLeftRect.bottom) - Math.max(b.y, topLeftRect.y)
        ? -1
        : 1
    )[0];
  let bottomClosestRectCandidates = tempRects.filter(
    (r) =>
      Math.min(r.right, topLeftRect.right) - Math.max(r.x, topLeftRect.x) >= 0
  );
  let bottomClosestRect,
    minimumVGap = 10000;
  for (let vRect of bottomClosestRectCandidates) {
    if (Math.abs(topLeftRect.y - vRect.bottom) < minimumVGap) {
      bottomClosestRect = vRect;
      minimumVGap = Math.abs(topLeftRect.y - vRect.bottom);
    }
    if (Math.abs(vRect.y - topLeftRect.bottom) < minimumVGap) {
      bottomClosestRect = vRect;
      minimumVGap = Math.abs(vRect.y - topLeftRect.bottom);
    }
  }
  return [topLeftRect, rightClosestRect, bottomClosestRect];
}

function checkAlignment(basicColl, overlapSide) {
  let candidates = basicColl.map((r) => [r[overlapSide[0]], r[overlapSide[1]]]);
  let thisEqualCons = candidates[0].filter(
    (cand) =>
      !candidates
        .map(
          (pair) =>
            Math.abs(cand - pair[0]) < gridAllignmentDiff ||
            Math.abs(cand - pair[1]) < gridAllignmentDiff
        )
        .includes(false)
  );
  return thisEqualCons.length;
}

function getPosition(S, subS, ind) {
  return S.split(subS, ind).join(subS).length;
}

var scene;
// var backupScene;

function getAtlasScene() {
  let thisID = 1;
  scene = atlas.scene();
  // backupScene = atlas.scene();
  scene = formGOM(scene, scene, newColls[0], thisID, 0);
  // for (let key of Object.keys(backupScene._itemMap)) {
  //   if (key.startsWith("rect") || key.startsWith("path")) {
  //     scene._itemMap[key] = backupScene._itemMap[key];
  //   }
  // }
  return scene;
}

function getAtlasGridDirection(s) {
  switch (s) {
    case "left":
      return "r2l";
    case "right":
      return "l2r";
    case "up":
      return "b2t";
    case "down":
      return "t2b";
  }
}

function formGOM(scene, parent, group, id, level) {
  let coll = group.Layout === "Glyph" ? scene.glyph() : scene.collection();
  coll.classId = group.Layout === "Glyph" ? "glyph" + id : "collection" + id;
  if ("gap" in group) {
    gridGaps[coll.classId] = group.gap;
  }
  if (group.Layout) {
    let thisLayout = group.Layout;
    let horzCellAlignment, vertCellAlignment;
    switch (thisLayout.substring(0, 4)) {
      case "Grid":
        let colGap, rowGap;
        let numOfRows = parseInt(
          thisLayout.substring(
            getPosition(thisLayout, "_", 2) + 1,
            thisLayout.indexOf("*")
          )
        );
        let numOfCols = parseInt(
          thisLayout.substring(thisLayout.indexOf("*") + 1)
        );
        allX = group.collections
          ? group.collections
              .map((c) => c.bbox.Left - group.collections[0].bbox.Right)
              .sort((a, b) => a - b)
          : group.rects
              .map((r) => r.x - Math.min(...group.rects.map((r) => r.right)))
              .sort((a, b) => a - b);
        allY = group.collections
          ? group.collections
              .map((c) => c.bbox.Top - group.collections[0].bbox.Bottom)
              .sort((a, b) => a - b)
          : group.rects
              .map((r) => r.y - Math.min(...group.rects.map((r) => r.bottom)))
              .sort((a, b) => a - b);
        vertCellAlignment =
          thisLayout.substring(5, 6) === "H"
            ? alignments[level] && alignments[level][0]
              ? alignments[level][0]
              : undefined
            : undefined;
        horzCellAlignment =
          thisLayout.substring(5, 6) === "V"
            ? alignments[level] && alignments[level][0]
              ? alignments[level][0]
              : undefined
            : undefined;
        let args = {};
        if (numOfCols > 1) args.colGap = allX.filter((g) => g >= gridGap)[0];
        if (numOfRows > 1) args.rowGap = allY.filter((g) => g >= gridGap)[0];
        if (numOfCols != 1 && numOfRows != 1) {
          //args.numRows = numOfRows;
          args.numCols = numOfCols;
        } else if (numOfCols == 1) {
          args.numCols = 1;
          args.horzCellAlignment = horzCellAlignment;
          args.vertCellAlignment = vertCellAlignment;
        } else {
          args.numRows = 1;
          args.horzCellAlignment = horzCellAlignment;
          args.vertCellAlignment = vertCellAlignment;
        }
        if (group.direction) {
          args.dir = group.direction.map((d) => getAtlasGridDirection(d));
          //args.vdir = group.direction.indexOf("up") >= 0 ? "b2t" : "t2b";
          //args.hdir = group.direction.indexOf("right") >= 0 ? "l2r" : "r2l";
        }
        coll.layout = atlas.layout("grid", args);
        // if (numOfCols != 1 && numOfRows != 1)
        //     coll.layout = atlas.layout("grid", {numRows: numOfRows, numCols: numOfCols, colGap: colGap, rowGap: rowGap});
        // else if (numOfCols == 1)
        //     coll.layout = atlas.layout("grid", {numCols: 1, rowGap: rowGap, horzCellAlignment: horzCellAlignment, vertCellAlignment: vertCellAlignment});
        // else if (numOfRows == 1)
        //     coll.layout = atlas.layout("grid", {numRows: 1, colGap: colGap, horzCellAlignment: horzCellAlignment, vertCellAlignment: vertCellAlignment});
        break;
      case "Stac":
        let orientation =
          thisLayout.substring(6, 10) == "Vert" ? "vertical" : "horizontal";
        let gap;
        switch (orientation) {
          case "vertical":
            horzCellAlignment =
              thisLayout.substring(getPosition(thisLayout, "_", 2) + 1) == "x"
                ? "left"
                : thisLayout.substring(getPosition(thisLayout, "_", 2) + 1);
            break;
          case "horizontal":
            vertCellAlignment =
              thisLayout.substring(getPosition(thisLayout, "_", 2) + 1) == "y"
                ? "top"
                : thisLayout.substring(getPosition(thisLayout, "_", 2) + 1);
            break;
        }
        let sl = atlas.layout("stack", {
          orientation: orientation,
          gap: 0,
          horzCellAlignment: horzCellAlignment,
          vertCellAlignment: vertCellAlignment,
        });
        coll.layout = sl;
        break;
      case "Tree":
        let tl = atlas.layout("treemap", {
          left: group.bbox.Left,
          top: group.bbox.Top,
          width: group.bbox.Width,
          height: group.bbox.Height,
        });
        coll.layout = tl;
        if (group.type === "colorGroup") coll.bottomTreeInd = true;
        break;
    }
  }
  if (!group.collections) {
    group.rects.sort(
      (r1, r2) =>
        parseFloat(r1.id.substring(4)) - parseFloat(r2.id.substring(4))
    );
    group.rects.forEach((rect) => {
      let newRect = scene.mark("rect", {
        top: rect.y,
        left: rect.x,
        width: rect.width,
        height: rect.height,
        fillColor: rect.fill,
        opacity: parseFloat(rect["fill-opacity"]),
        strokeWidth:
          "stroke-width" in rect
            ? rect["stroke-width"]
            : "stroke" in rect
            ? 1
            : 0,
        strokeColor: rect["stroke"],
      });
      let thisID =
        group.Layout === "Glyph" ? id + group.rects.indexOf(rect) : id;
      newRect.classId = "rect" + thisID;
      coll.addChild(newRect);
      // delete scene._itemMap[newRect.id];
      // newRect.id = rect.id;
      // backupScene._itemMap[rect.id] = newRect;
    });
  } else {
    for (let thisColl of group.collections) {
      coll = formGOM(scene, coll, thisColl, id + 1, level + 1);
    }
  }
  parent.addChild(coll);
  return parent;
}

function inferEncodings() {
  if (newColls[0]) {
    let allRects = newColls[0].rects.filter((r) => r.width > 0 && r.height > 0);
    rectEnc = rectEnc.concat(
      ["width", "height"].filter(
        (p) => range(allRects.map((r) => r[p])) > whDiff
      )
    );
    if (allRects.map((r) => r.fill).filter(onlyUnique).length > 1)
      rectEnc.push("fill");
    else if (
      allRects.map((r) => r["fill-opacity"]).filter(onlyUnique).length > 1
    )
      rectEnc.push("fill-opacity");
    let thisColl = newColls[0],
      previousColl = null;
    let basicLayout = thisColl.Layout;
    let previousLayout;
    while (thisColl.collections) {
      encodings.push(basicLayout.substring(0, 3) === "Enc" ? ["x", "y"] : []);
      previousColl = [...thisColl.collections];
      previousLayout = thisColl.Layout;
      thisColl = thisColl.collections[0];
      basicLayout = thisColl.Layout;
    }
    if (basicLayout.substring(0, 4) === "Stac") {
      if (rectEnc.indexOf("x") >= 0) rectEnc.splice(rectEnc.indexOf("x"), 1);
      if (rectEnc.indexOf("y") >= 0) rectEnc.splice(rectEnc.indexOf("y"), 1);
    }
    if (basicLayout.substring(0, 4) === "Tree") {
      if (rectEnc.indexOf("width") >= 0)
        rectEnc.splice(rectEnc.indexOf("width"), 1);
      if (rectEnc.indexOf("height") >= 0)
        rectEnc.splice(rectEnc.indexOf("height"), 1);
    }
    if (basicLayout.substring(0, 4) === "Glyp") {
      if (previousColl) {
        rectEnc = [];
        let thisEnc = [];
        switch (previousLayout.substring(5, 6)) {
          case "H":
            for (let i = 0; i < thisColl.rects.length; i++) {
              thisEnc = [];
              let rectsOfSameRole = previousColl.map((c) => c.rects[i]);
              if (range(rectsOfSameRole.map((r) => r.width)) > 1)
                thisEnc.push("width");
              if (range(rectsOfSameRole.map((r) => r.height)) > 1)
                thisEnc.push("height");
              if (
                thisEnc.length == 0 &&
                range(rectsOfSameRole.map((r) => r.middle)) > 1
              )
                thisEnc.push("y");
              rectEnc.push(thisEnc);
            }
            break;
          case "V":
            for (let i = 0; i < thisColl.rects.length; i++) {
              thisEnc = [];
              let rectsOfSameRole = previousColl.map((c) => c.rects[i]);
              if (range(rectsOfSameRole.map((r) => r.width)) > 1)
                thisEnc.push("width");
              if (range(rectsOfSameRole.map((r) => r.height)) > 1)
                thisEnc.push("height");
              if (
                thisEnc.length == 0 &&
                range(rectsOfSameRole.map((r) => r.center)) > 1
              )
                thisEnc.push("x");
              rectEnc.push(thisEnc);
            }
            break;
        }
        // handle percentage bullet chart where the most behind bars are of the same length
        if (rectEnc[0]) {
          if (rectEnc[0].length === 0) {
            rectEnc[0] = rectEnc.map((r) => r.includes("width")).includes(true)
              ? ["width"]
              : rectEnc.map((r) => r.includes("height")).includes(true)
              ? ["height"]
              : [];
          }
        }
      } else {
        if (
          range(thisColl.rects.map((r) => r.x)) <= 1 ||
          range(thisColl.rects.map((r) => r.right)) <= 1 ||
          range(thisColl.rects.map((r) => r.middle)) <= 1
        ) {
          if (rectEnc.indexOf("height") >= 0)
            rectEnc.splice(rectEnc.indexOf("height"), 1);
        }
        if (
          range(thisColl.rects.map((r) => r.y)) <= 1 ||
          range(thisColl.rects.map((r) => r.bottom)) <= 1 ||
          range(thisColl.rects.map((r) => r.center)) <= 1
        ) {
          if (rectEnc.indexOf("width") >= 0)
            rectEnc.splice(rectEnc.indexOf("width"), 1);
        }
      }
      // removing "fill" from encoded channels for test
      if (rectEnc.indexOf("fill") >= 0)
        rectEnc.splice(rectEnc.indexOf("fill"), 1);
    }
    if (basicLayout.substring(0, 4) === "Tree") rectEnc.push("area");
    encodings.push(rectEnc);
  }
}
