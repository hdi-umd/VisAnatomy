import os
import json

# Define the folder path and the output JSON file path
folder_path = './examples'
output_file = './SVG_Names.json'

# Read the names of all files in the folder
file_names = sorted([f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f)) and f.endswith('.svg')])

# Write the file names to a JSON file
with open(output_file, 'w') as json_file:
    json.dump(file_names, json_file)

print(f"File names written to {output_file}")
