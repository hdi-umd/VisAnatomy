# compare_json_files.py

A Python script that compares JSON files with the same name across two subfolders, identifies differences, and automatically manages identical files.

## Overview

This script is useful for comparing annotations or data files that exist in multiple subfolders (e.g., different annotators' versions). It will:
- Find all JSON files that exist in both subfolders
- Compare them for equality
- Print differences in a readable format
- Move identical files to the root of `annotations_w_data` and delete them from subfolders

## Usage

```bash
python compare_json_files.py <folder1> <folder2> [filename]
```

### Arguments

- **folder1** (required): Name of the first subfolder to compare
- **folder2** (required): Name of the second subfolder to compare
- **filename** (optional): Specific JSON file to compare. If omitted, all common files are compared

### Examples

**Compare all common files between two folders:**
```bash
python compare_json_files.py Ramy Rohith
```

**Compare a specific file between two folders:**
```bash
python compare_json_files.py Ramy Rohith BarChart1.json
```

## Output

### For Identical Files
```
✓ BarChart3.json: IDENTICAL → moved to root, deleted from both folders
```
- The file is copied to `annotations_w_data/`
- Both copies in the subfolders are deleted

### For Different Files
```
✗ BarChart1.json: DIFFERENT
  data:
    elements:
      color:
        folder1: '#FF0000'
        folder2: '#00FF00'
```
- Differences are displayed with indentation showing the JSON structure
- `folder1` shows the value from the first subfolder
- `folder2` shows the value from the second subfolder
- Added/missing keys are marked with `+` and `-` respectively

## Special Handling

**Ignored Differences:**
- The `strokeWidth` key is ignored when comparing files. Files that differ only in `strokeWidth` are treated as identical.

## Summary

The script prints a summary at the end:
```
Summary:
  Identical: 4
  Different: 7
  Total: 11
```

This shows:
- Number of files that were identical
- Number of files with differences
- Total number of common files compared
