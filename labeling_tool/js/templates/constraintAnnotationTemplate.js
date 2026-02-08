/**
 * Template for Constraint Annotation UI
 */

/**
 * Template for constraint annotation section
 */
const constraintAnnotationTemplate = () => `
  <div style="
    position: absolute;
    top: 20px;
    right: 10px;
    display: flex;
    flex-grow: 1;
    width: 40%;
    height: calc(100% - 50px);
    visibility: hidden;
  ">
    <div id="ConstraintAnnotation" style="
      padding: 25px;
      margin-bottom: 10px;
      vertical-align: top;
      width: 49%;
    ">
      <h4>Grouping Structure</h4>
    </div>
    <div id="ConstraintSpec" style="
      padding: 25px;
      margin-bottom: 10px;
      vertical-align: top;
      width: 49%;
    ">
      <h4>
        Drag a text from the SVG chart and drop it onto its corresponding
        visual object displayed in the grouping structure to pair them as
        a text-object linking.

        <p id="pairInfo" style="visibility: hidden">
          Current pairing
          <span id="draggingText" style="color: blue"> </span> and
          <span id="droppingObject" style="color: red"></span>
        </p>
      </h4>

      <div id="pairingStructure" style="
        overflow: scroll;
        overflow: -moz-scrollbars-vertical;
        height: 200px;
        border: 0.5px solid #aaa;
        padding: 5px;
        margin-bottom: 10px;
      "></div>
    </div>
  </div>
`;

/**
 * Initialize the constraint annotation UI
 * Call this function on page load to inject the template into the DOM
 */
function initializeConstraintAnnotationUI() {
  const container = document.getElementById('container');
  
  // Find the insertion point (after rbox2)
  const rbox2 = document.getElementById('rbox2');
  
  // Create a temporary container to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = constraintAnnotationTemplate();
  
  // Insert the constraint annotation section after rbox2
  while (tempDiv.firstChild) {
    container.insertBefore(tempDiv.firstChild, rbox2.nextSibling);
  }
}
