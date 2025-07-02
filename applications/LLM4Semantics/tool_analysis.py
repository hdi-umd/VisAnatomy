import pandas as pd
import numpy as np
import sys

def main():
    # Input file paths
    eval_results_path = 'applications/LLM4Semantics/evaluation_results_openai/performance_by_chart.csv'
    # eval_results_path = 'applications/LLM4Semantics/evaluation_results_deepseek/performance_by_chart.csv'

    chart_types_path = 'applications/LLM4Semantics/chart_types_first_three_columns.csv'
    output_path = 'applications/LLM4Semantics/evaluation_results_openai/performance_by_tool.csv'
    # output_path = 'applications/LLM4Semantics/evaluation_results_deepseek/performance_by_tool.csv'

    # Read CSVs
    eval_df = pd.read_csv(eval_results_path)
    chart_types_df = pd.read_csv(chart_types_path)

    # Remove any space in 'Type' column
    chart_types_df['Type'] = chart_types_df['Type'].astype(str).str.replace(' ', '', regex=False)
    # Create a 'chart_name' column in chart_types_df as (Type + ID)
    chart_types_df['chart_name'] = chart_types_df['Type'].astype(str) + chart_types_df['ID'].astype(str)

    # Merge on 'chart_name'
    merged_df = pd.merge(eval_df, chart_types_df[['chart_name', 'charting tool']], on='chart_name', how='inner')

    # Identify metric columns (those containing 'f1', 'recall', or 'precision', case-insensitive)
    metric_cols = [col for col in merged_df.columns if any(metric in col.lower() for metric in ['f1', 'recall', 'precision'])]

    # Group by 'charting tool'
    grouped = merged_df.groupby('charting tool')

    # Prepare results
    results = []

    for tool, group in grouped:
        tool_stats = {'charting tool': tool}
        tool_stats['num_rows'] = len(group)
        for col in metric_cols:
            values = group[col].dropna().astype(float)
            if len(values) == 0:
                stats = {'min': np.nan, 'max': np.nan, 'median': np.nan, 'mean': np.nan, 'iqr': np.nan}
            else:
                stats = {
                    'min': values.min(),
                    'max': values.max(),
                    'median': values.median(),
                    'mean': values.mean(),
                    'iqr': values.quantile(0.75) - values.quantile(0.25)
                }
            for stat_name, stat_value in stats.items():
                tool_stats[f'{col}_{stat_name}'] = stat_value
        results.append(tool_stats)

    # Convert results to DataFrame and print/save
    results_df = pd.DataFrame(results)
    print(results_df.to_string(index=False))
    # Optionally, save to CSV:
    # results_df.to_csv(output_path, index=False)
    # ...existing code...

    # Convert results to DataFrame and print/save
    results_df = pd.DataFrame(results)
    # print(results_df.to_string(index=False))
    results_df.to_csv(output_path, index=False)

    # --- Generate top/bottom 5 performing tools report ---
    # --- Print all tools ordered by num_rows (desc), then by mean f1 (desc) ---
    print("\n=== All Tools Ordered by Number of Rows and Mean F1 ===")
    f1_mean_cols = [col for col in results_df.columns if col.endswith('_f1_mean')]
    if f1_mean_cols:
        f1_mean_col = f1_mean_cols[0]  # Use the first f1 mean column found
        all_sorted = results_df.sort_values(['num_rows', f1_mean_col], ascending=[False, False])
        for i, row in all_sorted.iterrows():
            print(f"{row['charting tool']}: num_rows={int(row['num_rows'])}, mean_f1={row[f1_mean_col]:.4f}")
    else:
        print("No F1 mean column found for ordering.")

if __name__ == '__main__':
    main()