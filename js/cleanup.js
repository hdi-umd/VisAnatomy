var style = {};
var graphicsElementTypes = [
  "line",
  "polyline",
  "rect",
  "circle",
  "ellipse",
  "polygon",
  "path",
  "image",
  "text",
  "use",
];
var keys_of_interest = [
  "style",
  "transform",
  "translate",
  "rotate",
  "skewX",
  "skewY",
  "x",
  "dx",
  "dy",
  "y",
  "x1",
  "x2",
  "y1",
  "y2",
  "width",
  "height",
  "fill",
  "color",
  "opacity",
  "fill-opacity",
  "stroke",
  "stroke-width",
  "stroke-opacity",
  "font-size",
  "font-weight",
  "id",
  "text-anchor",
  "aria-label",
  "display",
  "matrix",
];
var referenceElements = [];

function groupSVGElementsByTypeWithCoordinates() {
  const tempDiv = document.getElementById("rbox1");

  const allElements = Array.from(tempDiv.querySelectorAll("*")).filter(
    // (element) => element.childElementCount === 0
    (element) =>
      graphicsElementTypes.includes(element.tagName) ||
      element.tagName === "tspan" // here we use all nodes other than leaf nodes because there are rare cases where <rect> is not a leaf node like the example in https://observablehq.com/@d3/diverging-bar-chart
  );

  const svgElement = tempDiv.querySelector("svg");
  const svgBBox = svgElement.getBoundingClientRect();

  allElements.forEach((element) => {
    // Get the bounding box for the element
    const bbox = element.getBoundingClientRect();

    const left = bbox.x - svgBBox.x;
    const top = bbox.y - svgBBox.y;
    const right = bbox.right - svgBBox.x;
    const bottom = bbox.bottom - svgBBox.y;

    let zeroWidth = element.attributes.width?.value === "0";
    let zeroHeight = element.attributes.height?.value === "0";
    if (!(zeroHeight && zeroWidth) && top > -4000 && left > -4000) {
      allGraphicsElement[element.id] = {
        left: left,
        top: top,
        right: right,
        bottom: bottom,
        height: bbox.height,
        width: bbox.width,
        id: element.id,
        tagName: element.tagName,
        content:
          element.tagName === "text" || element.tagName === "tspan"
            ? element.textContent.trim()
            : element.innerHTML.trim(), // TBD: need to get text content more accurately, e.g., in grouped bar chart 6 and stacked bar chart 3
        fill: element.attributes.fill
          ? element.attributes.fill.value
          : element.style.fill
          ? element.style.fill
          : getClosestAncestorStyle(element.id, "fill"),
        stroke: element.attributes.stroke? element.attributes.stroke.value : 
          element.style.stroke ? element.style.stroke : getClosestAncestorStyle(element.id, "stroke"),
        isReferenceElement: false,
        strokeWidth: element.attributes["stroke-width"]? element.attributes["stroke-width"].value : 
        element.style["stroke-width"] ? element.style["stroke-width"] : getClosestAncestorStyle(element.id, "stroke-width"),
      };
      if (Object.keys(groupedGraphicsElement).includes(element.tagName + "s"))
        groupedGraphicsElement[element.tagName + "s"].push({
          left: left,
          top: top,
          right: right,
          bottom: bottom,
          height: bbox.height,
          width: bbox.width,
          id: element.id,
          tagName: element.tagName,
          content:
            element.tagName === "text"
              ? element.textContent.trim()
              : element.innerHTML.trim(), // TBD: need to get text content more accurately, e.g., in grouped bar chart 6
          fill: element.attributes.fill
            ? element.attributes.fill.value
            : addStyleAttributesToElement(
                document.getElementById(element.id)
              ).getAttribute("fill"),
        });
      else
        groupedGraphicsElement[element.tagName + "s"] = [
          {
            left: left,
            top: top,
            right: right,
            bottom: bottom,
            height: bbox.height,
            width: bbox.width,
            id: element.id,
            tagName: element.tagName,
            content:
              element.tagName === "text"
                ? element.textContent.trim()
                : element.innerHTML.trim(), // TBD: need to get text content more accurately, e.g., in grouped bar chart 6
            fill: element.attributes.fill
              ? element.attributes.fill.value
              : element.style.fill
              ? element.style.fill
              : getClosestAncestorStyle(element.id, "fill"),
          },
        ];
    }
  });
  console.log(allGraphicsElement);
}

function getClosestAncestorStyle(elementID, style) {
  let element = document.getElementById(elementID);
  let parent = element.parentElement;
  while (parent.tagName !== "svg") {
    if (parent.attributes[style]) return parent.attributes[style].value;
    if (parent.style[style]) return parent.style[style];
    parent = parent.parentElement;
  }
  return "undefined";
}

