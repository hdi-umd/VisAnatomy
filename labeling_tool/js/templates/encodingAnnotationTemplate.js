/**
 * Template for Encoding Annotation UI
 */

/**
 * Template for encoding annotation section
 */
const encodingAnnotationTemplate = () => `
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
    <div id="EncodingAnnotation" style="
      padding: 25px;
      margin-bottom: 10px;
      vertical-align: top;
      width: 49%;
    ">
      <h4>Grouping Structure</h4>
    </div>
    <div id="EncodingSpec" style="
      padding: 25px;
      margin-bottom: 10px;
      vertical-align: top;
      width: 49%;
    ">
      <h4 style="text-align: center">Encoded Channels</h4>
      <p>
        Click to select one group or mark on the left, a set of channels
        will show below.
      </p>
      <p>
        Select the channels that encode data for the selected
        <span id="selectedObjectType"> object </span>
        <span id="selectedGroup4EncodingStage1" style="color: red; margin-bottom: 2px"></span>:
      </p>
      <ul id="channelList"></ul>

      <div>
        <button class="btn" id="button4EncodingSpec" style="margin-top: 10px" onclick="recordBatchEncoding(event)">
          Record encodings for <b>all</b> same-level groups / same-type
          marks
        </button>
      </div>
    </div>
  </div>
`;

/**
 * Initialize the encoding annotation UI
 * Call this function on page load to inject the template into the DOM
 */
function initializeEncodingAnnotationUI() {
  const container = document.getElementById('container');
  
  // Find the insertion point (after rbox2)
  const rbox2 = document.getElementById('rbox2');
  
  // Create a temporary container to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = encodingAnnotationTemplate();
  
  // Insert the encoding annotation section after rbox2
  while (tempDiv.firstChild) {
    container.insertBefore(tempDiv.firstChild, rbox2.nextSibling);
  }
}
