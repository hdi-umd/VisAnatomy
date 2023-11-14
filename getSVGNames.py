import os
import json
import re

def extract_number(file_name):
    match = re.search(r'(\d+)(?=\.\w+$)', file_name)
    return int(match.group()) if match else 0

def custom_sort_key_v2(file_name):
    string_part = re.match(r'^\D*', file_name).group().lower()  # Extracting non-digit prefix, case-insensitive
    trailing_number = extract_number(file_name)
    return (string_part, trailing_number)

# Define the folder path and the output JSON file path
folder_path = './examples'
output_file = './SVG_Names.json'

# Read the names of all files in the folder
file_names = sorted([f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f)) and f.endswith('.svg')], key=custom_sort_key_v2)

# Write the file names to a JSON file
with open(output_file, 'w') as json_file:
    json.dump(file_names, json_file)

print(f"File names written to {output_file}")
