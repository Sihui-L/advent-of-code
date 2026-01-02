const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "..", "input.txt");
const input = fs.readFileSync(inputPath, "utf-8").trim().split("\n");

const findAndAddLargestTwoDigits = (input) => {
  const largestTwoDigits = [];

  for (const line of input) {
    const digits = line.split("").map(Number);
    let largest = 0;
    let secondLargest = 0;

    // Find the largest digit before the last digit
    for (const digit of digits.slice(0, -1)) {
      if (digit > largest) {
        largest = digit;
      }
    }
    // Find the second largest digit after the largest digit
    for (const digit of digits.slice(digits.indexOf(largest) + 1)) {
      if (digit > secondLargest) {
        secondLargest = digit;
      }
    }

    largestTwoDigits.push(`${largest}` + `${secondLargest}`);
  }

  console.log("Largest two digits sums per line:", largestTwoDigits);
  const sum = largestTwoDigits.reduce((acc, curr) => acc + Number(curr), 0);
  console.log("Total sum of largest two digits:", sum);
  return largestTwoDigits;
};

findAndAddLargestTwoDigits(input);