function groupSVGElementsByType() {
  referenceElements = [
    ...(legend.labels ? legend.labels : []),
    ...(legend.marks ? legend.marks : []),
    ...Object.keys(axes)
      .map((key) => (axes[key].labels ? axes[key].labels : []))
      .flat(),
    ...Object.keys(axes)
      .map((key) => (axes[key].title ? axes[key].title : []))
      .flat(),
    ...Object.keys(axes)
      .map((key) =>
        axes[key].upperLevels ? axes[key].upperLevels.flat(Infinity) : []
      )
      .flat(),
    ...chartTitle,
    ...titleLegend,
  ]
    .filter((e) => e !== null)
    .map((element) => element.id);

  const tempDiv = document.getElementById("rbox1");

  // Get all leaf-node elements (elements whose tag is within basic elements or without child elements)
  const leafElements = Array.from(tempDiv.querySelectorAll("*")).filter(
    (element) =>
      ((element.childElementCount === 0 &&
        !graphicsElementTypes.includes(element.parentElement.tagName)) ||
        graphicsElementTypes.includes(element.tagName)) &&
      !referenceElements.includes(element.id)
  );

  // Group the elements by their element type
  const groupedElements = {};

  leafElements.forEach((element) => {
    const elementType = element.tagName;
    if (!groupedElements[elementType]) {
      groupedElements[elementType] = [];
    }
    let zeroWidth = element.attributes.width?.value === "0";
    let zeroHeight = element.attributes.height?.value === "0";

    if (!(zeroHeight && zeroWidth)) {
      groupedElements[elementType].push({
        element: addStyleAttributesToElement(element),
        id: element.id,
      });
    }
  });

  return groupedElements;
}

function addStyleAttributesToElement(svgElement) {
  // Check if the element has a style attribute
  if (svgElement.hasAttribute("style")) {
    // Get the style attribute value
    const styles = svgElement.getAttribute("style");

    // Split the styles into individual key-value pairs
    styles.split(";").forEach((style) => {
      // Split each style into key and value
      let [key, value] = style.split(":");

      // Trim whitespace and set the attribute on the element
      if (key && value) {
        key = key.trim();
        value = value.trim();
        try {
          svgElement.setAttribute(key, value);
        } catch (e) {
          // do nothing
        }
      }
    });

    // Optional: Remove the style attribute after parsing
    // svgElement.removeAttribute('style');
  }

  return svgElement;
}

function flattenSVG(svgString) {
  let parser = new DOMParser();
  let doc = parser.parseFromString(svgString, "text/xml");
  let nodeMap = {};
  style = {};
  let flatArray = tree_dict_not_nested(
    doc.getElementsByTagName("svg")[0],
    0,
    null,
    [],
    [0, 0],
    nodeMap
  );
  let groups = leaf_nodes_grouping(flatArray);
  let rects = groups["rect"];

  let temp = process_rects(rects);
  let rects_processed = temp[0],
    rectWith0WH = temp[1];
  let circles_processed = [];
  if ("circle" in groups) {
    circles_processed = process_circles(groups["circle"]);
  }

  let texts_processed = [];
  if ("text" in groups) {
    let texts = groups["text"];
    if ("tspan" in groups) texts = texts.concat(groups["tspan"]);
    texts_processed = process_texts(texts);
  }

  let lines_processed = [];
  if ("line" in groups) lines_processed = process_lines(groups["line"]);

  return {
    rects: rects_processed.concat(circles_processed),
    rectWith0WH: rectWith0WH,
    texts: texts_processed,
    lines: lines_processed,
    allNodes: flatArray,
  };
}

function leaf_nodes_grouping(flattened_svg_rep) {
  let groups = {};
  for (let element of flattened_svg_rep) {
    let key = element["tag"];
    if (key in groups) groups[key].push(element);
    else {
      groups[key] = [];
      groups[key].push(element);
    }
  }
  return groups;
}

function tree_dict_not_nested(
  node,
  level,
  parent,
  container,
  acc_transforms,
  nodeMap
) {
  let tag = extractTag(node);
  let thing = {};
  thing["tag"] = tag;
  thing["children"] = [];
  if (tag == "clipPath") return container;
  if (!(tag in nodeMap)) {
    thing["id"] = tag + "0";
    nodeMap[tag] = 1;
  } else {
    thing["id"] = tag + nodeMap[tag];
    nodeMap[tag] = nodeMap[tag] + 1;
  }
  if (parent != null) {
    thing["parent"] = parent["id"];
    container[container.indexOf(parent)]["children"].push(thing["id"]);
  } else {
    thing["parent"] = "canvas";
  }
  thing["level"] = level;
  thing = extract_features(thing, node, parent, acc_transforms);
  if ("display" in thing) {
    if (thing["display"] == "none") return container;
  }
  if ("transform" in thing) {
    let temp = thing["transform"].split(" ");
    let transform_dict = {};
    for (let pair of temp) {
      transform_dict[pair.split("(")[0]] = "(" + pair.split("(")[1];
    }
    let dxy = transform_dict["translate"].split(",");
    acc_transforms[0] = parseFloat(
      parseFloat(dxy[0].substring(1)).toPrecision(6)
    );
    acc_transforms[1] = parseFloat(
      parseFloat(dxy[1].split(")")[0]).toPrecision(6)
    );
  }
  if (tag == "text") {
    let c = node.outerHTML; //.decode("utf-8")
    let start = c.indexOf(">"),
      end = c.indexOf("<", start);
    thing["content"] = "";
    while (end != -1) {
      if (end != start + 1 && c.substring(start - 5, start) != "title") {
        thing["content"] = thing["content"] + c.substring(start + 1, end) + " ";
      }
      start = c.indexOf(">", end);
      end = c.indexOf("<", start);
    }
    if (thing["content"] == "") {
      // nodeMap[tag] = nodeMap[tag] - 1;
      // tbd: verify which examples are affected
      return container;
    }
  }

  if (node.children.length > 0 && thing["tag"] != "text") {
    //avoid parse too low-level to <tspan>
    container.push(thing);
    for (let i = 0; i < node.children.length; i++) {
      let child = node.children[i];
      tree_dict_not_nested(
        child,
        level + 1,
        thing,
        container,
        acc_transforms.map((d) => d),
        nodeMap
      );
    }
  } else {
    // if tag !='g':
    container.push(thing);
  }
  return container;
}

