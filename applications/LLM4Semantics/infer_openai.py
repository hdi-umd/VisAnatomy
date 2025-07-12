import os
import json
import time
import sys
from bs4 import BeautifulSoup
import re
from typing import Dict, List, Any
from datetime import datetime
from tqdm import tqdm
from openai import OpenAI


class SVGProcessorOpenAI:
    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)
        self.indices = {}
        self.all_svg_element_id = []
        self.id_mappings = {}
    
    def reset_state(self):
        """Reset state for processing a new SVG"""
        self.indices = {}
        self.all_svg_element_id = []
        self.id_mappings = {}
    
    def add_class_and_id_to_leaves(self, element, soup):
        """Python equivalent of addClassAndIdToLeaves JavaScript function"""
        if element.name and element.name != "svg":
            # Get original ID if exists
            original_id = element.get("id")
            
            # Initialize index for this element type if not exists
            if element.name not in self.indices:
                self.indices[element.name] = 0
            
            # Skip certain elements
            if (element.name not in ["linearGradient", "g"] and 
                ":" not in element.name):
                new_id = f"{element.name}{self.indices[element.name]}"
                self.indices[element.name] += 1
                element["id"] = new_id
                self.all_svg_element_id.append(new_id)
                
                if original_id:
                    self.id_mappings[original_id] = new_id
        
        # Process children
        for child in element.find_all(recursive=False):
            self.add_class_and_id_to_leaves(child, soup)
    
    def update_use_element_references(self, soup):
        """Python equivalent of updateUseElementReferences JavaScript function"""
        use_elements = soup.find_all("use")
        for use in use_elements:
            href = use.get("href") or use.get("xlink:href")
            if href and "#" in href:
                original_id = href.split("#")[1]
                if original_id in self.id_mappings:
                    new_href = f"#{self.id_mappings[original_id]}"
                    use["href"] = new_href
                    use["xlink:href"] = new_href
    
    def process_svg(self, svg_content: str) -> str:
        """Process SVG content with ID assignment"""
        self.reset_state()
        soup = BeautifulSoup(svg_content, 'xml')
        
        # Process the SVG root element
        svg_root = soup.find('svg')
        if svg_root:
            self.add_class_and_id_to_leaves(svg_root, soup)
            self.update_use_element_references(soup)
        
        return str(soup)
    
    def create_prompt(self, svg_content: str) -> str:
        """Create prompt for OpenAI API"""
        prompt = f"""You are an expert in analyzing SVG-based data visualizations. Your task is to identify and categorize different visual elements in the provided SVG chart.

Please analyze the following SVG content and identify the element IDs that correspond to:

1. **Main chart marks**: The primary visual elements that represent data (bars, lines, points, areas, etc.)
2. **Legend components**:
   - Title: Text elements that serve as legend titles
   - Marks: Visual symbols/shapes in the legend (rectangles, circles, lines, etc.)
   - Labels: Text labels in the legend describing what each mark represents
3. **Axis labels**: Text elements that show axis tick labels (the values/categories like "10", "20", "Jan", "Feb")
4. **Axis titles**: Text elements that show axis titles (descriptive labels like "Sales ($)", "Month", "Revenue")

Here is the SVG content to analyze:

```xml
{svg_content}
```

Please respond with ONLY a valid JSON object in exactly this format (no additional text or explanation):

{{
  "main_chart_marks": ["element_id1", "element_id2", ...],
  "legend": {{
    "title": ["element_id1", "element_id2", ...],
    "marks": ["element_id1", "element_id2", ...],
    "labels": ["element_id1", "element_id2", ...]
  }},
  "axis_labels": ["element_id1", "element_id2", ...],
  "axis_titles": ["element_id1", "element_id2", ...]
}}

Important notes:
- Only include element IDs that actually exist in the SVG
- Focus on visible elements that users would interact with or see
- For main chart marks, include the primary data-representing shapes
- For axis labels, include tick mark values (like "10", "20", "30" or "Jan", "Feb", "Mar")
- For axis titles, include descriptive axis labels (like "Sales ($)", "Time", "Revenue")
- If a category has no elements, use an empty array []
"""
        return prompt
    
    def create_batch_input_file(self, svg_directory: str, batch_file_path: str, limit: int = None, specific_files: List[str] = None) -> List[str]:
        """Create batch input file for OpenAI Batch API"""
        if specific_files:
            # Process only specific files
            svg_files = []
            for filename in specific_files:
                if not filename.endswith('.svg'):
                    filename += '.svg'
                svg_path = os.path.join(svg_directory, filename)
                if os.path.exists(svg_path):
                    svg_files.append(filename)
                else:
                    print(f"⚠️  Warning: {filename} not found in {svg_directory}")
            print(f"🎯 SPECIFIC FILES MODE: Processing {len(svg_files)} specified files")
            print(f"📋 Files: {svg_files}")
        else:
            svg_files = [f for f in os.listdir(svg_directory) if f.endswith('.svg')]
            
            # Limit the number of files if specified
            if limit:
                svg_files = svg_files[:limit]
                print(f"🧪 TEST MODE: Processing only {len(svg_files)} files")
                print(f"📋 Test files: {svg_files}")
        
        batch_requests = []
        
        print(f"Preparing batch input for {len(svg_files)} SVG files...")
        
        for i, svg_file in enumerate(tqdm(svg_files, desc="Creating batch requests")):
            svg_path = os.path.join(svg_directory, svg_file)
            
            try:
                with open(svg_path, 'r', encoding='utf-8') as f:
                    svg_content = f.read()
                
                # Process SVG to add consistent IDs
                processed_svg = self.process_svg(svg_content)
                
                # Check SVG size and truncate if necessary (OpenAI has token limits)
                max_svg_chars = 50000  # Approximately 12.5k tokens
                if len(processed_svg) > max_svg_chars:
                    print(f"⚠️  {svg_file} is large ({len(processed_svg)} chars), truncating for API limits")
                    processed_svg = processed_svg[:max_svg_chars] + "\n... (truncated)"
                
                # Create prompt
                prompt = self.create_prompt(processed_svg)
                
                # Create batch request
                batch_request = {
                    "custom_id": f"svg_analysis_{i}_{svg_file.replace('.svg', '')}",
                    "method": "POST",
                    "url": "/v1/chat/completions",
                    "body": {
                        "model": "gpt-4o",
                        "messages": [
                            {
                                "role": "user",
                                "content": prompt
                            }
                        ],
                        "max_tokens": 4096,
                        "temperature": 0.1,
                        "response_format": {"type": "json_object"}
                    }
                }
                
                batch_requests.append(json.dumps(batch_request))
                
            except Exception as e:
                print(f"Failed to process {svg_file} for batch: {e}")
                continue
        
        # Write batch file
        with open(batch_file_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(batch_requests))
        
        print(f"Batch input file created: {batch_file_path}")
        print(f"Total requests: {len(batch_requests)}")
        
        return svg_files
    
    def upload_and_create_batch(self, batch_file_path: str) -> str:
        """Upload batch file and create batch job"""
        print("Uploading batch file...")
        
        # Upload the batch file
        with open(batch_file_path, 'rb') as f:
            batch_input_file = self.client.files.create(
                file=f,
                purpose="batch"
            )
        
        print(f"Batch file uploaded. File ID: {batch_input_file.id}")
        
        # Create the batch job
        batch_job = self.client.batches.create(
            input_file_id=batch_input_file.id,
            endpoint="/v1/chat/completions",
            completion_window="24h",
            metadata={
                "description": "SVG semantic element analysis batch"
            }
        )
        
        print(f"Batch job created. Batch ID: {batch_job.id}")
        print(f"Status: {batch_job.status}")
        
        return batch_job.id
    
    def wait_for_batch_completion(self, batch_id: str) -> str:
        """Wait for batch completion and return output file ID"""
        print(f"Waiting for batch {batch_id} to complete...")
        
        while True:
            batch_job = self.client.batches.retrieve(batch_id)
            
            print(f"Batch status: {batch_job.status}")
            
            if batch_job.status == "completed":
                print("Batch completed successfully!")
                return batch_job.output_file_id
            elif batch_job.status == "failed":
                print("Batch failed!")
                if batch_job.errors:
                    print(f"Error details: {batch_job.errors}")
                return None
            elif batch_job.status in ["cancelled", "expired"]:
                print(f"Batch {batch_job.status}!")
                return None
            
            # Wait 30 seconds before checking again
            time.sleep(30)
    
    def download_and_process_results(self, output_file_id: str, svg_files: List[str], output_directory: str):
        """Download batch results and save individual files"""
        print(f"Downloading results from file ID: {output_file_id}")
        
        # Download the results
        result_file_response = self.client.files.content(output_file_id)
        results_content = result_file_response.content.decode('utf-8')
        
        # Parse results
        results = []
        for line in results_content.strip().split('\n'):
            if line:
                results.append(json.loads(line))
        
        print(f"Processing {len(results)} results...")
        
        # Process results and save individual files
        successful = 0
        failed = 0
        
        progress_data = {
            "started_at": datetime.now().isoformat(),
            "total_files": len(svg_files),
            "completed": len(results),
            "successful": 0,
            "failed": 0,
            "results": {}
        }
        
        for result in tqdm(results, desc="Processing results"):
            try:
                custom_id = result["custom_id"]
                # Extract filename from custom_id
                svg_filename = custom_id.split("_", 2)[2] + ".svg"
                
                if result["response"]["status_code"] == 200:
                    # Successful response
                    response_body = result["response"]["body"]
                    content = response_body["choices"][0]["message"]["content"]
                    
                    try:
                        # Parse the JSON response
                        parsed_result = json.loads(content)
                    except json.JSONDecodeError as e:
                        # Handle JSON parsing error
                        print(f"❌ JSON parsing error for {svg_filename}: {e}")
                        print(f"Raw content (first 500 chars): {content[:500]}")
                        print(f"Raw content (last 500 chars): {content[-500:]}")
                        
                        failed += 1
                        progress_data["results"][svg_filename] = {
                            "status": "json_parse_error",
                            "error": f"JSON parsing failed: {str(e)}",
                            "raw_content_preview": f"Start: {content[:200]}... End: {content[-200:]}",
                            "processed_at": datetime.now().isoformat()
                        }
                        continue
                    
                    # Save result
                    output_file = os.path.join(output_directory, svg_filename.replace('.svg', '_llm_annotation.json'))
                    with open(output_file, 'w', encoding='utf-8') as f:
                        json.dump(parsed_result, f, indent=2)
                    
                    successful += 1
                    progress_data["results"][svg_filename] = {
                        "status": "success",
                        "output_file": output_file,
                        "processed_at": datetime.now().isoformat()
                    }
                    
                else:
                    # Failed response
                    failed += 1
                    error_msg = f"API error: {result['response']['status_code']}"
                    progress_data["results"][svg_filename] = {
                        "status": "failed",
                        "error": error_msg,
                        "processed_at": datetime.now().isoformat()
                    }
                    print(f"❌ Failed to process {svg_filename}: {error_msg}")
                    
            except Exception as e:
                failed += 1
                svg_filename = "unknown"
                try:
                    custom_id = result.get("custom_id", "unknown")
                    svg_filename = custom_id.split("_", 2)[2] + ".svg"
                except:
                    pass
                
                progress_data["results"][svg_filename] = {
                    "status": "error",
                    "error": str(e),
                    "processed_at": datetime.now().isoformat()
                }
                print(f"💥 Error processing result: {e}")
        
        # Update final progress
        progress_data["successful"] = successful
        progress_data["failed"] = failed
        progress_data["completed_at"] = datetime.now().isoformat()
        
        # Save progress file
        progress_file = os.path.join(output_directory, "progress.json")
        with open(progress_file, 'w', encoding='utf-8') as f:
            json.dump(progress_data, f, indent=2)
        
        # Final summary
        print(f"\n🎉 Processing complete!")
        print(f"📊 Total: {len(results)} | ✅ Success: {successful} | ❌ Failed: {failed}")
        print(f"📄 Progress saved to: {progress_file}")
    
    def process_all_svgs_batch(self, svg_directory: str, output_directory: str = None, test_limit: int = None, specific_files: List[str] = None):
        """Process all SVG files using OpenAI Batch API"""
        if output_directory is None:
            output_directory = "results_openai"
        
        os.makedirs(output_directory, exist_ok=True)
        
        # Create batch input file
        batch_file_path = os.path.join(output_directory, "batch_input.jsonl")
        svg_files = self.create_batch_input_file(svg_directory, batch_file_path, test_limit, specific_files)
        
        if not svg_files:
            print("No SVG files to process!")
            return
        
        # Upload and create batch
        batch_id = self.upload_and_create_batch(batch_file_path)
        
        # Wait for completion
        output_file_id = self.wait_for_batch_completion(batch_id)
        
        if output_file_id:
            # Download and process results
            self.download_and_process_results(output_file_id, svg_files, output_directory)
        else:
            print("Batch processing failed!")


