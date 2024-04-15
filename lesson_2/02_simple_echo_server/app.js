/**
 * JS175 Lesson 2
 * Assignment 2: A Simple Echo Server
 */
const HTTP = require("http");
const PORT = 8080;

const SERVER = HTTP.createServer((req, res) => {
  let method = req.method;
  let path = req.url;

  if (path === "/favicon.ico") {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.write("Not found!");
    res.end();
    return;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.write(`${method} ${path}\n`);
  res.end();
});

SERVER.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
