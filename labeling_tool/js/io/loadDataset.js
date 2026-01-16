/**
 * Dataset loading and management functions
 */

/**
 * Infer the data type of a column based on its values
 * @param {Array} values - Array of values from a column
 * @returns {string} The inferred data type ('number', 'date', or 'string')
 */
function inferDataType(values) {
  if (!values || values.length === 0) return 'string';
  
  // Filter out empty values
  const nonEmptyValues = values.filter(v => v !== null && v !== undefined && v !== '');
  if (nonEmptyValues.length === 0) return 'string';
  
  // Check if all non-empty values are numbers
  const allNumbers = nonEmptyValues.every(v => {
    const num = Number(v);
    return !isNaN(num) && v.toString().trim() !== '';
  });
  
  if (allNumbers) return 'number';
  
  // Check if values look like dates
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/,  // YYYY-MM-DD
    /^\d{1,2}\/\d{1,2}\/\d{4}$/,  // MM/DD/YYYY or M/D/YYYY
    /^\d{1,2}-\d{1,2}-\d{4}$/,  // MM-DD-YYYY
    /^\d{4}\/\d{2}\/\d{2}$/,  // YYYY/MM/DD
  ];
  
  const mostlyDates = nonEmptyValues.filter(v => {
    const str = v.toString().trim();
    return datePatterns.some(pattern => pattern.test(str)) || !isNaN(Date.parse(str));
  }).length / nonEmptyValues.length > 0.5;
  
  if (mostlyDates) return 'date';
  
  return 'string';
}

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

    displayTable(data.header, data.rows);

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
  
  // Create default column headers and empty data
  const defaultHeaders = ['Column 1', 'Column 2', 'Column 3'];
  const emptyRows = Array(3).fill(null).map(() => Array(3).fill(''));
  
  displayTable(defaultHeaders, emptyRows);
}

/**
 * Display table with Tabulator
 * @param {Array} headers - Column headers
 * @param {Array} rows - Data rows (array of arrays)
 */
function displayTable(headers, rows) {
  // Store CSV columns globally for dropdown population
  VA.csvColumns = [...headers];

  // Infer or initialize data types for each column
  if (!VA.csvDataTypes || VA.csvDataTypes.length !== headers.length) {
    VA.csvDataTypes = headers.map((header, idx) => {
      const columnValues = rows.map(row => row[idx]);
      const inferredType = inferDataType(columnValues);
      // Map to FieldTypes format
      if (inferredType === 'number') return FieldTypes.NUMBER;
      if (inferredType === 'date') return FieldTypes.DATE;
      return FieldTypes.STRING;
    });
  }

  // Create Tabulator columns from headers with custom title formatter
  const columns = headers.map((header, index) => ({
    title: header,
    field: header,
    headerSort: true,
    titleFormatter: function(cell, formatterParams, onRendered) {
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '4px';
      container.style.width = '100%';
      
      // Column name
      const nameDiv = document.createElement('div');
      nameDiv.textContent = header;
      nameDiv.style.fontWeight = 'bold';
      nameDiv.style.fontSize = '13px';
      container.appendChild(nameDiv);
      
      // Dropdown for data type
      const select = document.createElement('select');
      select.style.width = '100%';
      select.style.fontSize = '11px';
      select.style.padding = '2px';
      select.style.border = '1px solid #ccc';
      select.style.borderRadius = '3px';
      select.style.backgroundColor = '#fff';
      
      // Add options from FieldTypes
      Object.values(FieldTypes).forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        if (type === VA.csvDataTypes[index]) {
          option.selected = true;
        }
        select.appendChild(option);
      });
      
      // Handle change event
      select.addEventListener('change', function(e) {
        VA.csvDataTypes[index] = e.target.value;
        console.log(`Column "${header}" data type changed to: ${e.target.value}`);
      });
      
      // Prevent sorting when clicking on dropdown
      select.addEventListener('click', function(e) {
        e.stopPropagation();
      });
      
      container.appendChild(select);
      return container;
    }
  }));

  // Convert rows to array of objects
  const tableData = rows.map(row => {
    const rowObj = {};
    headers.forEach((col, idx) => {
      rowObj[col] = row[idx] || '';
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
  VA.csvColumns[index] = newValue;
  
  // Update all dropdown options
  populateColumnDropdowns();
  
  console.log(`Column ${index} renamed to: ${newValue}`);
}

/**
 * Populate column dropdowns with available CSV columns
 */
function populateColumnDropdowns() {
  if (!VA.csvColumns) return;

  // Populate existing axis column dropdowns
  document.querySelectorAll('.columnSelect').forEach(select => {
    // Clear existing options except the first default option
    while (select.options.length > 1) {
      select.remove(1);
    }

    // Add CSV columns as options
    VA.csvColumns.forEach(column => {
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
