import pandas as pd

df = pd.read_csv('./AnnotationRecord.csv')
df['Tag'] = df['Type'].str.split().str[0].str.lower()
df['Filename'] = df['Type'].str.replace(' ', '') + df['ID'].astype(str) + '.png'
df['Description'] = df['Type'] + ' ' + df['ID'].astype(str)
df = df[['Type', 'ID', 'Description', 'Filename', 'Tag', 'Link']]

df.to_csv('examples_collection_output.csv', index=False)