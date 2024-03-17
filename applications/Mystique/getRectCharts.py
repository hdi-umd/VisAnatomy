import os
import json

script_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
annotations_folder = os.path.join(script_dir, "annotations")

# next get the list of all the files in the annotations folder, and loop through them
files = os.listdir(annotations_folder)
for file in files:
    # read the file
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
                # write the file name to a json file in the same folder, whose keys are file names and values are ""
                with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), "rectCharts.txt"), "a") as f:
                    f.write(f'"{file}": "",\n')
