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

    // Create Tabulator columns from header
    const columns = data.header.map(col => ({
      title: col,
      field: col,
      headerSort: true
    }));

    // Convert rows to array of objects
    const tableData = data.rows.map(row => {
      const rowObj = {};
      data.header.forEach((col, idx) => {
        rowObj[col] = row[idx];
      });
      return rowObj;
    });

    // Clear the container and create Tabulator instance
    const container = document.getElementById('datasetTableContainer');
    container.innerHTML = '';

    new Tabulator(container, {
      data: tableData,
      columns: columns,
      layout: "fitColumns",
      height: "400px",
      pagination: true,
      paginationSize: 20,
      paginationSizeSelector: [10, 20, 50, 100]
    });

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
  
  // Create Tabulator columns with editable headers
  const columns = defaultHeaders.map((header, index) => ({
    title: header,
    field: `col${index}`,
    headerSort: false,
    editor: "input",
    headerMenu: [{
      label: "Edit Column Name",
      action: function(e, column) {
        const newName = prompt("Enter new column name:", column.getDefinition().title);
        if (newName && newName.trim()) {
          column.updateDefinition({title: newName});
          window.csvColumns[index] = newName;
          populateColumnDropdowns();
        }
      }
    }]
  }));

  // Create empty placeholder data
  const emptyData = Array(3).fill(null).map(() => {
    const row = {};
    defaultHeaders.forEach((_, idx) => {
      row[`col${idx}`] = '';
    });
    return row;
  });

  // Clear the container and create Tabulator instance
  const container = document.getElementById('datasetTableContainer');
  container.innerHTML = '';
  
  new Tabulator(container, {
    data: emptyData,
    columns: columns,
    layout: "fitColumns",
    height: "250px"
  });
  
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
