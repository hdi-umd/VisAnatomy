/**
 * Annotation saving functions
 */

/**
 * Prepare annotations for saving by:
 * - Marking reference elements
 * - Restoring original coordinates
 * - Removing runtime properties
 * - Converting object arrays to ID arrays
 * Returns the prepared VA.annotations object
 */
function prepareAnnotationsForSaving() {
  // Mark reference elements
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
  
  // Restore original coordinates and remove runtime properties
  const elementsToSave = {};
  for (const [id, element] of Object.entries(VA.allElements)) {
    elementsToSave[id] = { ...element };
    
    if (element.originalValues) {
      ['left', 'top', 'right', 'bottom', 'height', 'width'].forEach(prop => {
        if (element.originalValues[prop] !== undefined) {
          elementsToSave[id][prop] = element.originalValues[prop];
        }
      });
      delete elementsToSave[id].originalValues;
    }
  }
  
  VA.annotations.allElements = elementsToSave;
  VA.annotations.chartTitle =
    VA.chartTitle.filter((e) => e !== null).length > 0
      ? VA.chartTitle.map((title) => typeof title === "string" ? title : title.id)
      : Object.keys(VA.allElements).filter(
        (mark) => VA.allElements[mark].role === "Chart Title"
      );
  VA.annotations.grouping = VA.grouping;
  VA.annotations.encodingInfo = VA.objectEncodings;
  VA.annotations.mappings = VA.mappings;
  VA.annotations.referenceElements = {};

  let polylines = Object.keys(VA.allElements).filter(
    (mark) => VA.allElements[mark].role === "Main Chart Mark" && VA.allElements[mark].type === "Polyline"
  );
  for (let pl of polylines) {
    let d = VA.annotations.allElements[pl].d;
    if (d) {
      VA.annotations.allElements[pl].numVertices = getNumVertices(d);
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
    
    ["labels", "title", "ticks", "path"].forEach(field => {
      if (savedAxis[field] && Array.isArray(savedAxis[field])) {
        savedAxis[field] = savedAxis[field].map(item => 
          typeof item === "string" ? item : item.id
        );
      }
    });
    
    if (savedAxis.upperLevels && Array.isArray(savedAxis.upperLevels)) {
      savedAxis.upperLevels = savedAxis.upperLevels.map(level =>
        Array.isArray(level) 
          ? level.map(item => typeof item === "string" ? item : item.id)
          : (typeof level === "string" ? level : level.id)
      );
    }
    
    return savedAxis;
  });

  // Complete legend elements
  VA.legend.title =
    VA.titleLegend.length > 0
      ? VA.titleLegend.map((title) => typeof title === "string" ? title : title.id)
      : Object.keys(VA.allElements)
        .filter((mark) => VA.allElements[mark].role === "Legend Title");
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
  VA.annotations.referenceElements["legend"] = VA.legend;
  delete VA.annotations.contentMarks;
  
  return VA.annotations;
}

/**
 * Batch re-save all annotations 
 * Call this function from browser console to process all files automatically
 */
async function saveAllAnnotations() {
  // Fetch the batch process list
  const response = await fetch("/batch_process_list.json");
  const data = await response.json();
  const charts = data.charts;
  
  console.log(`Processing ${charts.length} charts...`);
  
  for (let i = 0; i < charts.length; i++) {
    const chartId = charts[i];
    console.log(`\n[${i+1}/${charts.length}] Processing ${chartId}...`);
    
    try {
      // Load the annotation file
      const annotationResponse = await fetch("/annotations/" + chartId + ".json");
      const annotations = await annotationResponse.json();
      
      if (!annotations) {
        console.warn(`No annotations found for ${chartId}`);
        continue;
      }
      
      // Process through the loading pipeline
      loadMarks(annotations);
      loadRefElements(annotations);
      loadGroups(annotations);
      loadLayouts(annotations);
      loadEncodings(annotations);
      loadConstraints(annotations);
      loadTitles(annotations);
      resolveElementReferences();
      
      // Set chart name for saving
      sessionStorage.setItem("fileName", chartId);
      
      // Prepare annotations for saving (shared logic)
      const preparedAnnotations = prepareAnnotationsForSaving();
      
      // Save to server
      const saveResponse = await fetch("/save_annotations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chart: chartId,
          annotations: preparedAnnotations
        })
      });
      
      await saveResponse.text();
      console.log(`✓ Saved ${chartId}`);
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 50));
      
    } catch (err) {
      console.error(`✗ Failed to process ${chartId}:`, err);
    }
  }
  
  console.log("\n✓ Batch processing complete!");
}

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
  
  // Prepare annotations using shared logic
  const preparedAnnotations = prepareAnnotationsForSaving();

  data["chart"] = sessionStorage.getItem("fileName");
  data["annotations"] = preparedAnnotations;
  xhr.send(JSON.stringify(data));
}
