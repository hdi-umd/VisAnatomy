function initilizeMappingAnnotation() {
    // Clear existing content
    const dataScopeDiv = document.getElementById('dataScopeAnnotationDiv');
    if (dataScopeDiv) {
        dataScopeDiv.innerHTML = '';
    }

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