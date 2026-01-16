/**
 * Annotation saving functions
 */

function saveAllAnnotations() {
  const chartItems = document.querySelectorAll(".demoItem");

  chartItems.forEach(async (item) => {
    const chartId = item.id;

    // Load annotation file
    await fetch("/annotations/" + chartId + ".json")
      .then((res) => res.json())
      .then((json) => {
        const annotations = json.annotations;
        if (!annotations) {
          console.warn(`No annotations found for ${chartId}`);
          return;
        }

        fetch("/save_and_restructure", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chart: chartId,
            annotations: annotations
          })
        })
          .then((res) => res.json())
          .then((result) =>
            console.log(`Saved & restructured ${chartId}:`, result)
          )
          .catch((err) =>
            console.error(`Failed to restructure ${chartId}:`, err)
          );
      })
      .catch((err) => console.warn("Error fetching annotations:", err));
  });

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
}

function post() {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/save_and_restructure");
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
    ...Object.keys(VA.axes).map((k) => (VA.axes[k].labels ? VA.axes[k].labels : [])),
    ...Object.keys(VA.axes).map((k) => (VA.axes[k].title ? VA.axes[k].title : [])),
  ]
    .filter((e) => e?.length > 0)
    .forEach((object) => {
      object.forEach((element) => {
        switch (typeof element) {
          case "string":
            VA.allGraphicsElement[element].isReferenceElement = true;
            break;
          case "object":
            VA.allGraphicsElement[element.id].isReferenceElement = true;
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
  VA.annotations.allGraphicsElement = VA.allGraphicsElement;
  VA.annotations.groupedGraphicsElement = VA.groupedGraphicsElement;
  VA.annotations.chartTitle =
    VA.chartTitle.filter((e) => e !== null).length > 0
      ? VA.chartTitle.map((title) => VA.allGraphicsElement[title.id])
      : Object.keys(VA.markInfo).filter(
        (mark) => VA.markInfo[mark].Role === "Chart Title"
      );
  VA.annotations.markInfo = VA.markInfo;
  VA.annotations.groupInfo = VA.grouping.groups;
  VA.annotations.nestedGrouping = VA.grouping.structure ? [VA.grouping.structure] : [];
  VA.annotations.layoutInfo = VA.grouping.layouts;
  VA.annotations.encodingInfo = VA.objectEncodings;
  VA.annotations.textObjectLinking = VA.textObjectLinking;
  VA.annotations.referenceElement = {};

  let polylines = Object.keys(VA.markInfo).filter(
    (mark) => VA.markInfo[mark].Role === "Main Chart Mark" && VA.markInfo[mark].Type === "Polyline"
  );
  for (let pl of polylines) {
    let d = VA.annotations.allGraphicsElement[pl].d;
    if (d) {
      VA.annotations.allGraphicsElement[pl].numVertices = getNumVertices(d);
    }
  }

  VA.annotations.referenceElement["xGridlines"] = Object.keys(VA.markInfo).filter(
    (mark) => VA.markInfo[mark].Role === "Horizontal Gridline"
  );
  VA.annotations.referenceElement["yGridlines"] = Object.keys(VA.markInfo).filter(
    (mark) => VA.markInfo[mark].Role === "Vertical Gridline"
  );

  // save the axes
  VA.annotations.referenceElement["axes"] = VA.axes;

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
  // annotations.referenceElement["xAxis"] = xAxis;

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
  // annotations.referenceElement["yAxis"] = yAxis;

  // complete legend elements
  VA.legend.title =
    VA.titleLegend.length > 0
      ? VA.titleLegend.map((title) => VA.allGraphicsElement[title.id])
      : Object.keys(VA.markInfo)
        .filter((mark) => VA.markInfo[mark].Role === "Legend Title")
        .map((title) => VA.allGraphicsElement[title]);
  // TBD: need to keep an eye on the legend info when annotating
  VA.legend.ticks = Object.keys(VA.markInfo).filter(
    (mark) => VA.markInfo[mark].Role === "Legend Tick"
  );
  VA.legend.marks =
    VA.legend.marks.length === 0
      ? Object.keys(VA.markInfo)
        .filter((mark) => VA.markInfo[mark].Role === "Legend Mark")
        .map((mark) => VA.allGraphicsElement[mark])
      : VA.legend.marks.map((mark) => VA.allGraphicsElement[mark.id]);
  VA.legend.labels =
    VA.legend.labels.length === 0
      ? Object.keys(VA.markInfo)
        .filter((mark) => VA.markInfo[mark].Role === "Legend Label")
        .map((mark) => VA.allGraphicsElement[mark])
      : VA.legend.labels.map((label) => VA.allGraphicsElement[label.id]);
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
  VA.annotations.referenceElement["legend"] = VA.legend;
  delete VA.annotations.contentMarks;

  data["chart"] = sessionStorage.getItem("fileName");
  data["annotations"] = VA.annotations;
  xhr.send(JSON.stringify(data));
}
