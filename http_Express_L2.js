const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    fs.readdir(__dirname, (err, result) => {
      if (err) {
        console.log(err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }

      console.log("Directory contents:", result);

      const listItems = result
        .map((e) => `<li><a href="${e}">${e}</a></li>`)
        .join("");

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
        <h1>Directory Listing</h1>
        <ul>
          ${listItems}
        </ul>
      `);
    });
  } else {
    const filePath = path.join(__dirname, req.url);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.log(err);
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
        return;
      }

      if (stats.isDirectory()) {
        fs.readdir(filePath, (err, files) => {
          if (err) {
            console.log(err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
            return;
          }

          const listItems = files
            .map(
              (e) => `<li><a href="${path.join(__dirname, e)}">${e}</a></li>`
            )
            .join("");
          console.log("Directory contents in subdirectory:", files);

          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(`
            <h1>Directory Listing</h1>
            <ul>
              ${listItems}
            </ul>
          `);
        });
      } else if (stats.isFile()) {
        fs.readFile(filePath, (err, data) => {
          if (err) {
            console.log(err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
            return;
          }

          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end(data);
        });
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
      }
    });
  }
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
