// Counter for generating unique encoding IDs
let encIdCounter = 0;

function initilizeMappingAnnotation() {
    // Reset encID counter
    encIdCounter = 0;
    
    // Clear existing content
    const dataScopeDiv = document.getElementById('dataScopeAnnotationDiv');
    if (dataScopeDiv) {
        dataScopeDiv.innerHTML = '';
    }

    const encodingDiv = document.getElementById('encodingDataColumnAnnotationDiv');
    if (encodingDiv) {
        encodingDiv.innerHTML = '';
    }

    // Initialize VA.mappings.dataScopes with correct number of levels
    if (!VA.mappings) {
        VA.mappings = {};
    }
    if (!VA.mappings.encodings) {
        VA.mappings.encodings = {};
    }

    const numLevels = VA.grouping && VA.grouping.length > 0 ? getMaxDepth(VA.grouping) + 1 : 0;
    VA.mappings.dataScopes = new Array(numLevels).fill('');

    // Process each top-level group or mark in VA.grouping
    if (VA.grouping && VA.grouping.length > 0) {
        VA.grouping.forEach(item => {
            processItem(item, 0, dataScopeDiv);
        });
    }

    // Create encoding data column annotations for items with encodings
    createEncodingAnnotations();
}

// Calculate the maximum depth in VA.grouping hierarchy
function getMaxDepth(items, currentDepth = 0) {
    let maxDepth = currentDepth;
    if (items && Array.isArray(items)) {
        items.forEach(item => {
            if (item.children && Array.isArray(item.children) && item.children.length > 0) {
                if (typeof item.children[0] === 'object') {
                    // Nested groups
                    maxDepth = Math.max(maxDepth, getMaxDepth(item.children, currentDepth + 1));
                } else {
                    // Leaf group - children are mark IDs, add one more level
                    maxDepth = Math.max(maxDepth, currentDepth + 1);
                }
            }
        });
    }
    return maxDepth;
}

// Helper function to create data scope annotation for a group or mark
function createDataScopeAnnotation(item, depth = 0) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = dataScopeAnnotationTemplate();
    const annotationDiv = tempDiv.firstElementChild;

    // Update the data attributes and content
    annotationDiv.setAttribute('data-depth', depth);
    annotationDiv.setAttribute('data-id', item.id || '0');

    if (item.children && Array.isArray(item.children) && item.children.length > 0) {
        // This is a group
        annotationDiv.setAttribute('data-type', 'group');
        annotationDiv.querySelector('span').textContent = `Group ${item.id}`;
    } else {
        // This is a mark
        annotationDiv.setAttribute('data-type', 'mark');
        annotationDiv.querySelector('span').textContent = `Mark ${item.id || item}`;
    }

    // Populate the dropdown with data scope options
    const dropdown = annotationDiv.querySelector('select');
    if (dropdown) {
        // Clear existing options
        dropdown.innerHTML = '';

        // Add "entire dataset" option (undefined value)
        const entireDatasetOption = document.createElement('option');
        entireDatasetOption.value = "";
        entireDatasetOption.textContent = 'entire dataset';
        dropdown.appendChild(entireDatasetOption);

        // Add dataset headers if available
        if (VA.dataset && VA.dataset.header) {
            VA.dataset.header.forEach(header => {
                const option = document.createElement('option');
                option.value = header;
                option.textContent = header;
                dropdown.appendChild(option);
            });
        }

        // Add "data row" option
        const dataRowOption = document.createElement('option');
        dataRowOption.value = 'data row';
        dataRowOption.textContent = 'data row';
        dropdown.appendChild(dataRowOption);

        // Add change event listener to update VA.mappings.dataScopes
        dropdown.addEventListener('change', function (event) {
            const selectedValue = event.target.value;
            const depth = parseInt(annotationDiv.getAttribute('data-depth'));

            // Ensure the array is large enough
            while (VA.mappings.dataScopes.length <= depth) {
                VA.mappings.dataScopes.push(undefined);
            }

            // Update the appropriate index
            VA.mappings.dataScopes[depth] = selectedValue;

            console.log('Updated VA.mappings.dataScopes:', VA.mappings.dataScopes);
        });
    }

    return annotationDiv;
}

