from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os
# from restructure_annotation_files import restructure_annotations


# FINAL_ANNOTATIONS_TEST_FOLDER = "annotations_test"

class MyHTTPRequestHandler(SimpleHTTPRequestHandler):
#annotations path: /annotations
    def do_GET(self):
        print(self.path)
        if (self.path == "/"):#root path
            self.path = "/labeling_tool/annotationPage.html"
        if (self.path == "/newSVG"):#root path
            self.path = "/labeling_tool/index.html"
        elif self.path.startswith("/check_file_exists/"):
            filename = self.path.split('/')[-1]
            folder_path = "examples"
            file_path = os.path.join(folder_path, filename)

            print("Checking file existence:", file_path)  # Add this line for debugging

            if os.path.exists(file_path):
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response_data = json.dumps({'exists': True})
                self.wfile.write(response_data.encode())
                return
            else:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response_data = json.dumps({'exists': False})
                self.wfile.write(response_data.encode())
                return
        elif self.path.startswith("/check_csv_exists/"):
            filename = self.path.split('/')[-1]
            folder_path = "data_tables"
            file_path = os.path.join(folder_path, filename)

            print("Checking CSV file existence:", file_path)

            if os.path.exists(file_path):
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response_data = json.dumps({'exists': True})
                self.wfile.write(response_data.encode())
                return
            else:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response_data = json.dumps({'exists': False})
                self.wfile.write(response_data.encode())
                return
        elif self.path == "/list_charts":
            print("listing charts in charts_svg folder")
            try:
                charts_folder = "charts_svg"
                if os.path.exists(charts_folder):
                    files = [f for f in os.listdir(charts_folder) if f.endswith('.svg')]
                else:
                    files = []
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response_data = json.dumps({'files': files})
                self.wfile.write(response_data.encode())
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
                return
        elif (self.path.find("annotations") > 0):
            print("getting " + self.path)
        return SimpleHTTPRequestHandler.do_GET(self)
    
    def do_POST(self):
        print(self.path)
        # if self.path == "/save_and_restructure":
        #     # Save and restructure the annotations
        #     content_length = int(self.headers['Content-Length'])
        #     post_data = json.loads(self.rfile.read(content_length).decode('utf-8'))
        #     print(post_data)
        #     filename = post_data["chart"] + ".json"
        #     annotations = post_data["annotations"]

        #     # Restructure the annotations
        #     restructured_annotations = restructure_annotations(annotations)

        #     # Save the restructured annotations to the final_annotations_test folder
        #     os.makedirs(FINAL_ANNOTATIONS_TEST_FOLDER, exist_ok=True)
        #     restructured_path = os.path.join(FINAL_ANNOTATIONS_TEST_FOLDER, filename)
        #     with open(restructured_path, "w") as restructured_file:
        #         json.dump(restructured_annotations, restructured_file, indent=4)

        #     # Respond to the client
        #     self.send_response(200)
        #     self.send_header("Content-Type", "application/json")
        #     self.end_headers()
        #     self.wfile.write(json.dumps({"message": "File saved and restructured successfully"}).encode())
        if self.path == "/upload_svg":
            print("uploading new SVG to charts_svg folder")
            try:
                content_length = int(self.headers['Content-Length'])
                body = self.rfile.read(content_length).decode('utf-8')
                print(f"Received body length: {len(body)}")
                data = json.loads(body)

                filename = data.get('filename')
                svg_data = data.get('svgData')
                print(f"Filename: {filename}, SVG data length: {len(svg_data) if svg_data else 0}")

                if not filename or not svg_data:
                    raise ValueError(f"Missing filename or svgData. filename={filename}, svgData length={len(svg_data) if svg_data else 0}")

                filepath = os.path.join("charts_svg", filename)

                with open(filepath, "w", encoding="utf-8") as outfile:
                    outfile.write(svg_data)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = json.dumps({'filename': filename, 'message': 'File saved successfully'})
                self.wfile.write(response.encode('utf-8'))

            except Exception as e:
                import traceback
                print(f"Error: {str(e)}")
                traceback.print_exc()
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
        elif self.path.startswith("/save_file"):
            print("saving new file")
            try:
                content_length = int(self.headers['Content-Length'])
                svg_data = self.rfile.read(content_length).decode('utf-8')

                filename = "examples/" + self.headers['X-Filename']  # Get filename from header
                with open(filename, "w") as outfile:
                    outfile.write(svg_data)

                self.send_response(200)
                self.send_header('Content-Type', 'text/plain')
                self.end_headers()
                self.wfile.write("File saved successfully.".encode('utf-8'))

            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'text/plain')
                self.end_headers()
                self.wfile.write(f"Error saving file: {str(e)}".encode('utf-8'))
        else:
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            data = json.loads(body)
            with open("annotations/"+data["chart"]+".json", "w") as outfile: #creates file then dumps data inside
                json.dump(data, outfile)
            self.send_response(200) #copy
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write("POST request for {}".format(self.path).encode('utf-8'))
    

httpd = HTTPServer(('localhost', 5200), MyHTTPRequestHandler) 
httpd.serve_forever()
