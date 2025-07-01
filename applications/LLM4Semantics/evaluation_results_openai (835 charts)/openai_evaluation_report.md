---
title: OpenAI LLM Chart Element Identification - Evaluation Report  
date: 2025-06-29 00:53:16
model: GPT-4o
api: OpenAI Batch API
---


# OpenAI LLM Chart Element Identification - Evaluation Report



📊 EVALUATION OVERVIEW:
   • Evaluation started: 2025-06-29T00:53:15.245030
   • OpenAI batch started: 2025-06-27T21:38:14.294020
   • OpenAI total processed: 841
   • OpenAI successful: 837
   • OpenAI failed: 6
   • Available for evaluation: 837
   • Successfully evaluated: 837
   • Failed evaluations: 0
   • Skipped (no ground truth): 0
   • Coverage: 100.0%

📈 PERFORMANCE METRICS:

MAIN CHART MARKS:
   F1 Score:  0.841 ± 0.311
   Precision: 0.891
   Recall:    0.845
   Charts:    837

AXIS LABELS:
   F1 Score:  0.781 ± 0.378
   Precision: 0.808
   Recall:    0.783
   Charts:    837

AXIS TITLES:
   F1 Score:  0.827 ± 0.374
   Precision: 0.827
   Recall:    0.830
   Charts:    837

LEGEND LABELS:
   F1 Score:  0.811 ± 0.389
   Precision: 0.813
   Recall:    0.811
   Charts:    837

LEGEND MARKS:
   F1 Score:  0.790 ± 0.401
   Precision: 0.789
   Recall:    0.795
   Charts:    837

LEGEND TITLES:
   F1 Score:  0.943 ± 0.230
   Precision: 0.943
   Recall:    0.944
   Charts:    837

🎯 OVERALL PERFORMANCE:
   Mean F1 Score: 0.832 ± 0.212
   Performance Level: 🟢 EXCELLENT

🏆 TOP PERFORMING CHARTS:
   1. MatrixDiagram18: 1.000
   2. StackedBarChart14: 1.000
   3. ViolinPlot1: 1.000
   4. GroupedBarChart17: 1.000
   5. WaterfallChart7: 1.000

🔍 MOST CHALLENGING CHARTS:
   1. BarChart25: 0.000
   2. Heatmap13: 0.000
   3. StackedBarChart6: 0.000
   4. BarChart13: 0.000
   5. DotPlot8: 0.035

🎯 CATEGORY PERFORMANCE INSIGHTS:
   Main Chart Marks: 🟢 Excellent (F1: 0.841, n=837)
   Axis Labels: 🟡 Good (F1: 0.781, n=837)
   Axis Titles: 🟢 Excellent (F1: 0.827, n=837)
   Legend Labels: 🟢 Excellent (F1: 0.811, n=837)
   Legend Marks: 🟡 Good (F1: 0.790, n=837)
   Legend Titles: 🟢 Excellent (F1: 0.943, n=837)

📈 CHART TYPE PERFORMANCE ANALYSIS:
| Chart Type | Count | F1 Mean | F1 Range | Performance |
|------------|-------|---------|----------|-------------|
| CandlestickChart | 21 | 0.957 | 0.788-1.000 | 🟢 |
| CirclePacking | 21 | 0.955 | 0.570-1.000 | 🟢 |
| ConnectedScatterPlot | 19 | 0.953 | 0.750-1.000 | 🟢 |
| Treemap | 19 | 0.945 | 0.664-1.000 | 🟢 |
| MarimekkoChart | 20 | 0.945 | 0.756-1.000 | 🟢 |
| StreamGraph | 14 | 0.940 | 0.333-1.000 | 🟢 |
| DonutChart | 21 | 0.935 | 0.667-1.000 | 🟢 |
| bespoke | 26 | 0.915 | 0.603-1.000 | 🟢 |
| PolarAreaChart | 24 | 0.900 | 0.324-1.000 | 🟢 |
| RangeChart | 20 | 0.900 | 0.419-1.000 | 🟢 |
| Scatterplot | 21 | 0.894 | 0.333-1.000 | 🟢 |
| PieChart | 22 | 0.893 | 0.663-1.000 | 🟢 |
| WordCloud | 15 | 0.891 | 0.833-1.000 | 🟢 |
| KagiChart | 20 | 0.889 | 0.485-1.000 | 🟢 |
| WaterfallChart | 21 | 0.888 | 0.333-1.000 | 🟢 |
| StackedAreaChart | 23 | 0.883 | 0.656-1.000 | 🟢 |
| LineGraph | 38 | 0.873 | 0.495-1.000 | 🟢 |
| WaffleChart | 15 | 0.868 | 0.445-1.000 | 🟢 |
| ConnectedDotPlot | 20 | 0.864 | 0.500-1.000 | 🟢 |
| BulletChart | 20 | 0.850 | 0.591-1.000 | 🟢 |
| BubbleChart | 22 | 0.848 | 0.278-1.000 | 🟢 |
| BumpChart | 20 | 0.845 | 0.588-1.000 | 🟢 |
| BarChartInRadialLayout | 17 | 0.835 | 0.500-0.987 | 🟢 |
| GeoHeatmap | 5 | 0.834 | 0.697-0.976 | 🟢 |
| ParallelCoordinatesPlot | 18 | 0.833 | 0.500-1.000 | 🟢 |
| RadialBarChart | 20 | 0.814 | 0.500-1.000 | 🟢 |
| DivergingStackedBarChart | 21 | 0.812 | 0.333-1.000 | 🟢 |
| SpiralPlot | 8 | 0.810 | 0.489-1.000 | 🟢 |
| Calendar | 13 | 0.809 | 0.611-1.000 | 🟢 |
| ViolinPlot | 20 | 0.803 | 0.222-1.000 | 🟢 |
| BoxAndWhisker | 23 | 0.799 | 0.470-1.000 | 🟡 |
| GanttChart | 23 | 0.792 | 0.385-1.000 | 🟡 |
| MatrixDiagram | 18 | 0.786 | 0.333-1.000 | 🟡 |
| DensityPlot | 21 | 0.783 | 0.167-1.000 | 🟡 |
| GroupedBarChart | 27 | 0.776 | 0.333-1.000 | 🟡 |
| Heatmap | 19 | 0.764 | 0.000-1.000 | 🟡 |
| RadarChart | 24 | 0.757 | 0.367-1.000 | 🟡 |
| DotPlot | 20 | 0.714 | 0.035-1.000 | 🟡 |
| AreaChart | 26 | 0.629 | 0.167-1.000 | 🟠 |
| StackedBarChart | 25 | 0.607 | 0.000-1.000 | 🟠 |
| BarChart | 27 | 0.533 | 0.000-1.000 | 🔴 |

🏆 BEST CHART TYPES:
   1. CandlestickChart: 0.957 (n=21)
   2. CirclePacking: 0.955 (n=21)
   3. ConnectedScatterPlot: 0.953 (n=19)

🔍 MOST CHALLENGING CHART TYPES:
   1. AreaChart: 0.629 (n=26)
   2. StackedBarChart: 0.607 (n=25)
   3. BarChart: 0.533 (n=27)

📊 EVALUATION COMPLETED
