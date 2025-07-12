import os
import json
import requests
from bs4 import BeautifulSoup
import re
from typing import Dict, List, Any
from datetime import datetime
from tqdm import tqdm


class SVGProcessor:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.api_url = "https://api.deepseek.com/chat/completions"
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
        """Create prompt for DeepSeek API"""
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
    
    def call_deepseek_api(self, prompt: str) -> Dict[str, Any]:
        """Call DeepSeek API with the prompt"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "deepseek-chat",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "max_tokens": 8000,
            "temperature": 0.1,
            "response_format": {"type": "json_object"}
        }
        
        try:
            response = requests.post(self.api_url, headers=headers, json=data)
            response.raise_for_status()
            
            result = response.json()
            content = result["choices"][0]["message"]["content"]
            
            # Parse the JSON response
            parsed_result = json.loads(content)
            return parsed_result
            
        except requests.exceptions.RequestException as e:
            print(f"API request failed: {e}")
            return None
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON response: {e}")
            print(f"Raw response: {content}")
            return None
        except Exception as e:
            print(f"Unexpected error: {e}")
            return None
    
    def process_svg_file(self, svg_file_path: str) -> Dict[str, Any]:
        """Process a single SVG file and return the analysis"""
        try:
            with open(svg_file_path, 'r', encoding='utf-8') as f:
                svg_content = f.read()
            
            # Process SVG to add consistent IDs
            processed_svg = self.process_svg(svg_content)
            
            # Create prompt
            prompt = self.create_prompt(processed_svg)
            
            # Call API
            result = self.call_deepseek_api(prompt)
            
            return result
            
        except Exception as e:
            print(f"Failed to process {svg_file_path}: {e}")
            return None
    
    def process_all_svgs(self, svg_directory: str, output_directory: str = None):
        """Process all SVG files in the directory with progress tracking"""
        if output_directory is None:
            output_directory = "results"
        
        os.makedirs(output_directory, exist_ok=True)
        
        # Get all SVG files
        svg_files = [f for f in os.listdir(svg_directory) if f.endswith('.svg')]
        total_files = len(svg_files)
        
        # Initialize progress tracking
        progress_data = {
            "started_at": datetime.now().isoformat(),
            "total_files": total_files,
            "completed": 0,
            "successful": 0,
            "failed": 0,
            "results": {}
        }
        
        progress_file = os.path.join(output_directory, "progress.json")
        
        # Process files with progress bar
        for svg_file in tqdm(svg_files, desc="Processing SVGs", unit="file"):
            svg_path = os.path.join(svg_directory, svg_file)
            
            try:
                result = self.process_svg_file(svg_path)
                
                if result:
                    # Save result
                    output_file = os.path.join(output_directory, svg_file.replace('.svg', '_llm_annotation.json'))
                    with open(output_file, 'w', encoding='utf-8') as f:
                        json.dump(result, f, indent=2)
                    
                    # Update progress
                    progress_data["successful"] += 1
                    progress_data["results"][svg_file] = {
                        "status": "success",
                        "output_file": output_file,
                        "processed_at": datetime.now().isoformat()
                    }
                    tqdm.write(f"✅ {svg_file} -> {output_file}")
                else:
                    # Update progress for failed processing
                    progress_data["failed"] += 1
                    progress_data["results"][svg_file] = {
                        "status": "failed",
                        "error": "API call failed or returned None",
                        "processed_at": datetime.now().isoformat()
                    }
                    tqdm.write(f"❌ Failed to process {svg_file}")
                    
            except Exception as e:
                # Handle unexpected errors
                progress_data["failed"] += 1
                progress_data["results"][svg_file] = {
                    "status": "error",
                    "error": str(e),
                    "processed_at": datetime.now().isoformat()
                }
                tqdm.write(f"💥 Error processing {svg_file}: {e}")
            
            # Update completed count and save progress
            progress_data["completed"] += 1
            progress_data["updated_at"] = datetime.now().isoformat()
            
            # Save progress file after each completion
            with open(progress_file, 'w', encoding='utf-8') as f:
                json.dump(progress_data, f, indent=2)
        
        # Final summary
        print(f"\n🎉 Processing complete!")
        print(f"📊 Total: {total_files} | ✅ Success: {progress_data['successful']} | ❌ Failed: {progress_data['failed']}")
        print(f"📄 Progress saved to: {progress_file}")


def main():
    # Configuration
    API_KEY = "your key"
    CHARTS_SVG_DIR = "../../charts_svg"
    RESULTS_DIR = "results"
    
    # Create results directory if it doesn't exist
    os.makedirs(RESULTS_DIR, exist_ok=True)
    
    # Initialize processor
    processor = SVGProcessor(API_KEY)
    
    # Process all SVGs with new format
    processor.process_all_svgs(CHARTS_SVG_DIR, RESULTS_DIR)


if __name__ == "__main__":
    main()
