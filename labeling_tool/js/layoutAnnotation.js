var groupsByDepth = {};

function initilizeLayoutAnnotation() {
  mainChartMarks.forEach((markID) => {
    d3.select("#" + markID).style("opacity", "0.3");
  });

  // display the grouping structure
  document.getElementById("LayoutAnnotation").innerHTML =
    "<h4>Grouping Structure</h4>";
  if (VA.grouping && VA.grouping.length > 0) {
    VA.grouping.forEach((group) => {
      document
        .getElementById("LayoutAnnotation")
        .appendChild(createList(group));
    });
  }
}

function createList(item) {
  const container = document.createElement("div");
  container.style.backgroundColor = "#E5FFFF"; // Background color for each list
  container.style.padding = "3px";

  // Get marks for this node
  const marks = getGroupMarks(item.id);
  const hasChildren = item.children && item.children.length > 0 && typeof item.children[0] !== 'string';

  if (hasChildren) {
    const toggleButton = document.createElement("button");
    toggleButton.textContent = "+";
    toggleButton.style.cursor = "pointer";
    toggleButton.style.cssText =
      "background-color: #eee; border: none; font-size: 16px; margin-right: 5px; vertical-align: middle; cursor: pointer; width: 20px; height: 20px;";
    toggleButton.addEventListener("click", function () {
      childrenContainer.classList.toggle("hidden");
      toggleButton.textContent = childrenContainer.classList.contains("hidden")
        ? "+"
        : "–";
    });
    container.appendChild(toggleButton);
  }

  const content = document.createElement("span");
  content.textContent = "Group " + item.id;
  d3.select(content)
    .on("mouseover", function () {
      d3.select(this).style("cursor", "pointer");
      marks.forEach((mark) => {
        d3.select("#" + mark).style("opacity", "1");
      });
    })
    .on("mouseout", function () {
      marks.forEach((mark) => {
        d3.select("#" + mark).style("opacity", "0.3");
      });
    })
    .on("click", function () {
      d3.select("#selectedGroup4LayoutStage").text("Group " + item.id);
      const layout = item.layout || getGroupLayout(item.id);
      if (layout) {
        let selectElement = document.getElementById("layoutTypeSelection");
        let thisLayoutType = layout.type;
        for (let i = 0; i < selectElement.options.length; i++) {
          if (selectElement.options[i].text == thisLayoutType) {
            selectElement.selectedIndex = i;
            break;
          }
        }
        let orientationSelection =
          document.getElementById("layoutOriSelection");
        let thisLayoutOri = layout.params.orientation;
        for (let i = 0; i < orientationSelection.options.length; i++) {
          if (orientationSelection.options[i].text == thisLayoutOri) {
            orientationSelection.selectedIndex = i;
            break;
          }
        }
        let horiAlignmentSelection = document.getElementById(
          "horiLayoutAlignSelection"
        );
        let thisLayoutAlign = layout.params.alignment;
        let thisHoriLayoutAlign = layout.params.horiAlignment;
        let thisVertLayoutAlign = layout.params.vertAlignment;
        for (let i = 0; i < horiAlignmentSelection.options.length; i++) {
          if (
            horiAlignmentSelection.options[i].text ===
            (thisHoriLayoutAlign ? thisHoriLayoutAlign : thisLayoutAlign)
          ) {
            horiAlignmentSelection.selectedIndex = i;
            break;
          }
        }
        let vertAlignmentSelection = document.getElementById(
          "vertLayoutAlignSelection"
        );
        for (let i = 0; i < vertAlignmentSelection.options.length; i++) {
          if (
            vertAlignmentSelection.options[i].text ===
            (thisVertLayoutAlign ? thisVertLayoutAlign : thisLayoutAlign)
          ) {
            vertAlignmentSelection.selectedIndex = i;
            break;
          }
        }
      } else {
        let selectElement = document.getElementById("layoutTypeSelection");
        selectElement.selectedIndex = 0;
        let orientationSelection =
          document.getElementById("layoutOriSelection");
        orientationSelection.selectedIndex = 0;
        document.getElementById("horiLayoutAlignSelection").selectedIndex = 0;
        document.getElementById("vertLayoutAlignSelection").selectedIndex = 0;
      }
    });
  container.appendChild(content);

  const layoutIndicator = document.createElement("span");
  layoutIndicator.textContent = " ";
  layoutIndicator.id = "layoutIndicator" + item.id;
  layoutIndicator.style.cssText =
    "margin-left: 2px; vertical-align: middle; color: #333;"; //03C03C
  
  const layout = item.layout || getGroupLayout(item.id);
  layoutIndicator.textContent =
    ": " +
    (layout
      ? layout.type +
        (layout.params.orientation
          ? "-" + layout.params.orientation
          : "") +
        (layout.params.alignment
          ? layout.params.alignment[0]
            ? "-" + layout.params.alignment[0]
            : ""
          : (layout.params.horiAlignment
              ? "-" + layout.params.horiAlignment[0]
              : "") +
            (layout.params.vertAlignment
              ? "-" + layout.params.vertAlignment[0]
              : ""))
      : "");
  container.appendChild(layoutIndicator);

  const childrenContainer = document.createElement("ul");
  childrenContainer.classList.add("hidden");
  childrenContainer.style.paddingLeft = "40px"; // Indent child lists
  childrenContainer.style.marginTop = "5px";

  if (hasChildren) {
    item.children.forEach((child) => {
      const childElement = createList(child);
      const listItem = document.createElement("li");
      listItem.appendChild(childElement);
      childrenContainer.appendChild(listItem);
    });
  }
  // else {
  //   // For lowest level items, display individual marks as foldable but non-expandable
  //   item.marks.forEach((mark) => {
  //     const markItem = document.createElement("li");
  //     markItem.textContent = mark;
  //     d3.select(markItem)
  //       .on("mouseover", function () {
  //         d3.select(this).style("cursor", "pointer");
  //         d3.select("#" + mark).style("opacity", "1");
  //       })
  //       .on("mouseout", function () {
  //         d3.select("#" + mark).style("opacity", "0.3");
  //       });
  //     childrenContainer.appendChild(markItem);
  //   });
  // }

  container.appendChild(childrenContainer);
  return container;
}

