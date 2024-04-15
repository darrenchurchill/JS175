/**
 * JS175 Lesson 2
 * Assignment 3: Dice Rolling App
 * app.js
 */
const HTTP = require("http");
const roll = require("./die");
const PORT = 8080;

const SERVER = HTTP.createServer((req, res) => {
  let method = req.method;
  let path = req.url;

  console.log({method, path});

  if (path === "/favicon.ico") {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.write("Not found!");
    res.end();
    return;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.write(`Die Roll: ${roll()}\n`);
  res.write(`${method} ${path}`);
  res.end();
});

SERVER.listen(PORT, "localhost", () => {
  console.log(`Server listening on port ${PORT}...`);
});
