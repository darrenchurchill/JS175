/**
 * JS175 Lesson 5
 * Hello World using Express.js
 * hello.js
 */
const express = require("express");
const app = express();
const PORT = 8080;

app.set("views", "./views");
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("hello-world");
});

app.listen(PORT, "localhost", () => {
  console.log(`Server listening on port ${PORT}...`);
});