// Helper function to recursively process groups and marks
function processItem(item, depth = 0, container = null) {
    if (!item) return;

    // Get the container if not provided
    if (!container) {
        container = document.getElementById('dataScopeAnnotationDiv');
    }

    // Create annotation for this item
    const annotationDiv = createDataScopeAnnotation(item, depth);
    container.appendChild(annotationDiv);

    // If this item has children, process them recursively
    if (item.children && Array.isArray(item.children) && item.children.length > 0) {
        // Check if children are objects (nested groups) or strings (mark IDs)
        if (typeof item.children[0] === 'object') {
            // Nested groups
            // item.children.forEach(child => {
            //     processItem(child, depth + 1, container);
            // });
            processItem(item.children[0], depth + 1, container);
        } else {
            // Leaf group - children are mark IDs, create annotations for individual marks
            // item.children.forEach(markId => {
            //     const markItem = { id: markId };
            //     const markAnnotationDiv = createDataScopeAnnotation(markItem, depth + 1);
            //     container.appendChild(markAnnotationDiv);
            // });
            const markId = item.children[0];
            const markItem = { id: markId };
            const markAnnotationDiv = createDataScopeAnnotation(markItem, depth + 1);
            container.appendChild(markAnnotationDiv);
        }
    }
}

// Helper function to update encodings for a specific channel
function updateEncoding(key, channel, property, value, encId) {
    if (!VA.mappings.encodings[key]) {
        VA.mappings.encodings[key] = {};
    }
    if (!VA.mappings.encodings[key][channel]) {
        VA.mappings.encodings[key][channel] = { id: encId };
    }
    VA.mappings.encodings[key][channel][property] = value;
    console.log('Updated VA.mappings.encodings:', VA.mappings.encodings);
}

// Helper function to create encoding annotation div
function createEncodingDiv(key, encodings) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = encodingDataColumnAnnotationTemplate();
    const annotationDiv = tempDiv.firstElementChild;

    // Generate unique encID
    const encId = `enc${++encIdCounter}`;

    // Update the encoding identifier and description using class selectors
    const encLabel = annotationDiv.querySelector('.encID');
    const encDescription = annotationDiv.querySelector('.encDescription');
    
    if (encLabel && encDescription) {
        encLabel.textContent = encId;
        encDescription.textContent = `${key}:${encodings.join(', ')}`;
    }

    // Populate dropdowns with dataset headers if available
    const dropdowns = annotationDiv.querySelectorAll('select');
    if (VA.dataset && VA.dataset.header) {
        dropdowns.forEach(dropdown => {
            // Clear existing options
            dropdown.innerHTML = '';
            
            // Add empty option
            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = 'Select...';
            dropdown.appendChild(emptyOption);
            
            // Add dataset headers
            VA.dataset.header.forEach(header => {
                const option = document.createElement('option');
                option.value = header;
                option.textContent = header;
                dropdown.appendChild(option);
            });
        });
    }

    // Set unique IDs for checkbox and label
    const checkbox = annotationDiv.querySelector('input[type="checkbox"]');
    const checkboxLabel = annotationDiv.querySelector('label');
    if (checkbox && checkboxLabel) {
        const uniqueId = key.replace(/\s+/g, '_') + '_includeZero';
        checkbox.id = uniqueId;
        checkboxLabel.setAttribute('for', uniqueId);
    }

    // Initialize encodings structure for this key
    if (!VA.mappings.encodings[key]) {
        VA.mappings.encodings[key] = {};
    }

    // Add event listeners to update VA.mappings.encodings
    const dataColumnSelect = dropdowns[0]; // First dropdown is Data Column
    const shareScaleSelect = dropdowns[1]; // Second dropdown is Share scale with
    const scaleTypeSelect = dropdowns[2]; // Third dropdown is Scale type

    // Add event listeners for each encoding channel
    encodings.forEach((channel, index) => {
        // Initialize the channel if it doesn't exist
        if (!VA.mappings.encodings[key][channel]) {
            VA.mappings.encodings[key][channel] = { id: encId };
        }

        // Data Column dropdown
        if (dataColumnSelect) {
            dataColumnSelect.addEventListener('change', function(event) {
                updateEncoding(key, channel, 'attr', event.target.value, encId);
            });
        }

        // Scale Type dropdown
        if (scaleTypeSelect) {
            // Populate scale type options
            scaleTypeSelect.innerHTML = '';
            const scaleTypes = ['', 'linear', 'log', 'sqrt', 'pow'];
            scaleTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type || 'Select...';
                scaleTypeSelect.appendChild(option);
            });

            scaleTypeSelect.addEventListener('change', function(event) {
                if (event.target.value) {
                    updateEncoding(key, channel, 'scaleType', event.target.value, encId);
                }
            });
        }

        // Include Zero checkbox
        if (checkbox) {
            checkbox.addEventListener('change', function(event) {
                updateEncoding(key, channel, 'includeZero', event.target.checked, encId);
            });
        }
    });

    return annotationDiv;
}

