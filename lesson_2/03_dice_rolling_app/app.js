/**
 * JS175 Lesson 2
 * Assignment 3: Dice Rolling App
 * app.js
 */
const HTTP = require("http");
const URL = require("url").URL;
const { doRolls } = require("./die");
const PORT = 8080;

function rollWithParams(params) {
  let rollResults = doRolls(params.get("rolls"), params.get("sides"));
  return `Die Roll${rollResults.split("\n").length > 1 ? "s" : ""}:\n` +
    rollResults + "\n";
}

// eslint-disable-next-line max-statements, max-lines-per-function
const SERVER = HTTP.createServer((req, res) => {
  let method = req.method;
  let path = req.url;
  let params = new URL(path, `http://${req.headers.host}`).searchParams;

  console.log({method, path, params});

  if (path === "/favicon.ico") {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.write("Not found!");
    res.end();
    return;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.write(`${rollWithParams(params)}\n`);
  res.write(`${method} ${path}`);
  res.end();
});

SERVER.listen(PORT, "localhost", () => {
  console.log(`Server listening on port ${PORT}...`);
});
