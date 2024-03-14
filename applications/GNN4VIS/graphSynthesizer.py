import xml.etree.ElementTree as ET
import numpy as np
import os

def get_fill_color(element):
    fill_color = element.get("fill")
    if not fill_color:
        style = element.get("style")
        if style:
            style_dict = dict(item.split(":") for item in style.split(";") if ":" in item)
            fill_color = style_dict.get("fill")
    return fill_color

def remove_namespace_prefix(root):
    # Remove namespace prefix from the SVG root element
    for elem in root.iter():
        if '}' in elem.tag:
            elem.tag = elem.tag.split('}', 1)[1]
    return root

def add_id_to_leaves(element, indices, all_svg_element_id, id_mappings):
    # Set ID
    if element.tag != "{http://www.w3.org/2000/svg}svg":
        original_id = element.get("id")  # Get original ID if exists
        if element.tag not in indices:
            indices[element.tag] = 0
        if (
            element.tag != "{http://www.w3.org/2000/svg}linearGradient"
            and element.tag != "{http://www.w3.org/2000/svg}g"
            and ":" not in element.tag.split("}")[1]
        ):
            new_id = element.tag.split("}")[1] + str(indices[element.tag])
            indices[element.tag] += 1
            element.set("id", new_id)
            all_svg_element_id.append(new_id)
            print (original_id, new_id)
            fill_colors[new_id] = get_fill_color(element)
            # RBD: also record the class attribute if any
            if original_id:
                id_mappings[original_id] = new_id  # Track original to new ID

    if len(list(element)) > 0:
        for child_node in element:
            add_id_to_leaves(child_node, indices, all_svg_element_id, id_mappings)

# Load BarChart1.svg from ../../examples
script_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))

svg_file_path = os.path.join(script_dir, "examples", "BarChart1.svg")
tree = ET.parse(svg_file_path)
root = tree.getroot()

# Initialize variables
indices = {}
fill_colors = {}
all_svg_element_id = []
id_mappings = {}

# Call the function to add class and ID to leaves
add_id_to_leaves(root, indices, all_svg_element_id, id_mappings)
print(fill_colors)

# # Write SVG to file with the custom namespace dictionary
# tree = ET.ElementTree(remove_namespace_prefix(root))
# tree.write('barChart1.svg', encoding="UTF-8", xml_declaration=True)

