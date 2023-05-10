var diffArrayH, diffArrayV;
var allHoriColls = null, allVertColls = null;
var newColls = [], finalGroups = null, encodings = [];
const average = (array) => array.reduce((a, b) => a + b) / array.length;
var rects, rectWith0WH;
var rectEnc;
var alignments, horiAlign, vertAlign;

function bottomUpGrouping() {
  console.clear();
  rects = rects4Grouping[0].filter(r => r.tag === 'rect');
  console.log([...rects])
  rectWith0WH = rects4Grouping[1];

  let [topLeftRect, rightClosestRect, bottomClosestRect] =
    findTwoStartingRects();

  // find collections
  newColls = [];
  encodings = [];
  rectEnc = [];
  alignments = [];
  horiAlign = [];
  vertAlign = [];
  allHoriColls = null;
  allVertColls = null;
  let thisDescription1 = { layout: null, equalConstraints: [] };
  let thisDescription2 = { layout: null, equalConstraints: [] };

  if (rightClosestRect) {
    allHoriColls = findGroupsFrom2Rects(
      thisDescription1,
      [topLeftRect, rightClosestRect],
      "Hori"
    );
    horiAlign = [...alignments];
  }

  if (bottomClosestRect) {
    alignments = [];
    allVertColls = findGroupsFrom2Rects(
      thisDescription2,
      [topLeftRect, bottomClosestRect],
      "Vert"
    );
    vertAlign = [...alignments];
  }

  if (!allHoriColls && !allVertColls) {
    let treemapGroups = treeMapTest([topLeftRect], [...rects]);
    if (!treemapGroups) {
      allHoriColls = findGroupsFromLabels("Horz");
      horiAlign = [[]];
      allVertColls = findGroupsFromLabels("Vert");
      vertAlign = [[]];
    } else {
      console.log("Treemap Groups: ", treemapGroups);
      allHoriColls = treemapGroups;
      horiAlign = [[]];
      thisDescription1.layout = "Treemap";
      allVertColls = null;
    }
  }

  if (!allHoriColls && !allVertColls) { // no grid/stack/treemap/glyph found, we then regard it as encoding-based rects
    newColls[0] = {};
    newColls[0].Layout = "Encoding-based";
    newColls[0].rects = rects;
    newColls[0].bbox = calculateBBox(rects);
    newColls[0].x = Math.min(...rects.map(r=>r.x));
    newColls[0].y = Math.min(...rects.map(r=>r.y));
    rectEnc = ["x", "y"];
    alignments = [];
  }

  // gluing nested layouts and atlas scene obj
  finalGroups = null;
  if (allHoriColls && allHoriColls.length >= 1) {
    alignments = [...horiAlign];
    iterLayoutExtractor(allHoriColls);
    horiAlign = [...alignments];
    if (newColls)
      if (newColls.length == 1) {
        finalGroups = allHoriColls;
        if (thisDescription1.layout.substr(0, 4) === "Stac") return
      }
  }
  let tempNewColls = newColls ? [...newColls] : undefined;
  if (allVertColls && allVertColls.length >= 1) {
    alignments = [...vertAlign];
    iterLayoutExtractor(allVertColls);
    vertAlign = [...alignments];
    if (newColls)
      if (newColls.length === 1) {
        if (
          !tempNewColls ||
          tempNewColls.length === 0 ||
          thisDescription2.layout.substr(0, 4) === "Stac" ||
          (thisDescription2.layout.substr(0, 4) === "Grid" && thisDescription1.layout.substr(0, 4) !== "Grid") ||
          (thisDescription2.layout.substr(0, 4) === "Grid" || thisDescription1.layout.substr(0, 4) !== "Grid" || tempNewColls.Layout === "Encoding-based")
        ) {
          finalGroups = allVertColls;
          return
        }
      }
    newColls = [...tempNewColls];
    alignments = [...horiAlign];
  }

  return
}

function findGroupsFromLabels(orientation) {
  let property;
  switch (orientation) {
    case "Horz":
      property = ["width", "left", "right", "x"];
      break;
    case "Vert":
      property = ["height", "top", "bottom", "y"];
      break;
  }

  let labelGroups = [];
  let labels = orientation == "Horz" ? [...xAxis.labels] : [...yAxis.labels];
  if (labels.length === 0) return undefined;
  [...rects, ...rectWith0WH].forEach((r) => {
    let everyOverlap = labels.map(
      (thisLabel) =>
        r[property[0]] +
        thisLabel[property[2]] -
        thisLabel[property[1]] -
        Math.max(thisLabel[property[2]], r[property[2]]) +
        Math.min(thisLabel[property[1]], r[property[3]])
    );
    let rBelongToThisIndex = everyOverlap.indexOf(Math.max(...everyOverlap));
    if (labelGroups[rBelongToThisIndex])
      labelGroups[rBelongToThisIndex].push(r);
    else labelGroups[rBelongToThisIndex] = [r];
  });
  if (labelGroups.length === labels.length) {
    return glyphCheck(labelGroups, orientation);
  } else return undefined;
}

function glyphCheck(labelGroups, orientation) {
  if (labelGroups.map((group) => group.length).filter(onlyUnique).length > 1)
    return undefined;
  // sorting each group by id
  labelGroups = labelGroups.map((group) =>
    group.sort((a, b) =>
      parseFloat(a.id.substring(4)) > parseFloat(b.id.substring(4)) ? 1 : -1
    )
  );
  let cond1 = labelGroups[0][0]["fill"] ? true : false,
    cond2 = labelGroups[0][0]["fill-opacity"]
      ? labelGroups[0].map((r) => r["fill-opacity"]).filter(onlyUnique).length >
        1
        ? true
        : false
      : false;
  for (let i = 0; i < labelGroups[0].length; i++) {
    cond1 =
      cond1 &&
      labelGroups.map((g) => g[i]["fill"]).filter(onlyUnique).length === 1;
    if (cond2) {
      cond2 =
        cond2 &&
        labelGroups.map((g) => g[i]["fill-opacity"]).filter(onlyUnique)
          .length === 1;
    }
  }
  if (cond1 || cond2) {
    let colls = [];
    for (let group of labelGroups) {
      let thisColl = {
        Layout: "Glyph",
        bbox: calculateBBox(group),
        rects: group,
        x: null,
        y: null,
      };
      thisColl = findGlyphAnchorPoint(thisColl, orientation);
      colls.push(thisColl);
    }
    return colls;
  } else return undefined;
}

