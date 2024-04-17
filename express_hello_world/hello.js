/**
 * JS175 Lesson 5
 * Hello World using Express.js
 * hello.js
 */
const express = require("express");
const app = express();
const PORT = 8080;

app.get("/", (req, res) => {
  res.send("Hello Worlds!\n");
});

app.listen(PORT, "localhost", () => {
  console.log(`Server listening on port ${PORT}...`);
});
