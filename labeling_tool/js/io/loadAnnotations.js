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

      VA.allGraphicsElement = annotations.allElements ? annotations.allElements : {};
      VA.groupedGraphicsElement = {};

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

      VA.markInfo = {};
      Object.keys(VA.allGraphicsElement).forEach((id) => {
        const element = VA.allGraphicsElement[id];
        VA.markInfo[id] = {
          Type: element.type || "none",
          Role: element.role || "none"
        };
      });

      VA.groupAnnotations = [];
      VA.nestedGrouping = [];
      VA.groupLayouts = {};

      function buildTree(node) {
        if (!node) return null;
        if (Array.isArray(node)) {
          // array of top-level nodes -> map each child
          return node.map((child) => buildTree(child)).filter((c) => c !== null);
        }
        if (typeof node !== "object" || !node.children) return null;

        // If this node is a leaf group (children are mark IDs)
        if (node.children.length > 0 && typeof node.children[0] === "string") {
          const leafIdx = VA.groupAnnotations.length;
          VA.groupAnnotations.push(node.children.slice()); // copy mark IDs
          // store leaf layout, default to Glyph when missing
          VA.groupLayouts[leafIdx] = node.layout && node.layout.type
            ? node.layout
            : { type: "Glyph", params: {} };

          // If node has an explicit id like "g3", also map that numeric suffix (defensive)
          if (node.id && typeof node.id === "string") {
            const m = node.id.match(/(\d+)$/);
            if (m) VA.groupLayouts[parseInt(m[1], 10)] = VA.groupLayouts[leafIdx];
          }
          return leafIdx;
        }

        // Internal group: recursively build children
        const children = node.children
          .map((child) => buildTree(child))
          .filter((c) => c !== null);
        // if node has explicit id like "g5", record its numeric layout (default Grid)
        if (node.id && typeof node.id === "string") {
          const m = node.id.match(/(\d+)$/);
          if (m) {
            VA.groupLayouts[parseInt(m[1], 10)] =
              node.layout && node.layout.type
                ? node.layout
                : { type: "Grid", params: {} };
          }
        }
        return children;
      }

      // Build top-level structure and set nestedGrouping[0] so layout UI reads it
      if (annotations.grouping && annotations.grouping.length > 0) {
        const topStructure =
          annotations.grouping.length === 1
            ? buildTree(annotations.grouping[0])
            : buildTree(annotations.grouping);
        // nestedGrouping used by UI: put topStructure at index 0
        VA.nestedGrouping = [topStructure];
      } else {
        // fallback: if no grouping, make each mark its own group (preserve old behavior)
        VA.nestedGrouping = VA.groupAnnotations.length
          ? [VA.groupAnnotations.map((_, i) => i)]
          : [];
      }

      // // Traverse grouping and ensure root group layout is at index 0
      // function traverseGrouping(node, parentIdx = null) {
      //   // node can be an array or an object with children
      //   if (Array.isArray(node)) {
      //     node.forEach((child) => traverseGrouping(child, parentIdx));
      //     return;
      //   }
      //   if (!node || typeof node !== "object" || !node.children) return;

      //     // Prefer numeric index derived from node.id (e.g., "g5" -> 5)
      //     let thisIdx = null;
      //     if (node.id && typeof node.id === "string") {
      //       const m = node.id.match(/(\d+)$/);
      //       if (m) thisIdx = parseInt(m[1], 10);
      //   }

      //   // fallback: find the next available numeric index
      //   if (thisIdx === null) {
      //     thisIdx = 0;
      //     while (
      //       typeof nestedGrouping[thisIdx] !== "undefined" ||
      //       typeof groupLayouts[thisIdx] !== "undefined" ||
      //       typeof groupAnnotations[thisIdx] !== "undefined"
      //     ) {
      //     thisIdx++;
      //     } 
      //   }

      //   // ensure arrays exist at thisIdx
      //   if (!nestedGrouping[thisIdx]) nestedGrouping[thisIdx] = [];

      //   // leaf group: children are element ids (strings)
      //   if (typeof node.children[0] === "string") {
      //     groupAnnotations[thisIdx] = node.children.slice();
      //     groupLayouts[thisIdx] =
      //     node.layout && node.layout.type ? node.layout : { type: "Glyph", params: {} };

      //     if (parentIdx !== null) {
      //       if (!nestedGrouping[parentIdx]) nestedGrouping[parentIdx] = [];
      //       nestedGrouping[parentIdx].push(thisIdx);
      //     }
      //   } else {
      //     // container group: children are groups
      //     nestedGrouping[thisIdx] = nestedGrouping[thisIdx] || [];
      //     node.children.forEach((child) => traverseGrouping(child, thisIdx));
      //     groupLayouts[thisIdx] =
      //       node.layout && node.layout.type ? node.layout : { type: "Grid", params: {} };

      //     if (parentIdx !== null) {
      //       if (!nestedGrouping[parentIdx]) nestedGrouping[parentIdx] = [];
      //       nestedGrouping[parentIdx].push(thisIdx);
      //     }
      //   }
      // }

      // if (annotations.grouping) {
      //   traverseGrouping(annotations.grouping, null, true);
      // }


      // groupAnnotations = annotations.groupInfo ? annotations.groupInfo : [];
      // nestedGrouping = annotations.nestedGrouping
      //   ? annotations.nestedGrouping
      //   : [];
      VA.groupLayouts = annotations.layoutInfo ? annotations.layoutInfo : VA.groupLayouts;
      VA.objectEncodings = annotations.encodingInfo ? annotations.encodingInfo : {};
      VA.textObjectLinking = annotations.textObjectLinking ? annotations.textObjectLinking : {};

      VA.chartTitle = Array.isArray(annotations.chartTitle) ? annotations.chartTitle : [];
      console.log("chartTitle: ", VA.chartTitle);

      VA.titleLegend = VA.legend.title ? VA.legend.title : [];
      if (VA.titleLegend.length > 0 && typeof VA.titleLegend[0] === "string") {
        VA.titleLegend = VA.titleLegend.map(id => VA.allGraphicsElement[id]).filter(Boolean);
      }

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
