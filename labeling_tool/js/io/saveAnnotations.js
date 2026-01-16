/**
 * Annotation saving functions
 */

// function saveAllAnnotations() {
//   const chartItems = document.querySelectorAll(".demoItem");

//   chartItems.forEach(async (item) => {
//     const chartId = item.id;

//     // Load annotation file
//     await fetch("/annotations/" + chartId + ".json")
//       .then((res) => res.json())
//       .then((json) => {
//         const annotations = json.annotations;
//         if (!annotations) {
//           console.warn(`No annotations found for ${chartId}`);
//           return;
//         }

//         fetch("/save_annotations", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify({
//             chart: chartId,
//             annotations: annotations
//           })
//         })
//           .then((res) => res.json())
//           .then((result) =>
//             console.log(`Saved & restructured ${chartId}:`, result)
//           )
//           .catch((err) =>
//             console.error(`Failed to restructure ${chartId}:`, err)
//           );
//       })
//       .catch((err) => console.warn("Error fetching annotations:", err));
//   });

//   xhr.onreadystatechange = function () {
//     if (xhr.readyState === 4) {
//       if (xhr.status >= 200 && xhr.status < 300) {
//         const alertBox = document.getElementById("alertBox");
//         alertBox.textContent = `Annotations saved to 'annotations / ${sessionStorage.getItem(
//           "fileName"
//         )}.json'!`;
//         alertBox.style.visibility = "visible";
//         alertBox.style.opacity = "1";

//         // Hide the alert box after 3 seconds
//         setTimeout(function () {
//           alertBox.style.visibility = "hidden";
//           alertBox.style.opacity = "0";
//         }, 3000);
//         console.log(xhr.responseText);
//       } else {
//         console.error("Error: " + xhr.status);
//         alertBox.textContent =
//           "Error: '" + xhr.status + "' occurred while saving the annotations";
//         alertBox.style.visibility = "visible";
//         alertBox.style.opacity = "1";
//       }
//     }
//   };
// }

