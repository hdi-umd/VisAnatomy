import os
import json
import re

script_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
annotations_folder = os.path.join(script_dir, "annotations")

# next get the list of all the files in the annotations folder, and loop through them
files = os.listdir(annotations_folder)
rectBasedCharts = {}
for file in files:
    # read the file
    if not file.endswith(".json"):
        continue
    print(f"Processing {file}")
    file_path = os.path.join(annotations_folder, file)
    with open(file_path, "r") as f:
        # read content as an JSON
        annotation = json.load(f)
        
        # Get the value of the "markInfo" key
        mark_info = annotation['annotations']['markInfo']

        # Check if "markInfo" exists and is a dictionary
        if mark_info and isinstance(mark_info, dict):
            main_chart_marks = [key for key, value in mark_info.items() if value['Role'] == 'Main Chart Mark']
            all_rectangles = all(mark_info[key]['Type'] == 'Rectangle' for key in main_chart_marks)
            
            if all_rectangles:
                rectBasedCharts[file] = ""

# sort the rectBasedCharts dictionary by key, note that the keys are strings plus numbers plus .json, we need sort based on the string first, then the number; 
# when sorting the numbers, the numbers can have 2 digits so its order should be 1,2,3,4,5,6,7,8,9,10,11,12... etc
rectBasedCharts = dict(sorted(rectBasedCharts.items(), key=lambda x: (re.split('(\d+)', x[0].replace(".json", "")), x[0])))

# save the rectBasedCharts dictionary to a file
currentDir = os.path.dirname(os.path.realpath(__file__))
rect_based_charts_file = os.path.join(currentDir, "rectBasedCharts.json")
with open(rect_based_charts_file, "w") as f:
    json.dump(rectBasedCharts, f)