function findGlyphAnchorPoint(coll, ori) {
  let potentialAlignments;
  switch (ori) {
    case "Horz":
      potentialAlignments = ["bottom", "y"].filter(
        (side) => range(coll.rects.map((r) => r[side])) < 0.1
      );
      if (potentialAlignments.length > 0) {
        coll.x = coll.rects[0].x;
        coll.y = coll.rects[0][potentialAlignments[0]];
      } else {
        coll.x = coll.rects[0].x;
        coll.y = coll.rects[0].y;
      }
      break;
    case "Vert":
      potentialAlignments = ["x", "right"].filter(
        (side) => range(coll.rects.map((r) => r[side])) < 0.1
      );
      if (potentialAlignments.length > 0) {
        coll.x = coll.rects[0][potentialAlignments[0]];
        coll.y = coll.rects[0].y;
      } else {
        coll.x = coll.rects[0].x;
        coll.y = coll.rects[0].y;
      }
      break;
  }
  return coll;
}

function findGroupsFrom2Rects(thisDescription, twoRects, ori) {
  twoRects =
    ori == "Hori"
      ? twoRects.sort((a, b) => (a.x > b.x ? 1 : -1))
      : twoRects.sort((a, b) => (a.y > b.y ? 1 : -1));
  let rect1 = twoRects[0];
  let rect2 = twoRects[1];
  switch (ori) {
    case "Hori":
      if (
        rect2.x - rect1.right >= gridGap &&
        range(twoRects.map((r) => r.width)) <= whDiff
      ) {
        // which can be stack layout cases where the first two rects happen to share the same width
        thisDescription.layout = "Grid_Hori";
        let pairComp = [
          ["bottom", "bottom"],
          ["y", "y"],
          ["bottom", "y"],
          ["y", "bottom"],
        ];
        pairComp = pairComp.filter(
          (pair) =>
            Math.abs(rect1[pair[0]] - rect2[pair[1]]) <= gridAllignmentDiff
        );
        thisDescription.equalConstraints = pairComp.map(
          (p) => (rect1[p[0]] + rect2[p[1]]) / 2
        );
      } else if (
        rect2.x - rect1.right >= stackMinGap &&
        rect2.x - rect1.right <= stackMaxGap
      ) {
        thisDescription.layout = "Stack_Hori";
        if (
          // Math.abs(rect1.height - rect2.height) <= whDiff &&
          Math.abs(rect1.middle - rect2.middle) <= whDiff
        )
          thisDescription.equalConstraints = ["middle"];
        else {
          if (range(twoRects.map((r) => r.y)) <= stackAllignmentDiff)
            thisDescription.equalConstraints.push("y");
          else if (range(twoRects.map((r) => r.bottom)) <= stackAllignmentDiff)
            thisDescription.equalConstraints.push("bottom");
        }
        if (thisDescription.equalConstraints.length == 0)
          thisDescription.layout = null; // note here it is possible that the two rects are vertically gridded
      }
      break;
    case "Vert":
      if (
        rect2.y - rect1.bottom >= gridGap &&
        range(twoRects.map((r) => r.height)) <= whDiff
      ) {
        thisDescription.layout = "Grid_Vert";
        let pairComp = [
          ["right", "right"],
          ["x", "x"],
          ["right", "x"],
          ["x", "right"],
        ];
        pairComp = pairComp.filter(
          (pair) =>
            Math.abs(rect1[pair[0]] - rect2[pair[1]]) <= gridAllignmentDiff
        );
        thisDescription.equalConstraints = pairComp.map(
          (p) => (rect1[p[0]] + rect2[p[1]]) / 2
        );
        // if (pairComp.length > 0) thisDescription.equalConstraints = pairComp;
        // else thisDescription.layout = null;
      } else if (
        rect2.y - rect1.bottom >= stackMinGap &&
        rect2.y - rect1.bottom <= stackMaxGap
      ) {
        thisDescription.layout = "Stack_Vert";
        if (
          // Math.abs(rect1.width - rect2.width) <= whDiff &&
          Math.abs(rect1.center - rect2.center) <= whDiff
        )
          thisDescription.equalConstraints = ["center"];
        else {
          if (range(twoRects.map((r) => r.x)) <= stackAllignmentDiff)
            thisDescription.equalConstraints.push("x");
          else if (range(twoRects.map((r) => r.right)) <= stackAllignmentDiff)
            thisDescription.equalConstraints.push("right");
        }
        if (thisDescription.equalConstraints.length == 0)
          thisDescription.layout = null; // note here it is possible that the two rects are horizontally gridded
      }
      break;
  }

  if (thisDescription.layout) {
    let basicCollection;
    let results = completeBasicColl(twoRects, thisDescription);
    basicCollection = results[0];
    thisDescription = results[1];
    alignments.unshift(thisDescription.layout.substring(0, 4) === "Stac" ? thisDescription.equalConstraints : thisDescription.equalConstraints.length > 0 ? thisDescription.layout.substring(5, 6) === "H" ? range([thisDescription.equalConstraints[0], ...basicCollection.map(r => r.bottom)]) <= gridAllignmentDiff ? ["bottom"] : ["y"] : range([thisDescription.equalConstraints[0], ...basicCollection.map(r => r.x)]) <= gridAllignmentDiff ? ["x"] : ["right"] : []);
    return findCollBasedOnSampleColl([basicCollection, thisDescription]);
  } else {
    return undefined;
  }
}

