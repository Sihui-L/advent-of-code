const fs = require('fs');
const readline = require('readline');

const DEFAULT_PATH = 'company_studies.jsonl';

async function listUniqueTitles(filePath, outputPath, year) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const seen = new Set();
  const uniqueTitles = [];

  for await (const line of rl) {
    if (!line.trim()) continue;
    let study;
    try {
      study = JSON.parse(line);
    } catch (error) {
      continue;
    }

    const dateCreated = String(study.date_created || '');
    if (!dateCreated.startsWith(year)) continue;

    const name = String(study.name || '').trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueTitles.push(name);
  }

  const output = uniqueTitles.join('\n');
  fs.writeFileSync(outputPath, `${output}\n`, 'utf8');
  console.log(`Wrote ${uniqueTitles.length} unique titles to ${outputPath}`);
}

const filePath = process.argv[2] || DEFAULT_PATH;
const outputPath = process.argv[3] || 'unique_titles_2025.txt';
const year = process.argv[4] || '2025';
listUniqueTitles(filePath, outputPath, year).catch((error) => {
  console.error('Failed to list unique titles:', error);
  process.exitCode = 1;
});
