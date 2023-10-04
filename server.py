from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os


class MyHTTPRequestHandler(SimpleHTTPRequestHandler):
    # annotations path: /annotations
    def do_GET(self):
        print(self.path)
        if self.path == "/":  # root path
            self.path = "index.html"
        elif self.path.startswith("/check_file_exists/"):
            filename = self.path.split("/")[-1]
            folder_path = "examples"
            file_path = os.path.join(folder_path, filename)

            print("Checking file existence:", file_path)  # Add this line for debugging

            if os.path.exists(file_path):
                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                response_data = json.dumps({"exists": True})
                self.wfile.write(response_data.encode())
                return
            else:
                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                response_data = json.dumps({"exists": False})
                self.wfile.write(response_data.encode())
                return
        elif self.path.find("annotations") > 0:
            print("getting " + self.path)
        return SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        if self.path.startswith("/save_file"):
            print("saving new file")
            try:
                content_length = int(self.headers["Content-Length"])
                svg_data = self.rfile.read(content_length).decode("utf-8")

                filename = (
                    "examples/" + self.headers["X-Filename"]
                )  # Get filename from header
                with open(filename, "w") as outfile:
                    outfile.write(svg_data)

                self.send_response(200)
                self.send_header("Content-Type", "text/plain")
                self.end_headers()
                self.wfile.write("File saved successfully.".encode("utf-8"))

            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "text/plain")
                self.end_headers()
                self.wfile.write(f"Error saving file: {str(e)}".encode("utf-8"))
        else:
            content_length = int(self.headers["Content-Length"])
            body = self.rfile.read(content_length)
            data = json.loads(body)
            with open(
                "annotations/" + data["chart"] + ".json", "w"
            ) as outfile:  # creates file then dumps data inside
                json.dump(data, outfile)
            self.send_response(200)  # copy
            self.send_header("Content-Type", "text/plain")
            self.end_headers()
            self.wfile.write("POST request for {}".format(self.path).encode("utf-8"))


httpd = HTTPServer(("localhost", 5200), MyHTTPRequestHandler)
httpd.serve_forever()
