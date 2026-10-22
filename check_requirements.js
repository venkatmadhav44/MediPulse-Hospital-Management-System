/**
 * MediPulse HMS - Deep Dependency Checker (Node.js Script)
 * Called by Check_Requirements.bat for detailed package validation.
 *
 * Checks:
 *  - Frontend package.json dependencies vs installed node_modules
 *  - Backend package.json dependencies vs installed server/node_modules
 *  - Key version compatibility notes
 *
 * Does NOT install, delete, or modify any files.
 */

import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve('.');
const log = (status, msg) => console.log(`  [${status.padEnd(7)}] ${msg}`);

const PASS    = 'PASS';
const WARN    = 'WARNING';
const FAIL    = 'FAIL';
const INFO    = 'INFO';

// -----------------------------------------------------------------------
// Helper: read a package.json safely
// -----------------------------------------------------------------------
function readPkg(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

// -----------------------------------------------------------------------
// Helper: check if a package is installed in a given node_modules dir
// -----------------------------------------------------------------------
function isInstalled(nmPath, pkgName) {
  return existsSync(join(nmPath, pkgName, 'package.json'));
}

// -----------------------------------------------------------------------
// Check a set of dependencies against a node_modules directory
// -----------------------------------------------------------------------
function checkDeps(pkgJson, nmPath, label) {
  const all = { ...pkgJson.dependencies, ...pkgJson.devDependencies };
  const missing = [];
  const found   = [];

  for (const [name] of Object.entries(all)) {
    if (isInstalled(nmPath, name)) {
      found.push(name);
    } else {
      missing.push(name);
    }
  }

  if (missing.length === 0) {
    log(PASS, `${label}: All ${found.length} declared packages are installed.`);
  } else {
    log(WARN, `${label}: ${missing.length} package(s) NOT found in node_modules:`);
    missing.forEach(m => console.log(`             - ${m}`));
    log(INFO, `  Fix: Run  npm install  in the ${label.includes('Backend') ? 'server/' : 'project root'} directory.`);
  }
}

// -----------------------------------------------------------------------
// Main checks
// -----------------------------------------------------------------------
console.log('\n  --- Detailed Package Dependency Check ---');

// Frontend
const fePkg = readPkg(join(ROOT, 'package.json'));
const feNm  = join(ROOT, 'node_modules');
if (fePkg) {
  checkDeps(fePkg, feNm, 'Frontend');
} else {
  log(FAIL, 'Frontend package.json could not be read.');
}

// Backend
const bePkg = readPkg(join(ROOT, 'server', 'package.json'));
const beNm  = join(ROOT, 'server', 'node_modules');
if (bePkg) {
  checkDeps(bePkg, beNm, 'Backend (server/)');
} else {
  log(FAIL, 'Backend server/package.json could not be read.');
}

// Node version check
const nvMatch = process.version.match(/^v(\d+)/);
const major   = nvMatch ? parseInt(nvMatch[1]) : 0;
if (major >= 18) {
  log(PASS, `Node.js v${major}.x — compatible with this project (requires ≥18).`);
} else {
  log(WARN, `Node.js v${major}.x — this project may need Node.js 18 or higher.`);
  console.log('          Fix: Upgrade Node.js at https://nodejs.org');
}

console.log('  --- End of Dependency Check ---\n');
