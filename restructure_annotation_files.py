import os
import json
import sys

script_dir = os.path.dirname(os.path.realpath(__file__))
annotations_folder = os.path.join(script_dir, "annotations")

# Create restructured_annotations directory if it doesn't exist
restructured_dir = os.path.join(script_dir, "final_annotations_test")
os.makedirs(restructured_dir, exist_ok=True)

def getObject(g):
    if isinstance(g, str):
        return g
    else:
        obj = list(g.values())[0]
        obj["id"] = list(g.keys())[0]
        obj["children"] = [getObject(d) for d in obj["children"]]
        return obj

def restructure_annotations(data):
    # restruct the data
    # remove the textObjectLinking  and groupedGraphicsElement keys if it exists
    if "textObjectLinking" in data:
        data.pop("textObjectLinking")
    if "groupedGraphicsElement" in data:
        data.pop("groupedGraphicsElement")
    # rename allGraphicsElement into allElements
    if "allGraphicsElement" in data:
        data["allElements"] = data.pop("allGraphicsElement")
    # merge the layoutInfo into the nestedGrouping
    # if groupInfo is just an array of length 1, then restructure to nested format
    if len(data["groupInfo"]) == 1:
        data["grouping"] = {
            "g0": {
                "layout": data["layoutInfo"].get(str(0), None),
                "children": data["groupInfo"][0]
            }
        }
    else:
        # here we need to merge the layoutInfo into the groupInfo recursively
        current_index = len(data["groupInfo"]) - 1  # Start from last group
        
        def parse_nested_groups(group_array, index):
            nonlocal current_index
            current_index += 1
            result = {}
            group_key = f"g{current_index}"
            result["layout"] = data["layoutInfo"].get(str(current_index), None)
            result["children"] = []
            for element in group_array:
                if isinstance(element, list):
                    result["children"].append(parse_nested_groups(element, current_index))
                else:
                    result["children"].append({
                        "g" + str(element): {
                            "layout": data["layoutInfo"].get(str(element), None),
                            "children": data["groupInfo"][element]
                        }
                    })
            return {group_key: result}
        
        if "nestedGrouping" in data and len(data["nestedGrouping"]) > 0:
            data["grouping"] = parse_nested_groups(data["nestedGrouping"][0], current_index)

    # chart title
    # if "chartTitle" in data:
    #     data["chartTitle"] = [d["id"] for d in data["chartTitle"] if d]
    
    # change 'referenceElement' to 'referenceElements'
    data["referenceElements"] = data["referenceElement"]
    del data["referenceElement"]

    gridlines = {
        "x": data.get("referenceElements", {}).pop("xGridlines", []),
        "y": data.get("referenceElements", {}).pop("yGridlines", [])
    }
    data["referenceElements"]["gridlines"] = gridlines

    # axis: change 'fieldType' to 'attrType', change 'type' to 'channel'
    if "axes" in data["referenceElements"]:
        axes = data["referenceElements"]["axes"]
        for k in axes:
            axis = axes[k]
            axis["attrType"] = axis["fieldType"]
            del axis["fieldType"]
            axis["channel"] = axis["type"]
            del axis["type"]

            # remove dup info on axis labels in referenceElements
            if "labels" in axis:
                axis["labels"] = [d["id"] for d in axis["labels"]]

            if "title" in axis:
                axis["title"] = [d["id"] if isinstance(d, dict) else d for d in axis["title"]]
        data["referenceElements"]["axes"] = list(data["referenceElements"]["axes"].values())
    
    del data["groupInfo"]
    del data["layoutInfo"]
    del data["nestedGrouping"]

    for m in data["markInfo"]:
        mi = data["markInfo"][m]
        if m in data["allElements"]:
            elem = data["allElements"][m]
            elem["type"] = mi["Type"]
            elem["role"] = mi["Role"]
        else:
            print(m + " not in all elements")
    del data["markInfo"]

    if "grouping" in data:
        data["grouping"] = [getObject(data["grouping"])]

    return data

def main():
    if len(sys.argv) > 1:
        files = [sys.argv[1] + ".json"]
    else:
        files = os.listdir(annotations_folder)

    # then, for each file, load the json data
    for file in files:
        if file.endswith(".json"):
            # get file name without extension
            file_name = os.path.splitext(file)[0]
            print("restructuring", file_name)
            with open(os.path.join(annotations_folder, file), "r") as f:
                data = json.load(f)["annotations"]
                restructured = restructure_annotations(data)
                # save the data to a new file in the ./annotations/restructured folder
                with open(os.path.join(restructured_dir, file_name + ".json"), "w") as out_f:
                    json.dump(restructured, out_f, indent=4)

if __name__ == "__main__":
    main()