function completeBasicColl(twoRects, des) {
  let basicColl = twoRects;
  if (des.layout.substr(0, 4) == "Grid") {
    let thisKeys, overlapSide;
    switch (des.layout.substr(5)) {
      case "Hori":
        thisKeys = ["width", "x", "right"];
        overlapSide = ["bottom", "y", "middle"];
        break;
      case "Vert":
        thisKeys = ["height", "y", "bottom"];
        overlapSide = ["right", "x", "center"];
        break;
    }
    let gap = basicColl[1][thisKeys[1]] - basicColl[0][thisKeys[2]];
    while (basicColl.length < rects.length + rectWith0WH.length) {
      let pR = basicColl[basicColl.length - 1];
      // below is for finding a rect that satisfies (1) same H/W; (2) same gap as before; (3) aligned with its neighbour
      let nextRectCandidate = [...rects, ...rectWith0WH].filter(
        (r) =>
          !basicColl.includes(r) &&
          range(
            basicColl.map((bcR) => bcR[thisKeys[0]]).concat([r[thisKeys[0]]])
          ) <= whDiff &&
          range([gap, r[thisKeys[1]] - pR[thisKeys[2]]]) <= 1
      );
      nextRectCandidate.sort(function (a, b) {
        return (
          Math.min(b[overlapSide[0]], pR[overlapSide[0]]) -
          Math.max(b[overlapSide[1]], pR[overlapSide[1]]) -
          (Math.min(a[overlapSide[0]], pR[overlapSide[0]]) -
            Math.max(a[overlapSide[1]], pR[overlapSide[1]]))
        );
      });
      if (nextRectCandidate[0]) {
        let nextCons = des.equalConstraints.filter(
          (v) =>
            Math.abs(v - nextRectCandidate[0][overlapSide[0]]) <
              gridAllignmentDiff ||
            Math.abs(v - nextRectCandidate[0][overlapSide[1]]) <
              gridAllignmentDiff
        );
        if ((
          basicColl.length >= 3 &&
          nextCons.length == 0 &&
          des.equalConstraints.length > 0
        ) || (
          basicColl.length >= 3 &&
          range(basicColl.map(r => r[overlapSide[0]])) <= whDiff &&
          range(basicColl.map(r => r[overlapSide[1]])) <= whDiff &&
          (
            range([...basicColl, nextRectCandidate[0]].map(r => r[overlapSide[0]])) > whDiff ||
            range([...basicColl, nextRectCandidate[0]].map(r => r[overlapSide[1]])) > whDiff
          ))
        )
          break;
        basicColl.push(nextRectCandidate[0]);
        des.equalConstraints = nextCons;
      } else break;
    }
    while (basicColl.length < rects.length + rectWith0WH.length) {
      let pR = basicColl[0];
      // below is for finding a rect that satisfies (1) same H/W; (2) same gap as before; (3) aligned with its neighbour
      let prevRectCandidate = [...rects, ...rectWith0WH].filter(
        (r) =>
          !basicColl.includes(r) &&
          range(
            basicColl.map((bcR) => bcR[thisKeys[0]]).concat([r[thisKeys[0]]])
          ) <= whDiff &&
          range([gap, pR[thisKeys[1]] - r[thisKeys[2]]]) <= 1
      );
      prevRectCandidate.sort(function (a, b) {
        return (
          Math.min(b[overlapSide[0]], pR[overlapSide[0]]) -
          Math.max(b[overlapSide[1]], pR[overlapSide[1]]) -
          (Math.min(a[overlapSide[0]], pR[overlapSide[0]]) -
            Math.max(a[overlapSide[1]], pR[overlapSide[1]]))
        );
      });
      if (prevRectCandidate[0]) {
        let nextCons = des.equalConstraints.filter(
          (v) =>
            Math.abs(v - prevRectCandidate[0][overlapSide[0]]) <
              gridAllignmentDiff ||
            Math.abs(v - prevRectCandidate[0][overlapSide[1]]) <
              gridAllignmentDiff
        );
        if ((
          basicColl.length >= 3 &&
          nextCons.length == 0 &&
          des.equalConstraints.length > 0
          ) || (
          basicColl.length >= 3 &&
          range(basicColl.map(r => r[overlapSide[0]])) <= whDiff &&
          range(basicColl.map(r => r[overlapSide[1]])) <= whDiff &&
          (
            range([...basicColl, prevRectCandidate[0]].map(r => r[overlapSide[0]])) > whDiff ||
            range([...basicColl, prevRectCandidate[0]].map(r => r[overlapSide[1]])) > whDiff
          ))
        )
          break;
        basicColl.unshift(prevRectCandidate[0]);
        des.equalConstraints = nextCons;
      } else break;
    }
    if (basicColl.length == 2) {
      // correct the case where a stack layout is recognized as a grid layout due to the first two rectangles share the same H/W
      // but this case can also happen after collectiong more than 2 rects so CONSIDER move this part inside the above loops
      let sideAllignment =
        range(basicColl.map((r) => r[overlapSide[2]])) <= stackAllignmentDiff
          ? overlapSide[2]
          : range(basicColl.map((r) => r[overlapSide[1]])) <= stackAllignmentDiff
            ? overlapSide[1]
            : range(basicColl.map((r) => r[overlapSide[0]])) <=
              stackAllignmentDiff
            ? overlapSide[0]
            : null;
      if (sideAllignment) {
        if (range(rects.map((r) => r[thisKeys[0]])) > whDiff) {
          des.layout = "Stack_" + des.layout.substr(5);
          des.equalConstraints = [sideAllignment];
          let results = completeBasicColl(twoRects, des);
          basicColl = results[0];
          des = results[1];
        }
      }
    }
  } else if (des.layout.substr(0, 5) == "Stack") {
    let thisKeys;
    switch (des.layout.substr(6)) {
      case "Hori":
        thisKeys = ["x", "right", "height", "middle"];
        break;
      case "Vert":
        thisKeys = ["y", "bottom", "width", "center"];
        break;
    }
    while (basicColl.length < rects.length + rectWith0WH.length) {
      let pR = basicColl[basicColl.length - 1];
      // below is for finding a rect that satisfies (1) stacked with previous ones; (2) equalConstraints is satisfied
      let nextRect = [...rects, ...rectWith0WH]
        .filter(
          (r) =>
            !basicColl.includes(r) &&
            r[thisKeys[0]] - pR[thisKeys[1]] >= stackMinGap &&
            r[thisKeys[0]] - pR[thisKeys[1]] <= stackMaxGap &&
            des.equalConstraints.filter(
              (c) => range([r[c], pR[c]]) <= stackAllignmentDiff
            ).length == des.equalConstraints.length
        )
        .sort((a, b) => a[thisKeys[0]] - b[thisKeys[0]])[0];
      if (nextRect) {
        basicColl.push(nextRect);
        // if (range(basicColl.map((bcR) => bcR[thisKeys[2]])) <= whDiff)
        //   des.equalConstraints = [thisKeys[2], thisKeys[3]];
      } else break;
    }
    while (basicColl.length < rects.length + rectWith0WH.length) {
      let pR = basicColl[0];
      // below is for finding a rect that satisfies (1) stacked with previous ones; (2) equalConstraints is satisfied
      let prevRect = [...rects, ...rectWith0WH]
        .filter(
          (r) =>
            !basicColl.includes(r) &&
            pR[thisKeys[0]] - r[thisKeys[1]] >= stackMinGap &&
            pR[thisKeys[0]] - r[thisKeys[1]] <= stackMaxGap &&
            des.equalConstraints.filter(
              (c) => range([r[c], pR[c]]) <= stackAllignmentDiff
            ).length == des.equalConstraints.length
        )
        .sort((a, b) => b[thisKeys[0]] - a[thisKeys[0]])[0];
      if (prevRect) {
        basicColl.unshift(prevRect);
        // if (range(basicColl.map((bcR) => bcR[thisKeys[2]])) <= whDiff)
        //   des.equalConstraints = [thisKeys[2], thisKeys[3]];
      } else break;
    }
  }
  if (des.equalConstraints.length === 0) {
    switch (des.layout.substr(5)) {
      case "Hori":
        rectEnc.push("y");
        break;
      case "Vert":
        rectEnc.push("x");
        break;
    }
  }
  return [basicColl, des];
}

