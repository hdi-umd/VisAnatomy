var availableTexts;

function initilizeConstraintAnnotation() {
  // first filter out texts whose mark role is not Main Chart Mark or isReferenceElement is false
  console.log(referenceElements);
  availableTexts = Object.values(allGraphicsElement).filter(function (d) {
    return d.tagName === "text" && !referenceElements.includes(d.id)
      ? markInfo[d.id]?.Role !== "Main Chart Mark"
      : false;
  });
  enableDD4AnnotationRoleText();

  // create a list that looks like the list in the encoding annotation without the click events
  document.getElementById("ConstraintAnnotation").innerHTML =
    "<h4>Grouping Structure</h4>";
  document
    .getElementById("ConstraintAnnotation")
    .appendChild(createList3(convertToJSON2(nestedGrouping[0])));
}

function createList3(item) {
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
    .on("click", function () {});
  container.appendChild(content);

  const childrenContainer = document.createElement("ul");
  childrenContainer.classList.add("hidden");
  childrenContainer.style.paddingLeft = "40px"; // Indent child lists
  childrenContainer.style.marginTop = "5px";

  if (item.children && item.children !== "none") {
    item.children.forEach((child) => {
      const childElement = createList3(child);
      const listItem = document.createElement("li");
      listItem.appendChild(childElement);
      childrenContainer.appendChild(listItem);
    });
  } else {
    // For lowest level items, display individual marks as foldable but non-expandable
    item.marks.forEach((mark) => {
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
        .on("click", function () {});
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

function enableDD4AnnotationRoleText() {
  // turn the opacity of the texts and their children tspans if any specified by textIDs to 1
  textIDs = availableTexts.map((d) => d.id);
  textIDs.forEach(function (textID) {
    d3.select("#" + textID)
      .style("pointer-events", "auto")
      .style("cursor", "pointer");
    d3.select("#" + textID).style("opacity", 1);
    d3.select("#" + textID)
      .selectAll("tspan")
      .style("opacity", 1);
  });
  // add the hover effect on the texts specified by textIDs, such that when hovered over the color turns red when mouseout the color turns back to the original color
  textIDs.forEach(function (textID) {
    d3.select("#" + textID)
      .on("mouseover", function () {
        d3.select(this).style("fill", "red").style("font-weight", "bold");
      })
      .on("mouseout", function () {
        d3.select(this)
          .style("fill", markInfo[textID]?.fill || "black")
          .style("font-weight", "normal");
      });
  });
}