function convertToJSON(thisNestedGrouping) {
  // This function is likely no longer needed with the hierarchical structure
  // But if we need to process old nested structure indices, we can keep it
  // For now, just return the hierarchical structure as-is
  console.warn("convertToJSON may no longer be needed with hierarchical structure");
  return thisNestedGrouping;
}

function recordlayout() {
  // first, get the determined group
  let selectedGroup = d3
    .select("#selectedGroup4LayoutStage")
    .text()
    .split(" ")[1]; // this is a string

  if (selectedGroup.length == 0) {
    alert("Please select a group first!");
    return;
  } else {
    // in the Grouping Structure, highlight the specified layout
    let selectElement = document.getElementById("layoutTypeSelection");
    let thisLayoutType =
      selectElement.options[selectElement.selectedIndex].text;
    
    // Find the group node and update its layout
    let groupNode = findGroupNode(VA.grouping, selectedGroup);
    if (groupNode) {
      groupNode.layout = getThisLayoutJson(selectedGroup);
      let layout = groupNode.layout;
      d3.select("#layoutIndicator" + selectedGroup).text(
        ": " +
          thisLayoutType +
          (layout.params.orientation
            ? "-" + layout.params.orientation
            : "") +
          (layout.params.horiAlignment[0]
            ? "-" + layout.params.horiAlignment[0]
            : "") +
          (layout.params.vertAlignment[0]
            ? "-" + layout.params.vertAlignment[0]
            : "")
      );
    }
  }
  console.log("Updated layouts in VA.grouping");
}

// Helper function to find a group node by ID in the hierarchical structure
function findGroupNode(nodes, groupId) {
  for (let node of nodes) {
    if (node.id === groupId) {
      return node;
    }
    if (Array.isArray(node.children) && typeof node.children[0] === 'object') {
      let found = findGroupNode(node.children, groupId);
      if (found) return found;
    }
  }
  return null;
}

function recordBatchGroupLayout() {
  // first, get the determined group
  let selectedGroup = d3
    .select("#selectedGroup4LayoutStage")
    .text()
    .split(" ")[1]; // this is a string

  if (selectedGroup.length == 0) {
    alert("Please select a group first!");
    return;
  } else {
    // in the Grouping Structure, highlight the specified layout
    let selectElement = document.getElementById("layoutTypeSelection");
    let thisLayoutType =
      selectElement.options[selectElement.selectedIndex].text;
    let thisLayoutJson = getThisLayoutJson(selectedGroup);

    // For batch layout, we need to apply to groups at the same depth
    // This requires understanding groupsByDepth which was built by convertToJSON
    // Since that's deprecated, we may need to reconsider this function
    // For now, just update the selected group
    let groupNode = findGroupNode(VA.grouping, selectedGroup);
    if (groupNode) {
      groupNode.layout = thisLayoutJson;
      d3.select("#layoutIndicator" + selectedGroup).text(
        ": " +
          thisLayoutType +
          (thisLayoutJson.params.orientation
            ? "-" + thisLayoutJson.params.orientation
            : "") +
          (thisLayoutJson.params.horiAlignment[0]
            ? "-" + thisLayoutJson.params.horiAlignment[0]
            : "") +
          (thisLayoutJson.params.vertAlignment[0]
            ? "-" + thisLayoutJson.params.vertAlignment[0]
            : "")
      );
    }
  }
  console.log("Updated layouts in VA.grouping");
}

function getThisLayoutJson() {
  let selectElement = document.getElementById("layoutTypeSelection");
  let thisLayoutType = selectElement.options[selectElement.selectedIndex].text;
  let thisLayoutJson = {
    type: thisLayoutType,
    params: {},
  };
  let orientationSelection = document.getElementById("layoutOriSelection");
  thisLayoutJson.params.orientation =
    orientationSelection.options[orientationSelection.selectedIndex].text;
  let alignmentSelection = document.getElementById("horiLayoutAlignSelection");
  thisLayoutJson.params.horiAlignment =
    alignmentSelection.options[alignmentSelection.selectedIndex].text;
  alignmentSelection = document.getElementById("vertLayoutAlignSelection");
  thisLayoutJson.params.vertAlignment =
    alignmentSelection.options[alignmentSelection.selectedIndex].text;
  console.log(thisLayoutJson);
  return thisLayoutJson;
}