function findCollBasedOnSampleColl(sampleDict) {
  let sampleColl = sampleDict[0];
  let sampleCons = sampleDict[1];
  let collections = [{ rects: sampleColl, x: null, y: null }];
  switch (sampleCons.layout.substr(0, 4)) {
    case "Grid":
      collections = findAllGridCell(collections, sampleColl, sampleCons);
      break;
    case "Stac":
      collections = findAllStackedCell(collections, sampleColl, sampleCons);
      break;
  }
  return collections;
}

function findAllGridCell(collections, sampleColl, sampleCons) {
  let allRects = rects;
  let gap,
    thisKeys,
    overlapSide,
    candidateBaseline = [],
    baselineResult;
  switch (sampleCons.layout.substr(5)) {
    case "Hori":
      thisKeys = ["width", "x", "right", "y"];
      overlapSide = ["bottom", "y"];
      gap = sampleColl[1].x - sampleColl[0].right;
      allRects = allRects
        .filter((r) => !sampleColl.includes(r))
        .sort((x, y) => (x.x > y.x ? 1 : -1));
      break;
    case "Vert":
      thisKeys = ["height", "y", "bottom", "x"];
      overlapSide = ["right", "x"];
      gap = sampleColl[1].y - sampleColl[0].bottom;
      allRects = allRects
        .filter((r) => !sampleColl.includes(r))
        .sort((x, y) => (x.y > y.y ? 1 : -1));
      break;
  }
  collections[0][thisKeys[1]] = Math.min(
    ...collections[0].rects.map((r) => r[thisKeys[1]])
  );
  collections[0][thisKeys[3]] = sampleCons.equalConstraints[0]
    ? sampleCons.equalConstraints[0]
    : collections[0].rects[
        collections[0].rects
          .map((r) => r[thisKeys[1]])
          .indexOf(collections[0][thisKeys[1]])
      ][overlapSide[1]];
  collections[0]["bbox"] = calculateBBox(collections[0].rects);
  collections[0]["Layout"] =
    sampleCons.layout.substr(5) == "Hori"
      ? sampleCons.layout + "_1*" + collections[0].rects.length
      : sampleCons.layout + "_" + collections[0].rects.length + "*1";

  while (allRects.length > 0) { // a minor tbd: handle cases where allRects runs out while rectWith0WH are out there: smallMultiplesBar_datylon
    let basicColl = [allRects[0]];
    while (basicColl.length < allRects.length + rectWith0WH.length) {
      let pR = basicColl[basicColl.length - 1];
      // below is for finding a rect that satisfies (1) same H/W; (2) same gap as before; (3) aligned with its neighbour
      let nextRectCandidate = [...allRects, ...rectWith0WH].filter(
        (r) =>
          !basicColl.includes(r) &&
          range(
            basicColl.map((bcR) => bcR[thisKeys[0]]).concat([r[thisKeys[0]]])
          ) <= whDiff &&
          range([gap, r[thisKeys[1]] - pR[thisKeys[2]]]) <= 1
      );
      nextRectCandidate.sort(function (a, b) {
        return (
          Math.min(b[overlapSide[0]], pR[overlapSide[0]]) -
          Math.max(b[overlapSide[1]], pR[overlapSide[1]]) -
          (Math.min(a[overlapSide[0]], pR[overlapSide[0]]) -
            Math.max(a[overlapSide[1]], pR[overlapSide[1]]))
        );
      });
      if (nextRectCandidate[0]) {
        if (
          basicColl.length >= 3 &&
          checkAlignment(basicColl, overlapSide) &&
          !checkAlignment([...basicColl, nextRectCandidate[0]], overlapSide)
        )
          break;
        basicColl.push(nextRectCandidate[0]);
      } else break;
    }
    while (basicColl.length < allRects.length + rectWith0WH.length) {
      let pR = basicColl[0];
      // below is for finding a rect that satisfies (1) same H/W; (2) same gap as before; (3) aligned with its neighbour
      let prevRectCandidate = [...allRects, ...rectWith0WH].filter(
        (r) =>
          !basicColl.includes(r) &&
          range(
            basicColl.map((bcR) => bcR[thisKeys[0]]).concat([r[thisKeys[0]]])
          ) <= whDiff &&
          range([gap, pR[thisKeys[1]] - r[thisKeys[2]]]) <= 1
      );
      prevRectCandidate.sort(function (a, b) {
        return (
          Math.min(b[overlapSide[0]], pR[overlapSide[0]]) -
          Math.max(b[overlapSide[1]], pR[overlapSide[1]]) -
          (Math.min(a[overlapSide[0]], pR[overlapSide[0]]) -
            Math.max(a[overlapSide[1]], pR[overlapSide[1]]))
        );
      });
      if (prevRectCandidate[0]) {
        if (
          basicColl.length >= 3 &&
          checkAlignment(basicColl, overlapSide) &&
          !checkAlignment([...basicColl, prevRectCandidate[0]], overlapSide)
        )
          break;
        basicColl.unshift(prevRectCandidate[0]);
      } else break;
    }
    // if (basicColl.length == 1) return null;
    // console.log(basicColl)
    thisGroup = { rects: basicColl, x: null, y: null };

    thisGroup[thisKeys[1]] = Math.min(
      ...thisGroup.rects.map((r) => r[thisKeys[1]])
    );
    let candidates = basicColl.map((r) => [
      r[overlapSide[0]],
      r[overlapSide[1]],
    ]);
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
    thisGroup[thisKeys[3]] = thisEqualCons[0]
      ? thisEqualCons[0]
      : thisGroup.rects[
          thisGroup.rects
            .map((r) => r[thisKeys[1]])
            .indexOf(thisGroup[thisKeys[1]])
        ][overlapSide[1]];
    thisGroup["bbox"] = calculateBBox(thisGroup.rects);
    thisGroup["Layout"] =
      sampleCons.layout.substr(5) == "Hori"
        ? sampleCons.layout + "_1*" + thisGroup.rects.length
        : sampleCons.layout + "_" + thisGroup.rects.length + "*1";

    if (checkOverlap(collections, thisGroup)) return null;
    else collections.push(thisGroup);
    allRects = allRects.filter((r) => !basicColl.includes(r));
  }
  return collections;
}

