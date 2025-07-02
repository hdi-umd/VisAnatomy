#!/usr/bin/env python3
"""
Integrated Model Comparison Visualization Script
Creates box plots comparing DeepSeek and OpenAI evaluation results
with three-level hierarchy: Metrics > Categories > Models
"""

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

class ModelComparisonVisualizer:
    def __init__(self):
        self.metrics = ['f1', 'precision', 'recall']
        self.categories = [
            'main_chart_marks', 'axis_labels', 'axis_titles',
            'legend_labels', 'legend_marks', 'legend_titles'
        ]
        self.category_display_names = {
            'main_chart_marks': 'Chart Marks',
            'axis_labels': 'Axis Labels', 
            'axis_titles': 'Axis Titles',
            'legend_labels': 'Legend Labels',
            'legend_marks': 'Legend Marks',
            'legend_titles': 'Legend Titles'
        }
        self.metric_display_names = {
            'f1': 'F1 Score',
            'precision': 'Precision',
            'recall': 'Recall'
        }
        
        # Set up the style
        plt.style.use('default')
        sns.set_palette("husl")
        
    def load_data(self, deepseek_path, openai_path):
        """Load and prepare data from both models"""
        print("Loading DeepSeek data...")
        deepseek_df = pd.read_csv(deepseek_path)
        deepseek_df['model'] = 'DeepSeek'
        
        print("Loading OpenAI data...")
        openai_df = pd.read_csv(openai_path)
        openai_df['model'] = 'OpenAI'
        
        return deepseek_df, openai_df
    
    def prepare_comparison_data(self, deepseek_df, openai_df):
        """Prepare data for comparison visualization"""
        comparison_data = []
        
        for df in [deepseek_df, openai_df]:
            model_name = df['model'].iloc[0]
            
            for category in self.categories:
                for metric in self.metrics:
                    col_name = f"{category}_{metric}"
                    if col_name in df.columns:
                        values = df[col_name].dropna()
                        for value in values:
                            comparison_data.append({
                                'model': model_name,
                                'category': category,
                                'metric': metric,
                                'value': value,
                                'category_display': self.category_display_names[category],
                                'metric_display': self.metric_display_names[metric]
                            })
        
        return pd.DataFrame(comparison_data)
    
    def create_integrated_comparison(self, comparison_df, output_dir):
        """Create the integrated three-level hierarchy comparison plot"""
        
        # Create single figure - optimized for horizontal layout
        fig, ax = plt.subplots(figsize=(16, 14))
        
        # Color palette for models
        model_colors = {'DeepSeek': '#2E86AB', 'OpenAI': '#A23B72'}
        
        # Create hierarchical data ordering: metric -> category -> model
        # Sort data by metric first, then category
        comparison_df['metric_order'] = comparison_df['metric'].map({'f1': 0, 'precision': 1, 'recall': 2})
        comparison_df['category_order'] = comparison_df['category'].map({
            'main_chart_marks': 0, 'axis_labels': 1, 'axis_titles': 2,
            'legend_labels': 3, 'legend_marks': 4, 'legend_titles': 5
        })
        comparison_df = comparison_df.sort_values(['metric_order', 'category_order'])
        
        # Create combined label for x-axis (category within metric)
        comparison_df['x_label'] = comparison_df['metric_display'] + '_' + comparison_df['category_display']
        
        # Create the box plot (swapped x and y axes)
        box_plot = sns.boxplot(
            data=comparison_df,
            y='x_label',
            x='value',
            hue='model',
            ax=ax,
            palette=model_colors,
            linewidth=1.5,
            orient='h'
        )
        
        # Fix outlier colors - adapted for horizontal orientation
        outliers_found = 0
        
        # Method 1: Check all Line2D objects (outliers are often Line2D with markers)
        for child in ax.get_children():
            if hasattr(child, 'get_xdata') and hasattr(child, 'get_ydata'):
                # Check if this looks like outlier data (single points)
                x_data = child.get_xdata()
                y_data = child.get_ydata()
                
                if len(y_data) > 0 and hasattr(child, 'get_marker') and child.get_marker() in ['o', '.', 'D']:
                    # This is likely an outlier point - now check y-position for horizontal plot
                    for y_pos in y_data:
                        # Determine model based on y-position offset
                        category_idx = int(round(y_pos))
                        offset_from_center = y_pos - category_idx
                        
                        if offset_from_center < 0:  # DeepSeek (below)
                            child.set_color(model_colors['DeepSeek'])
                            child.set_markerfacecolor(model_colors['DeepSeek'])
                            child.set_markeredgecolor(model_colors['DeepSeek'])
                        else:  # OpenAI (above)
                            child.set_color(model_colors['OpenAI'])
                            child.set_markerfacecolor(model_colors['OpenAI'])
                            child.set_markeredgecolor(model_colors['OpenAI'])
                        
                        outliers_found += 1
                        break  # Only need to check once per child
        
        # Method 2: Check collections (PathCollections for scatter-like outliers)
        for collection in ax.collections:
            if hasattr(collection, 'get_offsets'):
                offsets = collection.get_offsets()
                if len(offsets) > 0:
                    y_positions = offsets[:, 1]  # Now check y-positions for horizontal plot
                    
                    if len(y_positions) > 0:
                        sample_y = y_positions[0]
                        category_idx = int(round(sample_y))
                        offset_from_center = sample_y - category_idx
                        
                        if offset_from_center < 0:  # DeepSeek (below)
                            color = model_colors['DeepSeek']
                        else:  # OpenAI (above)
                            color = model_colors['OpenAI']
                        
                        try:
                            collection.set_facecolors(color)
                            collection.set_edgecolors(color)
                            outliers_found += len(y_positions)
                        except:
                            pass
        
        # Method 3: Check for any remaining outlier artists
        for artist in ax.get_children():
            if hasattr(artist, 'get_facecolor') and hasattr(artist, 'get_offsets'):
                try:
                    offsets = artist.get_offsets()
                    if len(offsets) > 0:
                        y_positions = offsets[:, 1]  # Y-positions for horizontal plot
                        sample_y = y_positions[0]
                        category_idx = int(round(sample_y))
                        offset_from_center = sample_y - category_idx
                        
                        if offset_from_center < 0:
                            color = model_colors['DeepSeek']
                        else:
                            color = model_colors['OpenAI']
                        
                        artist.set_facecolor(color)
                        artist.set_edgecolor(color)
                        outliers_found += len(y_positions)
                except:
                    pass
        
        print(f"Colored {outliers_found} outlier points")
        
        # Customize the plot (swapped axes)
        ax.set_xlabel('Score', fontsize=16, fontweight='bold')
        ax.set_ylabel('', fontsize=16, fontweight='bold')  # Remove y-label since we'll add custom labels
        
        # Rotate y-axis labels for better readability
        ax.tick_params(axis='y', rotation=0, labelsize=12)
        ax.tick_params(axis='x', labelsize=12)
        
        # Add grid for better readability
        ax.grid(True, alpha=0.3, linestyle='--')
        ax.set_axisbelow(True)
        
        # Set x-axis limits to show full range
        ax.set_xlim(0, 1.05)
        
        # Add subtle background color
        ax.set_facecolor('#f8f9fa')
        
        # Create custom hierarchical y-axis labels
        # Get the current y-tick positions and labels
        tick_positions = ax.get_yticks()
        tick_labels = [t.get_text() for t in ax.get_yticklabels()]
        
        # Clear existing labels
        ax.set_yticklabels([])
        
        # Parse labels to get metric and category info
        categories_by_metric = {}
        for i, label in enumerate(tick_labels):
            if '_' in label:
                metric, category = label.split('_', 1)
                if metric not in categories_by_metric:
                    categories_by_metric[metric] = []
                categories_by_metric[metric].append((i, category))
        
        # Add category labels (inner level) - these are the individual semantic categories
        for i, label in enumerate(tick_labels):
            if '_' in label:
                metric, category = label.split('_', 1)
                ax.text(-0.02, i, category, ha='right', va='center', transform=ax.get_yaxis_transform(),
                       fontsize=12)  # Closer to chart
        
        # Add metric group labels (outer level) - F1 Score, Precision, Recall
        for metric, positions_categories in categories_by_metric.items():
            positions = [pos for pos, cat in positions_categories]
            center_pos = np.mean(positions)
            ax.text(-0.15, center_pos, metric, ha='right', va='center', transform=ax.get_yaxis_transform(),
                   fontsize=16, fontweight='bold')  # Further from semantic labels
            
            # Add separator lines between metric groups
            if metric != list(categories_by_metric.keys())[-1]:  # Not the last group
                separator_pos = max(positions) + 0.5
                ax.axhline(y=separator_pos, color='gray', linestyle='--', alpha=0.5, linewidth=1)
        
        # Position legend in the empty label area to avoid overlapping with chart
        legend = ax.legend(title='Model', bbox_to_anchor=(-0.30, 1), loc='upper left',
                          frameon=True, fancybox=True, shadow=True, fontsize=12)
        legend.get_title().set_fontweight('bold')
        legend.get_title().set_fontsize(14)
        
        # Adjust layout to accommodate left hierarchical labels
        plt.tight_layout()
        plt.subplots_adjust(left=0.22)
        
        # Save the plot
        output_path = Path(output_dir) / 'integrated_model_comparison.png'
        plt.savefig(output_path, dpi=300, bbox_inches='tight', 
                   facecolor='white', edgecolor='none')
        print(f"Integrated comparison plot saved to: {output_path}")
        
        return fig
    
    def create_summary_statistics(self, comparison_df, output_dir):
        """Create summary statistics table"""
        summary_stats = []
        
        for metric in self.metrics:
            for category in self.categories:
                for model in ['DeepSeek', 'OpenAI']:
                    data = comparison_df[
                        (comparison_df['metric'] == metric) &
                        (comparison_df['category'] == category) &
                        (comparison_df['model'] == model)
                    ]['value']
                    
                    if len(data) > 0:
                        summary_stats.append({
                            'Metric': self.metric_display_names[metric],
                            'Category': self.category_display_names[category],
                            'Model': model,
                            'Mean': data.mean(),
                            'Std': data.std(),
                            'Median': data.median(),
                            'Min': data.min(),
                            'Max': data.max(),
                            'Count': len(data)
                        })
        
        summary_df = pd.DataFrame(summary_stats)
        summary_path = Path(output_dir) / 'model_comparison_summary.csv'
        summary_df.to_csv(summary_path, index=False)
        print(f"Summary statistics saved to: {summary_path}")
        
        return summary_df
    
    def create_overall_comparison(self, comparison_df, output_dir):
        """Create an overall performance comparison chart"""
        fig, ax = plt.subplots(figsize=(12, 8))
        
        # Calculate mean performance by model and metric
        overall_stats = comparison_df.groupby(['model', 'metric'])['value'].agg(['mean', 'std']).reset_index()
        overall_stats['metric_display'] = overall_stats['metric'].map(self.metric_display_names)
        
        # Create grouped bar plot
        x = np.arange(len(self.metrics))
        width = 0.35
        
        deepseek_means = overall_stats[overall_stats['model'] == 'DeepSeek']['mean'].values
        openai_means = overall_stats[overall_stats['model'] == 'OpenAI']['mean'].values
        
        deepseek_stds = overall_stats[overall_stats['model'] == 'DeepSeek']['std'].values
        openai_stds = overall_stats[overall_stats['model'] == 'OpenAI']['std'].values
        
        bars1 = ax.bar(x - width/2, deepseek_means, width, label='DeepSeek', 
                      color='#2E86AB', alpha=0.8, yerr=deepseek_stds, capsize=5)
        bars2 = ax.bar(x + width/2, openai_means, width, label='OpenAI', 
                      color='#A23B72', alpha=0.8, yerr=openai_stds, capsize=5)
        
        # Customize the plot
        ax.set_title('Overall Model Performance Comparison', fontsize=18, fontweight='bold', pad=20)
        ax.set_xlabel('Metrics', fontsize=16, fontweight='bold')
        ax.set_ylabel('Average Score', fontsize=16, fontweight='bold')
        ax.set_xticks(x)
        ax.set_xticklabels([self.metric_display_names[m] for m in self.metrics], fontsize=12)
        ax.tick_params(axis='y', labelsize=12)
        legend = ax.legend(frameon=True, fancybox=True, shadow=True, fontsize=12)
        ax.grid(True, alpha=0.3, linestyle='--')
        ax.set_axisbelow(True)
        ax.set_facecolor('#f8f9fa')
        
        # Add value labels on bars
        def add_value_labels(bars, values):
            for bar, value in zip(bars, values):
                height = bar.get_height()
                ax.text(bar.get_x() + bar.get_width()/2., height + 0.01,
                       f'{value:.3f}', ha='center', va='bottom', fontweight='bold', fontsize=11)
        
        add_value_labels(bars1, deepseek_means)
        add_value_labels(bars2, openai_means)
        
        plt.tight_layout()
        
        # Save the plot
        output_path = Path(output_dir) / 'overall_model_comparison.png'
        plt.savefig(output_path, dpi=300, bbox_inches='tight', 
                   facecolor='white', edgecolor='none')
        print(f"Overall comparison plot saved to: {output_path}")
        
        return fig

