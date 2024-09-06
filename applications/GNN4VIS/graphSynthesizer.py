import xml.etree.ElementTree as ET
import numpy as np
import os
import json

dataSplition = json.load(open(os.path.join(os.path.dirname(os.path.realpath(__file__)), "dataSplition.json"), "r"))

# Initialize variables
indices = {}
visualStyles = {}
all_svg_element_id = []
id_mappings = {}
parent_child_relationship = {}
edges = []
nodeFeatures = []
allNodes = []

graphicsElementTypes = [
  "line",
  "polyline",
  "rect",
  "circle",
  "ellipse",
  "polygon",
  "path",
  "image",
  "text",
  "use",
  "g",
]

markTypeGroundtruths = [
  "Straight Line",
  "Polyline",
  "Rectangle",
  "Polygon",
  "geoPolygon",
  "Circle",
  "Ellipse",
  "Pie",
  "Arc",
  "Area",
  "Image",
  "Text",
  "Path"
]

def getAllChartNames():
    script_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
    annotations_folder = os.path.join(script_dir, "annotations")
    chartNames = []
    files = os.listdir(annotations_folder)
    for file in files:
        if len(file.split(".")[0]) > 0 and not file.startswith("_bespoke"):
            chartNames.append(file.split(".")[0])
    return chartNames

def remove_namespace_prefix(root):
    # Remove namespace prefix from the SVG root element
    for elem in root.iter():
        if '}' in elem.tag:
            elem.tag = elem.tag.split('}', 1)[1]
    return root

def get_fill_color(element):
    fill_color = element.get("fill")
    if not fill_color:
        style = element.get("style")
        if style:
            style_dict = dict(item.split(":") for item in style.split(";") if ":" in item)
            fill_color = style_dict.get("fill")
    if (fill_color == None or fill_color == "none" or fill_color == "transparent" or fill_color == ""):
        fill_color = 0
    else:
        fill_color = 1
    return fill_color

def get_stroke(element):
    stroke_color = element.get("stroke")
    if not stroke_color:
        style = element.get("style")
        if style:
            style_dict = dict(item.split(":") for item in style.split(";") if ":" in item)
            stroke_color = style_dict.get("stroke")
    if (stroke_color == None or stroke_color == "none" or stroke_color == "transparent" or stroke_color == ""):
        stroke_color = 0
    else:
        stroke_color = 1
    return stroke_color

def get_stroke_width(element): # stoke width can be string like "2%"
    stroke_width = element.get("stroke-width")
    if not stroke_width:
        style = element.get("style")
        if style:
            style_dict = dict(item.split(":") for item in style.split(";") if ":" in item)
            stroke_width = style_dict.get("stroke-width")
    if (stroke_width == "0" or stroke_width == None):
        stroke_width = 0
    else :
        stroke_width = 1
    return stroke_width

def add_id_to_leaves(element, indices, all_svg_element_id, id_mappings, currentVisualStyles, parent):
    # Set ID
    
    thisTag = element.tag.split("}")[1] if "}" in element.tag else element.tag
    thisVisualStyles = [get_fill_color(element), get_stroke(element), get_stroke_width(element)]

    original_id = element.get("id")  # Get original ID if exists
    if thisTag not in indices:
        indices[thisTag] = 0
    if (
        thisTag != "linearGradient"
        and thisTag != "clipPath"
        and ":" not in thisTag
    ):
        new_id = thisTag + str(indices[thisTag])
        indices[thisTag] += 1
        element.set("id", new_id)
        all_svg_element_id.append(new_id)
        for i in range(3):
            if thisVisualStyles[i] is None:
                thisVisualStyles[i] = currentVisualStyles[i]
        visualStyles[new_id] = thisVisualStyles
        if original_id:
            id_mappings[original_id] = new_id  # Track original to new ID mapping

    parent_child_relationship[element.get('id')] = parent.get('id')
    if (len(list(element)) > 0 and (thisTag not in graphicsElementTypes or thisTag == "g" or thisTag == "text")):
        # add parent-child relationship
        for child_node in element:
            add_id_to_leaves(child_node, indices, all_svg_element_id, id_mappings, thisVisualStyles, element)

