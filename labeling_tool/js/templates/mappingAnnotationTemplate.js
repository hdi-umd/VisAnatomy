const mappingAnnotationTemplate = () => `
    <div style="position: absolute;
              top: 20px;
              right: 10px;
              display: flex;
              flex-grow: 1;
              width: 40%;
              height: calc(100% - 50px);
              visibility: hidden;">
        <div id="MappingAnnotation" style="padding: 25px; margin-bottom: 10px; vertical-align: top; width: 89%; visibility: visible;">
            <h4>Specify data scope</h4>
            <div id="dataScopeAnnotationDiv"></div>
            
            <h4 style="margin-top: 20px;">Specify data columns for encodings</h4>
            <div id="encodingDataColumnAnnotationDiv"></div>
        </div>
    </div>
`;

const dataScopeAnnotationTemplate = () => `
    <div data-depth="0" data-id="0" data-type="group" style="padding: 8px; border: 1px solid rgb(204, 204, 204); margin-bottom: 2px; background-color: rgb(229, 255, 255); display: flex; flex-direction: column; align-items: flex-start;">
        <span style="font-weight: bold;">Group 0</span>
        <div style="display: flex; flex-flow: row; align-items: center; margin-top: 5px; width: 100%;">
            <span style="margin-right: 5px; white-space: nowrap;">Data Scope: </span>
            <select style="flex-grow: 1; width: auto;"></select>
        </div>
    </div>
`;

const encodingDataColumnAnnotationTemplate = () => `
    <div style="padding: 8px; border: 1px solid rgb(204, 204, 204); margin-bottom: 2px; background-color: rgb(229, 255, 255); display: flex; flex-direction: column; align-items: flex-start;">
        <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 5px;">
            <span style="font-weight: bold; margin-right: 10px; min-width: 50px;">enc1</span>
            <span>circle0: x</span>
        </div>
        <div style="display: flex; flex-flow: row; align-items: center; margin-top: 5px; width: 100%;">
            <span style="margin-right: 5px; white-space: nowrap;">Data Column: </span>
            <select style="flex-grow: 1; width: auto;"></select>
        </div>
        <div style="display: flex; flex-flow: row; align-items: center; margin-top: 5px; width: 100%;">
            <span style="margin-right: 5px; white-space: nowrap;">Share scale with: </span>
            <select style="flex-grow: 1; width: auto;"></select>
        </div>
        <div style="display: flex; flex-direction: row; align-items: center; margin-top: 5px; width: 100%;">
            <input type="checkbox" id="enc1_includeZero" style="margin-right: 5px;"><label for="enc1_includeZero">Include zero</label>
        </div>
        <div style="display: flex; flex-flow: row; align-items: center; margin-top: 5px; width: 100%;">
            <span style="margin-right: 5px; white-space: nowrap;">Scale type: </span>
            <select style="flex-grow: 1; width: auto;"></select>
        </div>
    </div>
`;

function initializeMappingAnnotationUI() {
    const container = document.getElementById('container');

    // Find the insertion point (after rbox2)
    const rbox2 = document.getElementById('rbox2');

    // Create a temporary container to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = mappingAnnotationTemplate();

    // Insert the layout annotation section after rbox2
    while (tempDiv.firstChild) {
        container.insertBefore(tempDiv.firstChild, rbox2.nextSibling);
    }
};
