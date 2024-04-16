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

const HTML_START = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Loan Calculator</title>
    <style type="text/css">
      body {
        background: rgba(250, 250, 250);
        font-family: sans-serif;
        color: rgb(50, 50, 50);
      }

      article {
        width: 100%;
        max-width: 40rem;
        margin: 0 auto;
        padding: 1rem 2rem;
      }

      h1 {
        font-size: 2.5rem;
        text-align: center;
      }

      table {
        font-size: 2rem;
      }

      th {
        text-align: right;
      }
    </style>
  </head>
  <body>
    <article>
      <h1>Loan Calculator</h1>
`;

const HTML_END = `
    </article>
  </body>
</html>`;

// eslint-disable-next-line max-lines-per-function
function generateContent({amount, duration, apr, pmt}) {

  return (
  // eslint-disable-next-line indent
`${HTML_START}
<table>
  <tbody>
    <tr>
      <th>Amount:</th>
      <td>$${amount.toFixed(2)}</td>
    </tr>
    <tr>
      <th>Duration:</th>
      <td>${duration} year${duration > 1 ? "s" : ""}</td>
    </tr>
    <tr>
      <th>APR:</th>
      <td>${DEFAULT_APR.toFixed(2)}%</td>
    </tr>
    <tr>
      <th>Monthly payment:</th>
      <td>$${pmt.toFixed(2)}</td>
    </tr>
  </tbody>
</table>
${HTML_END}`
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
