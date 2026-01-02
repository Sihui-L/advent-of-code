const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "..", "input.txt");
const input = fs.readFileSync(inputPath, "utf-8").trim().split("\n");

const findAndAddLargestTwelveDigits = (input) => {
  const largestTwelveDigits = [];

  for (const line of input) {
    const digits = line.split("").map(Number);
    const largestDigits = Array.from({ length: 12 }, () => 0);
    const indexOfLargestDigits = Array.from({ length: 12 }, () => 0);

    for (let i = 0; i <= 11; i++) {
      const indexOfPreviousLargestDigit =
        i === 0 ? -1 : indexOfLargestDigits[i - 1];
      const start = indexOfPreviousLargestDigit + 1;
      const end = digits.length - (11 - i);
      for (let j = start; j < end; j++) {
        if (digits[j] > largestDigits[i]) {
          largestDigits[i] = digits[j];
          indexOfLargestDigits[i] = j;
        }
      }
    }
    largestTwelveDigits.push(Number(largestDigits.join("")));
  }

  console.log("Largest twelve digits from each line:", largestTwelveDigits);
  const sumOfLargestTwelveDigits = largestTwelveDigits.reduce(
    (acc, curr) => acc + curr,
    0
  );
  console.log("Sum of largest twelve digits:", sumOfLargestTwelveDigits);
  return largestTwelveDigits;
};

findAndAddLargestTwelveDigits(input);
