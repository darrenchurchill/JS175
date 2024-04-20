/**
 * JS175 Lesson 5
 * Hello World using Express.js
 * hello.js
 */
const fs = require("fs");

const express = require("express");
const morgan = require("morgan");

const HELLO_WORLD_PATTERN = /^hello-world-(?<language>.*)\./;
const LANGUAGES = fs
  .readdirSync(`${__dirname}/views`)
  .filter((file) => file.match(HELLO_WORLD_PATTERN))
  .reduce(
    (files, file) => [
      ...files,
      file.match(HELLO_WORLD_PATTERN).groups.language,
    ],
    []
  );

const app = express();
const PORT = 8080;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(morgan("common"));

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.redirect("/english");
});

app.get("/favicon.ico", (_req, _res, next) => {
  next(new Error("No favicon.ico"));
});

app.get("/:language", (req, res, next) => {
  let language = req.params.language;
  if (!LANGUAGES.includes(language)) {
    next(new Error(`Language ${language} not supported`));
    return;
  }
  res.render(`hello-world-${language}`);
});

app.use((err, _req, res, _next) => {
  console.log(err);
  res.status(404).send(err.message);
});

app.listen(PORT, "localhost", () => {
  console.log(`Server listening on port ${PORT}...`);
  console.log(
    "Valid language routes are:",
    ...LANGUAGES.map((lang) => `/${lang}`)
  );
});
