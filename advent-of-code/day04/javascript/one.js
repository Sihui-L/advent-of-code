const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "..", "input.txt");
const input = fs.readFileSync(inputPath, "utf-8").trim().split("\n");

function countAccessible(lines) {
  const rows = lines.length;
  const columns = rows ? lines[0].length : 0;

  const adjacentPositions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  let ans = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (lines[r][c] !== "@") continue;
      let adj = 0;
      for (const [moveRow, moveColumn] of adjacentPositions) {
        const rr = r + moveRow,
          cc = c + moveColumn;
        if (rr >= 0 && rr < rows && cc >= 0 && cc < columns && lines[rr][cc] === "@") {
          adj++;
        }
      }
      if (adj < 4) ans++;
    }
  }

  console.log("Total accessible '@' characters:", ans);
  return ans;
}

countAccessible(input);