// Helper function to determine the hierarchical level of an object in VA.grouping
function getObjectLevel(objectKey, grouping = VA.grouping) {
    function findInGroup(group, currentDepth = 0) {
        if (!group) return null;
        
        // If this is an array of groups, search each group
        if (Array.isArray(group)) {
            for (const subGroup of group) {
                const result = findInGroup(subGroup, currentDepth);
                if (result !== null) return result;
            }
        } else if (group.children) {
            // Check if objectKey matches this group's ID
            if (group.id === objectKey) {
                return currentDepth;
            }
            // Check children
            if (Array.isArray(group.children)) {
                if (typeof group.children[0] === 'string') {
                    // Leaf group - check if objectKey is in the mark IDs
                    if (group.children.includes(objectKey)) {
                        return currentDepth + 1; // Marks are one level deeper than their group
                    }
                } else {
                    // Internal group - recurse into children
                    for (const child of group.children) {
                        const result = findInGroup(child, currentDepth + 1);
                        if (result !== null) return result;
                    }
                }
            }
        }
        return null;
    }
    
    return findInGroup(grouping);
}

// Helper function to get mark type for an object
function getObjectMarkType(objectKey) {
    // Check if it's a group
    if (objectKey.startsWith('Group ')) {
        return 'Group';
    }
    // Check if it's an individual mark
    if (VA.allElements && VA.allElements[objectKey]) {
        return VA.allElements[objectKey].type || 'unknown';
    }
    return 'unknown';
}

// Helper function to create encoding data column annotations for items with encodings
function createEncodingAnnotations() {
    const encodingDiv = document.getElementById('encodingDataColumnAnnotationDiv');
    if (!encodingDiv || !VA.objectEncodings) return;
    console.log(VA.objectEncodings);
    
    // Group objects by level, mark type, and encoding channels
    const groups = {};
    
    Object.entries(VA.objectEncodings).forEach(([key, encodings]) => {
        if (encodings && Array.isArray(encodings) && encodings.length > 0) {
            const level = getObjectLevel(key);
            const markType = getObjectMarkType(key);
            const encodingChannels = encodings.sort().join(','); // Sort for consistent comparison
            
            const groupKey = `${level}-${markType}-${encodingChannels}`;
            
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push({ key, encodings });
        }
    });
    
    // Create div only for the first object in each group
    Object.values(groups).forEach(group => {
        if (group.length > 0) {
            const firstObject = group[0];
            const encodingAnnotation = createEncodingDiv(firstObject.key, firstObject.encodings);
            encodingDiv.appendChild(encodingAnnotation);
        }
    });
}