function extract_features(container, node, parent, sum_transforms) {
  if (container["tag"] == "style") {
    style = styleParser(node.textContent); //.decode("utf-8")
  }
  let attrs = getAttributeNames(node);
  if (Object.keys(style).length > 0) {
    if (attrs.indexOf("class") >= 0) {
      let thisClass = getAttributeValue(node, "class").trim();
      for (let oneClass of thisClass.split(" ")) {
        oneClass = "." + oneClass;
        if (oneClass in style) Object.assign(container, style[oneClass]);
      }
    }
    if (container["tag"] in style)
      Object.assign(container, style[container["tag"]]);
  }
  // if (container['tag']=='path' && attrs.indexOf('d') >= 0) {
  //     container = pathParser(container, node)
  // }
  // if (container['tag']=='polyline' && attrs.indexOf('points') >= 0) {
  //     container = polylineParser(container, node)
  // }
  if (parent) {
    // inheriting parent's attributes
    if (parent["tag"] == "g") {
      for (let pkey in parent) {
        if (
          keys_of_interest.indexOf(pkey) >= 0 &&
          pkey != "id" &&
          pkey != "class" &&
          pkey != "width" &&
          pkey != "height"
        )
          container[pkey] = parent[pkey];
      }
    }
  }
  let thisTransform = false;
  for (let key of keys_of_interest) {
    if (attrs.indexOf(key) >= 0) {
      if (key == "style") {
        let allStyles = getAttributeValue(node, key).split(";");
        let modifiedStyles = [];
        for (let pair of allStyles) modifiedStyles.push(pair.trim());
        let style_dict = {};
        for (let pair of modifiedStyles) {
          if (pair != "") {
            style_dict[pair.split(":")[0]] = pair.split(":")[1];
          }
        }
        for (let style_key in style_dict) {
          let this_key = style_key.trim();
          if (keys_of_interest.indexOf(this_key) >= 0) {
            container[this_key] = style_dict[style_key].trim();
          }
        }
        continue;
      }
      if (key == "transform") {
        let tranString = getAttributeValue(node, key);
        thisTransform = tranString == "";
        let indexOfTranslate = tranString.indexOf("translate");
        if (indexOfTranslate != -1) {
          let newString = tranString.substring(indexOfTranslate + 9);
          let indexOfRight = newString.indexOf(")");
          let indexOfLeft = newString.indexOf("(");
          let pair = newString.substring(indexOfLeft, indexOfRight + 1);
          // need to handle spaces in bewteen in the code below
          let dx, dy;
          if (pair.indexOf(",") >= 0) {
            let dxy = pair.split(",");
            dx = parseFloat(parseFloat(dxy[0].substring(1)).toPrecision(6));
            dy = parseFloat(parseFloat(dxy[1].split(")")[0]).toPrecision(6));
          } else {
            while (pair.length != 0 && (pair[0] == " " || pair[0] == "("))
              pair = pair.substring(1);
            while (
              pair.length != 0 &&
              (pair[pair.length - 1] == " " || pair[pair.length - 1] == ")")
            )
              pair = pair.substring(0, pair.length - 1);
            let dxy = pair.split(" ");
            dx = parseFloat(parseFloat(dxy[0]).toPrecision(6));
            if (dxy.length == 1) dy = 0.0;
            else
              dy = parseFloat(parseFloat(dxy[dxy.length - 1]).toPrecision(6));
          }
          container[key] =
            "translate(" +
            String(dx + sum_transforms[0]) +
            "," +
            String(dy + sum_transforms[1]) +
            ")";
          if (container["tag"] == "text") {
            container["selfDx"] = dx;
            container["selfDy"] = dy;
          }
        }
        indexOfMatrix = tranString.indexOf("matrix");
        if (indexOfMatrix != -1) {
          let newString = tranString.substring(indexOfMatrix + 6);
          let indexOfRight = newString.indexOf(")");
          let indexOfLeft = newString.indexOf("(");
          let pair = newString.substring(indexOfLeft + 1, indexOfRight);
          if (pair.indexOf(",") >= 0) {
            if ("matrix" in container)
              container["matrix"] = pair.split(",").concat(container["matrix"]);
            else container["matrix"] = pair.split(",");
          } else {
            if ("matrix" in container)
              container["matrix"] = pair.split(" ").concat(container["matrix"]);
            else container["matrix"] = pair.split(" ");
          }
        }

        if (tranString.indexOf("rotate") != -1) container["rotate"] = true;
        if (tranString.indexOf("scale") != -1) container["scale"] = true;
        if (tranString.indexOf("skewX") != -1) container["skewX"] = true;
        if (tranString.indexOf("skewY") != -1) container["skewY"] = true;
      } else if (key == "font-size") {
        let v = getAttributeValue(node, key).trim();
        if (v.endsWith("px"))
          container[key] = parseFloat(v.substring(0, v.length - 2));
        else if (v.endsWith("pt"))
          container[key] =
            parseFloat(v.substring(0, v.length - 2)) * 1.3281472327365;
        else if (v.endsWith("em"))
          container[key] = parseFloat(v.substring(0, v.length - 2)) * 16;
        else container[key] = parseFloat(v);
      } else if (
        (key == "dx" || key == "dy") &&
        getAttributeValue(node, key).trim().endsWith("em")
      ) {
        // think about this
        // container[key] = parent['font-size'] * float(node.attrib[key][0:-2])
        let v = getAttributeValue(node, key).trim();
        container[key] = String(16 * parseFloat(v.substring(0, v.length - 2)));
      } else if (key != "id") {
        container[key] = getAttributeValue(node, key).trim();
      }
    }
  }
  if ("fill-opacity" in container) {
    if (container["fill-opacity"] == "0" && "fill" in parent) {
      container["fill"] = parent["fill"];
      delete container["fill-opacity"];
    }
  }

  if (
    (attrs.indexOf("transform") < 0 || thisTransform) &&
    sum_transforms[0] != 0 &&
    sum_transforms[1] != 0
  )
    container["transform"] =
      "translate(" +
      String(sum_transforms[0]) +
      "," +
      String(sum_transforms[1]) +
      ")";
  return container;
}

