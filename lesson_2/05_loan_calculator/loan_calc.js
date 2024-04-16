/**
 * JS175 Lesson 2
 * Assignment 5: Loan Calculator App
 * loan_calc.js
 */
function calculateMonthlyPmt(loanAmt, APR, loanYrs, loanMonths = 0) {
  let monthlyRate = APR / 12;
  loanMonths = (loanYrs * 12) + loanMonths;
  if (monthlyRate === 0) return loanAmt / loanMonths;

  return loanAmt * (monthlyRate
                    / (1 - Math.pow((1 + monthlyRate), (-loanMonths))));
}

module.exports = calculateMonthlyPmt;
