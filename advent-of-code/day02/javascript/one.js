const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "..", "input.txt");
const input = fs
  .readFileSync(inputPath, "utf-8")
  .trim()
  .split(",")
  .map((str) => {
    let [rangeStart, rangeEnd] = str.split("-");
    if (rangeStart.length % 2 === 1 || rangeEnd.length % 2 === 1) {
        if (rangeStart.length === rangeEnd.length) {
            return [];
        } else if (rangeStart.length < rangeEnd.length) {
            if (rangeStart.length % 2 === 1) {
                rangeStart = "1" + "0".repeat(rangeStart.length);
            } else {
                rangeEnd = "9".repeat(rangeEnd.length - 1);
            }
        }
    }
    return [Number(rangeStart), Number(rangeEnd)];
  });

const addAllRepeatNumbersInRange = (input) => {
    const repeatNumbersInRange = [];

    for (const [rangeStart, rangeEnd] of input) {
        if (rangeStart === undefined || rangeEnd === undefined) {
            continue;
        }
        for (let num = rangeStart; num <= rangeEnd; num++) {
            const lengthOfNum = num.toString().length;
            const [firstHalf, secondHalf] = [
                num.toString().slice(0, lengthOfNum / 2),
                num.toString().slice(lengthOfNum / 2),
            ];
            if (firstHalf === secondHalf) {
                repeatNumbersInRange.push(num);
            }
        }
    }

    const sumOfRepeatNumbersInRange = repeatNumbersInRange.reduce((acc, curr) => acc + curr, 0);
    console.log("Sum of repeat numbers in range:", sumOfRepeatNumbersInRange);
    return repeatNumbersInRange;
}

addAllRepeatNumbersInRange(input);