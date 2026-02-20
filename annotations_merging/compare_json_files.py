#!/usr/bin/env python3
"""
Compare JSON files with the same name across two subfolders.

Usage:
    python compare_json_files.py <folder1> <folder2>
"""

import json
import sys
from pathlib import Path
from typing import Set, Tuple


def get_json_files(folder_path: Path) -> Set[str]:
    """Get all JSON file names in a folder."""
    return {f.name for f in folder_path.glob("*.json")}


def compare_json_files(file1_path: Path, file2_path: Path) -> Tuple[bool, dict, dict]:
    """Compare two JSON files for equality and return the data."""
    try:
        with open(file1_path, 'r') as f1:
            data1 = json.load(f1)
        with open(file2_path, 'r') as f2:
            data2 = json.load(f2)
        return data1 == data2, data1, data2
    except (json.JSONDecodeError, IOError) as e:
        print(f"Error reading files: {e}")
        return False, {}, {}


def print_json_differences(data1: dict, data2: dict, prefix: str = "") -> None:
    """Print differences between two JSON objects, ignoring strokeWidth."""
    all_keys = set(data1.keys()) | set(data2.keys())
    
    for key in sorted(all_keys):
        # Ignore strokeWidth differences
        if key == "strokeWidth":
            continue
            
        if key not in data1:
            print(f"  {prefix}+ {key}: (missing in folder1) → {repr(data2[key])}")
        elif key not in data2:
            print(f"  {prefix}- {key}: {repr(data1[key])} → (missing in folder2)")
        elif data1[key] != data2[key]:
            if isinstance(data1[key], dict) and isinstance(data2[key], dict):
                print(f"  {prefix}{key}:")
                print_json_differences(data1[key], data2[key], prefix + "  ")
            else:
                print(f"  {prefix}{key}:")
                print(f"    folder1: {repr(data1[key])}")
                print(f"    folder2: {repr(data2[key])}")


def main() -> None:
    """Main function to compare JSON files across two folders."""
    if len(sys.argv) < 3 or len(sys.argv) > 4:
        print("Usage: python compare_json_files.py <folder1> <folder2> [filename]")
        sys.exit(1)
    
    folder1_name = sys.argv[1]
    folder2_name = sys.argv[2]
    filename_filter = sys.argv[3] if len(sys.argv) == 4 else None
    
    # Get current script directory (annotations_w_data)
    script_dir = Path(__file__).parent
    folder1 = script_dir / folder1_name
    folder2 = script_dir / folder2_name
    
    # Validate folders exist
    if not folder1.is_dir():
        print(f"Error: Folder '{folder1}' does not exist")
        sys.exit(1)
    if not folder2.is_dir():
        print(f"Error: Folder '{folder2}' does not exist")
        sys.exit(1)
    
    # Get JSON files from both folders
    files1 = get_json_files(folder1)
    files2 = get_json_files(folder2)
    
    # Find common JSON files
    common_files = sorted(files1 & files2)
    
    # Filter by filename if provided
    if filename_filter:
        if filename_filter in common_files:
            common_files = [filename_filter]
        else:
            print(f"Error: File '{filename_filter}' not found in both '{folder1_name}' and '{folder2_name}'")
            sys.exit(1)
    
    if not common_files:
        print(f"No common JSON files found in '{folder1_name}' and '{folder2_name}'")
        sys.exit(0)
    
    print(f"Comparing {len(common_files)} common JSON files between '{folder1_name}' and '{folder2_name}':\n")
    
    identical_count = 0
    different_count = 0
    
    for filename in common_files:
        file1_path = folder1 / filename
        file2_path = folder2 / filename
        
        is_identical, data1, data2 = compare_json_files(file1_path, file2_path)
        
        if is_identical:
            print(f"✓ {filename}: IDENTICAL", end="")
            identical_count += 1
            
            # Move one copy to annotations_w_data root and delete both
            dest_path = script_dir / filename
            try:
                # Copy to parent directory
                with open(file1_path, 'r') as src:
                    content = src.read()
                with open(dest_path, 'w') as dst:
                    dst.write(content)
                
                # Delete from both subfolders
                file1_path.unlink()
                file2_path.unlink()
                
                print(" → moved to root, deleted from both folders")
            except Exception as e:
                print(f" → ERROR: {e}")
        else:
            print(f"✗ {filename}: DIFFERENT")
            different_count += 1
            print_json_differences(data1, data2)
    
    # Summary
    print(f"\nSummary:")
    print(f"  Identical: {identical_count}")
    print(f"  Different: {different_count}")
    print(f"  Total: {len(common_files)}")


if __name__ == "__main__":
    main()