def main():
    # Initialize visualizer
    visualizer = ModelComparisonVisualizer()
    
    # Define file paths
    deepseek_path = "applications/LLM4Semantics/evaluation_results_deepseek/performance_by_chart.csv"
    openai_path = "applications/LLM4Semantics/evaluation_results_openai/performance_by_chart.csv"
    output_dir = "applications/LLM4Semantics/model_comparison_plots"
    
    # Create output directory
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    try:
        # Load data
        deepseek_df, openai_df = visualizer.load_data(deepseek_path, openai_path)
        print(f"Loaded {len(deepseek_df)} DeepSeek samples and {len(openai_df)} OpenAI samples")
        
        # Prepare comparison data
        comparison_df = visualizer.prepare_comparison_data(deepseek_df, openai_df)
        print(f"Prepared {len(comparison_df)} comparison data points")
        
        # Create visualizations
        print("\nCreating integrated comparison visualization...")
        visualizer.create_integrated_comparison(comparison_df, output_dir)
        
        print("\nCreating overall performance comparison...")
        visualizer.create_overall_comparison(comparison_df, output_dir)
        
        print("\nGenerating summary statistics...")
        visualizer.create_summary_statistics(comparison_df, output_dir)
        
        print("\n✅ Model comparison visualization completed successfully!")
        print(f"All outputs saved to: {output_dir}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    main() 