function findAllStackedCell(collections, sampleColl, sampleCons) {
  let allRects = rects;
  let gap, thisKeys;
  collections[0]["bbox"] = calculateBBox(collections[0].rects);
  collections[0]["Layout"] = sampleCons.equalConstraints.includes("center")
    ? sampleCons.layout + "_" + "center"
    : sampleCons.equalConstraints.includes("middle")
    ? sampleCons.layout + "_" + "middle"
    : sampleCons.layout + "_" + sampleCons.equalConstraints[0];
  switch (sampleCons.layout.substr(6)) {
    case "Hori":
      thisKeys = ["x", "right"];
      thisAllignment = sampleCons.equalConstraints[0] === "middle" ? sampleCons.equalConstraints : ["y", "bottom"];
      collections[0]["y"] = collections[0].rects[0][sampleCons.equalConstraints[0]]
      collections[0]["x"] =
        sampleCons.equalConstraints[0] !== "middle"
          ? [collections[0].bbox.Right, collections[0].bbox.Left]
          : [collections[0].bbox.Right, collections[0].bbox.Left]
              .concat(collections[0].rects.map((r) => r.center))
              .concat(collections[0].rects.map((r) => r.right))
              .filter(onlyUnique);
      gap = sampleColl[1].x - sampleColl[0].right;
      allRects = allRects
        .filter((r) => !sampleColl.includes(r))
        .sort((x, y) => (x.x > y.x ? 1 : -1));
      break;
    case "Vert":
      thisKeys = ["y", "bottom"];
      thisAllignment = sampleCons.equalConstraints[0] === "center" ? sampleCons.equalConstraints : ["x", "right"];
      collections[0]["x"] = collections[0].rects[0][sampleCons.equalConstraints[0]]
      collections[0]["y"] =
      sampleCons.equalConstraints[0] !== "center"
          ? [collections[0].bbox.Bottom, collections[0].bbox.Top]
          : [collections[0].bbox.Bottom, collections[0].bbox.Top]
              .concat(collections[0].rects.map((r) => r.middle))
              .concat(collections[0].rects.map((r) => r.bottom))
              .filter(onlyUnique);
      gap = sampleColl[1].y - sampleColl[0].bottom;
      allRects = allRects
        .filter((r) => !sampleColl.includes(r))
        .sort((x, y) => (x.y > y.y ? 1 : -1));
      break;
  }
  while (allRects.length > 0) {
    let basicColl = [allRects[0]];
    while (basicColl.length < allRects.length + rectWith0WH.length) {
      let pR = basicColl[basicColl.length - 1];
      // below is for finding a rect that satisfies (1) stacked with previous ones; (2) equalConstraints is satisfied
      let nextRect = [...allRects, ...rectWith0WH].filter(
        (r) =>
          !basicColl.includes(r) &&
          r[thisKeys[0]] - pR[thisKeys[1]] >= stackMinGap &&
          r[thisKeys[0]] - pR[thisKeys[1]] <= stackMaxGap &&
          thisAllignment.filter((c) => range([r[c], pR[c]]) <= stackAllignmentDiff).length >= 1
      )[0];
      if (nextRect) basicColl.push(nextRect);
      else break;
    }
    while (basicColl.length < allRects.length + rectWith0WH.length) {
      let pR = basicColl[0];
      // below is for finding a rect that satisfies (1) stacked with previous ones; (2) equalConstraints is satisfied
      let prevRect = [...allRects, ...rectWith0WH].filter(
        (r) =>
          !basicColl.includes(r) &&
          pR[thisKeys[0]] - r[thisKeys[1]] >= stackMinGap &&
          pR[thisKeys[0]] - r[thisKeys[1]] <= stackMaxGap &&
          thisAllignment.filter((c) => range([r[c], pR[c]]) <= stackAllignmentDiff).length >= 1
      )[0];
      if (prevRect) basicColl.unshift(prevRect);
      else break;
    }
    if (basicColl.length == 1) return null;
    
    thisGroup = {
      rects: basicColl,
      x: null,
      y: null,
      bbox: calculateBBox(basicColl),
      Layout: collections[0]["Layout"],
    };
    let finalAlignment = thisAllignment.filter((c) => range(basicColl.map(r => r[c])) <= stackAllignmentDiff)[0];
    thisGroup["Layout"] = ["x", "y"].includes(finalAlignment)
      ? sampleCons.layout + "_" + finalAlignment
      : thisGroup["Layout"];
    switch (sampleCons.layout.substr(6)) {
      case "Hori":
        thisGroup["y"] = thisGroup.rects[0][finalAlignment];
        thisGroup["x"] =
          sampleCons.equalConstraints[0] !== "middle" 
            ? [thisGroup.bbox.Right, thisGroup.bbox.Left]
            : [thisGroup.bbox.Right, thisGroup.bbox.Left]
                .concat(thisGroup.rects.map((r) => r.center))
                .concat(thisGroup.rects.map((r) => r.right))
                .filter(onlyUnique);
        break;
      case "Vert":
        thisGroup["x"] = thisGroup.rects[0][finalAlignment];
        thisGroup["y"] =
          sampleCons.equalConstraints[0] !== "center" 
            ? [thisGroup.bbox.Bottom, thisGroup.bbox.Top]
            : [thisGroup.bbox.Bottom, thisGroup.bbox.Top]
                .concat(thisGroup.rects.map((r) => r.middle))
                .concat(thisGroup.rects.map((r) => r.bottom))
                .filter(onlyUnique);
        break;
    }
    if (checkOverlap(collections, thisGroup)) return null;
    else collections.push(thisGroup);
    allRects = allRects.filter((r) => !basicColl.includes(r));
  }
  return collections;
}

function iterLayoutExtractor(collections) {
  // newColls = collections;
  if (!collections) return;
  if (collections.length == 1) {newColls = collections; return;}
  let newColl;
  switch (collections[0].Layout.substring(0, 4)) {
    case "Grid":
      newColl = CollCluster4Grid(collections);
      iterLayoutExtractor(newColl);
      break;
    case "Stac":
      newColl = CollCluster4Stack(collections);
      iterLayoutExtractor(newColl);
      break;
    case "Glyp":
      newColl = CollCluster4Grid(collections);
      iterLayoutExtractor(newColl);
      break;
    case "Tree":
      newColl = CollCluster4Grid(collections);
      iterLayoutExtractor(newColl);
      break;
    case "Enco":
      newColl = CollCluster4Grid(collections);
      iterLayoutExtractor(newColl);
      break;
  }
}

