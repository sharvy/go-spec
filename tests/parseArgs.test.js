"use strict";

const assert = require("assert");

// Inline parseArgs from bin/install.js
function parseArgs(argv) {
  const args = argv.slice(2);

  let runtime = null;
  if (args.includes("--claude")) runtime = "claude";
  else if (args.includes("--antigravity")) runtime = "antigravity";

  return {
    runtime,
    scope: args.includes("--global")
      ? "global"
      : args.includes("--local")
      ? "local"
      : null,
    uninstall: args.includes("--uninstall"),
    yes: args.includes("--yes") || args.includes("-y"),
    help: args.includes("--help") || args.includes("-h"),
    version: args.includes("--version") || args.includes("-v"),
  };
}

function parse(...flags) {
  return parseArgs(["node", "install.js", ...flags]);
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

console.log("\nparseArgs() — argument parsing\n");

test("no args: all null/false", () => {
  const r = parse();
  assert.strictEqual(r.runtime, null);
  assert.strictEqual(r.scope, null);
  assert.strictEqual(r.uninstall, false);
  assert.strictEqual(r.help, false);
  assert.strictEqual(r.version, false);
});

test("--claude sets runtime", () => {
  assert.strictEqual(parse("--claude").runtime, "claude");
});

test("--antigravity sets runtime", () => {
  assert.strictEqual(parse("--antigravity").runtime, "antigravity");
});

test("--global sets scope", () => {
  assert.strictEqual(parse("--claude", "--global").scope, "global");
});

test("--local sets scope", () => {
  assert.strictEqual(parse("--claude", "--local").scope, "local");
});

test("--uninstall sets uninstall", () => {
  assert.strictEqual(parse("--claude", "--global", "--uninstall").uninstall, true);
});

test("--yes sets yes flag", () => {
  assert.strictEqual(parse("--yes").yes, true);
});

test("-y sets yes flag", () => {
  assert.strictEqual(parse("-y").yes, true);
});

test("--help sets help flag", () => {
  assert.strictEqual(parse("--help").help, true);
});

test("-h sets help flag", () => {
  assert.strictEqual(parse("-h").help, true);
});

test("--version sets version flag", () => {
  assert.strictEqual(parse("--version").version, true);
});

test("-v sets version flag", () => {
  assert.strictEqual(parse("-v").version, true);
});

test("first runtime flag wins (claude before antigravity)", () => {
  assert.strictEqual(parse("--claude", "--antigravity").runtime, "claude");
});

test("interactive: no runtime → null", () => {
  assert.strictEqual(parse("--global").runtime, null);
});

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