function styleParser(styleStr) {
  let styleDic = {};
  let content = styleStr.trim().split("}");
  content = content.map((d) => d.trim());
  content.pop();
  for (let line of content) {
    let pair = line.split("{");
    if (pair.length == 1) continue;
    pair[0] = removeAllSpace(pair[0]);
    pair[1] = removeAllSpace(pair[1]);
    for (let eachStyle of pair[1].split(";")) {
      if (eachStyle == "") continue;
      let thisPair = eachStyle.split(":");
      if (thisPair.length == 1) continue;
      thisPair[0] = removeAllSpace(thisPair[0]);
      thisPair[1] = removeAllSpace(thisPair[1]);
      for (let targetElement of pair[0].split(",")) {
        if (!(targetElement in styleDic)) styleDic[targetElement] = {};
        styleDic[targetElement][thisPair[0]] = thisPair[1];
      }
    }
  }
  return styleDic;
}

// function polylineParser(container, node) {
//     let points = getAttributeValue(node, 'points').trim().split(" ")
//     points = points.filter(d => d!='');
//     if (points.length==2) {
//         container['tag'] = 'line'
//         container['x1'] = points[0].split(',')[0]
//         container['y1'] = points[0].split(',')[1]
//         container['x2'] = points[1].split(',')[0]
//         container['y2'] = points[1].split(',')[1]
//     }
//     return container
// }