function CollCluster4Grid(collections) {
  let originalColls = [...collections];
  let newColl = [];
  let gap = null, info = [false, 0, 0, null];
  // horizontal Grid
  collections = collections.sort((c1, c2) => c1.x - c2.x);
  while (collections.length > 0) {
    let referColl = collections[0],
      thisRects = [];
    let candidateColl = collections
      .filter(
        (coll) =>
          coll !== referColl &&
          (Math.abs(coll.y - referColl.y) <= gridAllignmentDiff ||
            Math.max(coll.bbox.Bottom, referColl.bbox.Bottom) -
              Math.min(coll.bbox.Top, referColl.bbox.Top) <=
              coll.bbox.Height + referColl.bbox.Height)
      )
      .sort((c1, c2) => c1.x - c2.x);

    if (candidateColl.length <= 0) break;
    gap = gap ? gap : candidateColl[0].bbox.Left - referColl.bbox.Right;
    let thisColl = [referColl, candidateColl[0]];
    thisRects = referColl.rects.concat(candidateColl[0].rects);
    candidateColl.shift();
    while (candidateColl.length > 0) {
      if (
        Math.abs(
          candidateColl[0].bbox.Left -
            thisColl[thisColl.length - 1].bbox.Right -
            gap
        ) <= 1
      ) {
        // && candidateColl[0].x - thisColl[thisColl.length-1].bbox.Right > 1) {
        thisColl.push(candidateColl[0]);
        thisRects = thisRects.concat(candidateColl[0].rects);
        candidateColl.shift();
      } else {
        break;
      }
    }

    // handle grouped range chart
    if (range(rects.map(r => r.height)) > 5 || range(rects.map(r => r.width)) > 5)
      for (let aColl of collections) {
        if (!thisColl.includes(aColl) && Math.abs(
          aColl.bbox.Left -
            thisColl[thisColl.length - 1].bbox.Right -
            gap
        ) <= 1) {
          thisColl.push(aColl);
          thisRects = thisRects.concat(aColl.rects);
        }
      }

    newColl.push({
      collections: thisColl,
      x: thisColl[0].x,
      y: thisColl[0].y,
      rects: thisRects,
      bbox: calculateBBox(thisRects),
      Layout: "Grid_Hori_1*" + thisColl.length,
    });
    collections = collections.filter((coll) => !thisColl.includes(coll));

    if (thisColl[0].Layout) {
      if (thisColl[0].Layout.substring(0, 9) === "Grid_Vert") {
        info = check2dGrid(thisColl, thisRects);
        if (info[0]) {
          newColl.pop();
          newColl.push({
            collections: info[3],
            x: thisColl[0].x,
            y: thisColl[0].y,
            rects: thisRects,
            gap: info[4],
            direction: info[5],
            bbox: calculateBBox(thisRects),
            Layout: info[0] === "Encoding-based" ? "Encoding-based" : "Grid_2D_" + info[1] + "*" + info[2],
          });
          alignments.shift();
          if (info[0] === "Encoding-based") rectEnc = ["x", "y"];
        }
      }
    }
  }

  if (collections.length == 0) {
    if (newColl[0].collections)
      alignments.unshift(range(newColl[0].collections.map(thisColl => thisColl.bbox.Bottom)) <= gridAllignmentDiff ? ["bottom"] : range(newColl[0].collections.map(thisColl => thisColl.bbox.Top)) <= gridAllignmentDiff ? ["top"] : []);
    return newColl;
  }

  collections = [...originalColls];
  newColl = [];
  gap = null;
  let gapY = null;
  // Vertical Grid
  collections = collections.sort((c1, c2) => c1.y - c2.y);
  while (collections.length > 0) {
    let referColl = collections[0],
      thisRects = [];
    let candidateColl = collections
      .filter(
        (coll) =>
          coll !== referColl &&
          (Math.abs(coll.x - referColl.x) <= gridAllignmentDiff ||
            Math.max(coll.bbox.Right, referColl.bbox.Right) -
              Math.min(coll.bbox.Left, referColl.bbox.Left) <=
              coll.bbox.Width + referColl.bbox.Width)
      )
      .sort((c1, c2) => c1.y - c2.y);
    if (candidateColl.length <= 0) break;
    gap = gap ? gap : candidateColl[0].bbox.Top - referColl.bbox.Bottom;
    gapY = gapY ? gapY : candidateColl[0].y - referColl.y; // tbd: add something similar as gapX
    let thisColl = [referColl, candidateColl[0]];
    thisRects = referColl.rects.concat(candidateColl[0].rects);
    candidateColl.shift();
    while (candidateColl.length > 0) {
      if (
        Math.abs(
          candidateColl[0].bbox.Top -
            thisColl[thisColl.length - 1].bbox.Bottom -
            gap
        ) <= 1
        ||
        Math.abs(
          candidateColl[0].y -
            thisColl[thisColl.length - 1].y -
            gapY
        ) <= 1
      ) {
        // && candidateColl[0].y - thisColl[thisColl.length-1].bbox.Bottom > 1) {
        thisColl.push(candidateColl[0]);
        thisRects = thisRects.concat(candidateColl[0].rects);
        candidateColl.shift();
      } else {
        break;
      }
    }
    newColl.push({
      collections: thisColl,
      x: thisColl[0].x,
      y: thisColl[0].y,
      rects: thisRects,
      bbox: calculateBBox(thisRects),
      Layout: "Grid_Vert_" + thisColl.length + "*1",
    });
    collections = collections.filter((coll) => !thisColl.includes(coll));

    if (thisColl[0].Layout) {
      if (thisColl[0].Layout.substring(0, 9) === "Grid_Hori") {
        info = check2dGrid(thisColl, thisRects);
        if (info[0]) {
          newColl.pop();
          newColl.push({
            collections: info[3],
            x: thisColl[0].x,
            y: thisColl[0].y,
            rects: thisRects,
            gap: info[4],
            direction: info[5],
            bbox: calculateBBox(thisRects),
            Layout: info[0] === "Encoding-based" ? "Encoding-based" : "Grid_2D_" + info[1] + "*" + info[2],
          });
          alignments.shift();
          if (info[0] === "Encoding-based") rectEnc = ["x", "y"];
        }
      }
    }
  }
  if (collections.length == 0) {
    if (newColl[0].collections)
      alignments.unshift(range(newColl[0].collections.map(thisColl => thisColl.bbox.Left)) <= gridAllignmentDiff ? ["left"] : range(newColl[0].collections.map(thisColl => thisColl.bbox.Right)) <= gridAllignmentDiff ? ["right"] : []);
    return newColl;
  }

  newColl = [];
  newColl[0] = {};
  newColl[0].Layout = "Encoding-based";
  newColl[0].collections = originalColls;
  newColl[0].rects = [];
  newColl[0].collections.forEach( thisColl => {
    newColl[0].rects = newColl[0].rects.concat(thisColl.rects);
  });
  newColl[0].bbox = calculateBBox(newColl[0].rects);
  newColl[0].x = Math.min(...newColl[0].rects.map(r=>r.x));
  newColl[0].y = Math.min(...newColl[0].rects.map(r=>r.y));
  alignments.unshift([]);
  return newColl
}

