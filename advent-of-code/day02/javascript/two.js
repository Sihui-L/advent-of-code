const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "..", "input.txt");
const input = fs
  .readFileSync(inputPath, "utf-8")
  .trim()
  .split(",")
  .map((str) => {
    const [rangeStart, rangeEnd] = str.split("-");
    return [Number(rangeStart), Number(rangeEnd)];
  });

const addAllRepeatNumbersInRange = (input) => {
  const repeatNumbersInRange = [];

  for (const [rangeStart, rangeEnd] of input) {
    for (let num = rangeStart; num <= rangeEnd; num++) {
      const numStr = num.toString();
      const lengthOfNum = numStr.length;

      for (let partSize = 1; partSize <= lengthOfNum / 2; partSize++) {
        if (lengthOfNum % partSize === 0) {
          const parts = [];
          for (let i = 0; i < lengthOfNum; i += partSize) {
            parts.push(numStr.slice(i, i + partSize));
          }
          if (parts.every((part) => part === parts[0])) {
            repeatNumbersInRange.push(num);
            break;
          }
        }
      }
    }
  }

  const sumOfRepeatNumbersInRange = repeatNumbersInRange.reduce(
    (acc, curr) => acc + curr,
    0
  );
  console.log("Sum of repeat numbers in range:", sumOfRepeatNumbersInRange);
  return repeatNumbersInRange;
};

addAllRepeatNumbersInRange(input);