// function pathParser(container, node) {
//     let allowed_operator = ['M', 'L', 'l', 'V', 'v', 'H', 'h', 'Z', 'z', 'A', 'a'];
//     let drawSeq = getAttributeValue(node, 'd');
//     let pointSeq = [], charseq = "";
//     let notCircle = drawSeq.indexOf('L') > 0 || drawSeq.indexOf('l') > 0 || drawSeq.indexOf('V') > 0 || drawSeq.indexOf('v') > 0 || drawSeq.indexOf('H') > 0 || drawSeq.indexOf('h') > 0;
//     for (let i = 0; i < drawSeq.length; i++) {
//         let char = drawSeq[i];
//         if (allowed_operator.indexOf(char) >= 0) {
//             charseq = charseq + char;
//             if (char=='Z' || char=='z') {
//                 if (pointSeq.length === 0) break;
//                 if (pointSeq[0][0] != pointSeq[pointSeq.length-1][0] || pointSeq[0][1] != pointSeq[pointSeq.length-1][1])
//                     pointSeq.push(pointSeq[0])
//                 if(pointSeq.length >= 2)
//                     if(Math.abs(pointSeq[pointSeq.length-1][0] - pointSeq[pointSeq.length-2][0]) <= 0.1 && Math.abs(pointSeq[pointSeq.length-1][1] - pointSeq[pointSeq.length-2][1]) <= 0.1) {
//                         // remove too close points
//                         pointSeq.splice(pointSeq.length - 2, 1)
//                     }
//             }
//             else {
//                 let j=i+1;
//                 while(/[^a-z]/i.test(drawSeq[j])) { //drawSeq[j] is not letter
//                     j=j+1
//                     if (j>=drawSeq.length)
//                         break
//                 }
//                 let shifts = drawSeq.substring(i+1,j).trim()
//                 let seperator = shifts.indexOf(',')
//                 if (char=='A' && !notCircle) {
//                     if (seperator > 0 && shifts.indexOf(' ')>0) //some cases have "a 0,0 0 0 1 0,0"
//                         continue
//                     let af;
//                     if (seperator!=-1) {
//                         af = shifts.split(',').filter(d => d!='');
//                     }
//                     else {
//                         af = shifts.split(' ').filter(d => d!='');
//                     }
//                     pointSeq.push([parseFloat(af[af.length-2]), parseFloat(af[af.length-1])]);
//                 } else if (char=='a' && !notCircle) {
//                     if (seperator > 0 && shifts.indexOf(' ')>0)  //some cases have "a 0,0 0 0 1 0,0"
//                         continue
//                     let previousX = pointSeq[pointSeq.length-1][0]
//                     let previousY = pointSeq[pointSeq.length-1][1]
//                     if (seperator!=-1) {
//                         let af = shifts.split(',').filter(d => d!='');
//                         pointSeq.push([previousX + parseFloat(af[af.length-2]), previousY + parseFloat(af[af.length-1])]);
//                     } else {
//                         let af = shifts.split(' ').filter(d => d!='');
//                         pointSeq.push([previousX + parseFloat(af[af.length-2]), previousY + parseFloat(af[af.length-1])]);
//                     }
//                 } else if (char=='M' || char=='L') {
//                     let af;
//                     if (seperator!=-1)
//                         af = shifts.split(',').filter(d => d!='');
//                     else
//                         af = shifts.split(' ').filter(d => d!='');
//                     pointSeq.push([parseFloat(af[0]), parseFloat(af[1])]);
//                     af.splice(0, 2);
//                     if (pointSeq.length>=2 && Math.abs(pointSeq[pointSeq.length-1][0] - pointSeq[pointSeq.length-2][0]) <=1 && Math.abs(pointSeq[pointSeq.length-1][1] - pointSeq[pointSeq.length-2][1]) <=1)
//                         pointSeq.pop()
//                     if (char == 'L' && af.length % 2 === 0 && af.length > 0) { // this is to handle the cases like d="M 942 86.8 L 942 109.2 944 109.2 944 86.8 Z" especially in Anychart Lib
//                         while (af.length > 0) {
//                             pointSeq.push([parseFloat(af[0]), parseFloat(af[1])]);
//                             af.splice(0, 2);
//                             if (pointSeq.length>=2 && Math.abs(pointSeq[pointSeq.length-1][0] - pointSeq[pointSeq.length-2][0]) <=1 && Math.abs(pointSeq[pointSeq.length-1][1] - pointSeq[pointSeq.length-2][1]) <=1)
//                                 pointSeq.pop()
//                         }
//                     }
//                 } else {
//                     let previousX = pointSeq[pointSeq.length-1][0]
//                     let previousY = pointSeq[pointSeq.length-1][1]
//                     if (char=='l') {
//                         let af;
//                         if (seperator!=-1)
//                             af = shifts.split(',').filter(d => d!='');
//                         else
//                             af = shifts.split(' ').filter(d => d!='');
//                         pointSeq.push([parseFloat(af[0])+previousX, parseFloat(af[1])+previousY]);
//                     } else if (char=='V') {
//                         pointSeq.push([previousX, parseFloat(shifts)]);
//                     } else if (char=='H') {
//                         pointSeq.push([parseFloat(shifts), previousY]);
//                     } else if (char=='v') {
//                         // if (parseFloat(shifts) !== 0)
//                         // tbd: here we cannot use this if otherwise 0hw-rects will be filtered out;
//                             pointSeq.push([previousX, previousY + parseFloat(shifts)]);
//                     } else if (char=='h') {
//                         // if (parseFloat(shifts) !== 0)
//                             pointSeq.push([previousX + parseFloat(shifts), previousY]);
//                     }
//                     // if (pointSeq.length>=2 && pointSeq[pointSeq.length-1][0] == pointSeq[pointSeq.length-2][0] && pointSeq[pointSeq.length-1][1] == pointSeq[pointSeq.length-2][1])
//                     //     pointSeq.pop()
//                 }
//             }
//         }
//     }

//     //then check whether the point seq forms a rect or a line
//     //haven't deal with all possible cases

//     if (pointSeq.length==5 && pointSeq[0][0]==pointSeq[pointSeq.length-1][0] && pointSeq[0][1]==pointSeq[pointSeq.length-1][1]) {
//         //just for now
//         let thisWidth = Math.max(...pointSeq.map(d => d[0])) - Math.min(...pointSeq.map(d => d[0]));
//         let thisHeight = Math.max(...pointSeq.map(d => d[1])) - Math.min(...pointSeq.map(d => d[1]));
//         container['tag'] = 'rect';
//         container['x'] = String(Math.min(...pointSeq.map(d => d[0])));
//         container['y'] = String(Math.min(...pointSeq.map(d => d[1])));
//         container['width'] = String(thisWidth);
//         container['height'] = String(thisHeight);
//     } else if (pointSeq.length==2) {
//         container['tag'] = 'line'
//         container['x1'] = String(pointSeq[0][0])
//         container['y1'] = String(pointSeq[0][1])
//         container['x2'] = String(pointSeq[1][0])
//         container['y2'] = String(pointSeq[1][1])
//     } else {
//         //below is for handling cases where using a rect-like shapes to represent axis lines
//         if (pointSeq.length == 3 && (charseq == "MAA" || charseq == "Maa")) {
//             if (pointSeq[0][0] == pointSeq[2][0] && pointSeq[0][1] == pointSeq[2][1]) {
//                 container['tag'] = 'circle'
//                 container['x'] = 0.5 * (pointSeq[0][0] + pointSeq[1][0])
//                 container['y'] = 0.5 * (pointSeq[0][1] + pointSeq[1][1])
//             }
//         } else if (pointSeq.length > 0) {
//             let thisWidth = Math.max(...pointSeq.map(d => d[0])) - Math.min(...pointSeq.map(d => d[0]))
//             let thisHeight = Math.max(...pointSeq.map(d => d[1])) - Math.min(...pointSeq.map(d => d[1]))
//             if (thisWidth<2) {
//                 container['tag'] = 'line'
//                 container['x1'] = String(Math.max(...pointSeq.map(d => d[0])))
//                 container['y1'] = String(Math.min(...pointSeq.map(d => d[1])))
//                 container['x2'] = String(Math.max(...pointSeq.map(d => d[0])))
//                 container['y2'] = String(Math.max(...pointSeq.map(d => d[1])))
//             }