function CollCluster4Stack(collections) {
  let newColl = [];
  let gap = null;
  let thisLayout = null;
  switch (collections[0].Layout.substring(6, 10)) {
    case "Vert":
      collections = collections.sort((c1, c2) => c1.x - c2.x);
      while (collections.length > 0) {
        let referColl = collections[0],
          thisRects = [];
        let candidateColl = collections
          .filter(
            (coll) =>
              coll !== referColl &&
              coll.bbox.Top < referColl.bbox.Bottom &&
              referColl.bbox.Top < coll.bbox.Bottom
          )
          .sort((c1, c2) => c1.x - c2.x);
        if (candidateColl.length <= 0) break;
        let thisColl = [referColl, candidateColl[0]];
        thisRects = referColl.rects.concat(candidateColl[0].rects);
        candidateColl.shift();
        let possibleAllignment = removeTooCloseValues(
          referColl.y
            .filter((v) =>
              thisColl[1].y
                .map((v2) => Math.abs(v - v2) <= stackAllignmentDiff)
                .includes(true)
            )
            .sort((v1, v2) => v2 - v1)
        );
        if (possibleAllignment.length < 1) break;
        thisLayout = thisLayout
          ? thisLayout
          : thisColl[1].bbox.Left - referColl.bbox.Right >= gridGap &&
            Math.abs(
              thisColl[1].bbox.Right -
                thisColl[1].bbox.Left -
                referColl.bbox.Right +
                referColl.bbox.Left
            ) <= whDiff
          ? "Grid"
          : "Stack";
        gap = gap ? gap : thisColl[1].bbox.Left - referColl.bbox.Right;
        if (thisLayout == "Grid") {
          while (candidateColl.length > 0) {
            if (
              Math.abs(
                candidateColl[0].bbox.Left -
                  thisColl[thisColl.length - 1].bbox.Right -
                  gap
              ) <= 1
            ) {
              possibleAllignment = removeTooCloseValues(
                possibleAllignment
                  .filter((v) =>
                    candidateColl[0].y
                      .map((v2) => Math.abs(v - v2) <= stackAllignmentDiff)
                      .includes(true)
                  )
                  .sort((v1, v2) => v2 - v1)
              );
              if (possibleAllignment.length > 0) {
                thisColl.push(candidateColl[0]);
                thisRects = thisRects.concat(candidateColl[0].rects);
                candidateColl.shift();
              } else break;
            } else {
              break;
            }
          }
          let color4AlignedRects = undefined;
          if (range(thisColl.map(coll => coll.bbox.Bottom)) > gridAllignmentDiff && range(thisColl.map(coll => coll.bbox.Top)) > gridAllignmentDiff) {
            let fill4alignmentRect = thisRects.filter(r => Math.abs(r.bottom - possibleAllignment[0]) <= stackMaxGap).map(r => r.fill);
            color4AlignedRects = mode(fill4alignmentRect);
          }
          newColl.push({
            collections: thisColl,
            x: thisColl[0].x,
            y: possibleAllignment[0],
            rects: thisRects,
            bbox: calculateBBox(thisRects),
            Layout: "Grid_Hori_1*" + thisColl.length,
            color4AlignedRects: color4AlignedRects,
          });
          collections = collections.filter((coll) => !thisColl.includes(coll));
        } else {
          while (candidateColl.length > 0) {
            if (
              Math.abs(
                candidateColl[0].bbox.Left -
                  thisColl[thisColl.length - 1].bbox.Right
              ) <= 1
            ) {
              possibleAllignment = removeTooCloseValues(
                possibleAllignment
                  .filter((v) =>
                    candidateColl[0].y
                      .map((v2) => Math.abs(v - v2) <= stackAllignmentDiff)
                      .includes(true)
                  )
                  .sort((v1, v2) => v2 - v1)
              );
              if (possibleAllignment.length > 0) {
                thisColl.push(candidateColl[0]);
                thisRects = thisRects.concat(candidateColl[0].rects);
                candidateColl.shift();
              } else break;
            } else {
              break;
            }
          }
          let thisY = possibleAllignment[0], thisSide = "customized";
          if (range(thisColl.map(coll => coll.bbox.Bottom)) <= gridAllignmentDiff) {thisY = thisColl[0].bbox.Bottom; thisSide = "bottom";}
          else {
            if (range(thisColl.map(coll => coll.bbox.Top)) <= gridAllignmentDiff) {thisY = thisColl[0].bbox.Top; thisSide = "top";}
          }
          newColl.push({
            collections: thisColl,
            x: thisColl[0].x,
            y: thisY,
            rects: thisRects,
            bbox: calculateBBox(thisRects),
            Layout: "Stack_Hori_" + thisSide,
          });
          collections = collections.filter((coll) => !thisColl.includes(coll));
        }
      }
      if (newColl[0].collections)
        switch (newColl[0].Layout.substring(0, 4)){
          case "Grid":
            alignments.unshift(range(newColl[0].collections.map(thisColl => thisColl.bbox.Bottom)) <= gridAllignmentDiff ? ["bottom"] : range(newColl[0].collections.map(thisColl => thisColl.bbox.Top)) <= gridAllignmentDiff ? ["top"] : ["customized"]);
            break;
          case "Stac":
            alignments.unshift(range(newColl[0].collections.map(thisColl => thisColl.bbox.Bottom)) <= gridAllignmentDiff ? ["bottom"] : range(newColl[0].collections.map(thisColl => thisColl.bbox.Top)) <= gridAllignmentDiff ? ["top"] : ["middle"]);
            break;
          }
      return newColl;
    case "Hori":
      collections = collections.sort((c1, c2) => c1.y - c2.y);
      while (collections.length > 0) {
        let referColl = collections[0],
          thisRects = [];
        let candidateColl = collections
          .filter(
            (coll) =>
              coll !== referColl &&
              coll.bbox.Left < referColl.bbox.Right &&
              referColl.bbox.Left < coll.bbox.Right
          )
          .sort((c1, c2) => c1.y - c2.y);
        if (candidateColl.length <= 0) break;
        let thisColl = [referColl, candidateColl[0]];
        thisRects = referColl.rects.concat(candidateColl[0].rects);
        candidateColl.shift();
        let possibleAllignment = removeTooCloseValues(
          referColl.x
            .filter((v) =>
              thisColl[1].x
                .map((v2) => Math.abs(v - v2) <= stackAllignmentDiff)
                .includes(true)
            )
            .sort((v1, v2) => v2 - v1)
        ); //waterfall - stacked bar chart
        if (possibleAllignment.length < 1) break;
        thisLayout = thisLayout
          ? thisLayout
          : Math.abs(thisColl[1].bbox.Top - referColl.bbox.Bottom) <= 1
          ? "Stack"
          : "Grid";
        gap = gap ? gap : thisColl[1].bbox.Top - referColl.bbox.Bottom;
        if (thisLayout == "Grid") {
          while (candidateColl.length > 0) {
            if (
              Math.abs(
                candidateColl[0].bbox.Top -
                  thisColl[thisColl.length - 1].bbox.Bottom -
                  gap
              ) <= 1
            ) {
              // && candidateColl[0].x - thisColl[thisColl.length-1].bbox.Right > 1) {
              possibleAllignment = removeTooCloseValues(
                possibleAllignment
                  .filter((v) =>
                    candidateColl[0].x
                      .map((v2) => Math.abs(v - v2) <= stackAllignmentDiff)
                      .includes(true)
                  )
                  .sort((v1, v2) => v2 - v1)
              );
              if (possibleAllignment.length > 0) {
                thisColl.push(candidateColl[0]);
                thisRects = thisRects.concat(candidateColl[0].rects);
                candidateColl.shift();
              } else break;
            } else {
              break;
            }
          }
          let color4AlignedRects = undefined;
          if (range(thisColl.map(coll => coll.bbox.Left)) > gridAllignmentDiff && range(thisColl.map(coll => coll.bbox.Right)) > gridAllignmentDiff) {
            let fill4alignmentRect = thisRects.filter(r => Math.abs(r.right - possibleAllignment[0]) <= stackMaxGap).map(r => r.fill);
            color4AlignedRects = mode(fill4alignmentRect);
          }
          newColl.push({
            collections: thisColl,
            x: possibleAllignment[0],
            y: thisColl[0].y,
            rects: thisRects,
            bbox: calculateBBox(thisRects),
            Layout: "Grid_Vert_" + thisColl.length + "*1",
            color4AlignedRects: color4AlignedRects,
          });
          collections = collections.filter((coll) => !thisColl.includes(coll));
        } else {
          while (candidateColl.length > 0) {
            if (
              Math.abs(
                candidateColl[0].bbox.Top -
                  thisColl[thisColl.length - 1].bbox.Bottom
              ) <= 1
            ) {
              // && candidateColl[0].x - thisColl[thisColl.length-1].bbox.Right > 1) {
              possibleAllignment = removeTooCloseValues(
                possibleAllignment
                  .filter((v) =>
                    candidateColl[0].x
                      .map((v2) => Math.abs(v - v2) <= stackAllignmentDiff)
                      .includes(true)
                  )
                  .sort((v1, v2) => v2 - v1)
              );
              if (possibleAllignment.length > 0) {
                thisColl.push(candidateColl[0]);
                thisRects = thisRects.concat(candidateColl[0].rects);
                candidateColl.shift();
              } else break;
            } else {
              break;
            }
          }
          let thisX = possibleAllignment[0], thisSide = "customized";
          if (range(thisColl.map(coll => coll.bbox.Left)) <= gridAllignmentDiff) {thisY = thisColl[0].bbox.Left; thisSide = "left";}
          else {
            if (range(thisColl.map(coll => coll.bbox.Right)) <= gridAllignmentDiff) {thisY = thisColl[0].bbox.Right; thisSide = "right";}
          }
          newColl.push({
            collections: thisColl,
            x: thisX,
            y: thisColl[0].y,
            rects: thisRects,
            bbox: calculateBBox(thisRects),
            Layout: "Stack_Vert_" + thisSide,
          });
          collections = collections.filter((coll) => !thisColl.includes(coll));
        }
      }
      switch (newColl[0].Layout.substring(0, 4)){
        case "Grid":
          alignments.unshift(range(newColl[0].collections.map(thisColl => thisColl.bbox.Left)) <= gridAllignmentDiff ? ["left"] : range(newColl[0].collections.map(thisColl => thisColl.bbox.Right)) <= gridAllignmentDiff ? ["right"] : ["customized"]);
          break;
        case "Stac":
          alignments.unshift(range(newColl[0].collections.map(thisColl => thisColl.bbox.Left)) <= gridAllignmentDiff ? ["left"] : range(newColl[0].collections.map(thisColl => thisColl.bbox.Right)) <= gridAllignmentDiff ? ["right"] : ["center"]);
          break;
        }
      return newColl;
  }
}

