"use strict";

const assert = require("assert");

// Inline the function under test (hooks/gs-update-checker.js)
function isNewer(current, latest) {
  const parse = (v) => v.replace(/^v/, "").split(".").map(Number);
  const [cMaj, cMin, cPat] = parse(current);
  const [lMaj, lMin, lPat] = parse(latest);
  if (lMaj !== cMaj) return lMaj > cMaj;
  if (lMin !== cMin) return lMin > cMin;
  return lPat > cPat;
}

let passed = 0;
let failed = 0;

function test(label, fn) {
  try {
    fn();
    console.log(`  ✓ ${label}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${label}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

console.log("\nisNewer() — semver comparison\n");

test("newer patch version returns true", () => {
  assert.strictEqual(isNewer("1.0.0", "1.0.1"), true);
});

test("newer minor version returns true", () => {
  assert.strictEqual(isNewer("1.0.0", "1.1.0"), true);
});

test("newer major version returns true", () => {
  assert.strictEqual(isNewer("1.0.0", "2.0.0"), true);
});

test("same version returns false", () => {
  assert.strictEqual(isNewer("1.0.0", "1.0.0"), false);
});

test("older patch returns false", () => {
  assert.strictEqual(isNewer("1.0.5", "1.0.3"), false);
});

test("older minor returns false", () => {
  assert.strictEqual(isNewer("1.5.0", "1.2.0"), false);
});

test("older major returns false", () => {
  assert.strictEqual(isNewer("2.0.0", "1.9.9"), false);
});

test("handles v-prefix in latest", () => {
  assert.strictEqual(isNewer("1.0.0", "v1.0.1"), true);
});

test("minor beats patch: 1.1.0 > 1.0.9", () => {
  assert.strictEqual(isNewer("1.0.9", "1.1.0"), true);
});

test("major beats minor+patch: 2.0.0 > 1.99.99", () => {
  assert.strictEqual(isNewer("1.99.99", "2.0.0"), true);
});

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