function post() {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/save_annotations");
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

  [
    VA.legend.marks,
    VA.legend.labels,
    VA.legend.title,
    ...VA.axes.map((axis) => (axis && axis.labels ? axis.labels : [])),
    ...VA.axes.map((axis) => (axis && axis.title ? axis.title : [])),
  ]
    .filter((e) => e?.length > 0)
    .forEach((object) => {
      object.forEach((element) => {
        switch (typeof element) {
          case "string":
            VA.allElements[element].isReferenceElement = true;
            break;
          case "object":
            VA.allElements[element.id].isReferenceElement = true;
            break;
        }
      });
    });
  //// TBD: handle higher level labels using new axes?
  // if (xAxis.upperLevels) {
  //   xAxis.upperLevels.forEach((level) => {
  //     level.forEach((element) => {
  //       allGraphicsElement[element.id].isReferenceElement = true;
  //     });
  //   });
  // }
  // if (yAxis.upperLevels) {
  //   yAxis.upperLevels.forEach((level) => {
  //     level.forEach((element) => {
  //       allGraphicsElement[element.id].isReferenceElement = true;
  //     });
  //   });
  // }
  VA.annotations.allElements = VA.allElements;
  VA.annotations.chartTitle =
    VA.chartTitle.filter((e) => e !== null).length > 0
      ? VA.chartTitle.map((title) => VA.allElements[title.id])
      : Object.keys(VA.markInfo).filter(
        (mark) => VA.markInfo[mark].Role === "Chart Title"
      );
  VA.annotations.markInfo = VA.markInfo;
  
  // Store hierarchical grouping structure directly
  VA.annotations.grouping = VA.grouping;
  
  VA.annotations.encodingInfo = VA.objectEncodings;
  VA.annotations.textObjectLinking = VA.textObjectLinking;
  VA.annotations.referenceElements = {};

  let polylines = Object.keys(VA.allElements).filter(
    (mark) => VA.allElements[mark].role === "Main Chart Mark" && VA.allElements[mark].type === "Polyline"
  );
  for (let pl of polylines) {
    let d = VA.annotations.allGraphicsElement[pl].d;
    if (d) {
      VA.annotations.allGraphicsElement[pl].numVertices = getNumVertices(d);
    }
  }

  VA.annotations.referenceElements["xGridlines"] = Object.keys(VA.allElements).filter(
    (mark) => VA.allElements[mark].role === "Horizontal Gridline"
  );
  VA.annotations.referenceElements["yGridlines"] = Object.keys(VA.allElements).filter(
    (mark) => VA.allElements[mark].role === "Vertical Gridline"
  );

  // Save the axes, converting labels/title/ticks/path arrays back to IDs
  VA.annotations.referenceElements["axes"] = VA.axes.map(axis => {
    const savedAxis = { ...axis };
    
    // Convert arrays of objects back to arrays of IDs
    ["labels", "title", "ticks", "path"].forEach(field => {
      if (savedAxis[field] && Array.isArray(savedAxis[field])) {
        savedAxis[field] = savedAxis[field].map(item => 
          typeof item === "string" ? item : item.id
        );
      }
    });
    
    // Handle upperLevels if it exists (nested arrays)
    if (savedAxis.upperLevels && Array.isArray(savedAxis.upperLevels)) {
      savedAxis.upperLevels = savedAxis.upperLevels.map(level =>
        Array.isArray(level) 
          ? level.map(item => typeof item === "string" ? item : item.id)
          : (typeof level === "string" ? level : level.id)
      );
    }
    
    return savedAxis;
  });

  // // complete x axis elements
  // xAxis.path = Object.keys(markInfo).filter(
  //   (mark) => markInfo[mark].Role === "X Axis Line"
  // );
  // xAxis.ticks = Object.keys(markInfo).filter(
  //   (mark) => markInfo[mark].Role === "X Axis Tick"
  // );
  // xAxis.title =
  //   VA.titleXaxis.length > 0
  //     ? VA.titleXaxis.map((title) => allGraphicsElement[title.id])
  //     : Object.keys(markInfo)
  //         .filter((mark) => markInfo[mark].Role === "X Axis Title")
  //         .map((title) => allGraphicsElement[title]);
  // xAxis.labels =
  //   xAxis.labels.length > 0
  //     ? xAxis.labels.map((label) => allGraphicsElement[label.id])
  //     : Object.keys(markInfo)
  //         .filter((mark) => markInfo[mark].Role === "X Axis Label")
  //         .map((label) => allGraphicsElement[label]);
  // xAxis.fieldType = d3.select("#xFieldType").property("value");
  // if (xAxis.upperLevels) {
  //   let newUpperLevels = [];
  //   xAxis.upperLevels.forEach((level) => {
  //     newUpperLevels.push(level.map((label) => allGraphicsElement[label.id]));
  //   });
  //   xAxis.upperLevels = newUpperLevels;
  // }
  // annotations.referenceElements["xAxis"] = xAxis;

  // // complete y axis elements
  // yAxis.path = Object.keys(markInfo).filter(
  //   (mark) => markInfo[mark].Role === "Y Axis Line"
  // );
  // yAxis.ticks = Object.keys(markInfo).filter(
  //   (mark) => markInfo[mark].Role === "Y Axis Tick"
  // );
  // yAxis.title =
  //   VA.titleYaxis.length > 0
  //     ? VA.titleYaxis.map((title) => allGraphicsElement[title.id])
  //     : Object.keys(markInfo)
  //         .filter((mark) => markInfo[mark].Role === "Y Axis Title")
  //         .map((title) => allGraphicsElement[title]);
  // yAxis.labels =
  //   yAxis.labels.length > 0
  //     ? yAxis.labels.map((label) => allGraphicsElement[label.id])
  //     : Object.keys(markInfo)
  //         .filter((mark) => markInfo[mark].Role === "Y Axis Label")
  //         .map((label) => allGraphicsElement[label]);
  // yAxis.fieldType = d3.select("#yFieldType").property("value");
  // if (yAxis.upperLevels) {
  //   let newUpperLevels = [];
  //   yAxis.upperLevels.forEach((level) => {
  //     newUpperLevels.push(level.map((label) => allGraphicsElement[label.id]));
  //   });
  //   yAxis.upperLevels = newUpperLevels;
  // }
  // annotations.referenceElements["yAxis"] = yAxis;

  // complete legend elements
  VA.legend.title =
    VA.titleLegend.length > 0
      ? VA.titleLegend.map((title) => typeof title === "string" ? title : title.id)
      : Object.keys(VA.allElements)
        .filter((mark) => VA.allElements[mark].role === "Legend Title");
  // TBD: need to keep an eye on the legend info when annotating
  VA.legend.ticks = Object.keys(VA.allElements).filter(
    (mark) => VA.allElements[mark].role === "Legend Tick"
  );
  VA.legend.marks =
    VA.legend.marks.length === 0
      ? Object.keys(VA.allElements)
        .filter((mark) => VA.allElements[mark].role === "Legend Mark")
      : VA.legend.marks.map((mark) => typeof mark === "string" ? mark : mark.id);
  VA.legend.labels =
    VA.legend.labels.length === 0
      ? Object.keys(VA.allElements)
        .filter((mark) => VA.allElements[mark].role === "Legend Label")
      : VA.legend.labels.map((label) => typeof label === "string" ? label : label.id);
  // VA.legend.marks = VA.legend.marks.push(
  //   ...Object.keys(markInfo)
  //     .filter((mark) => markInfo[mark].Role === "Legend Mark")
  //     .map((mark) => allGraphicsElement[mark])
  // );
  // VA.legend.marks = VA.legend.marks.filter(onlyUnique);
  // VA.legend.labels = VA.legend.labels.push(
  //   ...Object.keys(markInfo)
  //     .filter((mark) => markInfo[mark].Role === "Legend Label")
  //     .map((mark) => allGraphicsElement[mark])
  // );
  // VA.legend.labels = VA.legend.labels.filter(onlyUnique);
  VA.annotations.referenceElements["legend"] = VA.legend;
  delete VA.annotations.contentMarks;

  data["chart"] = sessionStorage.getItem("fileName");
  data["annotations"] = VA.annotations;
  xhr.send(JSON.stringify(data));
}
