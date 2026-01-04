const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "..", "input.txt");
const input = fs.readFileSync(inputPath, "utf-8").trim();

function countFreshIngredients(inputText) {
  const lines = inputText.split(/\r?\n/);

  // ---------- 1) Parse ranges and IDs ----------
  const rawRanges = [];
  const availableIds = [];

  let readingRanges = true;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // blank line switches from ranges section to IDs section
    if (line === "") {
      readingRanges = false;
      continue;
    }

    if (readingRanges) {
      // parse "start-end"
      const [startStr, endStr] = line.split("-");
      const start = Number(startStr);
      const end = Number(endStr);
      rawRanges.push([start, end]);
    } else {
      // parse single integer ID
      availableIds.push(Number(line));
    }
  }

  // Edge case: no ranges
  if (rawRanges.length === 0) return 0;

  // ---------- 2) Sort and merge overlapping ranges ----------
  rawRanges.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  const mergedRanges = [];
  for (const [start, end] of rawRanges) {
    if (mergedRanges.length === 0) {
      mergedRanges.push([start, end]);
      continue;
    }

    const lastIndex = mergedRanges.length - 1;
    const [lastStart, lastEnd] = mergedRanges[lastIndex];

    // If current range overlaps or touches the previous range:
    // currentStart <= lastEnd + 1  => merge them
    if (start <= lastEnd + 1) {
      mergedRanges[lastIndex] = [lastStart, Math.max(lastEnd, end)];
    } else {
      mergedRanges.push([start, end]);
    }
  }

  // ---------- 3) For each ID, check if it falls into any merged range ----------
  // Binary search helper: find the last range whose start <= id
  function isFresh(id) {
    let left = 0;
    let right = mergedRanges.length - 1;
    let candidateIndex = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const [rangeStart] = mergedRanges[mid];

      if (rangeStart <= id) {
        candidateIndex = mid; // mid could contain id, but we search further right
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    if (candidateIndex === -1) return false;

    const [start, end] = mergedRanges[candidateIndex];
    return start <= id && id <= end;
  }

  let freshCount = 0;
  for (const id of availableIds) {
    if (isFresh(id)) freshCount++;
  }

  return freshCount;
}

const result = countFreshIngredients(input);
console.log("Total fresh ingredient IDs:", result);