def generateGraphData(chartName, folderName):
    script_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))

    svg_file_path = os.path.join(script_dir, "examples_augmented", chartName+".svg")
    tree = ET.parse(svg_file_path)
    root = tree.getroot()

    add_id_to_leaves(root, indices, all_svg_element_id, id_mappings, [None, None, None], root)

    annotation_file_path = os.path.join(script_dir, "annotations", chartName+".json")

    with open(annotation_file_path, "r") as f:
        annotations = json.load(f)['annotations']
        mark_info = annotations['markInfo']
        groupInfo = annotations['groupInfo']
        allElements = annotations["allGraphicsElement"]
        # allElements is a JSON, whose keys are element IDs and values are the bounding box information, enumerated the values and extract the overall bounding box
        # Initialize variables for the overall bounding box
        max_x = float('-inf')
        max_y = float('-inf')

        # Iterate over the values (bounding box information) in the JSON
        for bbox_info in allElements.values():
            # Extract the coordinates from the bounding box information
            right = bbox_info['right']
            bottom = bbox_info['bottom']

            # Update the overall bounding box coordinates
            max_x = max(max_x, right)
            max_y = max(max_y, bottom)

        # if target main chart marks
        targetedElements = [key for key, value in mark_info.items() if value['Role'] == 'Main Chart Mark']

        # # if target all basic elements
        # targetedElements = [key for key, value in allElements.items() if key]

        allNodes = targetedElements.copy()

        ## get ancesters of main_chart_marks and form edges

        # # if using the parent-child relationship in the SVG
        # for mark in targetedElements:
        #     if (mark in parent_child_relationship):
        #         child = mark
        #         parent = parent_child_relationship[mark]
        #         while parent:
        #             if (parent not in allNodes):
        #                 allNodes.append(parent)
        #             if ([allNodes.index(child), allNodes.index(parent)] not in edges):
        #                 edges.append([allNodes.index(child), allNodes.index(parent)])
        #             if (parent == root.get('id') or parent.startswith('svg')):
        #                 break
        #             child = parent
        #             parent = parent_child_relationship[parent]

        # if using the nestedGrouping in the annotations to form the edges
        idEdges = []
        def addEdges(node):
            # if the node is a number
            if (isinstance(node, int)):
                allNodes.append("group" + str(node))
                for child in groupInfo[node]:
                    idEdges.append(["group" + str(node), child])
            else:
                allNodes.append("group" + str(node))
                for child in node:
                    idEdges.append(["group" + str(node), "group" + str(child)])
                for child in node:
                    addEdges(child)
        nestedGrouping = annotations['nestedGrouping'][0]
        addEdges(nestedGrouping)
        for edge in idEdges:
            if (edge[0] in allNodes and edge[1] in allNodes):
                edges.append([allNodes.index(edge[0]), allNodes.index(edge[1])])
            
        for node in allNodes:
            # first part, one-hot encoding of the node type referring to the nodes name starting with which dimension of graphicsElementTypes

            # # if using just the SVG type
            # nodeFeature = [0] * len(graphicsElementTypes)
            # if (node not in targetedElements):
            #     # the last element of the nodeFeature is 1
            #     nodeFeature[-1] = 1
            #     nodeFeature.extend([0, 0, 0, 0, 0, 0, 0])
            #     nodeFeatures.append(nodeFeature)
            #     continue
            # for i, nodeType in enumerate(graphicsElementTypes):
            #     if node.startswith(nodeType):
            #         nodeFeature[i] = 1
            #         break
            # if (node.startswith("tspan") or node.startswith("textPath")):
            #     nodeFeature[8] = 1
            # if (node.startswith("use")):
            #     # get the element using ET
            #     element = root.find(f".//*[@id='{node}']")
            #     if (element):
            #         # get the href attribute
            #         href = element.get("{http://www.w3.org/1999/xlink}href")
            #         if (href == None):
            #             # get the xlink:href attribute
            #             href = element.get("{http://www.w3.org/1999/xlink}xlink:href")
            #         if (href != None):
            #             # get the href attribute
            #             if (href[0] == "#" and href[1:] in id_mappings):
            #                 # get the element using ET
            #                 referredElementID = id_mappings[href[1:]]
            #                 # get the type of the element
            #                 for i, nodeType in enumerate(graphicsElementTypes):
            #                     if referredElementID.startswith(nodeType):
            #                         nodeFeature = [0] * len(graphicsElementTypes)
            #                         nodeFeature[i] = 1
            #                         break
            #                 # in visualStyles[node], if a value is none then use the value of the referred element
            #                 if (visualStyles[node] != None):    
            #                     for i in range(3):
            #                         if visualStyles[node][i] is None and visualStyles[referredElementID][i] is not None:
            #                             visualStyles[node][i] = visualStyles[referredElementID][i]

            # if using their ground truth mark type in the annotations
            nodeFeature = [0] * (len(markTypeGroundtruths) + 1)
            if (node not in targetedElements):
                nodeFeature[-1] = 1
                nodeFeature.extend([0, 0, 0, 0, 0, 0, 0])
                nodeFeatures.append(nodeFeature)
                continue
            else:
                markType = mark_info[node]['Type']
                for i, nodeType in enumerate(markTypeGroundtruths):
                    if markType == nodeType:
                        nodeFeature[i] = 1
                        break

            # second part, the boudning box information from annotations
            nodeFeature.extend([allElements[node]['top']/max_y, allElements[node]['right']/max_x, allElements[node]['bottom']/max_y, allElements[node]['left']/max_x])
            if (node in visualStyles):
                nodeFeature.extend(visualStyles[node])
            else:
                nodeFeature.extend([0, 0, 0])
            nodeFeatures.append(nodeFeature)

        # save the nodeFeatures and edges to a json file within the current folder
        with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), folderName, chartName+".json"), "w") as f:
            json.dump({"nodeNames": allNodes ,"nodes": nodeFeatures, "edges": edges, "splition": dataSplition[chartName]['role'], "label": dataSplition[chartName]['label']}, f)

folderName = "graphData_v4"
for chartName in getAllChartNames():
    # Initialize variables
    indices = {}
    visualStyles = {}
    all_svg_element_id = []
    id_mappings = {}
    parent_child_relationship = {}
    edges = []
    nodeFeatures = []
    allNodes = []
    # if the chart has already been processed, i.e., the json file exists, then skip it
    if (os.path.exists(os.path.join(os.path.dirname(os.path.realpath(__file__)), folderName, chartName+".json"))):
        continue
    # show the percentage of the progress
    print(f"processing {chartName} ...")
    generateGraphData(chartName, folderName)