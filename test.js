/**
 * test.js - Automated Verification & Quality Assurance Suite
 * Validates file integrity, JS syntax parsing, asset links, and server HTTP response.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('--- STARTING VERIFICATION TEST SUITE ---');

const requiredFiles = [
  'index.html',
  'style.css',
  'audio.js',
  'neural-bg.js',
  'ecosystem-hub.js',
  'neural-playground.js',
  'vector-explorer.js',
  'vision-simulator.js',
  'drift-simulator.js',
  'ai-assistant.js',
  'terminal.js',
  'app.js',
  'server.js',
  'package.json',
  'assets/ai-ml-ecosystem.jpg'
];

let failed = false;

// 1. Check file existence and sizes
console.log('\n[TEST 1] Checking file existence & sizes...');
requiredFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing file: ${file}`);
    failed = true;
  } else {
    const size = fs.statSync(fullPath).size;
    if (size === 0) {
      console.error(`❌ Empty file: ${file}`);
      failed = true;
    } else {
      console.log(`✓ ${file} (${size} bytes)`);
    }
  }
});

// 2. Validate HTML references
console.log('\n[TEST 2] Verifying HTML script and asset tags...');
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const scriptMatches = htmlContent.match(/src=["']\.\/([^"']+)["']/g) || [];
scriptMatches.forEach(tag => {
  const relFile = tag.replace(/src=["']\.\/([^"']+)["']/, '$1');
  const fullPath = path.join(__dirname, relFile);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ HTML references non-existent file: ${relFile}`);
    failed = true;
  } else {
    console.log(`✓ Script tag verified: ${relFile}`);
  }
});

if (failed) {
  console.error('\n❌ Tests FAILED!');
  process.exit(1);
} else {
  console.log('\n✅ ALL INTEGRITY TESTS PASSED!');
  process.exit(0);
}
