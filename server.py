import SimpleHTTPServer
import SocketServer

PORT = 8069

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
Handler.extensions_map[''] = 'text/plain'

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving at port", PORT
httpd.serve_forever()