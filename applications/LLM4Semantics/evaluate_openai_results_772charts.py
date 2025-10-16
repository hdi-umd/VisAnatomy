#!/usr/bin/env python3
import os
import json
import pandas as pd
from datetime import datetime
from typing import Dict, List, Set, Tuple
from collections import defaultdict
import numpy as np
from tqdm import tqdm


class OpenAIResultsMatchedEvaluator:
    def __init__(self, openai_results_dir: str, ground_truth_dir: str, deepseek_evaluation_file: str, evaluation_output_dir: str = "evaluation_results_openai_matched"):
        self.openai_results_dir = openai_results_dir
        self.ground_truth_dir = ground_truth_dir
        self.deepseek_evaluation_file = deepseek_evaluation_file
        self.evaluation_output_dir = evaluation_output_dir
        self.progress_file = os.path.join(openai_results_dir, "progress.json")
        
        # Create directories
        os.makedirs(evaluation_output_dir, exist_ok=True)
        
        # Load DeepSeek evaluation data to get the 772 chart list
        self.deepseek_charts = self.load_deepseek_evaluated_charts()
        
        # Load OpenAI progress data
        self.openai_progress = self.load_openai_progress()
        
    def load_deepseek_evaluated_charts(self) -> Set[str]:
        """Load the list of 772 charts that were evaluated in the DeepSeek study"""
        if not os.path.exists(self.deepseek_evaluation_file):
            raise FileNotFoundError(f"DeepSeek evaluation file not found: {self.deepseek_evaluation_file}")
        
        with open(self.deepseek_evaluation_file, 'r', encoding='utf-8') as f:
            deepseek_data = json.load(f)
        
        # Extract chart names from evaluated_files
        evaluated_charts = set()
        if "evaluated_files" in deepseek_data:
            for chart_name in deepseek_data["evaluated_files"].keys():
                evaluated_charts.add(chart_name)
        
        print(f"📋 Loaded {len(evaluated_charts)} charts from DeepSeek evaluation")
        return evaluated_charts
        
    def load_openai_progress(self) -> Dict:
        """Load OpenAI batch processing progress"""
        if not os.path.exists(self.progress_file):
            raise FileNotFoundError(f"OpenAI progress file not found: {self.progress_file}")
        
        with open(self.progress_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def extract_ground_truth_elements(self, gt_data: dict) -> Dict[str, Set[str]]:
        """Extract ground truth elements from annotations format"""
        gt_elements = {
            "main_chart_marks": set(),
            "axis_labels": set(),
            "axis_titles": set(),
            "legend_labels": set(),
            "legend_marks": set(),
            "legend_titles": set()
        }
        
        # Extract main chart marks from allElements
        if "allElements" in gt_data:
            for element_id, element_info in gt_data["allElements"].items():
                if element_info.get("role") == "Main Chart Mark":
                    gt_elements["main_chart_marks"].add(element_id)
        
        # Extract axis elements from referenceElements
        if "referenceElements" in gt_data and "axes" in gt_data["referenceElements"]:
            for axis in gt_data["referenceElements"]["axes"]:
                # Axis labels
                if "labels" in axis:
                    gt_elements["axis_labels"].update(axis["labels"])
                # Axis titles
                if "title" in axis:
                    gt_elements["axis_titles"].update(axis["title"])
        
        # Extract legend elements from referenceElements
        if "referenceElements" in gt_data and "legend" in gt_data["referenceElements"]:
            legend = gt_data["referenceElements"]["legend"]
            if "labels" in legend:
                # Handle both list of strings and list of dicts
                if legend["labels"]:
                    if isinstance(legend["labels"][0], dict):
                        gt_elements["legend_labels"].update([item["id"] for item in legend["labels"] if "id" in item])
                    else:
                        gt_elements["legend_labels"].update(legend["labels"])
            
            if "marks" in legend:
                if legend["marks"]:
                    if isinstance(legend["marks"][0], dict):
                        gt_elements["legend_marks"].update([item["id"] for item in legend["marks"] if "id" in item])
                    else:
                        gt_elements["legend_marks"].update(legend["marks"])
            
            if "title" in legend:
                if legend["title"]:
                    if isinstance(legend["title"][0], dict):
                        gt_elements["legend_titles"].update([item["id"] for item in legend["title"] if "id" in item])
                    else:
                        gt_elements["legend_titles"].update(legend["title"])
        
        return gt_elements
    
    def find_llm_result_file(self, chart_name: str) -> str:
        """Find the LLM result file for a chart (may have numerical prefix)"""
        # First try exact match
        exact_path = os.path.join(self.openai_results_dir, f"{chart_name}_llm_annotation.json")
        if os.path.exists(exact_path):
            return exact_path
        
        # If exact match not found, look for files that end with the pattern
        pattern = f"{chart_name}_llm_annotation.json"
        for filename in os.listdir(self.openai_results_dir):
            if filename.endswith(pattern):
                return os.path.join(self.openai_results_dir, filename)
        
        return None
    
    def extract_llm_elements(self, llm_data: dict) -> Dict[str, Set[str]]:
        """Extract LLM predicted elements"""
        llm_elements = {
            "main_chart_marks": set(llm_data.get("main_chart_marks", [])),
            "axis_labels": set(llm_data.get("axis_labels", [])),
            "axis_titles": set(llm_data.get("axis_titles", [])),
            "legend_labels": set(),
            "legend_marks": set(),
            "legend_titles": set()
        }
        
        # Extract legend elements
        if "legend" in llm_data:
            legend = llm_data["legend"]
            llm_elements["legend_labels"] = set(legend.get("labels", []))
            llm_elements["legend_marks"] = set(legend.get("marks", []))
            llm_elements["legend_titles"] = set(legend.get("title", []))
        
        return llm_elements
    
    def calculate_metrics(self, predicted: Set[str], ground_truth: Set[str]) -> Dict[str, float]:
        """Calculate precision, recall, F1, and other metrics"""
        tp = len(predicted & ground_truth)  # True positives
        fp = len(predicted - ground_truth)  # False positives
        fn = len(ground_truth - predicted)  # False negatives
        
        # Handle empty categories correctly
        if len(predicted) == 0 and len(ground_truth) == 0:
            # Both are empty - perfect match!
            precision = 1.0
            recall = 1.0
            f1 = 1.0
            jaccard = 1.0
            accuracy = 1.0
        elif len(ground_truth) == 0:
            # Ground truth is empty but prediction is not - complete failure
            precision = 0.0
            recall = 0.0
            f1 = 0.0
            jaccard = 0.0
            accuracy = 0.0
        elif len(predicted) == 0:
            # Prediction is empty but ground truth is not - complete failure
            precision = 0.0
            recall = 0.0
            f1 = 0.0
            jaccard = 0.0
            accuracy = 0.0
        else:
            # Standard calculation when both sets have elements
            precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
            recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
            f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
            jaccard = tp / (tp + fp + fn) if (tp + fp + fn) > 0 else 0.0
            accuracy = tp / len(ground_truth) if len(ground_truth) > 0 else 0.0
        
        return {
            "precision": precision,
            "recall": recall,
            "f1": f1,
            "jaccard": jaccard,
            "accuracy": accuracy,
            "tp": tp,
            "fp": fp,
            "fn": fn,
            "predicted_count": len(predicted),
            "ground_truth_count": len(ground_truth),
            "is_empty_match": len(predicted) == 0 and len(ground_truth) == 0
        }
    
    def evaluate_single_file(self, chart_name: str) -> Dict[str, Dict[str, float]]:
        """Evaluate a single chart file"""
        # Load ground truth
        gt_file = os.path.join(self.ground_truth_dir, f"{chart_name}.json")
        
        if not os.path.exists(gt_file):
            return {"error": "ground_truth_not_found"}
        
        # Find the corresponding LLM result file (may have numerical prefix)
        llm_file = self.find_llm_result_file(chart_name)
        
        if not llm_file:
            return {"error": "llm_result_not_found"}
        
        try:
            with open(gt_file, 'r', encoding='utf-8') as f:
                gt_data = json.load(f)
            
            with open(llm_file, 'r', encoding='utf-8') as f:
                llm_data = json.load(f)
            
            gt_elements = self.extract_ground_truth_elements(gt_data)
            llm_elements = self.extract_llm_elements(llm_data)
            
            # Calculate metrics for each category
            results = {}
            categories = ["main_chart_marks", "axis_labels", "axis_titles", 
                         "legend_labels", "legend_marks", "legend_titles"]
            
            for category in categories:
                results[category] = self.calculate_metrics(
                    llm_elements[category], 
                    gt_elements[category]
                )
            
            return results
            
        except Exception as e:
            return {"error": f"processing_failed: {str(e)}"}
    
    def get_openai_successful_files(self) -> Set[str]:
        """Get set of successfully processed files from OpenAI progress"""
        successful_files = set()
        
        for filename, result_info in self.openai_progress.get("results", {}).items():
            if result_info.get("status") == "success":
                # Extract chart name from filename (remove .svg extension)
                chart_name = filename.replace(".svg", "")
                
                # Remove numerical prefix (e.g., "100__bespoke4" -> "_bespoke4", "105_StackedAreaChart17" -> "StackedAreaChart17")
                if "_" in chart_name and chart_name[0].isdigit():
                    # Find the first underscore and extract everything after it
                    first_underscore = chart_name.find("_")
                    extracted_name = chart_name[first_underscore + 1:]  # Skip the underscore itself
                    
                    # Handle double underscore case for bespoke (e.g., "100__bespoke4" -> "_bespoke4")
                    if extracted_name.startswith("_bespoke"):
                        chart_name = extracted_name  # Already has single underscore prefix
                    elif "bespoke" in extracted_name:
                        chart_name = "_" + extracted_name  # Add underscore prefix
                    else:
                        chart_name = extracted_name  # Regular chart names
                
                successful_files.add(chart_name)
        
        return successful_files
    
    def get_matched_charts(self) -> List[str]:
        """Get the intersection of DeepSeek evaluated charts and OpenAI successful charts"""
        openai_successful = self.get_openai_successful_files()
        
        # Find intersection
        matched_charts = list(self.deepseek_charts.intersection(openai_successful))
        
        print(f"🔗 Chart matching:")
        print(f"   • DeepSeek evaluated: {len(self.deepseek_charts)}")
        print(f"   • OpenAI successful: {len(openai_successful)}")
        print(f"   • Intersection (matched): {len(matched_charts)}")
        
        # Show some examples of charts that are in DeepSeek but not in OpenAI
        deepseek_only = self.deepseek_charts - openai_successful
        if deepseek_only:
            print(f"   • DeepSeek only (first 5): {list(deepseek_only)[:5]}")
        
        # Show some examples of charts that are in OpenAI but not in DeepSeek
        openai_only = openai_successful - self.deepseek_charts
        if openai_only:
            print(f"   • OpenAI only (first 5): {list(openai_only)[:5]}")
        
        return matched_charts
    
    def extract_chart_type(self, chart_name: str) -> str:
        """Extract chart type from chart name (e.g., '_bespoke4' -> 'bespoke', 'BarChart15' -> 'BarChart')"""
        import re
        
        # Handle cases like "_bespoke4" - remove leading underscore
        clean_name = chart_name[1:] if chart_name.startswith("_") else chart_name
        
        # Use regex to find chart type (letters at the beginning)
        match = re.match(r'^([A-Za-z]+)', clean_name)
        return match.group(1) if match else "Unknown"
    
    def evaluate_all_matched_results(self) -> Tuple[pd.DataFrame, Dict]:
        """Evaluate OpenAI results for charts that match the DeepSeek evaluation set"""
        matched_charts = self.get_matched_charts()
        total_files = len(matched_charts)
        
        if total_files == 0:
            print("❌ No matched charts found between DeepSeek and OpenAI evaluations!")
            return pd.DataFrame(), {}
        
        print(f"🔍 Evaluating {total_files} matched charts...")
        
        # Initialize progress tracking
        progress_data = {
            "started_at": datetime.now().isoformat(),
            "evaluation_scope": "matched_charts_only",
            "deepseek_source": self.deepseek_evaluation_file,
            "deepseek_total_charts": len(self.deepseek_charts),
            "openai_successful_charts": len(self.get_openai_successful_files()),
            "matched_charts": total_files,
            "evaluated": 0,
            "successful": 0,
            "failed": 0,
            "skipped": 0,  # No ground truth available
            "evaluated_files": {},
            "summary_stats": {},
            "openai_source": {
                "total_processed": self.openai_progress.get("completed", 0),
                "successful_openai": self.openai_progress.get("successful", 0),
                "failed_openai": self.openai_progress.get("failed", 0),
                "openai_started_at": self.openai_progress.get("started_at", "unknown")
            }
        }
        
        all_results = []
        
        # Evaluate files with progress bar
        for chart_name in tqdm(matched_charts, desc="Evaluating matched charts", unit="file"):
            result = self.evaluate_single_file(chart_name)
            
            # Update progress
            if "error" in result:
                if result["error"] == "ground_truth_not_found":
                    progress_data["skipped"] += 1
                    status = "skipped"
                    tqdm.write(f"⏸️  {chart_name}: No ground truth")
                else:
                    progress_data["failed"] += 1
                    status = "failed"
                    tqdm.write(f"❌ {chart_name}: {result['error']}")
            else:
                progress_data["successful"] += 1
                status = "success"
                # Calculate overall F1 for this file
                f1_scores = [result[cat]["f1"] for cat in result.keys()]
                overall_f1 = np.mean(f1_scores) if f1_scores else 0
                tqdm.write(f"✅ {chart_name}: F1={overall_f1:.3f}")
                
                # Add to results for DataFrame
                row = {"chart_name": chart_name}
                
                # Extract and add chart type
                chart_type = self.extract_chart_type(chart_name)
                row["chart_type"] = chart_type
                
                # Flatten metrics for DataFrame
                categories = ["main_chart_marks", "axis_labels", "axis_titles", 
                             "legend_labels", "legend_marks", "legend_titles"]
                
                for category in categories:
                    if category in result:
                        for metric_name, value in result[category].items():
                            row[f"{category}_{metric_name}"] = value
                
                # Add overall F1 score
                row["overall_f1"] = overall_f1
                
                # Add metadata
                row["evaluated_at"] = datetime.now().isoformat()
                row["status"] = status
                
                all_results.append(row)
            
            # Store result
            progress_data["evaluated_files"][chart_name] = {
                "status": status,
                "evaluated_at": datetime.now().isoformat(),
                "metrics": result if "error" not in result else {},
                "error": result.get("error", None)
            }
            
            progress_data["evaluated"] += 1
        
        # Create DataFrame
        df = pd.DataFrame(all_results)
        
        # Update summary statistics
        if not df.empty:
            self.update_summary_stats(progress_data, df)
        
        # Save progress
        progress_file = os.path.join(self.evaluation_output_dir, "openAI_evaluation_progress.json")
        with open(progress_file, 'w', encoding='utf-8') as f:
            json.dump(progress_data, f, indent=2)
        
        # Final summary
        print(f"\n🎉 Matched evaluation complete!")
        print(f"📊 Total matched: {total_files} | ✅ Success: {progress_data['successful']} | ❌ Failed: {progress_data['failed']} | ⏸️  Skipped: {progress_data['skipped']}")
        print(f"📄 Progress saved to: {progress_file}")
        
        return df, progress_data
    
    def update_summary_stats(self, progress_data: Dict, df: pd.DataFrame):
        """Update summary statistics based on all evaluated files"""
        categories = ["main_chart_marks", "axis_labels", "axis_titles", 
                     "legend_labels", "legend_marks", "legend_titles"]
        
        summary = {}
        for category in categories:
            category_f1_scores = []
            category_precision_scores = []
            category_recall_scores = []
            
            f1_col = f"{category}_f1"
            precision_col = f"{category}_precision"
            recall_col = f"{category}_recall"
            
            if f1_col in df.columns:
                category_f1_scores = df[f1_col].dropna().tolist()
                category_precision_scores = df[precision_col].dropna().tolist()
                category_recall_scores = df[recall_col].dropna().tolist()
            
            if category_f1_scores:
                summary[category] = {
                    "f1_mean": np.mean(category_f1_scores),
                    "f1_std": np.std(category_f1_scores),
                    "f1_min": np.min(category_f1_scores),
                    "f1_median": np.median(category_f1_scores),
                    "f1_max": np.max(category_f1_scores),
                    "precision_mean": np.mean(category_precision_scores),
                    "precision_std": np.std(category_precision_scores),
                    "precision_min": np.min(category_precision_scores),
                    "precision_median": np.median(category_precision_scores),
                    "precision_max": np.max(category_precision_scores),
                    "recall_mean": np.mean(category_recall_scores),
                    "recall_std": np.std(category_recall_scores),
                    "recall_min": np.min(category_recall_scores),
                    "recall_median": np.median(category_recall_scores),
                    "recall_max": np.max(category_recall_scores),
                    "count": len(category_f1_scores)
                }
        
        # Overall F1 score with additional statistics
        if 'overall_f1' in df.columns:
            overall_f1_scores = df['overall_f1'].dropna().tolist()
            if overall_f1_scores:
                # Calculate overall precision and recall
                overall_precision_scores = []
                overall_recall_scores = []
                
                for category in categories:  
                    precision_col = f"{category}_precision"
                    recall_col = f"{category}_recall"
                    if precision_col in df.columns and recall_col in df.columns:
                        overall_precision_scores.extend(df[precision_col].dropna().tolist())
                        overall_recall_scores.extend(df[recall_col].dropna().tolist())
                
                summary["overall"] = {
                    "f1_mean": np.mean(overall_f1_scores),
                    "f1_std": np.std(overall_f1_scores),
                    "f1_min": np.min(overall_f1_scores),
                    "f1_median": np.median(overall_f1_scores),
                    "f1_max": np.max(overall_f1_scores),
                    "precision_mean": np.mean(overall_precision_scores) if overall_precision_scores else 0,
                    "precision_std": np.std(overall_precision_scores) if overall_precision_scores else 0,
                    "precision_min": np.min(overall_precision_scores) if overall_precision_scores else 0,
                    "precision_median": np.median(overall_precision_scores) if overall_precision_scores else 0,
                    "precision_max": np.max(overall_precision_scores) if overall_precision_scores else 0,
                    "recall_mean": np.mean(overall_recall_scores) if overall_recall_scores else 0,
                    "recall_std": np.std(overall_recall_scores) if overall_recall_scores else 0,
                    "recall_min": np.min(overall_recall_scores) if overall_recall_scores else 0,
                    "recall_median": np.median(overall_recall_scores) if overall_recall_scores else 0,
                    "recall_max": np.max(overall_recall_scores) if overall_recall_scores else 0,
                    "count": len(overall_f1_scores)
                }
        
        progress_data["summary_stats"] = summary
    
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
    
    def print_comprehensive_report(self, progress_data: Dict, df: pd.DataFrame):
        """Print comprehensive evaluation report for matched charts"""
        report_lines = []
        
        def print_and_save(text=""):
            print(text)
            report_lines.append(text)
        
        print_and_save("=" * 80)
        print_and_save("OPENAI vs DEEPSEEK MATCHED CHARTS - EVALUATION REPORT")
        print_and_save("=" * 80)
        
        # Overview
        deepseek_total = progress_data.get("deepseek_total_charts", 0)
        openai_successful_total = progress_data.get("openai_successful_charts", 0)
        matched_total = progress_data.get("matched_charts", 0)
        evaluated = progress_data.get("evaluated", 0)
        successful = progress_data.get("successful", 0)
        failed = progress_data.get("failed", 0)
        skipped = progress_data.get("skipped", 0)
        
        openai_info = progress_data.get("openai_source", {})
        
        print_and_save(f"\n📊 EVALUATION OVERVIEW:")
        print_and_save(f"   • Evaluation scope: Matched charts only (DeepSeek ∩ OpenAI)")
        print_and_save(f"   • Evaluation started: {progress_data.get('started_at', 'Unknown')}")
        print_and_save(f"   • DeepSeek source: {os.path.basename(progress_data.get('deepseek_source', 'Unknown'))}")
        print_and_save(f"   • OpenAI batch started: {openai_info.get('openai_started_at', 'Unknown')}")
        print_and_save("")
        print_and_save(f"📈 CHART AVAILABILITY:")
        print_and_save(f"   • DeepSeek evaluated charts: {deepseek_total}")
        print_and_save(f"   • OpenAI successful charts: {openai_successful_total}")
        print_and_save(f"   • Matched charts (intersection): {matched_total}")
        print_and_save(f"   • Match rate: {100*matched_total/max(deepseek_total, 1):.1f}% of DeepSeek charts")
        print_and_save("")
        print_and_save(f"🎯 EVALUATION RESULTS:")
        print_and_save(f"   • Successfully evaluated: {successful}")
        print_and_save(f"   • Failed evaluations: {failed}")
        print_and_save(f"   • Skipped (no ground truth): {skipped}")
        print_and_save(f"   • Coverage: {100*successful/matched_total if matched_total > 0 else 0:.1f}% of matched charts")
        
        if df.empty:
            print_and_save("\n❌ No successful evaluations to report!")
            return
        
        # Performance metrics
        print_and_save(f"\n📈 PERFORMANCE METRICS (MATCHED CHARTS ONLY):")
        print_and_save("-" * 80)
        
        categories = ["main_chart_marks", "axis_labels", "axis_titles", 
                     "legend_labels", "legend_marks", "legend_titles"]
        
        summary_stats = progress_data.get("summary_stats", {})
        
        for category in categories:
            if category in summary_stats:
                stats = summary_stats[category]
                print_and_save(f"\n{category.upper().replace('_', ' ')}:")
                print_and_save(f"   F1 Score:  {stats['f1_mean']:.3f} ± {stats['f1_std']:.3f} (min: {stats['f1_min']:.3f}, median: {stats['f1_median']:.3f}, max: {stats['f1_max']:.3f})")
                print_and_save(f"   Precision: {stats['precision_mean']:.3f} ± {stats['precision_std']:.3f} (min: {stats['precision_min']:.3f}, median: {stats['precision_median']:.3f}, max: {stats['precision_max']:.3f})")
                print_and_save(f"   Recall:    {stats['recall_mean']:.3f} ± {stats['recall_std']:.3f} (min: {stats['recall_min']:.3f}, median: {stats['recall_median']:.3f}, max: {stats['recall_max']:.3f})")
                print_and_save(f"   Charts:    {stats['count']}")
        
        # Overall performance
        if "overall" in summary_stats:
            overall = summary_stats["overall"]
            print_and_save(f"\n🎯 OVERALL PERFORMANCE (MATCHED CHARTS):")
            print_and_save(f"   Mean F1 Score: {overall['f1_mean']:.3f} ± {overall['f1_std']:.3f} (min: {overall['f1_min']:.3f}, median: {overall['f1_median']:.3f}, max: {overall['f1_max']:.3f})")
            print_and_save(f"   Mean Precision: {overall['precision_mean']:.3f} ± {overall['precision_std']:.3f} (min: {overall['precision_min']:.3f}, median: {overall['precision_median']:.3f}, max: {overall['precision_max']:.3f})")
            print_and_save(f"   Mean Recall: {overall['recall_mean']:.3f} ± {overall['recall_std']:.3f} (min: {overall['recall_min']:.3f}, median: {overall['recall_median']:.3f}, max: {overall['recall_max']:.3f})")
            print_and_save(f"   Evaluated Charts: {overall['count']}")
            
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
            print_and_save(f"   Performance Level: {status}")
        
        # Top performers
        if 'overall_f1' in df.columns:
            print_and_save(f"\n🏆 TOP PERFORMING CHARTS (MATCHED SET):")
            print_and_save("-" * 50)
            top_5 = df.nlargest(5, 'overall_f1')[['chart_name', 'overall_f1']]
            for i, (_, row) in enumerate(top_5.iterrows(), 1):
                print_and_save(f"   {i}. {row['chart_name']}: {row['overall_f1']:.3f}")
            
            print_and_save(f"\n🔍 MOST CHALLENGING CHARTS (MATCHED SET):")
            print_and_save("-" * 50)
            bottom_5 = df.nsmallest(5, 'overall_f1')[['chart_name', 'overall_f1']]
            for i, (_, row) in enumerate(bottom_5.iterrows(), 1):
                print_and_save(f"   {i}. {row['chart_name']}: {row['overall_f1']:.3f}")
        
        # Category insights
        print_and_save(f"\n🎯 CATEGORY PERFORMANCE INSIGHTS:")
        print_and_save("-" * 50)
        
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
                
                print_and_save(f"   {category.replace('_', ' ').title()}: {status} (F1: {f1_mean:.3f}, n={count})")
        
        # Chart type analysis
        if 'chart_type' in df.columns:
            chart_type_stats = self.generate_chart_type_analysis(df)
            
            if chart_type_stats:
                print_and_save(f"\n📈 CHART TYPE PERFORMANCE ANALYSIS (MATCHED CHARTS):")
                print_and_save("-" * 80)
                
                # Sort by F1 score (descending)
                sorted_types = sorted(chart_type_stats.items(), 
                                    key=lambda x: x[1]['f1_mean'], reverse=True)
                
                print_and_save(f"{'Chart Type':<25} {'Count':<8} {'F1 Mean':<10} {'F1 Range':<15} {'Performance'}")
                print_and_save("-" * 80)
                
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
                    print_and_save(f"{chart_type:<25} {count:<8} {f1_mean:<10.3f} {range_str:<15} {perf_icon}")
                
                # Top and bottom performing chart types
                if len(sorted_types) >= 3:
                    print_and_save(f"\n🏆 BEST CHART TYPES (MATCHED SET):")
                    for i, (chart_type, stats) in enumerate(sorted_types[:3], 1):
                        print_and_save(f"   {i}. {chart_type}: {stats['f1_mean']:.3f} (n={stats['count']})")
                    
                    print_and_save(f"\n🔍 MOST CHALLENGING CHART TYPES (MATCHED SET):")
                    for i, (chart_type, stats) in enumerate(sorted_types[-3:], 1):
                        print_and_save(f"   {i}. {chart_type}: {stats['f1_mean']:.3f} (n={stats['count']})")
        
        print_and_save(f"\n📊 MATCHED EVALUATION COMPLETED")
        print_and_save("=" * 80)
        
        # Save the report as markdown
        self.save_markdown_report(report_lines)
    
    def save_markdown_report(self, report_lines: List[str]):
        """Save the evaluation report as a markdown file"""
        # Convert the console report to markdown format
        markdown_lines = []
        
        for line in report_lines:
            if line.startswith("=" * 80):
                # Convert separator lines to markdown headers
                if "EVALUATION COMPLETED" in line:
                    continue  # Skip these separator lines
                else:
                    markdown_lines.append("")
            elif "OPENAI vs DEEPSEEK MATCHED CHARTS - EVALUATION REPORT" in line:
                markdown_lines.append("# OpenAI vs DeepSeek Matched Charts - Evaluation Report")
                markdown_lines.append("")
            elif line.startswith("📊 EVALUATION OVERVIEW:"):
                markdown_lines.append("## 📊 Evaluation Overview")
                markdown_lines.append("")
            elif line.startswith("📈 CHART AVAILABILITY:"):
                markdown_lines.append("### 📈 Chart Availability")
                markdown_lines.append("")
            elif line.startswith("🎯 EVALUATION RESULTS:"):
                markdown_lines.append("### 🎯 Evaluation Results")
                markdown_lines.append("")
            elif line.startswith("📈 PERFORMANCE METRICS"):
                markdown_lines.append("## 📈 Performance Metrics (Matched Charts Only)")
                markdown_lines.append("")
            elif line.startswith("🎯 OVERALL PERFORMANCE"):
                markdown_lines.append("## 🎯 Overall Performance (Matched Charts)")
                markdown_lines.append("")
            elif line.startswith("🏆 TOP PERFORMING CHARTS"):
                markdown_lines.append("## 🏆 Top Performing Charts (Matched Set)")
                markdown_lines.append("")
            elif line.startswith("🔍 MOST CHALLENGING CHARTS"):
                markdown_lines.append("## 🔍 Most Challenging Charts (Matched Set)")
                markdown_lines.append("")
            elif line.startswith("🎯 CATEGORY PERFORMANCE INSIGHTS:"):
                markdown_lines.append("## 🎯 Category Performance Insights")
                markdown_lines.append("")
            elif line.startswith("📈 CHART TYPE PERFORMANCE ANALYSIS"):
                markdown_lines.append("## 📈 Chart Type Performance Analysis (Matched Charts)")
                markdown_lines.append("")
            elif line.startswith("🏆 BEST CHART TYPES"):
                markdown_lines.append("### 🏆 Best Chart Types (Matched Set)")
                markdown_lines.append("")
            elif line.startswith("🔍 MOST CHALLENGING CHART TYPES"):
                markdown_lines.append("### 🔍 Most Challenging Chart Types (Matched Set)")
                markdown_lines.append("")
            elif line.startswith("-" * 80) or line.startswith("-" * 50):
                # Skip separator lines in markdown
                continue
            elif line.strip() and line.startswith(("MAIN CHART MARKS:", "AXIS LABELS:", "AXIS TITLES:", "LEGEND LABELS:", "LEGEND MARKS:", "LEGEND TITLES:")):
                # Convert category headers to markdown subheaders
                markdown_lines.append(f"### {line.strip()}")
                markdown_lines.append("")
            elif "Chart Type" in line and "Count" in line and "F1 Mean" in line:
                # Convert table header to markdown table
                markdown_lines.append("| Chart Type | Count | F1 Mean | F1 Range | Performance |")
                markdown_lines.append("|------------|-------|---------|----------|-------------|")
            elif line.strip() and not line.startswith(("   •", "   F1", "   Precision", "   Recall", "   Charts", "   Mean", "   Performance", "   Evaluated", "   1.", "   2.", "   3.")):
                # Check if this is a table row (chart type data)
                parts = line.split()
                if len(parts) >= 5 and parts[1].isdigit():
                    # This looks like a chart type data row
                    chart_type = parts[0]
                    count = parts[1]
                    f1_mean = parts[2]
                    f1_range = parts[3]
                    performance = " ".join(parts[4:])
                    markdown_lines.append(f"| {chart_type} | {count} | {f1_mean} | {f1_range} | {performance} |")
                else:
                    markdown_lines.append(line)
            else:
                markdown_lines.append(line)
        
        # Add timestamp and metadata
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        header = f"""---
title: OpenAI vs DeepSeek Matched Charts - Evaluation Report  
date: {current_time}
model: GPT-4o (OpenAI)
scope: Matched charts only (intersection with DeepSeek evaluation)
api: OpenAI Batch API
---

"""
        
        # Combine header with content
        full_content = header + "\n".join(markdown_lines)
        
        # Save to file
        report_file = os.path.join(self.evaluation_output_dir, "openai_matched_evaluation_report.md")
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(full_content)
        
        print(f"📄 Markdown report saved to: {report_file}")
    
    def generate_reports(self):
        """Generate comprehensive evaluation reports for matched charts"""
        print("📋 Evaluating OpenAI results for charts matched with DeepSeek evaluation...")
        
        # Evaluate matched results only
        df, progress_data = self.evaluate_all_matched_results()
        
        # Print comprehensive report
        self.print_comprehensive_report(progress_data, df)
        
        # Save detailed results to CSV
        if not df.empty:
            output_file = os.path.join(self.evaluation_output_dir, "performance_by_chart.csv")
            df.to_csv(output_file, index=False)
            print(f"\n💾 Detailed results saved to: {output_file}")
        
        # Generate chart type analysis
        chart_type_analysis = {}
        if not df.empty:
            chart_type_analysis = self.generate_chart_type_analysis(df)
        
        # Save summary statistics to JSON
        summary_file = os.path.join(self.evaluation_output_dir, "openai_matched_evaluation_summary.json")
        summary_data = {
            "generated_at": datetime.now().isoformat(),
            "evaluation_scope": "matched_charts_only",
            "evaluation_overview": {
                "deepseek_total_charts": progress_data.get("deepseek_total_charts", 0),
                "openai_successful_charts": progress_data.get("openai_successful_charts", 0),
                "matched_charts": progress_data.get("matched_charts", 0),
                "successful": progress_data.get("successful", 0),
                "failed": progress_data.get("failed", 0),
                "skipped": progress_data.get("skipped", 0)
            },
            "performance_summary": progress_data.get("summary_stats", {}),
            "chart_type_analysis": chart_type_analysis,
            "openai_source_info": progress_data.get("openai_source", {}),
            "deepseek_source_file": progress_data.get("deepseek_source", ""),
            "evaluation_period": {
                "started_at": progress_data.get("started_at"),
                "completed_at": datetime.now().isoformat()
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
    # Configuration
    OPENAI_RESULTS_DIR = "results_openai"
    GROUND_TRUTH_DIR = "../../annotations"
    DEEPSEEK_EVALUATION_FILE = "evaluation_results/evaluation_progress.json"
    EVALUATION_OUTPUT_DIR = "evaluation_results_openai_matched"
    
    # Initialize evaluator
    evaluator = OpenAIResultsMatchedEvaluator(
        OPENAI_RESULTS_DIR, 
        GROUND_TRUTH_DIR, 
        DEEPSEEK_EVALUATION_FILE,
        EVALUATION_OUTPUT_DIR
    )
    
    # Generate comprehensive evaluation reports for matched charts only
    evaluator.generate_reports()


if __name__ == "__main__":
    main() 