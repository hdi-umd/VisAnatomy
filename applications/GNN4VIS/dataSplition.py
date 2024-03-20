import json
import random
import os

def getAllChartNames():
    script_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
    annotations_folder = os.path.join(script_dir, "annotations")
    chartNames = []
    files = os.listdir(annotations_folder)
    for file in files:
        chartNames.append(file.split(".")[0])
    return chartNames

def process_chart_array(chart_array, output_file):
    chart_types = {}
    
    # Group chart names by their type
    for chart_name in chart_array:
        chart_type = ''.join([i for i in chart_name if not i.isdigit()])
        if chart_type not in chart_types:
            chart_types[chart_type] = []
        chart_types[chart_type].append(chart_name)
    
    # Sort the chart types alphabetically
    sorted_chart_types = sorted(chart_types.keys())
    
    output = {}
    trainingNum = 0;
    testNum = 0;
    
    for label, chart_type in enumerate(sorted_chart_types):
        charts = chart_types[chart_type]
        total_charts = len(charts)
        train_count = round(total_charts * 0.6)
        
        # Shuffle the charts randomly
        train_charts = 0
        test_charts = 0
        
        for i, chart_name in enumerate(charts):
            if i < train_count:
                role = "training"
                train_charts += 1
            else:
                role = "test"
                test_charts += 1
            
            output[chart_name] = {
                "role": role,
                "label": label
            }
        
        output[f"{chart_type}_count"] = {
            "training": train_charts,
            "test": test_charts
        }
        trainingNum += train_charts
        testNum += test_charts
    
    # # Save the output as JSON file
    # with open(output_file, 'w') as file:
    #     # clear the file
    #     file.write("")
    #     config_str  = json.dumps(output, indent=4, sort_keys=True)
    #     file.write(config_str)
    
    # print(f"JSON file saved as {output_file}")
    # print(f"Training charts: {trainingNum}", f"Test charts: {testNum}")

output_file = os.path.join(os.path.dirname(os.path.realpath(__file__)), "dataSplition.json")
process_chart_array(getAllChartNames(), output_file)