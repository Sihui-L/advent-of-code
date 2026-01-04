function countTotalFreshIds(inputText) {
  const lines = inputText.split(/\r?\n/);

  // ---------- 1) Parse only the fresh ranges (before blank line) ----------
  const freshRanges = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Stop reading once we hit the blank line
    if (line === "") break;

    const [startStr, endStr] = line.split("-");
    const rangeStart = Number(startStr);
    const rangeEnd = Number(endStr);

    freshRanges.push([rangeStart, rangeEnd]);
  }

  if (freshRanges.length === 0) return 0;

  // ---------- 2) Sort ranges by start, then end ----------
  freshRanges.sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1] - b[1];
  });

  // ---------- 3) Merge overlapping or touching ranges ----------
  const mergedRanges = [];

  let currentStart = freshRanges[0][0];
  let currentEnd = freshRanges[0][1];

  for (let i = 1; i < freshRanges.length; i++) {
    const [nextStart, nextEnd] = freshRanges[i];

    // Inclusive ranges:
    // If nextStart <= currentEnd + 1, they overlap or touch
    if (nextStart <= currentEnd + 1) {
      currentEnd = Math.max(currentEnd, nextEnd);
    } else {
      mergedRanges.push([currentStart, currentEnd]);
      currentStart = nextStart;
      currentEnd = nextEnd;
    }
  }

  // Push the final merged range
  mergedRanges.push([currentStart, currentEnd]);

  // ---------- 4) Sum up inclusive lengths ----------
  let totalFreshIds = 0;
  for (const [start, end] of mergedRanges) {
    totalFreshIds += end - start + 1;
  }

  return totalFreshIds;
}

// ---- AoC-style stdin usage ----
if (require.main === module) {
  const fs = require("fs");
  const input = fs.readFileSync(0, "utf8");
  console.log(countTotalFreshIds(input));
}

module.exports = { countTotalFreshIds };
