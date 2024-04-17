/**
 * JS175 Lesson 2-4
 * Loan Calculator App
 * app.js
 */
const fs = require("fs");
const HTTP = require("http");
const URL = require("url").URL;
const QUERYSTRING = require("querystring");

const FINALHANDLER = require("finalhandler");
const HANDLEBARS = require("handlebars");
const ROUTER = require("router");
const SERVESTATIC = require("serve-static");

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
  let amount = getNum(params["amount"], DEFAULT_LOAN_AMOUNT);
  let duration = getNum(params["duration"], DEFAULT_LOAN_DURATION_YEARS);
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

const router = ROUTER();
router.use((req, _, next) => {
  let method = req.method;
  let url = new URL(req.url, `http://${req.headers.host}`);
  let path = url.pathname;
  let params = QUERYSTRING.parse(url.search.substring(1));

  console.log({method, path, params});

  next();
});
router.use(SERVESTATIC(`${__dirname}/public`));

router.get("/", (req, res) => {
  respond200(req, res, "text/html", () => generateContentLoanCalc());
});

router.get(LOAN_OFFER_PATH, (req, res) => {
  let url = new URL(req.url, `http://${req.headers.host}`);
  let params = QUERYSTRING.parse(url.search.substring(1));

  respond200(req, res, "text/html", () =>
    generateContentLoanOffer({
      loanOfferPath: LOAN_OFFER_PATH,
      ...calcLoanOfferData(params),
    })
  );
});

router.post(LOAN_OFFER_PATH, (req, res) => {
  req
    .reduce((body, chunk) => body + chunk.toString(), "")
    .then((body) =>
      respond200(req, res, "text/html", () =>
        generateContentLoanOffer({
          loanOfferPath: LOAN_OFFER_PATH,
          ...calcLoanOfferData(QUERYSTRING.parse(body))
        })
      ))
    .catch((error) => { console.log(error) });
});

router.get("*", (req, res) => respond404(req, res));

const SERVER = HTTP.createServer((req, res) => {
  router(req, res, FINALHANDLER(req, res));
});

SERVER.listen(PORT, "localhost", () => {
  console.log(`Server listening on port ${PORT}...`);
});
