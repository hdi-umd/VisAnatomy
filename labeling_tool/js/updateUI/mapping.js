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

    // Initialize or preserve VA.mappings structure
    if (!VA.mappings) {
        VA.mappings = {};
    }
    
    // Preserve existing encodings if they were loaded from file
    const existingEncodings = VA.mappings.encodings || {};
    const existingDataScopes = VA.mappings.dataScopes || [];
    
    if (!VA.mappings.encodings) {
        VA.mappings.encodings = {};
    }

    const numLevels = VA.grouping && VA.grouping.length > 0 ? getMaxDepth(VA.grouping) + 1 : 0;
    
    // Initialize dataScopes array if it doesn't exist or is too short
    if (!VA.mappings.dataScopes || VA.mappings.dataScopes.length < numLevels) {
        VA.mappings.dataScopes = new Array(numLevels).fill('');
        // Copy over existing values if they were loaded
        if (existingDataScopes.length > 0) {
            for (let i = 0; i < Math.min(existingDataScopes.length, numLevels); i++) {
                VA.mappings.dataScopes[i] = existingDataScopes[i] || '';
            }
        }
    }

    // Process each top-level group or mark in VA.grouping
    if (VA.grouping && VA.grouping.length > 0) {
        VA.grouping.forEach(item => {
            processItem(item, 0, dataScopeDiv);
        });
    }

    // Create encoding data column annotations for items with encodings
    createEncodingAnnotations();
    
    // Populate controls from loaded mappings
    populateControlsFromMappings();
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

    let marks = [];
    if (item.children && Array.isArray(item.children) && item.children.length > 0) {
        // This is a group
        annotationDiv.setAttribute('data-type', 'group');
        annotationDiv.querySelector('span').textContent = `Group ${item.id}`;
        // Get marks for this group
        marks = getGroupMarks(item.id);
    } else {
        // This is a mark
        annotationDiv.setAttribute('data-type', 'mark');
        annotationDiv.querySelector('span').textContent = `Mark ${item.id || item}`;
        // Single mark
        marks = [item.id || item];
    }

    // Add hover highlighting functionality to the span
    const spanElement = annotationDiv.querySelector('span');
    if (spanElement && marks.length > 0) {
        d3.select(spanElement)
            .on('mouseover', function() {
                d3.select(this).style('cursor', 'pointer');
                marks.forEach(mark => {
                    d3.select('#' + mark).style('opacity', '1');
                });
            })
            .on('mouseout', function() {
                marks.forEach(mark => {
                    d3.select('#' + mark).style('opacity', '0.3');
                });
            });
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

// Helper function to create encoding annotation div for a single channel
function createEncodingDiv(key, channel) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = encodingDataColumnAnnotationTemplate();
    const annotationDiv = tempDiv.firstElementChild;

    // Check if encoding already exists in loaded mappings and use its ID
    let encId;
    let existingEncoding = null;
    if (VA.mappings.encodings[key] && VA.mappings.encodings[key][channel] && VA.mappings.encodings[key][channel].id) {
        encId = VA.mappings.encodings[key][channel].id;
        existingEncoding = VA.mappings.encodings[key][channel];
        // Extract the numeric part from encId (e.g., "enc1" -> 1) to update counter
        const idNum = parseInt(encId.replace('enc', ''));
        if (!isNaN(idNum) && idNum > encIdCounter) {
            encIdCounter = idNum;
        }
    } else {
        // Generate unique encID
        encId = `enc${++encIdCounter}`;
    }

    // Update the encoding identifier and description using class selectors
    const encLabel = annotationDiv.querySelector('.encID');
    const encDescription = annotationDiv.querySelector('.encDescription');
    
    if (encLabel && encDescription) {
        encLabel.textContent = encId;
        encDescription.textContent = `${key}: ${channel}`;
        
        // Add hover highlighting functionality to the encDescription span
        let marks = [];
        if (key.startsWith('Group ')) {
            // This is a group - extract group ID and get marks
            const groupId = key.replace('Group ', '');
            marks = getGroupMarks(groupId);
        } else {
            // This is an individual mark
            marks = [key];
        }
        
        if (marks.length > 0) {
            d3.select(encDescription)
                .on('mouseover', function() {
                    d3.select(this).style('cursor', 'pointer');
                    marks.forEach(mark => {
                        d3.select('#' + mark).style('opacity', '1');
                    });
                })
                .on('mouseout', function() {
                    marks.forEach(mark => {
                        d3.select('#' + mark).style('opacity', '0.3');
                    });
                });
        }
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
        const uniqueId = `${key.replace(/\s+/g, '_')}_${channel}_includeZero`;
        checkbox.id = uniqueId;
        checkboxLabel.setAttribute('for', uniqueId);
    }

    // Initialize encodings structure for this key and channel
    if (!VA.mappings.encodings[key]) {
        VA.mappings.encodings[key] = {};
    }
    if (!VA.mappings.encodings[key][channel]) {
        VA.mappings.encodings[key][channel] = { id: encId };
    }

    // Add event listeners to update VA.mappings.encodings
    const dataColumnSelect = dropdowns[0]; // First dropdown is Data Column
    const shareScaleSelect = dropdowns[1]; // Second dropdown is Share scale with
    const scaleTypeSelect = dropdowns[2]; // Third dropdown is Scale type

    // Data Column dropdown
    if (dataColumnSelect) {
        dataColumnSelect.addEventListener('change', function(event) {
            const value = event.target.value;
            if (value) {
                updateEncoding(key, channel, 'attr', value, encId);
            } else {
                // Remove attr property if value is empty
                if (VA.mappings.encodings[key] && VA.mappings.encodings[key][channel]) {
                    delete VA.mappings.encodings[key][channel].attr;
                    console.log('Updated VA.mappings.encodings:', VA.mappings.encodings);
                }
            }
        });
    }

    // Share scale with dropdown
    if (shareScaleSelect) {
        shareScaleSelect.addEventListener('change', function(event) {
            const value = event.target.value;
            if (value) {
                updateEncoding(key, channel, 'shareScale', value, encId);
            } else {
                // Remove shareScale property if value is empty
                if (VA.mappings.encodings[key] && VA.mappings.encodings[key][channel]) {
                    delete VA.mappings.encodings[key][channel].shareScale;
                    console.log('Updated VA.mappings.encodings:', VA.mappings.encodings);
                }
            }
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
            const value = event.target.value;
            if (value) {
                updateEncoding(key, channel, 'scaleType', value, encId);
            } else {
                // Remove scaleType property if value is empty
                if (VA.mappings.encodings[key] && VA.mappings.encodings[key][channel]) {
                    delete VA.mappings.encodings[key][channel].scaleType;
                    console.log('Updated VA.mappings.encodings:', VA.mappings.encodings);
                }
            }
        });
    }

    // Include Zero checkbox
    if (checkbox) {
        checkbox.addEventListener('change', function(event) {
            updateEncoding(key, channel, 'includeZero', event.target.checked, encId);
        });
    }

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

// Helper function to find the nearest group node in VA.grouping that contains the object
function findContainingGroupForObject(objectKey, grouping = VA.grouping) {
    function groupContainsObject(groupNode, targetKey) {
        if (!groupNode || !groupNode.children || !Array.isArray(groupNode.children)) return false;

        if (groupNode.id === targetKey) return true;

        if (groupNode.children.length === 0) return false;

        if (typeof groupNode.children[0] === 'string') {
            return groupNode.children.includes(targetKey);
        }

        return groupNode.children.some(child => groupContainsObject(child, targetKey));
    }

    function findNearest(groupNode, targetKey) {
        if (!groupNode || !groupNode.children || !Array.isArray(groupNode.children)) return null;

        if (groupNode.children.length > 0 && typeof groupNode.children[0] === 'object') {
            for (const child of groupNode.children) {
                if (groupContainsObject(child, targetKey)) {
                    const deeper = findNearest(child, targetKey);
                    return deeper || child;
                }
            }
        }

        if (groupContainsObject(groupNode, targetKey)) {
            return groupNode;
        }

        return null;
    }

    if (!Array.isArray(grouping)) return null;

    for (const topGroup of grouping) {
        if (groupContainsObject(topGroup, objectKey)) {
            const nearest = findNearest(topGroup, objectKey);
            return nearest || topGroup;
        }
    }

    return null;
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
    
    // Create encoding divs based on a representative object in each grouped bucket:
    // - If representative object's containing group has Glyph layout, create divs for
    //   each channel of each object within that same containing group only.
    // - Otherwise, keep existing behavior (first object only).
    Object.values(groups).forEach(group => {
        if (!group || group.length === 0) return;

        const firstObject = group[0];
        const representativeContainingGroup = findContainingGroupForObject(firstObject.key);
        const representativeLayoutType = representativeContainingGroup && representativeContainingGroup.layout
            ? representativeContainingGroup.layout.type
            : null;

        if (representativeLayoutType === 'Glyph') {
            const representativeGroupId = representativeContainingGroup ? representativeContainingGroup.id : null;
            const representativeGroupItems = group.filter(item => {
                const containingGroup = findContainingGroupForObject(item.key);
                if (!representativeContainingGroup || !containingGroup) return false;
                if (representativeGroupId && containingGroup.id) {
                    return representativeGroupId === containingGroup.id;
                }
                return containingGroup === representativeContainingGroup;
            });

            const targetItems = representativeGroupItems.length > 0
                ? representativeGroupItems
                : [firstObject];

            targetItems.forEach(item => {
                item.encodings.forEach(channel => {
                    const encodingAnnotation = createEncodingDiv(item.key, channel);
                    encodingDiv.appendChild(encodingAnnotation);
                });
            });
            return;
        }

        firstObject.encodings.forEach(channel => {
            const encodingAnnotation = createEncodingDiv(firstObject.key, channel);
            encodingDiv.appendChild(encodingAnnotation);
        });
    });
}

// Helper function to populate controls from loaded mappings
function populateControlsFromMappings() {
    if (!VA.mappings) return;
    
    // Populate data scope dropdowns
    if (VA.mappings.dataScopes && Array.isArray(VA.mappings.dataScopes)) {
        const dataScopeDiv = document.getElementById('dataScopeAnnotationDiv');
        if (dataScopeDiv) {
            const scopeDivs = dataScopeDiv.querySelectorAll('[data-depth]');
            scopeDivs.forEach(div => {
                const depth = parseInt(div.getAttribute('data-depth'));
                const dropdown = div.querySelector('select');
                if (dropdown && depth < VA.mappings.dataScopes.length) {
                    const value = VA.mappings.dataScopes[depth];
                    if (value !== undefined && value !== null) {
                        dropdown.value = value;
                    }
                }
            });
        }
    }
    
    // Populate encoding controls
    if (VA.mappings.encodings) {
        const encodingDiv = document.getElementById('encodingDataColumnAnnotationDiv');
        if (!encodingDiv) return;
        
        // Iterate through all encoding divs
        const encodingDivs = encodingDiv.querySelectorAll(':scope > div');
        encodingDivs.forEach(div => {
            const encDescription = div.querySelector('.encDescription');
            if (!encDescription) return;
            
            // Parse the key and channel from the description text (format: "key: channel")
            const descriptionText = encDescription.textContent;
            const match = descriptionText.match(/^(.+?):\s*(.+)$/);
            if (!match) return;
            
            const key = match[1];
            const channel = match[2];
            
            // Check if we have mappings for this key and channel
            if (VA.mappings.encodings[key] && VA.mappings.encodings[key][channel]) {
                const encoding = VA.mappings.encodings[key][channel];
                
                // Get the control elements
                const dropdowns = div.querySelectorAll('select');
                const checkbox = div.querySelector('input[type="checkbox"]');
                
                // Populate data column (first dropdown)
                if (dropdowns[0] && encoding.attr) {
                    dropdowns[0].value = encoding.attr;
                }
                
                // Populate share scale with (second dropdown)
                if (dropdowns[1] && encoding.shareScale) {
                    dropdowns[1].value = encoding.shareScale;
                }
                
                // Populate scale type (third dropdown)
                if (dropdowns[2] && encoding.scaleType) {
                    dropdowns[2].value = encoding.scaleType;
                }
                
                // Populate include zero checkbox
                if (checkbox && encoding.includeZero !== undefined) {
                    checkbox.checked = encoding.includeZero;
                }
            }
        });
    }
}