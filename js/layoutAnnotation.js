var groupsByDepth = {};

function initilizeLayoutAnnotation() {
  // avoid the need for clicking go2higherLevelGroups button when only one group presents
  nestedGrouping =
    nestedGrouping.length === 0
      ? groupAnnotations.map((g, i) => i)
      : nestedGrouping;

  // assuming nestedGrouping is a length 1 array and the first element is the nested grouping
  document.getElementById("LayoutAnnotation").innerHTML =
    "<h4>Grouping Structure</h4>";
  document
    .getElementById("LayoutAnnotation")
    .appendChild(createList(convertToJSON(nestedGrouping[0])));
}

function createList(item) {
  const container = document.createElement("div");
  container.style.backgroundColor = "#E5FFFF"; // Background color for each list
  container.style.padding = "3px";

  if (item.children && item.children !== "none") {
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
      item.marks.forEach((mark) => {
        d3.select("#" + mark).style("opacity", "1");
      });
    })
    .on("mouseout", function () {
      item.marks.forEach((mark) => {
        d3.select("#" + mark).style("opacity", "0.3");
      });
    })
    .on("click", function () {
      d3.select("#selectedGroup4LayoutStage").text("Group " + item.id);
      if (Object.keys(groupLayouts).includes(item.id.toString())) {
        let thisLayout = groupLayouts[item.id];
        let selectElement = document.getElementById("layoutTypeSelection");
        let thisLayoutType = thisLayout.type;
        for (let i = 0; i < selectElement.options.length; i++) {
          if (selectElement.options[i].text == thisLayoutType) {
            selectElement.selectedIndex = i;
            break;
          }
        }
        let orientationSelection =
          document.getElementById("layoutOriSelection");
        let thisLayoutOri = thisLayout.params.orientation;
        for (let i = 0; i < orientationSelection.options.length; i++) {
          if (orientationSelection.options[i].text == thisLayoutOri) {
            orientationSelection.selectedIndex = i;
            break;
          }
        }
        let horiAlignmentSelection = document.getElementById(
          "horiLayoutAlignSelection"
        );
        let thisLayoutAlign = thisLayout.params.alignment;
        let thisHoriLayoutAlign = thisLayout.params.horiAlignment;
        let thisVertLayoutAlign = thisLayout.params.vertAlignment;
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
        let alignmentSelection = document.getElementById(
          "layoutAlignSelection"
        );
        alignmentSelection.selectedIndex = 0;
      }
    });
  container.appendChild(content);

  const layoutIndicator = document.createElement("span");
  layoutIndicator.textContent = " ";
  layoutIndicator.id = "layoutIndicator" + item.id;
  layoutIndicator.style.cssText =
    "margin-left: 2px; vertical-align: middle; color: #333;"; //03C03C
  layoutIndicator.textContent =
    ": " +
    (Object.keys(groupLayouts).includes(item.id.toString())
      ? groupLayouts[item.id].type +
        (groupLayouts[item.id].params.orientation[0]
          ? "-" + groupLayouts[item.id].params.orientation[0]
          : "") +
        (groupLayouts[item.id].params.alignment[0]
          ? "-" + groupLayouts[item.id].params.alignment[0]
          : "")
      : "");
  container.appendChild(layoutIndicator);

  const childrenContainer = document.createElement("ul");
  childrenContainer.classList.add("hidden");
  childrenContainer.style.paddingLeft = "40px"; // Indent child lists
  childrenContainer.style.marginTop = "5px";

  if (item.children && item.children !== "none") {
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
  // Function to flatten an array and remove duplicates
  const flattenUnique = (arr) => [...new Set(arr.flat(Infinity))];
  let groupIndex = groupAnnotations.length;
  groupsByDepth = {};

  // Recursive function to handle nested arrays
  function processGroup(group, depth) {
    if (Array.isArray(group)) {
      if (groupsByDepth[depth]) {
        groupsByDepth[depth].push(groupIndex);
      } else {
        groupsByDepth[depth] = [groupIndex];
      }
      return {
        id: groupIndex++,
        marks: flattenUnique(group)
          .map((i) => groupAnnotations[i])
          .flat(Infinity),
        layout: "",
        children: group.map((subGroup) => processGroup(subGroup, depth + 1)),
      };
    } else {
      if (groupsByDepth[depth]) {
        groupsByDepth[depth].push(group);
      } else {
        groupsByDepth[depth] = [group];
      }
      return {
        id: group,
        marks: groupAnnotations[group],
        layout: "",
        children: null,
      };
    }
  }

  return processGroup(thisNestedGrouping, 0);
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
    groupLayouts[selectedGroup] = getThisLayoutJson(selectedGroup);
    d3.select("#layoutIndicator" + selectedGroup).text(
      ": " +
        thisLayoutType +
        (groupLayouts[selectedGroup].params.orientation[0]
          ? "-" + groupLayouts[selectedGroup].params.orientation[0]
          : "") +
        (groupLayouts[selectedGroup].params.horiAlignment[0]
          ? "-" + groupLayouts[selectedGroup].params.horiAlignment[0]
          : "") +
        (groupLayouts[selectedGroup].params.vertAlignment[0]
          ? "-" + groupLayouts[selectedGroup].params.vertAlignment[0]
          : "")
    );
  }
  console.log(groupLayouts);
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

    Object.keys(groupsByDepth).forEach((depth) => {
      let group = groupsByDepth[depth];
      if (group.includes(parseInt(selectedGroup))) {
        group.forEach((groupID) => {
          groupLayouts[groupID] = thisLayoutJson;
          d3.select("#layoutIndicator" + groupID).text(
            ": " +
              thisLayoutType +
              (thisLayoutJson.params.orientation[0]
                ? "-" + thisLayoutJson.params.orientation[0]
                : "") +
              (thisLayoutJson.params.horiAlignment[0]
                ? "-" + thisLayoutJson.params.horiAlignment[0]
                : "") +
              (thisLayoutJson.params.vertAlignment[0]
                ? "-" + thisLayoutJson.params.vertAlignment[0]
                : "")
          );
        });
      }
    });
  }
  console.log(groupLayouts);
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
