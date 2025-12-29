const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "..", "input.txt");
const input = fs
  .readFileSync(inputPath, "utf-8")
  .trim()
  .split("\n")
  .map((str) => {
    const direction = str[0];
    const steps = Number(str.slice(1));
    return [direction, steps];
  });

const startNumber = 50;

const getPositionZeroTimes = (input) => {
  let positionZeroTimes = 0;
  let currentPosition = startNumber;

  for (const [direction, steps] of input) {
    if (direction === "L") {
      if (currentPosition - steps <= 0) {
        currentPosition =
          (steps - currentPosition) % 100 === 0
            ? 0
            : 100 - ((steps - currentPosition) % 100);
      } else {
        currentPosition -= steps;
      }
    } else if (direction === "R") {
      if (currentPosition + steps >= 100) {
        currentPosition = (currentPosition + steps) % 100;
      } else {
        currentPosition += steps;
      }
    }
    if (currentPosition === 0) positionZeroTimes++;
    // console.log("\ninput:", direction + steps);
    // console.log("Current Position:", currentPosition);
    // console.log("Position 0 reached times so far:", positionZeroTimes);
  }

  return positionZeroTimes;
};

getPositionZeroTimes(input);
