/**
 * JS175 Lesson 2
 * Assignment 3: Dice Rolling App
 * die.js
 */
const NUM_SIDES = 6;
const NUM_ROLLS = 1;

function roll(sides = NUM_SIDES) {
  return Math.floor((Math.random() * sides) + 1);
}

function doRolls(numRolls = NUM_ROLLS, numSides = NUM_SIDES) {
  numRolls = Number(numRolls);
  if (!Number.isInteger(numRolls) || numRolls < 1) numRolls = NUM_ROLLS;
  numSides = Number(numSides);
  if (!Number.isInteger(numSides) || numSides < 1) numSides = NUM_SIDES;

  return new Array(numRolls)
    .fill(null)
    .map(() => roll(numSides))
    .join("\n");
}

module.exports = {
  roll,
  doRolls,
};
