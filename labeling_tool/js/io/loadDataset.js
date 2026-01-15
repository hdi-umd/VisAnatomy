/**
 * Dataset loading and management functions
 */

/**
 * Check if a CSV file exists on the server
 * @param {string} fileName - The name of the CSV file to check
 * @returns {Promise<boolean>} True if the file exists, false otherwise
 */
async function checkCSVExists(fileName) {
  console.log(`Checking if CSV ${fileName} exists...`);
  const res = await fetch("/check_csv_exists/" + fileName);
  if (!res.ok) return false;
  const body = await res.json();
  return body.exists;
}

/**
 * Display CSV data in the dataset table container
 * @param {string} fileName - The name of the CSV file to load
 */
async function displayCSVData(fileName) {
  console.log(`Loading CSV data for ${fileName}...`);
  try {
    const res = await fetch("/get_csv_data/" + fileName);
    if (!res.ok) {
      console.error("Failed to fetch CSV data");
      return;
    }
    const data = await res.json();

    // Store CSV columns globally for dropdown population
    window.csvColumns = data.header;

    // Create table HTML
    let tableHTML = '<table>';

    // Add header row
    tableHTML += '<thead><tr>';
    data.header.forEach(col => {
      tableHTML += `<th>${col}</th>`;
    });
    tableHTML += '</tr></thead>';

    // Add data rows
    tableHTML += '<tbody>';
    data.rows.forEach((row, idx) => {
      tableHTML += '<tr>';
      row.forEach(cell => {
        tableHTML += `<td>${cell}</td>`;
      });
      tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';

    // Update the dataset drawer with the table
    document.getElementById('datasetTableContainer').innerHTML = tableHTML;

    // Populate all column dropdowns
    populateColumnDropdowns();

  } catch (error) {
    console.error("Error loading CSV data:", error);
    document.getElementById('datasetTableContainer').innerHTML =
      '<p style="color: red;">Error loading CSV data</p>';
  }
}

/**
 * Display an empty editable table when no CSV file is available
 */
function displayEmptyEditableTable() {
  console.log("Displaying empty editable table...");
  
  // Create default column headers
  const defaultHeaders = ['Column 1', 'Column 2', 'Column 3'];
  window.csvColumns = [...defaultHeaders]; // Store globally for dropdown population
  
  // Create editable table HTML
  let tableHTML = '<table style="border-collapse: collapse; width: 100%; font-size: 12px; margin: 10px;">';
  
  // Add editable header row
  tableHTML += '<thead><tr>';
  defaultHeaders.forEach((header, index) => {
    tableHTML += `<th style="border: 1px solid #ddd; padding: 8px; background-color: #4CAF50; color: white; text-align: left;">
      <input type="text" value="${header}" 
             style="background: transparent; border: none; color: white; font-weight: bold; width: 100%;"
             onchange="updateColumnHeader(${index}, this.value)"
             placeholder="Column ${index + 1}">
    </th>`;
  });
  tableHTML += '</tr></thead>';
  
  // Add empty data rows with placeholder
  tableHTML += '<tbody>';
  for (let i = 0; i < 3; i++) {
    const bgColor = i % 2 === 0 ? '#f2f2f2' : 'white';
    tableHTML += `<tr style="background-color: ${bgColor};">`;
    defaultHeaders.forEach(() => {
      tableHTML += `<td style="border: 1px solid #ddd; padding: 8px; color: #999;">No data available</td>`;
    });
    tableHTML += '</tr>';
  }
  tableHTML += '</tbody></table>';
  
  // Update the chartDatasetDiv with the editable table
  document.getElementById('chartDatasetDiv').innerHTML = 
    '<div style="margin-left: 5px; font-weight: bold">Dataset (No CSV file found)</div>' + tableHTML;
  
  // Populate column dropdowns with default headers
  populateColumnDropdowns();
}

/**
 * Update a column header in the editable table
 * @param {number} index - The index of the column to update
 * @param {string} newValue - The new header value
 */
function updateColumnHeader(index, newValue) {
  if (!newValue.trim()) {
    newValue = `Column ${index + 1}`;
  }
  
  // Update the global csvColumns array
  window.csvColumns[index] = newValue;
  
  // Update all dropdown options
  populateColumnDropdowns();
  
  console.log(`Column ${index} renamed to: ${newValue}`);
}

/**
 * Populate column dropdowns with available CSV columns
 */
function populateColumnDropdowns() {
  if (!window.csvColumns) return;

  // Populate existing axis column dropdowns
  document.querySelectorAll('.columnSelect').forEach(select => {
    // Clear existing options except the first default option
    while (select.options.length > 1) {
      select.remove(1);
    }

    // Add CSV columns as options
    window.csvColumns.forEach(column => {
      const option = document.createElement('option');
      option.value = column;
      option.textContent = column;
      select.appendChild(option);
    });
  });
}

/**
 * Show column dropdown selectors
 */
function showColumnDropdowns() {
  document.querySelectorAll('.columnSelect').forEach(select => {
    select.style.display = 'inline-block';
  });
}

/**
 * Hide column dropdown selectors
 */
function hideColumnDropdowns() {
  document.querySelectorAll('.columnSelect').forEach(select => {
    select.style.display = 'none';
  });
}

/**
 * Handle column selection change for an axis
 * @param {number} axisIndex - The index of the axis
 */
function columnSelectionChanged(axisIndex) {
  const columnSelect = document.getElementById(`columnSelect_${axisIndex}`);
  const selectedColumn = columnSelect.value;
  console.log(`Axis ${axisIndex} mapped to column: ${selectedColumn}`);

  // Store the mapping in the axes object
  if (!VA.axes[axisIndex]) {
    VA.axes[axisIndex] = {labels: [], fieldType: "Null", title: [], type: "x", ticks: [], path: []};
  }
  VA.axes[axisIndex].dataColumn = selectedColumn;
}

/**
 * Handle column selection change for legend
 */
function legendColumnSelectionChanged() {
  const legendColumnSelect = document.getElementById('legendColumnSelect');
  const selectedColumn = legendColumnSelect.value;
  console.log(`Legend mapped to column: ${selectedColumn}`);

  // Store the mapping in the legend object
  if (!window.legend) {
    window.legend = {};
  }
  window.legend.dataColumn = selectedColumn;
}
