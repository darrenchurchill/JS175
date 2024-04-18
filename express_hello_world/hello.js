/**
 * JS175 Lesson 5
 * Hello World using Express.js
 * hello.js
 */
const express = require("express");
const strftime = require("strftime");

const app = express();
const PORT = 8080;

app.set("views", "./views");
app.set("view engine", "pug");

app.use((req, res, next) => {
  // https://en.wikipedia.org/wiki/Common_Log_Format
  let msg = [
    req.ip,
    "-", // RFC 1413 client identity
    "-", // userid
    `[${strftime("%d/%b/%Y:%H:%M:%S %z")}]`,
    `"${req.method} ${req.path} HTTP/${req.httpVersion}"`,
  ];

  res.on("finish", () => {
    console.log(
      ...msg,
      res.statusCode,
      res.getHeader("Content-Length"),
    );
  });

  next();
});

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.redirect("/english");
});

app.get("/english", (_req, res) => {
  res.render("hello-world-english");
});

app.get("/french", (_req, res) => {
  res.render("hello-world-french");
});

app.get("/serbian", (_req, res) => {
  res.render("hello-world-serbian");
});

app.listen(PORT, "localhost", () => {
  console.log(`Server listening on port ${PORT}...`);
});
