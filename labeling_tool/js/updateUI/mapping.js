function initilizeMappingAnnotation() {
    // Clear existing content
    const dataScopeDiv = document.getElementById('dataScopeAnnotationDiv');
    if (dataScopeDiv) {
        dataScopeDiv.innerHTML = '';
    }

    // Initialize VA.mappings.dataScopes with correct number of levels
    if (!VA.mappings) {
        VA.mappings = {};
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
    
    const numLevels = VA.grouping && VA.grouping.length > 0 ? getMaxDepth(VA.grouping) + 1 : 0;
    VA.mappings.dataScopes = new Array(numLevels).fill('');

    // Process each top-level group or mark in VA.grouping
    if (VA.grouping && VA.grouping.length > 0) {
        VA.grouping.forEach(item => {
            processItem(item, 0, dataScopeDiv);
        });
    }
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
        dropdown.addEventListener('change', function(event) {
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