//             if (thisHeight<2) {
//                 container['tag'] = 'line'
//                 container['x1'] = String(Math.min(...pointSeq.map(d => d[0])))
//                 container['y1'] = String(Math.min(...pointSeq.map(d => d[1])))
//                 container['x2'] = String(Math.max(...pointSeq.map(d => d[0])))
//                 container['y2'] = String(Math.min(...pointSeq.map(d => d[1])))
//             }
//         }
//     }

//     return container
// }

function extractTag(node) {
  if (node.tagName.indexOf("}") > 0) return node.tagName.split("}")[1];
  else return node.tagName;
}

function getAttributeNames(node) {
  let a = [];
  if (node.hasAttributes()) {
    for (let i = 0; i < node.attributes.length; i++) {
      a.push(node.attributes[i].name);
    }
  }
  return a;
}

function getAttributeValue(node, attr) {
  return node.attributes.getNamedItem(attr).value;
}

function removeAllSpace(str) {
  if (str == null || str === undefined) return "";
  let newStr = "";
  for (let s of str) {
    if (s != " " && s != "\n" && s != "\t") newStr = newStr + s;
  }
  return newStr;
}

function process_rects(Rects) {
  if (!Rects) return [[], []];
  let target = Rects;

  let processed = [],
    rectWith0WH = [];
  for (let rect of target) {
    if (!("width" in rect) || !("height" in rect)) continue;
    if (rect["width"].slice(-1) == "%")
      rect["width"] =
        parseFloat(rect["width"].substring(0, rect["width"].length - 1)) * 25;
    if (rect["height"].slice(-1) == "%")
      rect["height"] =
        parseFloat(rect["height"].substring(0, rect["height"].length - 1)) * 25;
    if (parseFloat(rect["width"]) <= 0 && parseFloat(rect["height"]) <= 0)
      continue;
    if (rect["id"].startsWith("path") && !("fill" in rect)) continue;
    // handle rgba and rgb cases
    if ("fill" in rect && rect["fill"].indexOf("url") === -1) {
      let rgba_a = 2,
        rgba;
      if (rect["fill"].indexOf("rgba") > -1) {
        rgba = rect["fill"].split(",");
        rgba_a = parseFloat(rgba[rgba.length - 1].split(")")[0]);
        if (rgba_a == 0.0) rect["fill"] = "none";
      }

      if (rect["fill"].indexOf("rgb") > -1 || (rgba_a <= 1 && rgba_a > 0)) {
        rgba = rect["fill"].split(",");
        let r = rgba[0].split("(")[1];
        let g = rgba[1];
        if (rgba[2].indexOf(")") > -1) b = rgba[2].split(")")[0];
        else b = rgba[2];
        if (
          (r.trim() == "100%" || r.trim() == "255") &&
          (g.trim() == "100%" || g.trim() == "255") &&
          (b.trim() == "100%" || b.trim() == "255")
        )
          rect["fill"] = "none";
        else
          rect["fill"] =
            rgba_a <= 1 && rgba_a > 0
              ? rgbaToHex(parseInt(r), parseInt(g), parseInt(b), rgba_a)
              : ConvertRGBtoHex(parseInt(r), parseInt(g), parseInt(b));
      }

      rect["fill"] = rect["fill"].startsWith("#")
        ? rect["fill"].toLowerCase()
        : rect["fill"];
    }

    let dx, dy;
    if ("transform" in rect) {
      let transform_dict = {},
        pairs = rect["transform"].split(" ");
      for (let pair of pairs) {
        if (pair != "") {
          transform_dict[pair.split("(")[0]] = "(" + pair.split("(")[1];
        }
      }
      let dxy = transform_dict["translate"].split(",");
      dx = parseFloat(parseFloat(dxy[0].substring(1)).toPrecision(6));
      dy = parseFloat(parseFloat(dxy[1].split(")")[0]).toPrecision(6));
    } else {
      // what if it has dx/dy attributes?
      dx = 0.0;
      dy = 0.0;
    }

    if (!("x" in rect)) rect["x"] = dx;
    else if ("transform" in rect) {
      if (rect["x"].endsWith("px"))
        rect["x"] = rect["x"].substring(0, rect["x"].length - 2);
      rect["x"] = parseFloat((parseFloat(rect["x"]) + dx).toPrecision(6));
    }

    if (!("y" in rect)) rect["y"] = dy;
    else if ("transform" in rect) {
      if (rect["y"].endsWith("px"))
        rect["y"] = rect["y"].substring(0, rect["y"].length - 2);
      rect["y"] = parseFloat((parseFloat(rect["y"]) + dy).toPrecision(6));
    }

    rect["x"] = parseFloat(parseFloat(rect["x"]).toPrecision(6));
    rect["y"] = parseFloat(parseFloat(rect["y"]).toPrecision(6));

    if ("matrix" in rect) {
      let tm = rect["matrix"];
      while (tm.length > 0) {
        let oldx = rect["x"];
        let oldy = rect["y"];
        rect["x"] =
          parseFloat(tm[0]) * oldx +
          parseFloat(tm[2]) * oldy +
          parseFloat(tm[4]);
        rect["y"] =
          parseFloat(tm[1]) * oldx +
          parseFloat(tm[3]) * oldy +
          parseFloat(tm[5]);
        tm = tm.slice(6);
      }
    }

    rect["width"] = parseFloat(parseFloat(rect["width"]).toPrecision(6));
    rect["height"] = parseFloat(parseFloat(rect["height"]).toPrecision(6));
    rect["right"] = parseFloat(
      parseFloat(rect["x"] + rect["width"]).toPrecision(6)
    );
    rect["bottom"] = parseFloat(
      parseFloat(rect["y"] + rect["height"]).toPrecision(6)
    );
    rect["center"] = parseFloat(
      parseFloat(rect["x"] + 0.5 * rect["width"]).toPrecision(6)
    );
    rect["middle"] = parseFloat(
      parseFloat(rect["y"] + 0.5 * rect["height"]).toPrecision(6)
    );
    delete rect["transform"];

    if (parseFloat(rect["width"]) == 0 || parseFloat(rect["height"]) == 0)
      rectWith0WH.push(rect);
    else processed.push(rect);
  }
  return [processed, rectWith0WH];
}

