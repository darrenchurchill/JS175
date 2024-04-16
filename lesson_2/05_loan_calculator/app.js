/**
 * JS175 Lesson 2
 * Assignment 5: Loan Calculator App
 * app.js
 */
const HTTP = require("http");
const URL = require("url").URL;
const calcLoan = require("./loan_calc");
const PORT = 8080;

const DEFAULT_APR = 5; // percent
const DEFAULT_LOAN_AMOUNT = 5000; // dollars
const DEFAULT_LOAN_DURATION_YEARS = 10;

function getNum(value, defaultValue) {
  let number = Number(value);
  if (value === null || Number.isNaN(number)) return defaultValue;
  return number;
}

// eslint-disable-next-line max-lines-per-function
function calcLoanWithParams(params) {
  let amount = getNum(params.get("amount"), DEFAULT_LOAN_AMOUNT);
  let duration = getNum(params.get("duration"), DEFAULT_LOAN_DURATION_YEARS);
  let pmt = calcLoan(amount, DEFAULT_APR / 100, duration);

  return (
  // eslint-disable-next-line indent
`Amount: $${amount}
Duration: ${duration} year${duration > 1 ? "s" : ""}
APR: ${DEFAULT_APR.toFixed(2)}%
Monthly Payment: $${pmt.toFixed(2)}\n`
  );
}

function respond200(req, res) {
  let method = req.method;
  let path = req.url;
  let params = new URL(path, `http://${req.headers.host}`).searchParams;

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.write(`${calcLoanWithParams(params)}\n`);
  res.write(`${method} ${path}`);
  res.end();
}

function respond404(_, res) {
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain");
  res.write("Not found!");
  res.end();
}

const SERVER = HTTP.createServer((req, res) => {
  let method = req.method;
  let path = req.url;
  let params = new URL(path, `http://${req.headers.host}`).searchParams;

  console.log({method, path, params});

  if (path === "/favicon.ico") {
    respond404(req, res);
    return;
  }

  respond200(req, res);
});

SERVER.listen(PORT, "localhost", () => {
  console.log(`Server listening on port ${PORT}...`);
});
