/**
 * Template for Mark Annotation UI
 */

/**
 * Template for mark type selection dropdown
 */
export const markTypeDropdown = () => `
  <select class="fieldType" id="markTypeSelection" onchange="markAnnotationChanged('Type')">
    <option value="none">Not Assigned</option>
    <option value="Straight Line">Straight Line</option>
    <option value="Polyline">Polyline</option>
    <option value="Rectangle">Rectangle</option>
    <option value="Polygon">Polygon</option>
    <option value="geoPolygon">geoPolygon</option>
    <option value="Circle">Circle</option>
    <option value="Ellipse">Ellipse</option>
    <option value="Pie">Pie</option>
    <option value="Arc">Arc</option>
    <option value="Area">Area</option>
    <option value="Image">Image</option>
    <option value="Text">Text</option>
    <option value="Path">Path</option>
  </select>
`;

/**
 * Template for area mark baseline selection
 */
export const areaMarkBaselineDropdown = () => `
  <select class="fieldType" id="areaMarkBaselineSelection" onchange="markAnnotationChanged('areaMarkBaseline')">
    <option value="none">Not Assigned</option>
    <option value="Left">Left</option>
    <option value="Right">Right</option>
    <option value="Top">Top</option>
    <option value="Bottom">Bottom</option>
    <option value="Center">Center</option>
    <option value="Middle">Middle</option>
  </select>
`;

/**
 * Template for mark role dropdown menu
 */
export const markRoleDropdown = () => `
  <div id="dropdown" class="dropdown">
    <div class="selected-option" onclick="toggleDropdown()">
      Assign a Mark Role
    </div>
    <div id="optionList" class="option-list">
      <div class="option" onclick="markAnnotationChanged('none')">
        Not Assigned
      </div>
      <div class="option" onclick="markAnnotationChanged('Chart Title')">
        Chart Title
      </div>
      <div class="option" onclick="markAnnotationChanged('Main Chart Mark')">
        Main Chart Mark
      </div>
      <div class="option" onclick="markAnnotationChanged('Horizontal Gridline')">
        Horizontal Gridline
      </div>
      <div class="option" onclick="markAnnotationChanged('Vertical Gridline')">
        Vertical Gridline
      </div>
      <div class="option" onclick="markAnnotationChanged('Radian Gridline')">
        Radian Gridline
      </div>
      <div class="option" onclick="markAnnotationChanged('Angular Gridline')">
        Angular Gridline
      </div>
      <div class="option" onclick="markAnnotationChanged('Annotation')">
        Annotation
      </div>
      <div class="option" onclick="toggleSublist(event, 'Axis Label')">
        Axis Label
        <div class="sublist" id="sublabel"></div>
      </div>
      <div class="option" onclick="toggleSublist(event, 'Axis Title')">
        Axis Title
        <div class="sublist" id="subtitle"></div>
      </div>
      <div class="option" onclick="toggleSublist(event, 'Axis Path')">
        Axis Path
        <div class="sublist" id="subpath"></div>
      </div>
      <div class="option" onclick="toggleSublist(event, 'Axis Ticks')">
        Axis Ticks
        <div class="sublist" id="subticks"></div>
      </div>
      <div class="option" onclick="markAnnotationChanged('legend Label')">
        Legend Label
      </div>
      <div class="option" onclick="markAnnotationChanged('legend Title')">
        Legend Title
      </div>
      <div class="option" onclick="markAnnotationChanged('legend Mark')">
        Legend Mark
      </div>
      <div class="option" onclick="markAnnotationChanged('legend Ticks')">
        Legend Ticks
      </div>
    </div>
  </div>
`;

/**
 * Template for the mark annotation controls section
 */
export const markAnnotationControls = () => `
  <div style="width: 100%; padding: 5px">
    <div id="markRoles" style="
      flex-grow: 1;
      background-color: lightblue;
      margin-right: 5px;
      padding-top: 5px;
      padding-left: 10px;
      padding-bottom: 10px;
    ">
      <div style="display: flex; justify-content: space-between">
        <div style="flex-grow: 1; margin-right: 5px">
          Assign a Mark Type
          ${markTypeDropdown()}
        </div>
        <div style="flex-grow: 1; margin-left: 5px">
          Area Mark Baseline
          ${areaMarkBaselineDropdown()}
        </div>
        ${markRoleDropdown()}
      </div>
    </div>
  </div>
`;

/**
 * Template for mark selection lists
 */
export const markSelectionLists = () => `
  <div style="display: flex; flex-grow: 1; width: 100%; height: 95%">
    <div style="
      padding: 0px;
      margin-bottom: 10px;
      vertical-align: top;
      width: 49%;
    ">
      <h4>
        <span style="color: red" id="numberOfMarksSelected">0</span> of
        <span style="color: black" id="totalNumberOfMarks"></span> Marks
        Selected
        <button onclick="disableAllMarkSelections()">Clear</button>
      </h4>
      <div id="allMarks" style="
        height: 85%;
        overflow: scroll;
        overflow: -moz-scrollbars-vertical;
        border: 1px solid #ccc;
        padding-left: 3px;
      "></div>
    </div>
    <div style="
      padding: 5px;
      margin-bottom: 10px;
      vertical-align: top;
      width: 49%;
    ">
      <h4 style="visibility: hidden">Batch Selections</h4>
      <div id="markSelections" style="
        height: 85%;
        overflow: scroll;
        overflow: -moz-scrollbars-vertical;
      "></div>
    </div>
  </div>
`;

/**
 * Template for the complete mark annotation section
 */
export const markAnnotationSectionTemplate = () => `
  <div id="generalizedSelection" style="
    position: absolute;
    top: 20px;
    right: 10px;
    display: flex;
    flex-direction: column;
    width: 40%;
    height: calc(100% - 50px);
    border: #ccc 0px solid;
  ">
    ${markAnnotationControls()}
    ${markSelectionLists()}
  </div>
`;

/**
 * Initialize the mark annotation UI
 * Call this function on page load to inject the template into the DOM
 */
export function initializeMarkAnnotationUI() {
  const container = document.getElementById('container');
  
  // Find the insertion point (after rbox2)
  const rbox2 = document.getElementById('rbox2');
  
  // Create a temporary container to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = markAnnotationSectionTemplate();
  
  // Insert the mark annotation section after rbox2
  while (tempDiv.firstChild) {
    container.insertBefore(tempDiv.firstChild, rbox2.nextSibling);
  }
}
