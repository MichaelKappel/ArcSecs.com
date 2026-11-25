const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, readdirSync, statSync } = require('node:fs');
const { join } = require('node:path');

const root = process.cwd();

function listFiles(directory, predicate, output = []) {
  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      if (entry !== 'node_modules' && entry !== '.git') {
        listFiles(fullPath, predicate, output);
      }
    } else if (predicate(fullPath)) {
      output.push(fullPath);
    }
  }
  return output;
}

test('source avoids jQuery Ajax helpers and Bootstrap runtime dependency', () => {
  const files = listFiles(root, (filePath) => /\.(js|ts|php|css)$/.test(filePath) && !filePath.includes('/tests/'));
  const combined = files.map((filePath) => readFileSync(filePath, 'utf8')).join('\n');
  assert.equal(combined.includes('$.ajax'), false);
  assert.equal(combined.includes('jQuery.ajax'), false);
  assert.equal(combined.includes('bootstrap.min.js'), false);
});
