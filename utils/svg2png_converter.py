import os
from cairosvg import svg2png
import xml.etree.ElementTree as ET


# Specify the input folder containing SVG files and output folder for PNG files
input_folder = "../charts_svg"
output_folder = "../charts_png"

# # Specify the default output size (in pixels) if SVG size is undefined
# default_width = 800
# default_height = 600

# Create the output folder if it doesn't exist
os.makedirs(output_folder, exist_ok=True)

# Create a text file to store conversion errors
error_file = os.path.join(output_folder, "__conversion_errors.txt")

# Iterate over all files in the input folder
with open(error_file, "w") as ef:
    for filename in os.listdir(input_folder):
        print(f"working on {filename} ...")
        if filename.endswith(".svg"):
            # Construct the full file paths
            svg_path = os.path.join(input_folder, filename)
            png_path = os.path.join(output_folder, filename[:-4] + ".png")

            # if the PNG file already exists, skip conversion
            if os.path.exists(png_path) or filename=="DensityPlot20.svg":
                print(f"Skipping {filename} as PNG already exists.")
                continue
            
            try:
                # Convert SVG to PNG using cairosvg with default size
                svg2png(url=svg_path, write_to=png_path)
                print(f"Converted {filename} to PNG.")
            except (ValueError, AttributeError, ET.ParseError) as e:
                print(f"Error converting {filename}: {str(e)}")
                ef.write(f"{filename}\n {str(e)}\n")  # Write the file name to the error file

print(f"Conversion complete. Errors logged in {error_file}")