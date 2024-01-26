var objectsByDepth = {};

function initilizeEncodingAnnotation() {
  console.log(convertToJSON2(nestedGrouping[0]));
  document.getElementById("EncodingAnnotation").innerHTML =
    "<h4>Grouping Structure</h4>";
  document
    .getElementById("EncodingAnnotation")
    .appendChild(createList2(convertToJSON2(nestedGrouping[0])));
}

function createList2(item) {
  // TBD: create object-type-specific list; can use annotated mark types and roles
  const container = document.createElement("div");
  container.style.backgroundColor = "#f0f0f0"; // Background color for each list

  const toggleButton = document.createElement("button");
  toggleButton.textContent = "+";
  toggleButton.style.cursor = "pointer";
  toggleButton.style.cssText =
    "background-color: #75739e; border: none; font-size: 16px; margin-right: 5px; vertical-align: middle; cursor: pointer; width: 20px; height: 20px;";
  container.appendChild(toggleButton);

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
      d3.select("#selectedGroup4EncodingStage1").text("Group " + item.id);
      if (Object.keys(objectEncodings).includes(item.id.toString())) {
        let thisEncoding = objectEncodings["Group " + item.id];
        let channelList = document.getElementById("channelList");
        let listItems = channelList.querySelectorAll(".list-item");
        listItems.forEach((item) => {
          if (thisEncoding.includes(item.textContent.trim())) {
            item.classList.add("selected");
          } else {
            item.classList.remove("selected");
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
  EncIndicator.textContent = " ";
  EncIndicator.id = "EncIndicator" + item.id;
  EncIndicator.style.cssText =
    "margin-left: 2px; vertical-align: middle; color: #03C03C;";
  container.appendChild(EncIndicator);

  const childrenContainer = document.createElement("ul");
  childrenContainer.classList.add("hidden");
  childrenContainer.style.paddingLeft = "20px"; // Indent child lists

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
      const markItem = document.createElement("li");
      markItem.textContent = mark;
      d3.select(markItem)
        .on("mouseover", function () {
          d3.select(this).style("cursor", "pointer");
          d3.select("#" + mark).style("opacity", "1");
        })
        .on("mouseout", function () {
          d3.select("#" + mark).style("opacity", "0.3");
        })
        .on("click", function () {
          d3.select("#selectedGroup4EncodingStage1").text(markItem.textContent);
          d3.select("#selectedGroup4EncodingStage2").text(markItem.textContent);
          if (Object.keys(objectEncodings).includes(mark)) {
            let thisEncoding = objectEncodings[mark];
            let channelList = document.getElementById("channelList");
            let listItems = channelList.querySelectorAll(".list-item");
            listItems.forEach((item) => {
              if (thisEncoding.includes(item.textContent.trim())) {
                item.classList.add("selected");
              } else {
                item.classList.remove("selected");
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
      childrenContainer.appendChild(markItem);
    });
  }

  container.appendChild(childrenContainer);

  toggleButton.addEventListener("click", function () {
    childrenContainer.classList.toggle("hidden");
    toggleButton.textContent = childrenContainer.classList.contains("hidden")
      ? "+"
      : "-";
  });

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
  if (selectedChannels.length == 0) {
    // alert("Please select at least one channel");
    return;
  } else if (!selectedGroup) {
    // alert("Please select a group");
    return;
  } else {
    objectEncodings[selectedGroup] = selectedChannels;
  }
  console.log(objectEncodings);
}

function recordBatchEncoding() {
  const selectedChannels = getSelectedChannelsTexts();
  const selectedGroup = d3.select("#selectedGroup4EncodingStage1").text();
  if (selectedChannels.length == 0) {
    alert("Please select at least one channel");
  } else if (!selectedGroup) {
    alert("Please select a group");
  } else {
    if (selectedGroup.startsWith("Group")) {
      Object.keys(objectsByDepth).forEach((depth) => {
        let group = objectsByDepth[depth];
        if (group.includes(parseInt(selectedGroup.split(" ")[1]))) {
          group.forEach((groupID) => {
            objectEncodings["Group " + groupID] = selectedChannels;
          });
        }
      });
    } else {
      groupAnnotations.flat(Infinity).forEach((mark) => {
        if (extractNonNumeric(mark) == extractNonNumeric(selectedGroup))
          objectEncodings[mark] = selectedChannels;
      });
    }
  }
  console.log(objectEncodings);
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
