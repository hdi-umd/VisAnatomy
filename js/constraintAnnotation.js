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
        d3.select(this).style("fill", "black");
      });
  });
}
