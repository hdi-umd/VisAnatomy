/**
 * Template for Group Annotation UI
 */

/**
 * Template for higher level groups section
 */
export const higherLevelGroupsSection = () => `
  <div id="higherLevelGroups" style="
    position: absolute;
    top: 0;
    left: 0;
    overflow: scroll;
    overflow: -moz-scrollbars-vertical;
    height: 100%;
    width: 100%;
    border: 0px solid rgb(102, 105, 105);
    padding: 5px;
    margin-bottom: 10px;
    visibility: hidden;
  ">
    <h4>
      Select groups by clicking or
      <button type="button" style="
        padding: 1px 1px;
        margin-left: 2.5px;
        margin-right: 2.5px;
        vertical-align: middle;
      " onclick="selectAllGroups()">
        select all groups
      </button>
    </h4>
    <div style="margin-bottom: 40px">
      <button type="button" style="
        padding: 1px 1px;
        margin-left: 2.5px;
        margin-right: 2.5px;
        vertical-align: middle;
      " onclick="mergeGroups()">
        merge selected groups
      </button>
      <button type="button" style="
        padding: 1px 1px;
        margin-left: 2.5px;
        margin-right: 2.5px;
        vertical-align: middle;
      " onclick="clearMergedGroups()">
        clear grouping
      </button>
    </div>
  </div>
`;

/**
 * Template for current section (mark selection and grouping)
 */
export const currentSectionTemplate = () => `
  <div id="current-section" style="
    border: 0px solid rgb(102, 105, 105);
    padding: 5px;
    margin-bottom: 10px;
  ">
    <div style="font-weight: bold; margin-bottom: 3px">
      Select a group of main chart marks by drawing a rectangle using
      your mouse on the visualization; or choose one of the options
      below:
    </div>
    <button class="btn selectionBtn" onclick="selectAllMarks()">
      Select all main chart marks
    </button>
    <div id="typeBasedSelection"></div>
    <div id="colorBasedGroupSelection"></div>

    <div style="margin-top: 20px">
      <span id="selectionForGrouping">0</span> marks selected
      <button class="btn" id="button4FormingGroups" style="margin-bottom: 5px"
        onclick="clickEvent4FormingGroupButton(event)">
        Group selected marks
      </button>
    </div>
    <div id="selectedGroup" style="
      border: 1.5px solid #aaa;
      height: 75px;
      overflow: scroll;
      overflow: -moz-scrollbars-vertical;
      padding: 5px;
      margin: 0px 0 5px 0;
    "></div>
  </div>
`;

/**
 * Template for specified groups section
 */
export const specifiedGroupsTemplate = () => `
  <div id="specifiedGroupsHeader" style="margin-top: 20px">
    Current grouping
    <button type="button" onclick="clearGrouping()" style="margin-bottom: 5px">
      Clear Grouping
    </button>
  </div>
  <div id="specifiedGroups" style="
    overflow: scroll;
    overflow: -moz-scrollbars-vertical;
    height: 200px;
    border: 0.5px solid #aaa;
    padding: 5px;
    margin-bottom: 10px;
  "></div>
  <button type="button" style="
    padding: 3px;
    margin-left: 2.5px;
    margin-right: 2.5px;
    margin-top: 20px;
    vertical-align: middle;
  " id="higherGroupBtn" onclick="go2HigherGrouping()">
    Next: Specify higher-level groups >>
  </button>
`;

/**
 * Template for possible other groups container
 */
export const possibleOtherGroupsTemplate = () => `
  <div id="possibleOtherGroupsContainer" style="
    visibility: hidden;
    border: 2px solid rgb(102, 105, 105);
    padding: 5px;
  ">
    <h4>Here display possible other valid mark groups.</h4>
    <p>
      Please hover over each label to see the highlight for the
      corresponding mark group, and decide if you would like to accept
      it or not by clicking the corresponding button shown below.
    </p>
    <div id="possibleOtherGroups" style="
      overflow: scroll;
      overflow: -moz-scrollbars-vertical;
      height: 200px;
    "></div>
    <button class="btn" onclick="acceptInferredGroups()">Accept</button>
    <button class="btn" onclick="rejectInferredGroups()">Reject</button>
  </div>
`;

/**
 * Template for the complete group selection section
 */
export const groupSelectionTemplate = () => `
  <div id="groupSelection" style="
    position: absolute;
    top: 20px;
    right: 10px;
    width: 40%;
    height: calc(100% - 50px);
    border: #ccc 0px solid;
  ">
    ${higherLevelGroupsSection()}
    ${currentSectionTemplate()}
    ${specifiedGroupsTemplate()}
    ${possibleOtherGroupsTemplate()}
  </div>
`;

/**
 * Initialize the group annotation UI
 * Call this function on page load to inject the templates into the DOM
 */
export function initializeGroupAnnotationUI() {
  const container = document.getElementById('container');
  
  // Find the insertion point (after the comment for mark annotation)
  const rbox2 = document.getElementById('rbox2');
  
  // Create a temporary container to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = groupSelectionTemplate();
  
  // Insert all group annotation sections after rbox2
  while (tempDiv.firstChild) {
    container.insertBefore(tempDiv.firstChild, rbox2.nextSibling);
  }
}
