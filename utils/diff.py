import json
import sys
import os
from typing import Any

def diff(a, b, path=""):
    diffs = []

    if isinstance(a, dict) and isinstance(b, dict):
        keys = sorted(set(a.keys()) | set(b.keys()))
        for key in keys:
            a_val = a.get(key, "__MISSING__")
            b_val = b.get(key, "__MISSING__")
            full_path = f"{path}.{key}" if path else key
            if a_val == "__MISSING__":
                diffs.append(f"{full_path} added:\n+ {json.dumps(b_val, indent=2)}")
            elif b_val == "__MISSING__":
                diffs.append(f"{full_path} removed:\n- {json.dumps(a_val, indent=2)}")
            else:
                diffs.extend(diff(a_val, b_val, full_path))
    elif isinstance(a, list) and isinstance(b, list):
        for i, (item1, item2) in enumerate(zip(a, b)):
            diffs.extend(diff(item1, item2, f"{path}[{i}]"))
        if len(a) > len(b):
            for i in range(len(b), len(a)):
                diffs.append(f"{path}[{i}] removed:\n- {json.dumps(a[i], indent=2)}")
        elif len(b) > len(a):
            for i in range(len(a), len(b)):
                diffs.append(f"{path}[{i}] added:\n+ {json.dumps(b[i], indent=2)}")
    else:
        if a != b:
            diffs.append(f"{path}:\n- {json.dumps(a)}\n+ {json.dumps(b)}")
    return diffs

def main():
    if len(sys.argv) != 3:
        print("Usage: python diff_json.py old.json new.json")
        sys.exit(1)

    old_file = sys.argv[1]
    new_file = sys.argv[2]

    try:
        with open(old_file, 'r') as f1, open(new_file, 'r') as f2:
            a = json.load(f1)
            b = json.load(f2)
    except Exception as e:
        print(f"Error loading JSON: {e}")
        sys.exit(1)

    differences = diff(a, b)

    output_file = f"diff.txt"
    with open(output_file, "w") as f:
        if differences:
            f.write("\n".join(differences))
            print(f"Diff written to {output_file}")
        else:
            f.write("Files are identical\n")
            print("Files are identical")

if __name__ == "__main__":
    main()
