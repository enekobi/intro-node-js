const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

/**
 * this function is blocking, fix that
 * @param {String} name full file name of asset in asset folder
 */
const findAsset = async (name) => {
  const assetPath = path.join(__dirname, 'assets', name);
  console.log('PATH', assetPath);
  return new Promise((resolve, rej) => {
    fs.readFile(assetPath, { encoding: 'utf-8' }, (err, val) => {
      resolve(val.toString());
    });
  });
  // return fs.readFileSync(assetPath, { encoding: 'utf-8' }).toString();
};

const hostname = '127.0.0.1';
const port = 3000;

// log incoming request coming into the server. Helpful for debugging and tracking
const logRequest = (method, route, status) => console.log(method, route, status);

const server = http.createServer(async (req, res) => {
  const method = req.method;
  const route = url.parse(req.url).pathname;
  // this is sloppy, especially with more assets, create a "router"
  let match = undefined;

  /**
   * TODO we're not differentiating methods (GET, POST, ...)
   */
  switch (route) {
    case '/':
      match = {
        filename: 'index.html',
        mime: mime.getType('html')
      };
      break;
    case '/style.css':
      match = {
        filename: route,
        mime: mime.getType('css')
      };
      break;
  }
  if (match) {
    res.writeHead(200, { 'Content-Type': match.mime });
    const asset = await findAsset(match.filename);
    res.write(asset);
    logRequest(method, route, 200);
  } else {
    logRequest(method, route, 404);
    res.writeHead(404);
  }

  res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
