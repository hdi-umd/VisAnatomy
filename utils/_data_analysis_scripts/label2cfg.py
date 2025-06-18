import json
from collections import defaultdict
import os

# Load the JSON data
script_dir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
target_file = os.path.join(script_dir, "_data_analysis_scripts", "labelAnalysis.json")
with open(target_file, 'r') as file:
    data = json.load(file)

# Create a dictionary to store unique encoding channels for each shape
shape_encodings = defaultdict(set)

# Iterate through all chart types
for chart_type, chart_data in data.items():
    if 'unique_encodingChannels' in chart_data:
        for shape, encodings in chart_data['unique_encodingChannels'].items():
            # Convert the list to a tuple so it can be added to a set
            if (len(encodings) > 0):
                shape_encodings[shape].add(tuple(sorted(encodings)))
                # # check if encodings include "x list"
                # if 'shape' in encodings:
                #     print(f"Chart type: {chart_type}, Shape: {shape}, Encodings: {encodings}")

# Print the results
for shape, encodings in shape_encodings.items():
    print(f"\n{shape}:")
    for encoding in encodings:
        print(f"- {list(encoding)}")

# Optionally, print the count of unique encoding combinations for each shape
print("\nCount of unique encoding combinations for each shape:")
allCount = 0;
for shape, encodings in shape_encodings.items():
    print(f"{shape}: {len(encodings)}")
    allCount += len(encodings)
print(f"Total: {allCount}")