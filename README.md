# VisCorpus

## Launch the UI
python server.py

## How to use

### Upload a svg file through the upload form
Choose a .svg file from your local directory to upload. 
If the file already exists in the system you will be asked to enter a new one. 
If it doesn't exist yet the file will be saved to the examples folder and loaded into the annotation page.

### Run an existing example by URL
If a chart is already in the examples folder, launch the annotation page by URL of the format: 
http://localhost:5200/annotationPage.html?file=bar_v_08
Change file=chartname to whatever chart you would like to use.