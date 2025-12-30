const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

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
    console.log("\nCurrent Position:", currentPosition);
    console.log("input:", direction + steps);
    if (direction === "L") {
      if (currentPosition - steps <= 0) {
        positionZeroTimes +=
          currentPosition === 0
            ? Math.floor(steps / 100)
            : Math.floor((steps - currentPosition) / 100) + 1;
        currentPosition =
          (steps - currentPosition) % 100 === 0
            ? 0
            : 100 - ((steps - currentPosition) % 100);
      } else {
        currentPosition -= steps;
      }
    } else if (direction === "R") {
      if (currentPosition + steps >= 100) {
        positionZeroTimes += Math.floor((currentPosition + steps) / 100);
        currentPosition = (currentPosition + steps) % 100;
      } else {
        currentPosition += steps;
      }
    }

    console.log("Position 0 reached times so far:", positionZeroTimes);
  }

  return positionZeroTimes;
};

getPositionZeroTimes(input);
