/**
 * Template for Chart Title section
 */
const chartTitleTemplate = () => `
  <div id="chartTitleDiv" style="overflow-y: auto; max-height: 400px">
    <div style="margin-left: 5px; font-weight: bold">Chart Title</div>
    <div id="chartTitle" class="chartTitle" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
  </div>
`;

/**
 * Template for a single axis configuration
 * @param {number} axisIndex - The index of the axis (1, 2, etc.)
 */
const axisTemplate = (axisIndex) => `
  <div class="axisDiv" id="axis_${axisIndex}">
    <div class="axisRow">
      <span class="deleteAxis" onclick="deleteAxis(${axisIndex})">
        <svg width="20" height="20">
          <circle cx="10" cy="10" r="8" fill="#FF6666" />
          <line x1="6" y1="10" x2="14" y2="10" stroke="white" stroke-width="2" />
        </svg>
      </span>
      <div class="axisMeta">
        <select class="axisType fieldType" id="axisType_${axisIndex}" onchange="axisTypeChanged(${axisIndex})"
          style="font-size: 12px; width: 60px">
          <option value="x">X</option>
          <option value="y">Y</option>
          <option value="radian">Radian</option>
          <option value="angular">Angular</option>
        </select>
        <b>Axis</b>
        <div style="display: inline-block">
          <select class="fieldType" id="fieldType_${axisIndex}" onchange="fieldTypeChanged(${axisIndex})"
            style="width: 100px; font-size: 12px">
            <option value="Null">none</option>
            <option value="string">categories</option>
            <option value="number">numbers</option>
            <option value="date">dates</option>
          </select>
          <select class="columnSelect" id="columnSelect_${axisIndex}" onchange="columnSelectionChanged(${axisIndex})"
            style="width: 100px; font-size: 12px; margin-left: 5px; display: none">
          </select>
          <input type="image" src="labeling_tool/img/select-area.png" onclick="activateAreaSelect(${axisIndex});"
            id="axis${axisIndex}Area" width="16px" height="16px" class="selectAreaBtn"
            style="margin-left: 0px; margin-top: 5px" />
        </div>
      </div>
      <div class="axisTitle" id="axisTitle_${axisIndex}" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
    </div>
    <div class="axisLabels" id="axisLabel_${axisIndex}" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
  </div>
`;

/**
 * Template for Legend section
 */
const legendTemplate = () => `
  <div class="axisDiv">
    <div class="axisRow">
      <div class="axisMeta">
        <b>Legend</b>
        <select class="fieldType" id="legendFieldType" onchange="legendFieldTypeChanged()">
          <option value="Null">none</option>
          <option value="string">categories</option>
          <option value="number">numbers</option>
          <option value="date">dates</option>
        </select>
        <select class="columnSelect" id="legendColumnSelect" onchange="legendColumnSelectionChanged()"
          style="width: 120px; font-size: 12px; margin-left: 5px; display: none">
          <option value="">Select Column</option>
        </select>
        <input type="image" src="labeling_tool/img/select-area.png" id="legendArea"
          onclick="activateAreaSelect('legend');" width="16px" height="16px" class="selectAreaBtn" />
      </div>
      <div class="axisTitle" ondrop="drop(event)" ondragover="allowDrop(event)" id="legendTitle"></div>
    </div>
    <div class="axisRow">
      <div class="axisLabels" id="legendLabels" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
    </div>
  </div>
`;

/**
 * Template for the complete Axis & Legend section
 * @param {boolean} includeDefaultAxes - Whether to include the default 2 axes (false when loading annotations)
 */
const axisLegendSectionTemplate = (includeDefaultAxes = false) => `
  <div class="mainbox" id="axisAndLegend" style="overflow-y: auto">
    <div style="margin-left: 5px">
      <span style="margin-right: 20px; font-weight: bold">Axes and Legends</span>
      <button style="height: 20px; cursor: pointer; font-size: 12.5px" onclick="addAxisConfiguration();">
        Add an Axis
      </button>
    </div>
    <div class="float-container" id="buttons" style="display: block">
      ${includeDefaultAxes ? axisTemplate(1) + axisTemplate(2) : ''}
      ${legendTemplate()}
    </div>
  </div>
`;

/**
 * Initialize the chart title and axis/legend UI
 * Call this function on page load to inject the templates into the DOM
 */
function initializeAxisLegendUI() {
  const container = document.getElementById('container');

  // Find the insertion point (after rbox2)
  const rbox2 = document.getElementById('rbox2');

  // Create a temporary container to parse the HTML
  const tempDiv = document.createElement('div');
  // Don't include default axes - they will be added by annotation loading or extract()
  tempDiv.innerHTML = chartTitleTemplate() + axisLegendSectionTemplate(false);

  // Insert each element after rbox2
  while (tempDiv.firstChild) {
    rbox2.parentNode.insertBefore(tempDiv.firstChild, rbox2.nextSibling);
  }
}

/**
 * Create a new axis DOM element using the template
 * @param {number} axisIndex - The index for the new axis
 * @returns {HTMLElement} - The axis div element
 */
function createAxisElement(axisIndex) {
  const axisDiv = document.createElement('div');
  axisDiv.innerHTML = axisTemplate(axisIndex);
  return axisDiv.firstElementChild;
}