function process_circles(Texts) {
  let target = Texts;
  let processed = [];
  for (let text of target) {
    if ("dx" in text) {
      if (text["dx"].endsWith("px"))
        text["dx"] = text["dx"].substring(0, text["dx"].length - 2);
      text["dx"] = parseFloat(parseFloat(text["dx"]).toPrecision(6));
    } else text["dx"] = 0.0;
    if ("dy" in text) {
      if (text["dy"].endsWith("px"))
        text["dy"] = text["dy"].substring(0, text["dy"].length - 2);
      text["dy"] = parseFloat(parseFloat(text["dy"]).toPrecision(6));
    } else text["dy"] = 0.0;

    if ("transform" in text) {
      let transform_dict = {},
        pairs = text["transform"].split(" ");
      for (let pair of pairs) {
        if (pair != "") {
          transform_dict[pair.split("(")[0]] = "(" + pair.split("(")[1];
        }
      }
      let dxy = transform_dict["translate"].split(",");
      text["dx"] =
        text["dx"] + parseFloat(parseFloat(dxy[0].substring(1)).toPrecision(6));
      text["dy"] =
        text["dy"] +
        parseFloat(parseFloat(dxy[1].split(")")[0]).toPrecision(6));
    }

    if (!("x" in text)) text["x"] = text["dx"];
    else {
      // if (text['x'][-2:] == "px"):
      //     text['x'] = text['x'][0:-2]
      text["x"] = parseFloat(parseFloat(text["x"]).toPrecision(6)) + text["dx"];
    }

    if (!("y" in text)) text["y"] = text["dy"];
    else {
      // if (text['y'][-2:] == "px"):
      //     text['y'] = text['y'][0:-2]
      text["y"] = parseFloat(parseFloat(text["y"]).toPrecision(6)) + text["dy"];
    }

    if ("matrix" in text) {
      let tm = text["matrix"];
      while (tm.length > 0) {
        let oldx = text["x"];
        let oldy = text["y"];
        text["x"] =
          parseFloat(tm[0]) * oldx +
          parseFloat(tm[2]) * oldy +
          parseFloat(tm[4]);
        text["y"] =
          parseFloat(tm[1]) * oldx +
          parseFloat(tm[3]) * oldy +
          parseFloat(tm[5]);
        tm = tm.slice(6);
      }
    }

    text["radius"] = 20; // TBD: calculate the radius of circles

    processed.push(text);
  }

  return processed;
}

