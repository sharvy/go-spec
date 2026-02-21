"use strict";

const assert = require("assert");

// Inline threshold/cooldown logic from hooks/gs-context-monitor.js
const THRESHOLDS = {
  warn: 60,
  urgent: 80,
  critical: 90,
};

const COOLDOWNS = {
  warn: 5 * 60 * 1000,
  urgent: 3 * 60 * 1000,
  critical: 60 * 1000,
};

function selectLevel(usedPct, state, now) {
  if (usedPct >= THRESHOLDS.critical && now - state.lastCritical > COOLDOWNS.critical) {
    return "critical";
  }
  if (usedPct >= THRESHOLDS.urgent && now - state.lastUrgent > COOLDOWNS.urgent) {
    return "urgent";
  }
  if (usedPct >= THRESHOLDS.warn && now - state.lastWarn > COOLDOWNS.warn) {
    return "warn";
  }
  return null;
}

function freshState() {
  return { lastWarn: 0, lastUrgent: 0, lastCritical: 0 };
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

const now = Date.now();

console.log("\nContext monitor — threshold and cooldown logic\n");

test("below warn threshold: no level", () => {
  assert.strictEqual(selectLevel(59, freshState(), now), null);
});

test("at warn threshold: warn level", () => {
  assert.strictEqual(selectLevel(60, freshState(), now), "warn");
});

test("above warn but below urgent: warn level", () => {
  assert.strictEqual(selectLevel(70, freshState(), now), "warn");
});

test("at urgent threshold: urgent level", () => {
  assert.strictEqual(selectLevel(80, freshState(), now), "urgent");
});

test("at critical threshold: critical level", () => {
  assert.strictEqual(selectLevel(90, freshState(), now), "critical");
});

test("100% used: critical level", () => {
  assert.strictEqual(selectLevel(100, freshState(), now), "critical");
});

test("critical suppressed within cooldown falls through to urgent", () => {
  // Critical is on cooldown but urgent threshold is met and urgent is fresh → falls through
  const state = { ...freshState(), lastCritical: now - 30_000 }; // 30s ago, cooldown=60s
  assert.strictEqual(selectLevel(95, state, now), "urgent");
});

test("critical allowed after cooldown elapsed", () => {
  const state = { ...freshState(), lastCritical: now - 61_000 }; // 61s ago, cooldown=60s
  assert.strictEqual(selectLevel(95, state, now), "critical");
});

test("urgent suppressed within cooldown falls through to warn", () => {
  // Urgent is on cooldown but warn threshold is met and warn is fresh → falls through
  const state = { ...freshState(), lastUrgent: now - 60_000 }; // 1min ago, cooldown=3min
  assert.strictEqual(selectLevel(85, state, now), "warn");
});

test("urgent allowed after cooldown elapsed", () => {
  const state = { ...freshState(), lastUrgent: now - 4 * 60 * 1000 }; // 4min ago
  assert.strictEqual(selectLevel(85, state, now), "urgent");
});

test("warn suppressed within cooldown", () => {
  const state = { ...freshState(), lastWarn: now - 60_000 }; // 1min ago, cooldown=5min
  assert.strictEqual(selectLevel(65, state, now), null);
});

test("warn allowed after cooldown elapsed", () => {
  const state = { ...freshState(), lastWarn: now - 6 * 60 * 1000 }; // 6min ago
  assert.strictEqual(selectLevel(65, state, now), "warn");
});

test("critical takes priority over urgent", () => {
  assert.strictEqual(selectLevel(92, freshState(), now), "critical");
});

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