def main():
    # Configuration
    API_KEY = "your key"
    CHARTS_SVG_DIR = "../../charts_svg"
    RESULTS_DIR = "results_openai"
    
    # Check command line arguments for different modes
    TEST_LIMIT = None
    SPECIFIC_FILES = None
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "test":
            TEST_LIMIT = 3  # Test with 3 files
            print(f"🧪 RUNNING IN TEST MODE - Processing only {TEST_LIMIT} files")
            print("To process all files, run: python infer_openai.py")
            RESULTS_DIR = "results_openai_test"  # Use separate test directory
        elif sys.argv[1].isdigit():
            TEST_LIMIT = int(sys.argv[1])
            print(f"🧪 RUNNING IN TEST MODE - Processing only {TEST_LIMIT} files")
            print("To process all files, run: python infer_openai.py")
            RESULTS_DIR = "results_openai_test"  # Use separate test directory
        else:
            # Assume specific filenames are provided
            SPECIFIC_FILES = sys.argv[1:]
            print(f"🎯 RUNNING IN SPECIFIC FILES MODE - Processing {len(SPECIFIC_FILES)} specified files")
            print(f"📋 Files: {SPECIFIC_FILES}")
            print("To process all files, run: python infer_openai.py")
            RESULTS_DIR = "results_openai_specific"  # Use separate specific directory
    else:
        print("🚀 RUNNING IN FULL MODE - Processing all SVG files")
        print("To test with a few files, run: python infer_openai.py test")
        print("To test with specific number, run: python infer_openai.py 5")
        print("To process specific files, run: python infer_openai.py file1.svg file2.svg")
    
    # Create results directory if it doesn't exist
    os.makedirs(RESULTS_DIR, exist_ok=True)
    
    # Initialize processor
    processor = SVGProcessorOpenAI(API_KEY)
    
    # Process SVGs using Batch API
    processor.process_all_svgs_batch(CHARTS_SVG_DIR, RESULTS_DIR, TEST_LIMIT, SPECIFIC_FILES)


if __name__ == "__main__":
    main() 