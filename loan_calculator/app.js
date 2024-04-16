/**
 * JS175 Lesson 2-4
 * Loan Calculator App
 * app.js
 */
const fs = require("fs");
const HTTP = require("http");
const URL = require("url").URL;

const HANDLEBARS = require("handlebars");

const calcLoan = require("./loan_calc");
const PORT = 8080;

const DEFAULT_APR = 5; // percent
const DEFAULT_LOAN_AMOUNT = 5000; // dollars
const DEFAULT_LOAN_DURATION_YEARS = 10;

const template = HANDLEBARS.compile(
  fs.readFileSync(`${__dirname}/loan_calc.handlebars`).toString()
);
HANDLEBARS.registerHelper("toFixed2", (string) => Number(string).toFixed(2));
HANDLEBARS.registerHelper("add", (a, b) => a + b);
HANDLEBARS.registerHelper("subtract", (a, b) => a - b);

// eslint-disable-next-line max-lines-per-function
function generateContent({amount, duration, apr, pmt}) {
  const AMOUNT_DELTA = 100;
  const DURATION_DELTA = 1;

  return template(
    {
      amount,
      duration,
      isPlural: duration !== 1,
      apr,
      pmt,
      amountDelta: AMOUNT_DELTA,
      durationDelta: DURATION_DELTA,
    }
  );
}

function getNum(value, defaultValue) {
  let number = Number(value);
  if (value === null || Number.isNaN(number)) return defaultValue;
  return number;
}

function calcLoanWithParams(params) {
  let amount = getNum(params.get("amount"), DEFAULT_LOAN_AMOUNT);
  let duration = getNum(params.get("duration"), DEFAULT_LOAN_DURATION_YEARS);
  let pmt = calcLoan(amount, DEFAULT_APR / 100, duration);

  return {amount, duration, apr: DEFAULT_APR, pmt};
}

function respond200(req, res) {
  let path = req.url;
  let params = new URL(path, `http://${req.headers.host}`).searchParams;

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.write(`${generateContent(calcLoanWithParams(params))}\n`);
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