function process_texts(Texts) {
  let target = Texts;
  let processed = [];
  for (let text of target) {
    if (text["content"].trim() == "") continue;
    if ("dx" in text) {
      if (text["dx"].endsWith("px"))
        text["dx"] = text["dx"].substring(0, text["dx"].length - 2);
      text["dx"] = parseFloat(parseFloat(text["dx"]).toPrecision(6));
    } else text["dx"] = 0.0;
    if ("dy" in text) {
      if (text["dy"].endsWith("px"))
        text["dy"] = text["dy"].substring(0, text["dy"].length - 2);
      text["dy"] = parseFloat(parseFloat(text["dy"]).toPrecision(6));
    } else text["dy"] = 0.0;

    if ("selfDx" in text) text["selfDx"] += text["dx"];
    else text["selfDx"] = text["dx"];
    if ("selfDy" in text) text["selfDy"] += text["dy"];
    else text["selfDy"] = text["dy"];

    if ("transform" in text) {
      let transform_dict = {},
        pairs = text["transform"].split(" ");
      for (let pair of pairs) {
        if (pair != "") {
          transform_dict[pair.split("(")[0]] = "(" + pair.split("(")[1];
        }
      }
      let dxy = transform_dict["translate"].split(",");
      text["dx"] =
        text["dx"] + parseFloat(parseFloat(dxy[0].substring(1)).toPrecision(6));
      text["dy"] =
        text["dy"] +
        parseFloat(parseFloat(dxy[1].split(")")[0]).toPrecision(6));
    }

    if (!("x" in text)) text["x"] = text["dx"];
    else {
      if (text["x"].endsWith("px"))
        text["x"] = text["x"].substring(0, text["x"].length - 2);
      text["x"] = parseFloat(parseFloat(text["x"]).toPrecision(6)) + text["dx"];
    }

    if (!("y" in text)) text["y"] = text["dy"];
    else {
      if (text["y"].endsWith("px"))
        text["y"] = text["y"].substring(0, text["y"].length - 2);
      text["y"] = parseFloat(parseFloat(text["y"]).toPrecision(6)) + text["dy"];
    }

    if ("matrix" in text) {
      let tm = text["matrix"];
      while (tm.length > 0) {
        let oldx = text["x"];
        let oldy = text["y"];
        text["x"] =
          parseFloat(tm[0]) * oldx +
          parseFloat(tm[2]) * oldy +
          parseFloat(tm[4]);
        text["y"] =
          parseFloat(tm[1]) * oldx +
          parseFloat(tm[3]) * oldy +
          parseFloat(tm[5]);
        tm = tm.slice(6);
      }
    }

    processed.push(text);
  }

  return processed;
}

function process_lines(Lines) {
  let target = Lines;
  let processed = [];
  for (let text of target) {
    if ("transform" in text) {
      let transform_dict = {},
        pairs = text["transform"].split(" ");
      for (let pair of pairs) {
        if (pair != "") {
          transform_dict[pair.split("(")[0]] = "(" + pair.split("(")[1];
        }
      }
      let dxy = transform_dict["translate"].split(",");
      text["dx"] = parseFloat(parseFloat(dxy[0].substring(1)).toPrecision(6));
      text["dy"] = parseFloat(parseFloat(dxy[1].split(")")[0]).toPrecision(6));
    } else {
      if ("dx" in text) {
        if (text["dx"].endsWith("px"))
          text["dx"] = text["dx"].substring(0, text["dx"].length - 2);
        text["dx"] = parseFloat(parseFloat(text["dx"]).toPrecision(6));
      } else text["dx"] = 0.0;
      if ("dy" in text) {
        if (text["dy"].endsWith("px"))
          text["dy"] = text["dy"].substring(0, text["dy"].length - 2);
        text["dy"] = parseFloat(parseFloat(text["dy"]).toPrecision(6));
      } else text["dy"] = 0.0;
    }

    if (!("x1" in text)) text["x1"] = "0";
    if (!("x2" in text)) text["x2"] = "0";
    if (!("y1" in text)) text["y1"] = "0";
    if (!("y2" in text)) text["y2"] = "0";

    if (text["x1"].endsWith("px"))
      text["x1"] = text["x1"].substring(0, text["x1"].length - 2);
    if (text["x2"].endsWith("px"))
      text["x2"] = text["x2"].substring(0, text["x2"].length - 2);
    if (text["y1"].endsWith("px"))
      text["y1"] = text["y1"].substring(0, text["y1"].length - 2);
    if (text["y2"].endsWith("px"))
      text["y2"] = text["y2"].substring(0, text["y2"].length - 2);

    text["y1"] = parseFloat(parseFloat(text["y1"]).toPrecision(6)) + text["dy"];
    text["y2"] = parseFloat(parseFloat(text["y2"]).toPrecision(6)) + text["dy"];
    text["x1"] = parseFloat(parseFloat(text["x1"]).toPrecision(6)) + text["dx"];
    text["x2"] = parseFloat(parseFloat(text["x2"]).toPrecision(6)) + text["dx"];

    if ("matrix" in text) {
      let tm = text["matrix"];
      while (tm.length > 0) {
        let oldx1 = text["x1"];
        let oldy1 = text["y1"];
        text["x1"] =
          parseFloat(tm[0]) * oldx1 +
          parseFloat(tm[2]) * oldy1 +
          parseFloat(tm[4]);
        text["y1"] =
          parseFloat(tm[1]) * oldx1 +
          parseFloat(tm[3]) * oldy1 +
          parseFloat(tm[5]);
        let oldx2 = text["x2"];
        let oldy2 = text["y2"];
        text["x2"] =
          parseFloat(tm[0]) * oldx2 +
          parseFloat(tm[2]) * oldy2 +
          parseFloat(tm[4]);
        text["y2"] =
          parseFloat(tm[1]) * oldx2 +
          parseFloat(tm[3]) * oldy2 +
          parseFloat(tm[5]);
        tm = tm.slice(6);
      }
    }

    if (text["y1"] == text["y2"] && text["x1"] == text["x2"]) continue;
    processed.push(text);
  }

  return processed;
}
