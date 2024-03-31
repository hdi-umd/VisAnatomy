import numpy as np
import os
import json

def getAllChartNames():
    script_dir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
    annotations_folder = os.path.join(script_dir, "annotations")
    chartNames = []
    files = os.listdir(annotations_folder)
    for file in files:
        chartNames.append(file.split(".")[0])
    return chartNames

def getDepthOfAnArray(arr):
    if type(arr) != list:
        return 0
    if len(arr) == 0:
        return 1
    maxDepth = 0
    for item in arr:
        maxDepth = max(maxDepth, getDepthOfAnArray(item))
    return maxDepth + 1

def parseAnnotationFile():
    allStat = {}
    for chartName in getAllChartNames():
        allStat[chartName] = {}
        script_dir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        annotation_file_path = os.path.join(script_dir, "annotations", chartName+".json")
        print("Processing: ", annotation_file_path)
        with open(annotation_file_path, "r") as f:
            annotations = json.load(f)['annotations']
            mark_info = annotations['markInfo']
            groupInfo = annotations['groupInfo']
            allElements = annotations["allGraphicsElement"]
            referElements = annotations["referenceElement"]
            nestedGrouping = annotations["nestedGrouping"]
            layoutInfo = annotations["layoutInfo"]
            encodingInfo = annotations["encodingInfo"]
            allStat[chartName]['num_allElements'] = len(allElements.keys())
            mainChartMarks = [key for key, value in mark_info.items() if value['Role'] == 'Main Chart Mark']
            allStat[chartName]['num_mainChartMarks'] = len(mainChartMarks)
            allStat[chartName]['ratio_main_over_all'] = len(mainChartMarks) / len(allElements.keys())
            # filter unique mark types
            allStat[chartName]['unique_mainChartMarkTypes'] = list(set([mark_info[mark]['Type'] for mark in mainChartMarks]))
            # filter unique layout types in values of layoutInfo
            allStat[chartName]['unique_layoutTypes'] = [x for x in list(set([layoutInfo[key]['type'] for key in layoutInfo])) if x != '']
            # pass referElements["axes"] to get the number of axes
            allStat[chartName]['num_axes'] = 0
            if ("axes" not in referElements):
                if len(referElements["xAxis"]["labels"]) > 0:
                        allStat[chartName]['num_axes'] += 1
                if len(referElements["yAxis"]["labels"]) > 0:
                        allStat[chartName]['num_axes'] += 1
            else:
                for axis in referElements["axes"]:
                    # if the label has length > 0, then it is a valid axis
                    if len(referElements["axes"][axis]["labels"]) > 0:
                        allStat[chartName]['num_axes'] += 1
            # get the depth of nestedGroup
            allStat[chartName]['nestedGroupDepth'] = getDepthOfAnArray(nestedGrouping)
            # for each unique mark type, get the list of unique encoding channels by passing encodingInfo, note the values of encodingInfo are array of channels
            allStat[chartName]['unique_encodingChannels'] = {}
            for markType in allStat[chartName]['unique_mainChartMarkTypes']:
                # concat the encoding channels of all marks of the same type
                allChannels = []
                for key in encodingInfo:
                    if (key.startswith("Group") or key not in mark_info):
                        continue
                    if mark_info[key]['Type'] == markType:
                        allChannels += encodingInfo[key]
                allStat[chartName]['unique_encodingChannels'][markType] = list(set(allChannels))
    return allStat

allStat = parseAnnotationFile()
# save the result to a json file
script_dir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
output_file_path = os.path.join(script_dir, "_data_analysis_scripts", "labelAnalysis.json")
with open(output_file_path, "w") as f:
    json.dump(allStat, f, indent=4)



