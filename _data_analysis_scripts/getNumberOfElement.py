import os
import json

def accumulate_all_graphics_element_length(directory):
    total_length = 0

    # Iterate over all files in the specified directory
    for filename in os.listdir(directory):
        if filename.endswith('.json'):
            file_path = os.path.join(directory, filename)
            
            # Open and read the JSON file
            with open(file_path, 'r') as file:
                data = json.load(file)
                
                # Check if 'allGraphicsElement' exists
                if 'annotations' in data and 'allGraphicsElement' in data['annotations']:
                    # Accumulate the length of 'allGraphicsElement'
                    total_length += len(data['annotations']['allGraphicsElement'])

    return total_length

# Specify the directory
directory_path = './annotations'

# Get the total length of all 'allGraphicsElement'
total_all_graphics_element_length = accumulate_all_graphics_element_length(directory_path)
print(f"Total length of 'allGraphicsElement': {total_all_graphics_element_length}")
