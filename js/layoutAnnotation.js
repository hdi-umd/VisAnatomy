function initilizeLayoutAnnotation() {
  // assuming nestedGrouping is a length 1 array and the first element is the nested grouping
  console.log(convertToJSON(nestedGrouping[0]));
  document.getElementById("LayoutAnnotation").innerHTML = "";
  document
    .getElementById("LayoutAnnotation")
    .appendChild(createList(convertToJSON(nestedGrouping[0])));
}

function convertToJSON(thisNestedGrouping) {
  // Function to flatten an array and remove duplicates
  const flattenUnique = (arr) => [...new Set(arr.flat(Infinity))];
  let groupIndex = groupAnnotations.length;

  // Recursive function to handle nested arrays
  function processGroup(group) {
    if (Array.isArray(group)) {
      return {
        id: groupIndex++,
        marks: flattenUnique(group)
          .map((i) => groupAnnotations[i])
          .flat(Infinity),
        layout: "",
        children: group.map((subGroup) => processGroup(subGroup)),
      };
    } else {
      return {
        id: group,
        marks: groupAnnotations[group],
        layout: "",
        children: null,
      };
    }
  }

  return processGroup(thisNestedGrouping);
}

function createList(item) {
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
    });
  container.appendChild(content);

  const childrenContainer = document.createElement("ul");
  childrenContainer.classList.add("hidden");
  childrenContainer.style.paddingLeft = "20px"; // Indent child lists

  if (item.children && item.children !== "none") {
    item.children.forEach((child) => {
      const childElement = createList(child);
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
