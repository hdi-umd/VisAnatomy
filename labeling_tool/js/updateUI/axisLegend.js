function addAxisConfiguration(forceIndex) {
    const index = forceIndex !== undefined ? forceIndex : VA.axes.length;

    // Only initialize axis data if not forcing an index (i.e., adding new axis)
    if (forceIndex === undefined) {
        axisCount = VA.axes.length;
        VA.axes[axisCount] = { labels: [], fieldType: "Null", title: [], type: "x", ticks: [], path: [] };
    } else {
        axisCount = forceIndex;
    }

    // Use the template to create the axis element
    const axisDiv = window.createAxisElement
        ? window.createAxisElement(axisCount)
        : (() => {
            // Fallback if template module hasn't loaded yet
            const div = document.createElement("div");
            div.className = "axisDiv";
            div.id = `axis_${axisCount}`;
            div.innerHTML = `
              <div class="axisRow">
                <span class="deleteAxis" onclick="deleteAxis(${axisCount})">
                  <svg width="20" height="20">
                    <circle cx="10" cy="10" r="8" fill="#FF6666" />
                    <line x1="6" y1="10" x2="14" y2="10" stroke="white" stroke-width="2" />
                  </svg>
                </span>
                <div class="axisMeta">
                  <select class="axisType fieldType" id="axisType_${axisCount}" onchange="axisTypeChanged(${axisCount})" style="font-size: 12px; width: 60px;">
                    <option value="x">X</option>
                    <option value="y">Y</option>
                    <option value="radian">Radian</option>
                    <option value="angular">Angular</option>
                  </select>
                  <b>Axis</b>
                  <div style="display: inline-block;">
                    <select class="fieldType" id="fieldType_${axisCount}" onchange="fieldTypeChanged(${axisCount})" style="width: 100px; font-size: 12px;">
                      <option value="Null">none</option>
                      <option value="string">categories</option>
                      <option value="number">numbers</option>
                      <option value="date">dates</option>
                    </select>
                    <select class="columnSelect" id="columnSelect_${axisCount}" onchange="columnSelectionChanged(${axisCount})" style="width: 120px; font-size: 12px; margin-left: 5px; display: none">
                      <option value="">Select Column</option>
                    </select>
                    <input type="image" src="labeling_tool/img/select-area.png" onclick="activateAreaSelect(${axisCount});" id="axis${axisCount}Area" width="16px" height="16px" class="selectAreaBtn" style="margin-left: 0px; margin-top: 5px"/>
                  </div>
                </div>
                <div class="axisTitle" id="axisTitle_${axisCount}" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
              </div>
              <div class="axisRow">
                <div class="axisLabels" id="axisLabel_${axisCount}" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
              </div>
            `;
            return div;
        })();

    document
        .getElementById("buttons")
        .insertBefore(axisDiv, document.querySelector(".axisDiv:last-child"));

    // Populate the column dropdown for the new axis if CSV data is available
    if (window.csvColumns) {
        populateColumnDropdowns();
        if (window.csvColumns.length > 0) {
            document.getElementById(`columnSelect_${axisCount}`).style.display = 'none';
        }
    }
}


function deleteAxis(axisIndex) {
    const axisDiv = document.getElementById(`axis_${axisIndex}`);
    axisDiv.remove();

    // Remove the corresponding axis from the axes array
    VA.axes.splice(axisIndex, 1);

    // Update the div IDs for remaining axes
    VA.axes.forEach((axis, newIndex) => {
        const div = document.getElementById(`axis_${newIndex + 1}`);
        if (div) {
            div.id = `axis_${newIndex}`;
            div
                .querySelector(".deleteAxis")
                .setAttribute("onclick", `deleteAxis(${newIndex})`);
            div.querySelector(".axisType").id = `axisType_${newIndex}`;
            div
                .querySelector(".axisType")
                .setAttribute("onchange", `axisTypeChanged(${newIndex})`);
            div.querySelector(".fieldType").id = `fieldType_${newIndex}`;
            div
                .querySelector(".fieldType")
                .setAttribute("onchange", `fieldTypeChanged(${newIndex})`);
            div.querySelector(".selectAreaBtn").id = `axis${newIndex}Area`;
            div
                .querySelector(".selectAreaBtn")
                .setAttribute("onclick", `activateAreaSelect(${newIndex});`);
            div.querySelector(".axisTitle").id = `axisTitle_${newIndex}`;
            div.querySelector(".axisLabels").id = `axisLabel_${newIndex}`;
        }
    });
    axisCount = VA.axes.length;
}
