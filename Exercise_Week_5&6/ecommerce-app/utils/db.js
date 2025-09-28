const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, '..', 'data');

function readJson(filename) {
  const p = path.join(dataDir, filename);
  try {
    const raw = fs.readFileSync(p, 'utf8') || '[]';
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function writeJson(filename, data) {
  const p = path.join(dataDir, filename);
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { readJson, writeJson };
