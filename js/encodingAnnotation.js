var objectsByDepth = {};
const typeSpecificChannels = {
  "Straight Line": [
    "x (x1)",
    "y (y1)",
    "x2",
    "y2",
    "color",
    "strokeWidth",
    "opacity",
    "length",
  ],
  Polyline: [
    "vertices-x",
    "vertices-y",
    "x",
    "y",
    "strokeColor",
    "strokeWidth",
    "opacity",
    "length",
  ],
  Rectangle: [
    "centroid-x",
    "centroid-y",
    "top",
    "left",
    "right",
    "bottom",
    "width",
    "height",
    "fill",
    "opacity",
    "area",
    "shape",
  ],
  Circle: [
    "centroid-x",
    "centroid-y",
    "radius",
    "fill",
    "opacity",
    "area",
    "shape",
  ],
  Ploygon: ["x", "y", "vertices", "radius", "fill", "opacity", "shape"],
  Ellipse: ["x", "y", "rx", "ry", "fill", "opacity", "shape", "size"],
  Arc: [
    "x",
    "y",
    "innerRadius",
    "outerRadius",
    "angle",
    "startAngle",
    "endAngle",
    "fill",
    "opacity",
    "shape",
  ],
  Pie: [
    "x",
    "y",
    "innerRadius",
    "outerRadius",
    "angle",
    "startAngle",
    "endAngle",
    "fill",
    "opacity",
    "shape",
  ],
  Text: ["x", "y", "text", "color", "opacity", "fontSize", "fontWeight"],
  Image: ["x", "y", "width", "height", "opacity"],
  Area: [
    "top-vertices-x",
    "top-vertices-y",
    "bottom-vertices-x",
    "bottom-vertices-y",
    "left-vertices-x",
    "left-vertices-y",
    "right-vertices-x",
    "right-vertices-y",
    "fill",
    "opacity",
    "shape",
    "stroke color",
  ],
  Path: [
    "shape",
    "x",
    "y",
    "right",
    "bottom",
    "size",
    "fill",
    "opacity",
    "vertices",
  ],
};

function initilizeEncodingAnnotation() {
  document.getElementById("EncodingAnnotation").innerHTML =
    "<h4>Grouping Structure</h4>";
  document
    .getElementById("EncodingAnnotation")
    .appendChild(createList2(convertToJSON2(nestedGrouping[0])));
}

function createList2(item) {
  const container = document.createElement("div");
  container.style.backgroundColor = "#E5FFFF"; // Background color for each list
  container.style.padding = "3px";

  const toggleButton = document.createElement("button");
  toggleButton.textContent = "–";
  toggleButton.style.cursor = "pointer";
  toggleButton.style.cssText =
    "background-color: #eee; border: none; font-size: 16px; margin-right: 5px; vertical-align: middle; cursor: pointer; width: 20px; height: 20px;";
  container.appendChild(toggleButton);

  const content = document.createElement("span");
  content.textContent = "Group " + item.id;
  let thisEncoding = objectEncodings["Group " + item.id];

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
      d3.select("#selectedGroup4EncodingStage1").text("Group " + item.id);
      populateChannelList(["x", "y"]);
      if (Object.keys(objectEncodings).includes("Group " + item.id)) {
        let channelList = document.getElementById("channelList");
        let listItems = channelList.querySelectorAll(".list-item");
        listItems.forEach((listItem) => {
          if (
            objectEncodings["Group " + item.id].includes(
              listItem.textContent.trim()
            )
          ) {
            listItem.classList.add("selected");
          } else {
            listItem.classList.remove("selected");
          }
        });
      } else {
        let channelList = document.getElementById("channelList");
        let listItems = channelList.querySelectorAll(".list-item");
        listItems.forEach((item) => {
          item.classList.remove("selected");
        });
      }
    });
  container.appendChild(content);

  // TBD: add encoding indicator
  const EncIndicator = document.createElement("span");
  EncIndicator.textContent = thisEncoding
    ? " [" + thisEncoding.toString() + "]"
    : " ";
  EncIndicator.id = ("EncIndicator" + item.id).trim();
  EncIndicator.style.cssText =
    "margin-left: 2px; vertical-align: middle; color: #03C03C;";
  container.appendChild(EncIndicator);

  const childrenContainer = document.createElement("ul");
  childrenContainer.classList.add("hidden");
  childrenContainer.style.paddingLeft = "40px"; // Indent child lists
  childrenContainer.style.marginTop = "5px";

  if (item.children && item.children !== "none") {
    item.children.forEach((child) => {
      const childElement = createList2(child);
      const listItem = document.createElement("li");
      listItem.appendChild(childElement);
      childrenContainer.appendChild(listItem);
    });
  } else {
    // For lowest level items, display individual marks as foldable but non-expandable
    item.marks.forEach((mark) => {
      let thisMarkEncoding = objectEncodings[mark];
      const markItem = document.createElement("li");
      markItem.textContent = mark.split(" ")[0] + " ";
      d3.select(markItem)
        .on("mouseover", function () {
          d3.select(this).style("cursor", "pointer");
          d3.select("#" + mark).style("opacity", "1");
        })
        .on("mouseout", function () {
          d3.select("#" + mark).style("opacity", "0.3");
        })
        .on("click", function () {
          d3.select("#selectedGroup4EncodingStage1").text(
            markItem.textContent.split(" ")[0]
          );
          let channelList = typeSpecificChannels[markInfo[mark].Type];
          populateChannelList(channelList);
          if (Object.keys(objectEncodings).includes(mark)) {
            let channelListHTML = document.getElementById("channelList");
            let listItems = channelListHTML.querySelectorAll(".list-item");
            listItems.forEach((listItem) => {
              if (objectEncodings[mark].includes(listItem.textContent.trim())) {
                listItem.classList.add("selected");
              } else {
                listItem.classList.remove("selected");
              }
            });
          } else {
            let channelListHTML = document.getElementById("channelList");
            let listItems = channelListHTML.querySelectorAll(".list-item");
            listItems.forEach((item) => {
              item.classList.remove("selected");
            });
          }
        });
      const markEncIndicator = document.createElement("span");
      markEncIndicator.textContent = thisMarkEncoding
        ? " [" + thisMarkEncoding.toString() + "]"
        : " ";
      markEncIndicator.id = ("EncIndicator" + markItem.textContent).trim();
      markEncIndicator.style.cssText =
        "margin-left: 2px; vertical-align: middle; color: #03C03C;";
      markItem.appendChild(markEncIndicator);
      childrenContainer.appendChild(markItem);
    });
  }

  container.appendChild(childrenContainer);

  toggleButton.addEventListener("click", function () {
    childrenContainer.classList.toggle("hidden");
    toggleButton.textContent = childrenContainer.classList.contains("hidden")
      ? "+"
      : "–";
  });

  childrenContainer.classList.toggle("hidden");

  return container;
}

