/**
 * JS175 Lesson 2
 * Assignment 3: Dice Rolling App
 * die.js
 */
const NUM_SIDES = 6;

function roll() {
  return Math.floor((Math.random() * NUM_SIDES) + 1);
}

module.exports = roll;
