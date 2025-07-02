#!/usr/bin/env python3
import os
import json
import pandas as pd
from datetime import datetime
import numpy as np
from typing import Dict, Any


class FinalReportGenerator:
    def __init__(self, evaluation_output_dir: str = "evaluation_results"):
        self.evaluation_output_dir = evaluation_output_dir
        self.progress_file = os.path.join(evaluation_output_dir, "evaluation_progress.json")
        
    def load_progress_data(self) -> Dict[str, Any]:
        """Load progress data from JSON file"""
        if not os.path.exists(self.progress_file):
            raise FileNotFoundError(f"Progress file not found: {self.progress_file}")
        
        with open(self.progress_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def extract_chart_type(self, chart_name: str) -> str:
        """Extract chart type from chart name (e.g., 'BarChart15' -> 'BarChart')"""
        import re
        # Use regex to find chart type (letters at the beginning)
        match = re.match(r'^([A-Za-z]+)', chart_name)
        return match.group(1) if match else "Unknown"
    
    def generate_detailed_csv(self, progress_data: Dict[str, Any]) -> pd.DataFrame:
        """Generate detailed CSV with all evaluation results"""
        all_results = []
        
        for chart_name, file_data in progress_data["evaluated_files"].items():
            if file_data.get("status") == "success" and "metrics" in file_data:
                row = {"chart_name": chart_name}
                metrics = file_data["metrics"]
                
                # Extract and add chart type
                chart_type = self.extract_chart_type(chart_name)
                row["chart_type"] = chart_type
                
                # Flatten metrics for DataFrame
                categories = ["main_chart_marks", "axis_labels", "axis_titles", 
                             "legend_labels", "legend_marks", "legend_titles"]
                
                for category in categories:
                    if category in metrics:
                        for metric_name, value in metrics[category].items():
                            row[f"{category}_{metric_name}"] = value
                
                # Add overall F1 score
                f1_scores = [metrics[cat]["f1"] for cat in categories if cat in metrics]
                row["overall_f1"] = np.mean(f1_scores) if f1_scores else 0
                
                # Add metadata
                row["evaluated_at"] = file_data.get("evaluated_at", "unknown")
                row["status"] = file_data["status"]
                
                all_results.append(row)
        
        return pd.DataFrame(all_results)
    
    def generate_chart_type_analysis(self, df: pd.DataFrame) -> Dict[str, Dict[str, float]]:
        """Generate performance statistics by chart type"""
        if df.empty or 'chart_type' not in df.columns:
            return {}
        
        chart_type_stats = {}
        
        for chart_type in df['chart_type'].unique():
            type_data = df[df['chart_type'] == chart_type]
            
            if len(type_data) == 0:
                continue
                
            # Calculate overall F1 statistics for this chart type
            f1_scores = type_data['overall_f1'].dropna()
            
            if len(f1_scores) > 0:
                chart_type_stats[chart_type] = {
                    "count": len(type_data),
                    "f1_mean": f1_scores.mean(),
                    "f1_std": f1_scores.std(),
                    "f1_median": f1_scores.median(),
                    "f1_min": f1_scores.min(),
                    "f1_max": f1_scores.max()
                }
                
                # Add category-specific statistics for this chart type
                categories = ["main_chart_marks", "axis_labels", "axis_titles", 
                             "legend_labels", "legend_marks", "legend_titles"]
                
                for category in categories:
                    f1_col = f"{category}_f1"
                    if f1_col in type_data.columns:
                        cat_f1 = type_data[f1_col].dropna()
                        if len(cat_f1) > 0:
                            chart_type_stats[chart_type][f"{category}_f1_mean"] = cat_f1.mean()
        
        return chart_type_stats
    
    def print_comprehensive_report(self, progress_data: Dict[str, Any], df: pd.DataFrame):
        """Print comprehensive evaluation report"""
        print("=" * 80)
        print("LLM CHART ELEMENT IDENTIFICATION - FINAL PERFORMANCE REPORT")
        print("=" * 80)
        
        # Overview
        total_available = progress_data.get("total_available", 0)
        evaluated = progress_data.get("evaluated", 0)
        successful = progress_data.get("successful", 0)
        failed = progress_data.get("failed", 0)
        skipped = progress_data.get("skipped", 0)
        
        print(f"\n📊 EVALUATION OVERVIEW:")
        print(f"   • Started: {progress_data.get('started_at', 'Unknown')}")
        print(f"   • Last updated: {progress_data.get('updated_at', 'Unknown')}")
        print(f"   • Total LLM results available: {total_available}")
        print(f"   • Successfully evaluated: {successful}")
        print(f"   • Failed evaluations: {failed}")
        print(f"   • Skipped (no ground truth): {skipped}")
        print(f"   • Coverage: {100*successful/total_available if total_available > 0 else 0:.1f}%")
        
        if df.empty:
            print("\n❌ No successful evaluations to report!")
            return
        
        # Performance metrics
        print(f"\n📈 PERFORMANCE METRICS:")
        print("-" * 80)
        
        categories = ["main_chart_marks", "axis_labels", "axis_titles", 
                     "legend_labels", "legend_marks", "legend_titles"]
        
        summary_stats = progress_data.get("summary_stats", {})
        
        for category in categories:
            if category in summary_stats:
                stats = summary_stats[category]
                print(f"\n{category.upper().replace('_', ' ')}:")
                print(f"   F1 Score:  {stats['f1_mean']:.3f} ± {stats['f1_std']:.3f}")
                print(f"   Precision: {stats['precision_mean']:.3f}")
                print(f"   Recall:    {stats['recall_mean']:.3f}")
                print(f"   Charts:    {stats['count']}")
        
        # Overall performance
        if "overall" in summary_stats:
            overall = summary_stats["overall"]
            print(f"\n🎯 OVERALL PERFORMANCE:")
            print(f"   Mean F1 Score: {overall['f1_mean']:.3f} ± {overall['f1_std']:.3f}")
            
            # Performance interpretation
            f1_mean = overall['f1_mean']
            if f1_mean > 0.8:
                status = "🟢 EXCELLENT"
            elif f1_mean > 0.7:
                status = "🟡 GOOD"
            elif f1_mean > 0.6:
                status = "🟠 ACCEPTABLE"
            else:
                status = "🔴 NEEDS IMPROVEMENT"
            print(f"   Performance Level: {status}")
        
        # Top performers
        if 'overall_f1' in df.columns:
            print(f"\n🏆 TOP PERFORMING CHARTS:")
            print("-" * 50)
            top_5 = df.nlargest(5, 'overall_f1')[['chart_name', 'overall_f1']]
            for i, (_, row) in enumerate(top_5.iterrows(), 1):
                print(f"   {i}. {row['chart_name']}: {row['overall_f1']:.3f}")
            
            print(f"\n🔍 MOST CHALLENGING CHARTS:")
            print("-" * 50)
            bottom_5 = df.nsmallest(5, 'overall_f1')[['chart_name', 'overall_f1']]
            for i, (_, row) in enumerate(bottom_5.iterrows(), 1):
                print(f"   {i}. {row['chart_name']}: {row['overall_f1']:.3f}")
        
        # Category insights
        print(f"\n🎯 CATEGORY PERFORMANCE INSIGHTS:")
        print("-" * 50)
        
        for category in categories:
            if category in summary_stats:
                f1_mean = summary_stats[category]['f1_mean']
                count = summary_stats[category]['count']
                
                if f1_mean > 0.8:
                    status = "🟢 Excellent"
                elif f1_mean > 0.7:
                    status = "🟡 Good"
                elif f1_mean > 0.6:
                    status = "🟠 Moderate"
                else:
                    status = "🔴 Challenging"
                
                print(f"   {category.replace('_', ' ').title()}: {status} (F1: {f1_mean:.3f}, n={count})")
        
        # Chart type analysis
        if 'chart_type' in df.columns:
            chart_type_stats = self.generate_chart_type_analysis(df)
            
            if chart_type_stats:
                print(f"\n📈 CHART TYPE PERFORMANCE ANALYSIS:")
                print("-" * 80)
                
                # Sort by F1 score (descending)
                sorted_types = sorted(chart_type_stats.items(), 
                                    key=lambda x: x[1]['f1_mean'], reverse=True)
                
                print(f"{'Chart Type':<20} {'Count':<8} {'F1 Mean':<10} {'F1 Range':<15} {'Performance'}")
                print("-" * 80)
                
                for chart_type, stats in sorted_types:
                    f1_mean = stats['f1_mean']
                    f1_min = stats['f1_min']
                    f1_max = stats['f1_max']
                    count = stats['count']
                    
                    # Performance categorization
                    if f1_mean > 0.8:
                        perf_icon = "🟢"
                    elif f1_mean > 0.7:
                        perf_icon = "🟡"
                    elif f1_mean > 0.6:
                        perf_icon = "🟠"
                    else:
                        perf_icon = "🔴"
                    
                    range_str = f"{f1_min:.3f}-{f1_max:.3f}"
                    print(f"{chart_type:<20} {count:<8} {f1_mean:<10.3f} {range_str:<15} {perf_icon}")
                
                # Top and bottom performing chart types
                if len(sorted_types) >= 3:
                    print(f"\n🏆 BEST CHART TYPES:")
                    for i, (chart_type, stats) in enumerate(sorted_types[:3], 1):
                        print(f"   {i}. {chart_type}: {stats['f1_mean']:.3f} (n={stats['count']})")
                    
                    print(f"\n🔍 MOST CHALLENGING CHART TYPES:")
                    for i, (chart_type, stats) in enumerate(sorted_types[-3:], 1):
                        print(f"   {i}. {chart_type}: {stats['f1_mean']:.3f} (n={stats['count']})")
        
        print(f"\n📊 EVALUATION COMPLETED")
        print("=" * 80)
    
    def generate_markdown_report(self, progress_data: Dict[str, Any], df: pd.DataFrame) -> str:
        """Generate markdown version of the comprehensive report"""
        md_content = []
        
        # Header
        md_content.append("# LLM Chart Element Identification - Performance Report")
        md_content.append("")
        
        # Overview
        total_available = progress_data.get("total_available", 0)
        successful = progress_data.get("successful", 0)
        failed = progress_data.get("failed", 0)
        skipped = progress_data.get("skipped", 0)
        
        md_content.append("## 📊 Evaluation Overview")
        md_content.append("")
        md_content.append(f"- **Started**: {progress_data.get('started_at', 'Unknown')}")
        md_content.append(f"- **Last updated**: {progress_data.get('updated_at', 'Unknown')}")
        md_content.append(f"- **Total LLM results available**: {total_available}")
        md_content.append(f"- **Successfully evaluated**: {successful}")
        md_content.append(f"- **Failed evaluations**: {failed}")
        md_content.append(f"- **Skipped (no ground truth)**: {skipped}")
        md_content.append(f"- **Coverage**: {100*successful/total_available if total_available > 0 else 0:.1f}%")
        md_content.append("")
        
        if df.empty:
            md_content.append("❌ No successful evaluations to report!")
            return "\n".join(md_content)
        
        # Performance metrics
        md_content.append("## 📈 Performance Metrics")
        md_content.append("")
        
        categories = ["main_chart_marks", "axis_labels", "axis_titles", 
                     "legend_labels", "legend_marks", "legend_titles"]
        
        summary_stats = progress_data.get("summary_stats", {})
        
        for category in categories:
            if category in summary_stats:
                stats = summary_stats[category]
                md_content.append(f"### {category.upper().replace('_', ' ')}")
                md_content.append("")
                md_content.append(f"- **F1 Score**: {stats['f1_mean']:.3f} ± {stats['f1_std']:.3f}")
                md_content.append(f"- **Precision**: {stats['precision_mean']:.3f}")
                md_content.append(f"- **Recall**: {stats['recall_mean']:.3f}")
                md_content.append(f"- **Charts**: {stats['count']}")
                md_content.append("")
        
        # Overall performance
        if "overall" in summary_stats:
            overall = summary_stats["overall"]
            md_content.append("## 🎯 Overall Performance")
            md_content.append("")
            md_content.append(f"- **Mean F1 Score**: {overall['f1_mean']:.3f} ± {overall['f1_std']:.3f}")
            
            # Performance interpretation
            f1_mean = overall['f1_mean']
            if f1_mean > 0.8:
                status = "🟢 **EXCELLENT**"
            elif f1_mean > 0.7:
                status = "🟡 **GOOD**"
            elif f1_mean > 0.6:
                status = "🟠 **ACCEPTABLE**"
            else:
                status = "🔴 **NEEDS IMPROVEMENT**"
            md_content.append(f"- **Performance Level**: {status}")
            md_content.append("")
        
        # Top performers
        if 'overall_f1' in df.columns:
            md_content.append("## 🏆 Top Performing Charts")
            md_content.append("")
            top_5 = df.nlargest(5, 'overall_f1')[['chart_name', 'overall_f1']]
            for i, (_, row) in enumerate(top_5.iterrows(), 1):
                md_content.append(f"{i}. **{row['chart_name']}**: {row['overall_f1']:.3f}")
            md_content.append("")
            
            md_content.append("## 🔍 Most Challenging Charts")
            md_content.append("")
            bottom_5 = df.nsmallest(5, 'overall_f1')[['chart_name', 'overall_f1']]
            for i, (_, row) in enumerate(bottom_5.iterrows(), 1):
                md_content.append(f"{i}. **{row['chart_name']}**: {row['overall_f1']:.3f}")
            md_content.append("")
        
        # Category insights
        md_content.append("## 🎯 Category Performance Insights")
        md_content.append("")
        
        for category in categories:
            if category in summary_stats:
                f1_mean = summary_stats[category]['f1_mean']
                count = summary_stats[category]['count']
                
                if f1_mean > 0.8:
                    status = "🟢 Excellent"
                elif f1_mean > 0.7:
                    status = "🟡 Good"
                elif f1_mean > 0.6:
                    status = "🟠 Moderate"
                else:
                    status = "🔴 Challenging"
                
                md_content.append(f"- **{category.replace('_', ' ').title()}**: {status} (F1: {f1_mean:.3f}, n={count})")
        md_content.append("")
        
        # Chart type analysis
        if 'chart_type' in df.columns:
            chart_type_stats = self.generate_chart_type_analysis(df)
            
            if chart_type_stats:
                md_content.append("## 📈 Chart Type Performance Analysis")
                md_content.append("")
                
                # Sort by F1 score (descending)
                sorted_types = sorted(chart_type_stats.items(), 
                                    key=lambda x: x[1]['f1_mean'], reverse=True)
                
                md_content.append("| Chart Type | Count | F1 Mean | F1 Range | Performance |")
                md_content.append("|------------|-------|---------|----------|-------------|")
                
                for chart_type, stats in sorted_types:
                    f1_mean = stats['f1_mean']
                    f1_min = stats['f1_min']
                    f1_max = stats['f1_max']
                    count = stats['count']
                    
                    # Performance categorization
                    if f1_mean > 0.8:
                        perf_icon = "🟢"
                    elif f1_mean > 0.7:
                        perf_icon = "🟡"
                    elif f1_mean > 0.6:
                        perf_icon = "🟠"
                    else:
                        perf_icon = "🔴"
                    
                    range_str = f"{f1_min:.3f}-{f1_max:.3f}"
                    md_content.append(f"| {chart_type} | {count} | {f1_mean:.3f} | {range_str} | {perf_icon} |")
                
                md_content.append("")
                
                # Top and bottom performing chart types
                if len(sorted_types) >= 3:
                    md_content.append("### 🏆 Best Chart Types")
                    md_content.append("")
                    for i, (chart_type, stats) in enumerate(sorted_types[:3], 1):
                        md_content.append(f"{i}. **{chart_type}**: {stats['f1_mean']:.3f} (n={stats['count']})")
                    md_content.append("")
                    
                    md_content.append("### 🔍 Most Challenging Chart Types")
                    md_content.append("")
                    for i, (chart_type, stats) in enumerate(sorted_types[-3:], 1):
                        md_content.append(f"{i}. **{chart_type}**: {stats['f1_mean']:.3f} (n={stats['count']})")
                    md_content.append("")
        
        md_content.append("---")
        md_content.append("*Report generated automatically by LLM4Semantics evaluation system*")
        
        return "\n".join(md_content)
    
    def generate_final_report(self):
        """Generate and save final comprehensive report"""
        print("📋 Generating final evaluation report...")
        
        # Load progress data
        try:
            progress_data = self.load_progress_data()
        except FileNotFoundError as e:
            print(f"❌ {e}")
            return
        
        # Generate detailed DataFrame
        df = self.generate_detailed_csv(progress_data)
        
        # Print comprehensive report
        self.print_comprehensive_report(progress_data, df)
        
        # Generate and save Markdown report
        markdown_content = self.generate_markdown_report(progress_data, df)
        markdown_file = os.path.join(self.evaluation_output_dir, "final_evaluation_report.md")
        with open(markdown_file, 'w', encoding='utf-8') as f:
            f.write(markdown_content)
        print(f"\n📝 Markdown report saved to: {markdown_file}")
        
        # Save detailed results to CSV
        if not df.empty:
            output_file = os.path.join(self.evaluation_output_dir, "performance_by_chart.csv")
            df.to_csv(output_file, index=False)
            print(f"💾 Detailed results saved to: {output_file}")
        
        # Generate chart type analysis
        chart_type_analysis = {}
        if not df.empty:
            chart_type_analysis = self.generate_chart_type_analysis(df)
        
        # Save summary statistics to JSON
        summary_file = os.path.join(self.evaluation_output_dir, "final_evaluation_summary.json")
        summary_data = {
            "generated_at": datetime.now().isoformat(),
            "evaluation_overview": {
                "total_available": progress_data.get("total_available", 0),
                "successful": progress_data.get("successful", 0),
                "failed": progress_data.get("failed", 0),
                "skipped": progress_data.get("skipped", 0)
            },
            "performance_summary": progress_data.get("summary_stats", {}),
            "chart_type_analysis": chart_type_analysis,
            "evaluation_period": {
                "started_at": progress_data.get("started_at"),
                "completed_at": progress_data.get("updated_at")
            }
        }
        
        # Convert NaN values to None for valid JSON
        def replace_nan(obj):
            if isinstance(obj, dict):
                return {k: replace_nan(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [replace_nan(v) for v in obj]
            elif isinstance(obj, float) and np.isnan(obj):
                return None
            return obj
        
        clean_summary_data = replace_nan(summary_data)
        
        with open(summary_file, 'w', encoding='utf-8') as f:
            json.dump(clean_summary_data, f, indent=2)
        print(f"📊 Summary statistics saved to: {summary_file}")
        
        return df, summary_data


def main():
    # Generate final report
    generator = FinalReportGenerator()
    generator.generate_final_report()


if __name__ == "__main__":
    main() 