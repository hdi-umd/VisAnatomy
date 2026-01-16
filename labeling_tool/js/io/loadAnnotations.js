function tryLoadAnnotations(filename) {
  // filename = sessionStorage.getItem("fileName");
  console.log("loading from: " + filename);

  // remove axes whose id is more than 3
  for (let thisIndex = 1; thisIndex <= 20; thisIndex++) {
    d3.select("#axis_" + thisIndex).remove();
  }
  axisCount = 0;

  fetch("../annotations/" + filename + ".json")
    .then((response) => {
      if (!response.ok) {
        console.log("no annotation file found");
        // throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then((annotations) => {
      console.log("annotations loading");
      this.users = annotations;
      VA.annotationLoaded = true;

      // Load different annotation components
      loadMarks(annotations);
      loadRefElements(annotations);
      loadGroups(annotations);
      loadLayouts(annotations);
      loadEncodings(annotations);
      loadConstraints(annotations);
      loadTitles(annotations);
      
      // Resolve element ID references to full objects
      resolveElementReferences();
      
      // Display loaded elements in UI
      displayLoadedAxes();
      displayLegend(VA.legend);
      displayTitles(VA.chartTitle, VA.titleLegend);
    })
    .catch(function () {
      this.dataError = true;
    });

  return new Promise((resolve, reject) => {
    // Simulate an asynchronous operation, e.g., fetching annotations from a server
    setTimeout(() => {
      // Load annotations and set annotationLoaded flag
      ifLoaded = VA.annotationLoaded; // or false based on the result of loading annotations
      resolve();
    }, 100); // Simulate a 0.1-second delay
  });
}

/**
 * Load reference elements (axes, legend, gridlines) from annotations
 */
function loadRefElements(annotations) {
  // Load all axes, not just x/y
  VA.axes = {};
  if (
    annotations.referenceElements &&
    Array.isArray(annotations.referenceElements.axes)
  ) {
    annotations.referenceElements.axes.forEach((axis, i) => {
      VA.axes[i + 1] = axis;
      VA.axes[i + 1].type = axis.type || axis.channel || "x";
      // Map attrType to fieldType if needed
      if (axis.attrType && !axis.fieldType) {
        VA.axes[i + 1].fieldType = axis.attrType;
      }
      console.log(`Loaded axis ${i + 1}:`, VA.axes[i + 1]);
    });
  }

  VA.legend = annotations.referenceElements && annotations.referenceElements.legend
    ? annotations.referenceElements.legend
    : {};

  VA.xGridlines =
    annotations.referenceElements &&
      annotations.referenceElements.gridlines &&
      annotations.referenceElements.gridlines.x
      ? annotations.referenceElements.gridlines.x
      : [];

  VA.yGridlines =
    annotations.referenceElements &&
      annotations.referenceElements.gridlines &&
      annotations.referenceElements.gridlines.y
      ? annotations.referenceElements.gridlines.y
      : [];
}

/**
 * Load mark information from all elements
 */
function loadMarks(annotations) {
  VA.allGraphicsElement = annotations.allElements ? annotations.allElements : {};
  VA.groupedGraphicsElement = {};

  VA.markInfo = {};
  Object.keys(VA.allGraphicsElement).forEach((id) => {
    const element = VA.allGraphicsElement[id];
    VA.markInfo[id] = {
      Type: element.type || "none",
      Role: element.role || "none"
    };
  });
}

/**
 * Load group annotations and nested grouping structure
 */
function loadGroups(annotations) {
  // Store hierarchical grouping structure directly
  VA.grouping = annotations.grouping || [];
}

/**
 * Load layout information for groups
 * Note: Layouts are embedded in the grouping structure, so this is a no-op now.
 * Kept for backward compatibility with old annotation files that have separate layoutInfo.
 */
function loadLayouts(annotations) {
  // For backward compatibility: if old files have separate layoutInfo, merge it into grouping
  if (annotations.layoutInfo && Object.keys(annotations.layoutInfo).length > 0) {
    console.warn("Loading legacy layoutInfo - consider updating annotation file format");
    // Would need to match layouts to groups by index - skip for now
  }
}

/**
 * Load encoding information for objects
 */
function loadEncodings(annotations) {
  VA.objectEncodings = annotations.encodingInfo ? annotations.encodingInfo : {};
}

/**
 * Load text-object linking constraints
 */
function loadConstraints(annotations) {
  VA.textObjectLinking = annotations.textObjectLinking ? annotations.textObjectLinking : {};
}

/**
 * Load chart titles and convert element IDs to full objects
 */
function loadTitles(annotations) {
  VA.chartTitle = Array.isArray(annotations.chartTitle) ? annotations.chartTitle : [];
  console.log("chartTitle: ", VA.chartTitle);

  VA.titleLegend = VA.legend.title ? VA.legend.title : [];
  if (VA.titleLegend.length > 0 && typeof VA.titleLegend[0] === "string") {
    VA.titleLegend = VA.titleLegend.map(id => VA.allGraphicsElement[id]).filter(Boolean);
  }
}

/**
 * Convert element ID references to full element objects for reference elements
 */
function resolveElementReferences() {
  // legend fields
  ["labels", "marks", "title", "ticks"].forEach((field) => {
    if (VA.legend[field] && VA.legend[field].length > 0 && typeof VA.legend[field][0] === "string") {
      VA.legend[field] = VA.legend[field].map(id => VA.allGraphicsElement[id]).filter(Boolean);
    }
  });

  // axes fields
  Object.keys(VA.axes).forEach((k) => {
    let axis = VA.axes[k];
    ["labels", "title", "ticks", "path"].forEach((field) => {
      if (axis[field] && axis[field].length > 0 && typeof axis[field][0] === "string") {
        axis[field] = axis[field].map(id => VA.allGraphicsElement[id]).filter(Boolean);
      }
    });
  });
}

/**
 * Display loaded axes in the UI
 */
function displayLoadedAxes() {
  Object.keys(VA.axes).forEach((k) => {
    let index = parseInt(k);
    console.log("loading axis", index, VA.axes[index]);
    // Ensure the axis div exists before trying to display it
    if (!document.getElementById(`axis_${index}`)) {
      // Set axisCount to match the index we need
      axisCount = index - 1;
      addAxisConfiguration();
    }
    displayAxis(index);
  });
  console.log("finish loading axes");
}
