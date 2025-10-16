#!/usr/bin/env python3
import os
import json
import pandas as pd
import time
from datetime import datetime
from typing import Dict, List, Set, Tuple
from collections import defaultdict
import numpy as np
from tqdm import tqdm

class ContinuousPerformanceEvaluator:
    def __init__(self, llm_results_dir: str, ground_truth_dir: str, evaluation_output_dir: str = "evaluation_results"):
        self.llm_results_dir = llm_results_dir
        self.ground_truth_dir = ground_truth_dir
        self.evaluation_output_dir = evaluation_output_dir
        self.progress_file = os.path.join(evaluation_output_dir, "evaluation_progress.json")
        
        # Create directories
        os.makedirs(evaluation_output_dir, exist_ok=True)
        
        # Initialize progress tracking
        self.progress_data = {
            "started_at": datetime.now().isoformat(),
            "total_available": 0,
            "evaluated": 0,
            "successful": 0,
            "failed": 0,
            "skipped": 0,  # No ground truth available
            "last_check": None,
            "evaluated_files": {},
            "summary_stats": {}
        }
        
        # Load existing progress if available
        if os.path.exists(self.progress_file):
            try:
                with open(self.progress_file, 'r') as f:
                    existing_progress = json.load(f)
                    self.progress_data["evaluated_files"] = existing_progress.get("evaluated_files", {})
                    print(f"📂 Loaded existing progress: {len(self.progress_data['evaluated_files'])} previously evaluated files")
            except Exception as e:
                print(f"⚠️  Could not load existing progress: {e}")
    
    def save_progress(self):
        """Save current progress to JSON file"""
        self.progress_data["updated_at"] = datetime.now().isoformat()
        with open(self.progress_file, 'w', encoding='utf-8') as f:
            json.dump(self.progress_data, f, indent=2)
    
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
        llm_file = os.path.join(self.llm_results_dir, f"{chart_name}_llm_annotation.json")
        
        if not os.path.exists(gt_file):
            return {"error": "ground_truth_not_found"}
        
        if not os.path.exists(llm_file):
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
    
    def get_new_files_to_evaluate(self) -> List[str]:
        """Get list of new LLM result files that haven't been evaluated yet"""
        if not os.path.exists(self.llm_results_dir):
            return []
        
        # Get all current LLM result files
        llm_files = [f for f in os.listdir(self.llm_results_dir) 
                     if f.endswith('_llm_annotation.json') and f != 'progress.json']
        
        # Filter out already evaluated files
        new_files = []
        for llm_file in llm_files:
            chart_name = llm_file.replace('_llm_annotation.json', '')
            if chart_name not in self.progress_data["evaluated_files"]:
                new_files.append(chart_name)
        
        return new_files
    
    def update_summary_stats(self):
        """Update summary statistics based on all evaluated files"""
        if not self.progress_data["evaluated_files"]:
            return
        
        # Collect all results
        all_results = []
        for file_data in self.progress_data["evaluated_files"].values():
            if file_data.get("status") == "success" and "metrics" in file_data:
                all_results.append(file_data["metrics"])
        
        if not all_results:
            return
        
        # Calculate summary statistics
        categories = ["main_chart_marks", "axis_labels", "axis_titles", 
                     "legend_labels", "legend_marks", "legend_titles"]
        
        summary = {}
        for category in categories:
            category_f1_scores = []
            category_precision_scores = []
            category_recall_scores = []
            
            for result in all_results:
                if category in result:
                    category_f1_scores.append(result[category]["f1"])
                    category_precision_scores.append(result[category]["precision"])
                    category_recall_scores.append(result[category]["recall"])
            
            if category_f1_scores:
                summary[category] = {
                    "f1_mean": np.mean(category_f1_scores),
                    "f1_std": np.std(category_f1_scores),
                    "precision_mean": np.mean(category_precision_scores),
                    "recall_mean": np.mean(category_recall_scores),
                    "count": len(category_f1_scores)
                }
        
        # Overall F1 score
        if all_results:
            overall_f1_scores = []
            for result in all_results:
                f1_scores = [result[cat]["f1"] for cat in categories if cat in result]
                if f1_scores:
                    overall_f1_scores.append(np.mean(f1_scores))
            
            if overall_f1_scores:
                summary["overall"] = {
                    "f1_mean": np.mean(overall_f1_scores),
                    "f1_std": np.std(overall_f1_scores),
                    "count": len(overall_f1_scores)
                }
        
        self.progress_data["summary_stats"] = summary
    
    def run_continuous_evaluation(self, check_interval: int = 30):
        """Run continuous evaluation, checking for new files periodically"""
        print("🔄 Starting continuous evaluation...")
        print(f"📁 Monitoring: {self.llm_results_dir}")
        print(f"📊 Ground truth: {self.ground_truth_dir}")
        print(f"⏱️  Check interval: {check_interval} seconds")
        print(f"📄 Progress file: {self.progress_file}")
        print("-" * 60)
        
        while True:
            try:
                # Get new files to evaluate
                new_files = self.get_new_files_to_evaluate()
                
                if new_files:
                    print(f"\n🆕 Found {len(new_files)} new files to evaluate...")
                    
                    # Evaluate new files with progress bar
                    for chart_name in tqdm(new_files, desc="Evaluating", unit="file"):
                        result = self.evaluate_single_file(chart_name)
                        
                        # Update progress
                        if "error" in result:
                            if result["error"] == "ground_truth_not_found":
                                self.progress_data["skipped"] += 1
                                status = "skipped"
                                tqdm.write(f"⏸️  {chart_name}: No ground truth")
                            else:
                                self.progress_data["failed"] += 1
                                status = "failed"
                                tqdm.write(f"❌ {chart_name}: {result['error']}")
                        else:
                            self.progress_data["successful"] += 1
                            status = "success"
                            # Calculate overall F1 for this file
                            f1_scores = [result[cat]["f1"] for cat in result.keys()]
                            overall_f1 = np.mean(f1_scores) if f1_scores else 0
                            tqdm.write(f"✅ {chart_name}: F1={overall_f1:.3f}")
                        
                        # Store result
                        self.progress_data["evaluated_files"][chart_name] = {
                            "status": status,
                            "evaluated_at": datetime.now().isoformat(),
                            "metrics": result if "error" not in result else {},
                            "error": result.get("error", None)
                        }
                        
                        self.progress_data["evaluated"] += 1
                    
                    # Update summary statistics
                    self.update_summary_stats()
                    
                    # Save progress
                    self.save_progress()
                    
                    # Print current status
                    self.print_status_update()
                
                # Update check time and total available count
                self.progress_data["last_check"] = datetime.now().isoformat()
                
                # Count total available files
                if os.path.exists(self.llm_results_dir):
                    all_llm_files = [f for f in os.listdir(self.llm_results_dir) 
                                   if f.endswith('_llm_annotation.json') and f != 'progress.json']
                    self.progress_data["total_available"] = len(all_llm_files)
                
                # Save progress after check
                self.save_progress()
                
                # Wait for next check
                time.sleep(check_interval)
                
            except KeyboardInterrupt:
                print("\n🛑 Evaluation stopped by user")
                break
            except Exception as e:
                print(f"⚠️  Error during evaluation: {e}")
                time.sleep(check_interval)
    
    def print_status_update(self):
        """Print current evaluation status"""
        total = self.progress_data["total_available"]
        evaluated = self.progress_data["evaluated"]
        successful = self.progress_data["successful"]
        failed = self.progress_data["failed"]
        skipped = self.progress_data["skipped"]
        
        print(f"\n📊 STATUS UPDATE:")
        print(f"   📁 Total available: {total}")
        print(f"   ✅ Successfully evaluated: {successful}")
        print(f"   ❌ Failed: {failed}")
        print(f"   ⏸️  Skipped (no ground truth): {skipped}")
        print(f"   📈 Progress: {evaluated}/{total} ({100*evaluated/total if total > 0 else 0:.1f}%)")
        
        # Print summary stats if available
        if "summary_stats" in self.progress_data and "overall" in self.progress_data["summary_stats"]:
            overall_f1 = self.progress_data["summary_stats"]["overall"]["f1_mean"]
            print(f"   🎯 Overall F1 Score: {overall_f1:.3f}")
        
        print(f"   🕐 Last check: {datetime.now().strftime('%H:%M:%S')}")
        print("-" * 60)


def main():
    # Configuration
    llm_results_dir = "results"
    ground_truth_dir = "../../annotations"
    evaluation_output_dir = "evaluation_results_deepseek"
    
    # Initialize continuous evaluator
    evaluator = ContinuousPerformanceEvaluator(
        llm_results_dir, 
        ground_truth_dir, 
        evaluation_output_dir
    )
    
    # Run continuous evaluation (check every 30 seconds)
    evaluator.run_continuous_evaluation(check_interval=30)


if __name__ == "__main__":
    main() 