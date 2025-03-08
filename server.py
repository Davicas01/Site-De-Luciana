from http.server import SimpleHTTPRequestHandler, HTTPServer
import os

class CustomHTTPRequestHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        path = super().translate_path(path)
        relpath = os.path.relpath(path, os.getcwd())
        return os.path.join('Site_Lu-main', 'Site_Lu', 'src', 'html', relpath)

if __name__ == '__main__':
    port = 8100
    server_address = ('', port)
    httpd = HTTPServer(server_address, CustomHTTPRequestHandler)
    print(f'Server is running on http://localhost:{port}')
    httpd.serve_forever()