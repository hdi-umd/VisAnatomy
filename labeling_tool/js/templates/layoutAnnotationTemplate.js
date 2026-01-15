/**
 * Template for Layout Annotation UI
 */

/**
 * Template for layout annotation section
 */
export const layoutAnnotationTemplate = () => `
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
    <div id="LayoutAnnotation" style="
      padding: 25px;
      margin-bottom: 10px;
      vertical-align: top;
      width: 49%;
    ">
      <h4>Grouping Structure</h4>
    </div>
    <div id="LayoutSpec" style="
      padding: 25px;
      margin-bottom: 10px;
      vertical-align: top;
      width: 49%;
    ">
      <h4 style="text-align: center">Layout Specification</h4>
      <p>
        Select a layout type for
        <span id="selectedGroup4LayoutStage" style="color: red"></span>:
      </p>
      <select class="fieldType" id="layoutTypeSelection" onchange="recordlayout()">
        <option value="none"></option>
        <option value="Grid">Grid</option>
        <option value="Stack">Stack</option>
        <option value="Packing">Packing</option>
        <option value="Radial">Radial</option>
        <option value="Spiral">Spiral</option>
        <option value="Nested">Nested</option>
        <option value="Glyph">Glyph</option>
        <option value="geoCoordinates">geoCoordinates</option>
      </select>

      <div id="layoutDetails" style="
        width: 100%;
        height: 40%;
        padding-top: 2px;
        padding-left: 5px;
        margin-top: 8px;
        border: 2.5px solid #eee;
      ">
        <p>
          <span> Orientation: </span>
          <select class="fieldType" id="layoutOriSelection" onchange="recordlayout()">
            <option value="none"></option>
            <option value="Horizontal">Horizontal</option>
            <option value="Vertical">Vertical</option>
            <option value="2-Dimensional">2-Dimensional</option>
            <option value="Radian">Radian</option>
            <option value="Angular">Angular</option>
            <option value="Tangential">Tangential</option>
            <option value="Orthogonal">Orthogonal</option>
            <option value="Customized">Customized</option>
          </select>
        </p>
        <p>
          <span> Horizontal Alignment: </span>
          <select class="fieldType" id="horiLayoutAlignSelection" onchange="recordlayout()">
            <option value="none"></option>
            <option value="Left">Left</option>
            <option value="Center">Center</option>
            <option value="Right">Right</option>
          </select>
        </p>
        <p>
          <span> Vertical Alignment: </span>
          <select class="fieldType" id="vertLayoutAlignSelection" onchange="recordlayout()">
            <option value="none"></option>
            <option value="Bottom">Bottom</option>
            <option value="Middle">Middle</option>
            <option value="Top">Top</option>
          </select>
        </p>
      </div>
      <button class="btn" id="button4LayoutSpec2" style="margin-top: 10px" onclick="recordBatchGroupLayout(event)">
        Apply layout for all groups at the same level
      </button>
    </div>
  </div>
`;

/**
 * Initialize the layout annotation UI
 * Call this function on page load to inject the template into the DOM
 */
export function initializeLayoutAnnotationUI() {
  const container = document.getElementById('container');
  
  // Find the insertion point (after rbox2)
  const rbox2 = document.getElementById('rbox2');
  
  // Create a temporary container to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = layoutAnnotationTemplate();
  
  // Insert the layout annotation section after rbox2
  while (tempDiv.firstChild) {
    container.insertBefore(tempDiv.firstChild, rbox2.nextSibling);
  }
}