function convertToJSON2(thisNestedGrouping) {
  // Function to flatten an array and remove duplicates
  const flattenUnique = (arr) => [...new Set(arr.flat(Infinity))];
  let groupIndex = groupAnnotations.length;
  objectsByDepth = {};

  // Recursive function to handle nested arrays
  function processGroup(group, depth) {
    if (Array.isArray(group)) {
      if (objectsByDepth[depth]) {
        objectsByDepth[depth].push(groupIndex);
      } else {
        objectsByDepth[depth] = [groupIndex];
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
      if (objectsByDepth[depth]) {
        objectsByDepth[depth].push(group);
      } else {
        objectsByDepth[depth] = [group];
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

function recordSingleEncoding() {
  const selectedChannels = getSelectedChannelsTexts();
  const selectedGroup = d3.select("#selectedGroup4EncodingStage1").text();
  if (!selectedGroup) {
    // alert("Please select a group");
    return;
  } else {
    objectEncodings[selectedGroup.trim()] = selectedChannels;
    console.log(objectEncodings);
    if (selectedGroup.startsWith("Group")) {
      document.getElementById(
        "EncIndicator" + selectedGroup.split(" ")[1]
      ).textContent =
        selectedChannels.length > 0
          ? " [" + selectedChannels.toString() + "]"
          : " ";
    } else {
      console.log(selectedChannels);
      document.getElementById(
        "EncIndicator" + selectedGroup.split(" ")[0]
      ).textContent =
        selectedChannels.length > 0
          ? " [" + selectedChannels.toString() + "]"
          : " ";
    }
  }
}

function recordBatchEncoding() {
  const selectedChannels = getSelectedChannelsTexts();
  const selectedGroup = d3.select("#selectedGroup4EncodingStage1").text();
  if (!selectedGroup) {
    alert("Please select a group");
  } else {
    if (selectedGroup.startsWith("Group")) {
      Object.keys(objectsByDepth).forEach((depth) => {
        let group = objectsByDepth[depth];
        if (group.includes(parseInt(selectedGroup.split(" ")[1]))) {
          group.forEach((groupID) => {
            objectEncodings["Group " + groupID] = selectedChannels;
            document.getElementById("EncIndicator" + groupID).textContent =
              selectedChannels.length > 0
                ? " [" + selectedChannels.toString() + "]"
                : " ";
          });
        }
      });
    } else {
      groupAnnotations.flat(Infinity).forEach((mark) => {
        console.log(extractNonNumeric(mark));
        if (
          selectedGroup.startsWith(extractNonNumeric(mark)) &&
          markInfo[mark].Type === markInfo[selectedGroup].Type
        ) {
          objectEncodings[mark] = selectedChannels;
          document.getElementById("EncIndicator" + mark).textContent =
            selectedChannels.length > 0
              ? " [" + selectedChannels.toString() + "]"
              : " ";
        }
      });
    }
  }
}

function getSelectedChannelsTexts() {
  const selectedTexts = [];
  const listItems = document.querySelectorAll("#channelList .list-item");

  listItems.forEach((item) => {
    if (item.classList.contains("selected")) {
      // Retrieve and store the text, excluding the dot
      selectedTexts.push(item.textContent.trim());
    }
  });

  return selectedTexts;
}

function toggleItem(listItem) {
  listItem.classList.toggle("selected");
  recordSingleEncoding();
}

function populateChannelList(channelArray) {
  const ulElement = document.getElementById("channelList");
  ulElement.innerHTML = "";

  channelArray.forEach((item) => {
    const li = document.createElement("li");
    li.className = "list-item";
    li.setAttribute("onclick", "toggleItem(this)");

    const span = document.createElement("span");
    span.className = "dot";

    li.appendChild(span);
    li.appendChild(document.createTextNode(` ${item}`));

    ulElement.appendChild(li);
  });
}
