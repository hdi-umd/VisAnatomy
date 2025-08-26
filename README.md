# VisAnatomy

## Overview
VisAnatomy is an SVG chart corpus with fine-grained labels of chart elements for visualization research and development. Currently VisAnatomy contains 942 real-world SVG charts produced by over 50 tools, encompassing 40 chart types and featuring structural and stylistic design variations. Each chart is augmented with multi-level
fine-grained labels on its semantic components, including each graphical element’s type, role, and position, hierarchical groupings
of elements, group layouts, and visual encodings. In total, VISANATOMY provides labels for more than 383k graphical elements.The underlying data tables are also included if available (329 out of 942). For more information on the fine-grained labels, refer to the [wiki pages](https://github.com/hdi-umd/VisAnatomy/wiki).

Online browser for the charts: https://visanatomy.github.io/

> **Citation:**  
> Chen Chen, Hannah K. Bako, Peihong Yu, John Hooker, Jeffrey Joyal, Simon C. Wang, Samuel Kim, Jessica Wu, Aoxue Ding, Lara Sandeep, Alex Chen, Chayanika Sinha, and Zhicheng Liu. 2025.  
> VisAnatomy: An SVG Chart Corpus with Fine-Grained Semantic Labels.  
> *IEEE Transactions on Visualization and Computer Graphics (Proceedings IEEE VIS 2025)* (2025). 
> [PDF](https://hdi.cs.umd.edu/papers/VisAnatomy_VIS25.pdf)

## Folder Structure

- charts_svg/  
  SVG files of charts in the corpus.

- charts_png/  
  PNG image files of charts used in the corpus.

- data_tables/  
  Tabular data files related to chart metadata and analysis.

- labeling_tool/  
  Web application for interactively labeling and annotating SVG charts.

- final_annotations/  
  Finalized annotation files, typically post-processed for research use.

- applications/  
  Contains subprojects and scripts, including LLM4Semantics for evaluation and analysis.

- utils/  
  Utility scripts and helper functions for data processing and

- annotations/  
  JSON files containing semantic annotations for individual charts. Will be deleted.

- _data_analysis_scripts/  
  Scripts for analyzing chart type distributions and annotation statistics.

## Using the Interactive Chart Labeling Tool

To start the server:

```python labeling_tool/server.py```

the labeling tool can be accessed at http://localhost:5200/.

### Upload a svg file through the upload form

Choose a .svg file from your local directory to upload.
If the file already exists in the system you will be asked to enter a new one.
If it doesn't exist yet the file will be saved to the examples folder and loaded into the annotation page.

### Run an existing example by URL

If a chart is already in the examples folder, launch the annotation page by URL of the format:
http://localhost:5200/annotationPage.html?file=bar_v_08
Change file=chartname to whatever chart you would like to use.
