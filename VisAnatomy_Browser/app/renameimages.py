import os

# Folder path containing images
folder_path = '../static/ExampleFiles'

# Function to remove spaces from file names
def remove_spaces(file_name):
    return file_name.replace(" ", "")

# Iterate through the image files in the folder and rename them
for file_name in os.listdir(folder_path):
    if file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
        # Get the new file name with no spaces
        new_file_name = file_name.title()
        new_file_name = remove_spaces(file_name)
        
        # Construct the full file paths for renaming
        old_path = os.path.join(folder_path, file_name)
        new_path = os.path.join(folder_path, new_file_name)
        
        # Rename the file
        os.rename(old_path, new_path)
        print(f'Renamed: {file_name} -> {new_file_name}')

print("File names have been changed to remove spaces.")
