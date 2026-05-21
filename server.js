const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 61188;
const ROOT = __dirname;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function safeJoin(root, urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const normalized = path.normalize(decoded).replace(/^(\.\.[\/\\])+/, "");
  return path.join(root, normalized === "/" ? "index.html" : normalized);
}

const server = http.createServer((req, res) => {
  let filePath = safeJoin(ROOT, req.url);

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("404 Not Found");
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        "Content-Type": mimeTypes[ext] || "application/octet-stream",
        "Cache-Control": "no-store"
      });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log("");
  console.log("Money Path App is running.");
  console.log("URL: http://localhost:" + PORT);
  console.log("");
  console.log("Keep this window open while using the app.");
  console.log("Press Ctrl + C to stop.");
});
