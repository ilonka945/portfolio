#!/usr/bin/env python3
"""Vývojový server pro portfolio — zakazuje kešování, aby se změny projevily hned."""
import functools
import os
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

PORT = 4173
ROOT = os.path.dirname(os.path.abspath(__file__))


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()


if __name__ == '__main__':
    ThreadingHTTPServer.allow_reuse_address = True
    handler = functools.partial(NoCacheHandler, directory=ROOT)
    server = ThreadingHTTPServer(('', PORT), handler)
    print(f'Serving {ROOT} at http://localhost:{PORT} (no-cache)')
    server.serve_forever()