function CollCluster4Glyph(collections) {
  // implement if needed
}

function check2dGrid(colls, thisRects) {
  let xyMap = [],
    collections = [],
    smallMultiple = false;
  colls.forEach((coll) => {
    if (coll.collections) {
      smallMultiple = true;
      coll.collections.forEach((c) => {
        xyMap.push([c.x, c.y]);
        collections.push(c);
      });
    } else {
      coll.rects.forEach((c) => {
        xyMap.push([c.x, c.y]);
      });
    }
  });
  let numRow = xyMap.map((coor) => coor[1]).filter(onlyUnique).length;
  let numCol = xyMap.map((coor) => coor[0]).filter(onlyUnique).length;
  if (numRow * numCol === xyMap.length & smallMultiple)
    return [
      true,
      numRow,
      numCol,
      collections.length === 0 ? null : collections,
    ];
  // gap & direction to be revised to be more robust
  thisRects = thisRects.sort((a,b) => a.x-b.x).sort((a,b) => -a.y+b.y); // right, up
  let Gap = thisRects[1].x-thisRects[0].right;
  if (!smallMultiple && range(rects.map(r => r.height))<=whDiff && range(rects.map(r => r.width))<=whDiff) {
    // we also need to set anchor points
    thisRects = thisRects.sort((a,b) => a.x-b.x).sort((a,b) => -a.y+b.y); // right, up
    if (checkColorContinuity(thisRects)) return [
      true,
      numRow,
      numCol,
      collections.length === 0 ? null : collections,
      Gap,
      ["right", "up"]
    ];
    thisRects = thisRects.sort((a,b) => -a.x+b.x).sort((a,b) => -a.y+b.y); // left, up
    if (checkColorContinuity(thisRects)) return [
      true,
      numRow,
      numCol,
      collections.length === 0 ? null : collections,
      Gap,
      ["left", "up"]
    ];
    thisRects = thisRects.sort((a,b) => -a.y+b.y).sort((a,b) => a.x-b.x); // up, right
    if (checkColorContinuity(thisRects)) return [
      true,
      numRow,
      numCol,
      collections.length === 0 ? null : collections,
      Gap,
      ["up", "right"]
    ];
    thisRects = thisRects.sort((a,b) => a.y-b.y).sort((a,b) => a.x-b.x); // down, right
    if (checkColorContinuity(thisRects)) return [
      true,
      numRow,
      numCol,
      collections.length === 0 ? null : collections,
      Gap,
      ["down", "right"]
    ];

    return [
      "Encoding-based",
      numRow,
      numCol,
      collections.length === 0 ? null : collections,
      Gap,
    ];
  }
  
  return [false, numRow, numCol, collections.length === 0 ? null : collections];
}

function checkColorContinuity(thisRects) {
  let allColors = thisRects.map(r => r.fill).filter(onlyUnique);
  let count = 0;
  for (let i=0; i<thisRects.length-1; i++) {
    if(thisRects[i].fill !== thisRects[i+1].fill) count++;
  }
  return count === allColors.length - 1;
}
