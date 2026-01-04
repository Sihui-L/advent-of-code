const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "..", "input.txt");
const input = fs.readFileSync(inputPath, "utf-8").trim().split("\n");

function totalRemovable(lines) {
  const rows = lines.length;
  const columns = rows ? lines[0].length : 0;

  const adjacentDirections = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  const aliveRoll = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: columns }, (_, c) => lines[r][c] === "@")
  );

  const adjacentRollCount = Array.from({ length: rows }, () => Array(columns).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (!aliveRoll[r][c]) continue;
      let neighborRolls = 0;
      for (const [dr, dc] of adjacentDirections) {
        const rr = r + dr,
          cc = c + dc;
        if (rr >= 0 && rr < rows && cc >= 0 && cc < columns && aliveRoll[rr][cc]) neighborRolls++;
      }
      adjacentRollCount[r][c] = neighborRolls;
    }
  }

  const candidateQueue = [];
  let queueHeadIndex = 0;
  const inQueue = Array.from({ length: rows }, () => Array(columns).fill(false));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (aliveRoll[r][c] && adjacentRollCount[r][c] < 4) {
        candidateQueue.push([r, c]);
        inQueue[r][c] = true;
      }
    }
  }

  let removed = 0;
  while (queueHeadIndex < candidateQueue.length) {
    const [r, c] = candidateQueue[queueHeadIndex++];
    inQueue[r][c] = false;

    if (!aliveRoll[r][c]) continue;
    if (adjacentRollCount[r][c] >= 4) continue;

    aliveRoll[r][c] = false;
    removed++;

    for (const [dr, dc] of adjacentDirections) {
      const rr = r + dr,
        cc = c + dc;
      if (rr >= 0 && rr < rows && cc >= 0 && cc < columns && aliveRoll[rr][cc]) {
        adjacentRollCount[rr][cc]--;
        if (adjacentRollCount[rr][cc] < 4 && !inQueue[rr][cc]) {
          candidateQueue.push([rr, cc]);
          inQueue[rr][cc] = true;
        }
      }
    }
  }

  console.log("Total removable:", removed);
  return removed;
}

totalRemovable(input);
