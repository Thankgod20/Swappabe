const http = require('http');

const hostname = '127.0.0.1';
const port = 3018;

const server = http.createServer((req, res) => {

  res.statusCode = 200;
  console.dir(req.param)
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method == 'POST') {
    console.log('POST')
    var body = ''
    req.on('data', function(data) {
      body += data
      console.log('Partial body: ' + body)
    })
    req.on('end', function() {
      console.log('Body: ' + body)
      res.writeHead(200, {'Content-Type': 'text/html'})
      res.end('post received')
    })
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});