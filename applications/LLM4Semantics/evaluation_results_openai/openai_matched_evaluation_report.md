---
title: OpenAI vs DeepSeek Matched Charts - Evaluation Report  
date: 2025-06-29 15:33:40
model: GPT-4o (OpenAI)
scope: Matched charts only (intersection with DeepSeek evaluation)
api: OpenAI Batch API
---


# OpenAI vs DeepSeek Matched Charts - Evaluation Report



📊 EVALUATION OVERVIEW:
   • Evaluation scope: Matched charts only (DeepSeek ∩ OpenAI)
   • Evaluation started: 2025-06-29T15:33:39.348216
   • DeepSeek source: evaluation_progress.json
   • OpenAI batch started: 2025-06-27T21:38:14.294020

### 📈 Chart Availability

   • DeepSeek evaluated charts: 772
   • OpenAI successful charts: 837
   • Matched charts (intersection): 772
   • Match rate: 100.0% of DeepSeek charts

### 🎯 Evaluation Results

   • Successfully evaluated: 772
   • Failed evaluations: 0
   • Skipped (no ground truth): 0
   • Coverage: 100.0% of matched charts

📈 PERFORMANCE METRICS (MATCHED CHARTS ONLY):

MAIN CHART MARKS:
   F1 Score:  0.845 ± 0.308 (min: 0.000, median: 1.000, max: 1.000)
   Precision: 0.892 ± 0.285 (min: 0.000, median: 1.000, max: 1.000)
   Recall:    0.848 ± 0.317 (min: 0.000, median: 1.000, max: 1.000)
   Charts:    772

AXIS LABELS:
   F1 Score:  0.796 ± 0.366 (min: 0.000, median: 1.000, max: 1.000)
   Precision: 0.822 ± 0.364 (min: 0.000, median: 1.000, max: 1.000)
   Recall:    0.799 ± 0.373 (min: 0.000, median: 1.000, max: 1.000)
   Charts:    772

AXIS TITLES:
   F1 Score:  0.834 ± 0.367 (min: 0.000, median: 1.000, max: 1.000)
   Precision: 0.834 ± 0.368 (min: 0.000, median: 1.000, max: 1.000)
   Recall:    0.838 ± 0.367 (min: 0.000, median: 1.000, max: 1.000)
   Charts:    772

LEGEND LABELS:
   F1 Score:  0.814 ± 0.386 (min: 0.000, median: 1.000, max: 1.000)
   Precision: 0.817 ± 0.385 (min: 0.000, median: 1.000, max: 1.000)
   Recall:    0.814 ± 0.387 (min: 0.000, median: 1.000, max: 1.000)
   Charts:    772

LEGEND MARKS:
   F1 Score:  0.797 ± 0.396 (min: 0.000, median: 1.000, max: 1.000)
   Precision: 0.796 ± 0.397 (min: 0.000, median: 1.000, max: 1.000)
   Recall:    0.802 ± 0.395 (min: 0.000, median: 1.000, max: 1.000)
   Charts:    772

LEGEND TITLES:
   F1 Score:  0.945 ± 0.227 (min: 0.000, median: 1.000, max: 1.000)
   Precision: 0.945 ± 0.227 (min: 0.000, median: 1.000, max: 1.000)
   Recall:    0.946 ± 0.227 (min: 0.000, median: 1.000, max: 1.000)
   Charts:    772

🎯 OVERALL PERFORMANCE (MATCHED CHARTS):
   Mean F1 Score: 0.839 ± 0.210 (min: 0.000, median: 0.929, max: 1.000)
   Mean Precision: 0.851 ± 0.347 (min: 0.000, median: 1.000, max: 1.000)
   Mean Recall: 0.841 ± 0.353 (min: 0.000, median: 1.000, max: 1.000)
   Evaluated Charts: 772
   Performance Level: 🟢 EXCELLENT

🏆 TOP PERFORMING CHARTS (MATCHED SET):
   1. Scatterplot21: 1.000
   2. PieChart8: 1.000
   3. LineGraph12: 1.000
   4. Scatterplot10: 1.000
   5. MarimekkoChart5: 1.000

🔍 MOST CHALLENGING CHARTS (MATCHED SET):
   1. BarChart25: 0.000
   2. StackedBarChart6: 0.000
   3. BarChart13: 0.000
   4. Heatmap13: 0.000
   5. DotPlot8: 0.035

🎯 CATEGORY PERFORMANCE INSIGHTS:
   Main Chart Marks: 🟢 Excellent (F1: 0.845, n=772)
   Axis Labels: 🟡 Good (F1: 0.796, n=772)
   Axis Titles: 🟢 Excellent (F1: 0.834, n=772)
   Legend Labels: 🟢 Excellent (F1: 0.814, n=772)
   Legend Marks: 🟡 Good (F1: 0.797, n=772)
   Legend Titles: 🟢 Excellent (F1: 0.945, n=772)

