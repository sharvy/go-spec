#!/usr/bin/env node

/**
 * gs-context-monitor.js
 *
 * Claude Code PostToolUse hook that monitors context window usage.
 * When usage exceeds thresholds, injects a warning into the conversation
 * so the AI can proactively checkpoint or wrap up before context runs out.
 *
 * Input:  JSON from Claude Code on stdin
 * Output: JSON with optional "message" field to inject into conversation
 */

"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");

// ─── Configuration ────────────────────────────────────────────────────────────

const THRESHOLDS = {
  warn: 60,     // First soft warning
  urgent: 80,   // Urgent — wrap up soon
  critical: 90, // Critical — finish this step and stop
};

/** Minimum ms between warnings at each level to avoid spam */
const COOLDOWNS = {
  warn: 5 * 60 * 1000,    // 5 min
  urgent: 3 * 60 * 1000,  // 3 min
  critical: 60 * 1000,    // 1 min
};

// ─── Workspace Isolation ──────────────────────────────────────────────────────

function findProjectRoot(startDir) {
  let dir = startDir;
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(dir, ".spec"))) return dir;
    if (fs.existsSync(path.join(dir, "package.json"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return startDir;
}

function workspaceHash(dir) {
  let h = 5381;
  for (let i = 0; i < dir.length; i++) h = ((h << 5) + h) ^ dir.charCodeAt(i);
  return Math.abs(h).toString(36).slice(0, 8);
}

function debugLog(msg) {
  if (process.env.GO_SPEC_DEBUG) process.stderr.write(`[go-spec debug] ${msg}\n`);
}

const _wsRoot = findProjectRoot(process.cwd());
const _wsHash = workspaceHash(_wsRoot);
const BRIDGE_FILE = path.join(os.tmpdir(), `go-spec-context-${_wsHash}.json`);
const STATE_FILE = path.join(os.tmpdir(), `go-spec-monitor-state-${_wsHash}.json`);

// ─── State Tracking ───────────────────────────────────────────────────────────

function loadMonitorState() {
  try {
    const raw = fs.readFileSync(STATE_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    debugLog(`loadMonitorState: ${err.message}`);
    return { lastWarn: 0, lastUrgent: 0, lastCritical: 0 };
  }
}

function saveMonitorState(state) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state));
  } catch (err) {
    debugLog(`saveMonitorState: ${err.message}`);
  }
}

// ─── Context Reading ──────────────────────────────────────────────────────────

/**
 * Get context usage from multiple sources, preferring direct input.
 */
function getUsedPercent(input) {
  // Prefer live data from Claude Code input
  const remaining = input?.context_window?.remaining_percentage;
  if (remaining != null) return 100 - remaining;

  // Fallback: read from statusline bridge file (written by gs-statusline)
  try {
    const bridge = JSON.parse(fs.readFileSync(BRIDGE_FILE, "utf8"));
    const age = Date.now() - (bridge.ts || 0);
    if (age < 30_000) return bridge.usedPct; // Only use if fresh (< 30s)
  } catch (err) {
    debugLog(`readBridgeFile: ${err.message}`);
  }

  return null;
}

// ─── Warning Messages ─────────────────────────────────────────────────────────

const MESSAGES = {
  warn: (pct) => `
[go-spec context monitor] Context is ${pct}% full.
Consider: summarizing completed work, committing changes, and planning a clean stopping point.
`.trim(),

  urgent: (pct) => `
[go-spec context monitor] ⚠ Context is ${pct}% full — please wrap up soon.
1. Finish your current step completely.
2. Write a brief summary of what was accomplished.
3. Commit any pending changes.
4. Note what remains for the next session in .spec/STATE.md.
`.trim(),

  critical: (pct) => `
[go-spec context monitor] 🚨 Context is ${pct}% full — STOP after this step.
Do not start new tasks. Complete only what's in progress, commit, and use /gs:pause to checkpoint.
`.trim(),
};

// ─── Main Logic ───────────────────────────────────────────────────────────────

function main() {
  let input = {};

  try {
    const raw = fs.readFileSync("/dev/stdin", "utf8");
    if (raw.trim()) input = JSON.parse(raw);
  } catch (err) {
    debugLog(`readStdin: ${err.message}`);
  }

  const usedPct = getUsedPercent(input);
  if (usedPct === null) {
    // No context data available — pass through silently
    process.stdout.write(JSON.stringify({}) + "\n");
    return;
  }

  const state = loadMonitorState();
  const now = Date.now();

  let message = null;
  let level = null;

  if (usedPct >= THRESHOLDS.critical && now - state.lastCritical > COOLDOWNS.critical) {
    message = MESSAGES.critical(usedPct);
    level = "critical";
    state.lastCritical = now;
  } else if (usedPct >= THRESHOLDS.urgent && now - state.lastUrgent > COOLDOWNS.urgent) {
    message = MESSAGES.urgent(usedPct);
    level = "urgent";
    state.lastUrgent = now;
  } else if (usedPct >= THRESHOLDS.warn && now - state.lastWarn > COOLDOWNS.warn) {
    message = MESSAGES.warn(usedPct);
    level = "warn";
    state.lastWarn = now;
  }

  if (level) saveMonitorState(state);

  const output = message ? { message } : {};
  process.stdout.write(JSON.stringify(output) + "\n");
}

main();
