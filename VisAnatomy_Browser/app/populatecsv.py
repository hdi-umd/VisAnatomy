import pandas as pd

# Read the input CSV file
input_df = pd.read_csv('examples_collection_output.csv')

# Define the data for the existing CSV file
data = {
    'Filename': input_df['Filename'].tolist(),
    'Description': input_df['Description'].tolist(),
    'Tags': input_df['Tag'].tolist(),
    'Dataset': [''] * len(input_df),
    'visual elements': input_df['Tag'].tolist(),
    'Tasks': [''] * len(input_df),
    'Relevant Topics': [''] * len(input_df),
    'sourcelink': input_df['Link'].tolist(),
    'comments': [''] * len(input_df),
}

# Create a DataFrame for the existing data
output_df = pd.DataFrame(data)

# Append the existing data to the output CSV file
output_df.to_csv('examples_details.csv', mode='a', header=False, index=False)

print('Data populated successfully to existing CSV file.')