📈 CHART TYPE PERFORMANCE ANALYSIS (MATCHED CHARTS):
| Chart Type | Count | F1 Mean | F1 Range | Performance |
|------------|-------|---------|----------|-------------|
| StreamGraph | 11 | 0.984 | 0.833-1.000 | 🟢 |
| CandlestickChart | 19 | 0.964 | 0.870-1.000 | 🟢 |
| CirclePacking | 19 | 0.959 | 0.570-1.000 | 🟢 |
| ConnectedScatterPlot | 19 | 0.953 | 0.750-1.000 | 🟢 |
| MarimekkoChart | 20 | 0.945 | 0.756-1.000 | 🟢 |
| Treemap | 16 | 0.941 | 0.664-1.000 | 🟢 |
| DonutChart | 21 | 0.935 | 0.667-1.000 | 🟢 |
| SpiralPlot | 5 | 0.932 | 0.833-1.000 | 🟢 |
| Scatterplot | 19 | 0.932 | 0.500-1.000 | 🟢 |
| bespoke | 26 | 0.915 | 0.603-1.000 | 🟢 |
| WaterfallChart | 18 | 0.909 | 0.333-1.000 | 🟢 |
| RangeChart | 20 | 0.900 | 0.419-1.000 | 🟢 |
| PieChart | 22 | 0.893 | 0.663-1.000 | 🟢 |
| BubbleChart | 18 | 0.893 | 0.490-1.000 | 🟢 |
| StackedAreaChart | 22 | 0.893 | 0.656-1.000 | 🟢 |
| PolarAreaChart | 22 | 0.892 | 0.324-1.000 | 🟢 |
| KagiChart | 20 | 0.889 | 0.485-1.000 | 🟢 |
| WordCloud | 14 | 0.883 | 0.833-1.000 | 🟢 |
| GeoHeatmap | 3 | 0.880 | 0.832-0.976 | 🟢 |
| LineGraph | 37 | 0.878 | 0.495-1.000 | 🟢 |
| WaffleChart | 15 | 0.868 | 0.445-1.000 | 🟢 |
| ConnectedDotPlot | 20 | 0.864 | 0.500-1.000 | 🟢 |
| BarChartInRadialLayout | 14 | 0.851 | 0.515-0.987 | 🟢 |
| BulletChart | 20 | 0.850 | 0.591-1.000 | 🟢 |
| BumpChart | 19 | 0.845 | 0.588-1.000 | 🟢 |
| Calendar | 11 | 0.836 | 0.611-1.000 | 🟢 |
| ParallelCoordinatesPlot | 16 | 0.833 | 0.500-1.000 | 🟢 |
| RadialBarChart | 18 | 0.815 | 0.500-1.000 | 🟢 |
| DivergingStackedBarChart | 20 | 0.811 | 0.333-1.000 | 🟢 |
| GanttChart | 22 | 0.805 | 0.385-1.000 | 🟢 |
| MatrixDiagram | 13 | 0.802 | 0.631-1.000 | 🟢 |
| ViolinPlot | 16 | 0.799 | 0.222-1.000 | 🟡 |
| BoxAndWhisker | 20 | 0.798 | 0.470-0.996 | 🟡 |
| GroupedBarChart | 26 | 0.780 | 0.333-1.000 | 🟡 |
| RadarChart | 23 | 0.774 | 0.381-1.000 | 🟡 |
| DensityPlot | 20 | 0.773 | 0.167-1.000 | 🟡 |
| Heatmap | 13 | 0.730 | 0.000-1.000 | 🟡 |
| DotPlot | 20 | 0.714 | 0.035-1.000 | 🟡 |
| AreaChart | 24 | 0.641 | 0.167-1.000 | 🟠 |
| StackedBarChart | 25 | 0.607 | 0.000-1.000 | 🟠 |
| BarChart | 26 | 0.543 | 0.000-1.000 | 🔴 |

🏆 BEST CHART TYPES (MATCHED SET):
   1. StreamGraph: 0.984 (n=11)
   2. CandlestickChart: 0.964 (n=19)
   3. CirclePacking: 0.959 (n=19)

🔍 MOST CHALLENGING CHART TYPES (MATCHED SET):
   1. AreaChart: 0.641 (n=24)
   2. StackedBarChart: 0.607 (n=25)
   3. BarChart: 0.543 (n=26)

📊 MATCHED EVALUATION COMPLETED
