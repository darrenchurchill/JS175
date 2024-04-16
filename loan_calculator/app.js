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
const LOAN_OFFER_PATH = "/loan-offer";

const DEFAULT_APR = 5; // percent
const DEFAULT_LOAN_AMOUNT = 5000; // dollars
const DEFAULT_LOAN_DURATION_YEARS = 10;

const templateLoanOffer = HANDLEBARS.compile(
  fs.readFileSync(`${__dirname}/templates/loan_offer.handlebars`).toString()
);
const templateLoanCalc = HANDLEBARS.compile(
  fs.readFileSync(`${__dirname}/templates/loan_calc.handlebars`).toString()
);

HANDLEBARS.registerHelper("toFixed2", (string) => Number(string).toFixed(2));
HANDLEBARS.registerHelper("add", (a, b) => a + b);
HANDLEBARS.registerHelper("subtract", (a, b) => a - b);

function generateContentLoanOffer({loanOfferPath, amount, duration, apr, pmt}) {
  const AMOUNT_DELTA = 100;
  const DURATION_DELTA = 1;

  return templateLoanOffer(
    {
      loanOfferPath,
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

function generateContentLoanCalc(
  {
    loanOfferPath,
    apr,
  } = {
    loanOfferPath: LOAN_OFFER_PATH,
    apr: DEFAULT_APR
  }
) {
  return templateLoanCalc(
    {
      loanOfferPath,
      apr,
    }
  );
}

function getNum(value, defaultValue) {
  let number = Number(value);
  if (value === null || Number.isNaN(number)) return defaultValue;
  return number;
}

function calcLoanOfferData(params) {
  let amount = getNum(params.get("amount"), DEFAULT_LOAN_AMOUNT);
  let duration = getNum(params.get("duration"), DEFAULT_LOAN_DURATION_YEARS);
  let pmt = calcLoan(amount, DEFAULT_APR / 100, duration);

  return {amount, duration, apr: DEFAULT_APR, pmt};
}

function respond200(_, res, contentType, writeCallback) {
  res.statusCode = 200;
  res.setHeader("Content-Type", contentType);
  res.write(`${writeCallback()}\n`);
  res.end();
}

function respond404(_, res) {
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain");
  res.write("Not found!");
  res.end();
}

function serveStatic(req, res) {
  let path = new URL(req.url, `http://${req.headers.host}`).pathname;
  let asset;

  try {
    asset = fs.readFileSync(`${__dirname}/public${path}`);
  } catch (error) {
    console.log(error);
    respond404(req, res);
    return;
  }

  let type = "";
  if (path.match(/\/assets\/styles/)) type = "text/css";

  respond200(req, res, type, () => asset.toString());
}

// eslint-disable-next-line max-lines-per-function
const SERVER = HTTP.createServer((req, res) => {
  let method = req.method;
  let url = new URL(req.url, `http://${req.headers.host}`);

  let path = url.pathname;
  let params = url.searchParams;

  console.log({method, path, params});

  if (path === "/") {
    respond200(req, res, "text/html", () => generateContentLoanCalc());
    return;
  }
  if (path === LOAN_OFFER_PATH) {
    respond200(req, res, "text/html", () =>
      generateContentLoanOffer({
        loanOfferPath: LOAN_OFFER_PATH,
        ...calcLoanOfferData(params),
      })
    );
    return;
  }
  if (path.match(/^\/assets/)) {
    serveStatic(req, res);
    return;
  }

  respond404(req, res);
});

SERVER.listen(PORT, "localhost", () => {
  console.log(`Server listening on port ${PORT}...`);
});
