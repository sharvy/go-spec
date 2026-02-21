#!/usr/bin/env node

/**
 * gs-statusline.js
 *
 * Claude Code PreToolUse hook that renders a status line showing:
 *   Model | Current task | Project path | Context usage bar
 *
 * Input:  JSON from Claude Code on stdin
 * Output: JSON with statusline string on stdout
 */

"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");

// ─── Context Data Bridge ──────────────────────────────────────────────────────

/** Shared temp file so context-monitor.js can read fresh usage data */
const CONTEXT_BRIDGE_FILE = path.join(os.tmpdir(), "go-spec-context.json");

// ─── State Discovery ──────────────────────────────────────────────────────────

/**
 * Walk up from cwd to find the nearest .spec/ directory.
 */
function findSpecDir(startDir) {
  let dir = startDir;
  for (let i = 0; i < 10; i++) {
    const candidate = path.join(dir, ".spec");
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

/**
 * Read the current task from STATE.md (looks for "Current Position" section).
 */
function readCurrentTask(specDir) {
  const statePath = path.join(specDir, "STATE.md");
  if (!fs.existsSync(statePath)) return null;

  try {
    const content = fs.readFileSync(statePath, "utf8");
    const match = content.match(/##\s+Current Position\s*\n+([^\n]+)/);
    return match ? match[1].trim() : null;
  } catch {
    return null;
  }
}

/**
 * Find the most recent active todo from todos/pending/.
 */
function readActiveTodo(specDir) {
  const pendingDir = path.join(specDir, "todos", "pending");
  if (!fs.existsSync(pendingDir)) return null;

  try {
    const files = fs
      .readdirSync(pendingDir)
      .filter((f) => f.endsWith(".md"))
      .sort()
      .reverse();

    if (!files.length) return null;

    const content = fs.readFileSync(path.join(pendingDir, files[0]), "utf8");
    const match = content.match(/^#\s+(.+)/m);
    return match ? match[1].trim() : files[0].replace(/\.md$/, "");
  } catch {
    return null;
  }
}

// ─── Rendering ────────────────────────────────────────────────────────────────

const BAR_LENGTH = 10;

/**
 * Render a filled progress bar.
 * @param {number} usedPct  0–100
 */
function renderBar(usedPct) {
  const filled = Math.round((usedPct / 100) * BAR_LENGTH);
  const empty = BAR_LENGTH - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}

/**
 * Color-code context percentage as a warning level string.
 * Claude Code's statusline supports basic ANSI or plain text.
 */
function contextLabel(usedPct) {
  if (usedPct >= 85) return `⚠ ${usedPct}%`;
  if (usedPct >= 60) return `${usedPct}%`;
  return `${usedPct}%`;
}

/**
 * Shorten a path for display.
 */
function shortenPath(fullPath) {
  const home = os.homedir();
  if (fullPath.startsWith(home)) return "~" + fullPath.slice(home.length);
  return fullPath;
}

/**
 * Build the statusline string from available data.
 */
function buildStatusline(input) {
  const parts = [];

  // Model name
  const modelName = input?.model?.display_name || input?.model?.id || "Claude";
  const shortModel = modelName.replace("Claude ", "").replace(" Latest", "");
  parts.push(shortModel);

  // Current task or todo
  const cwd = input?.workspace?.current_dir || process.cwd();
  const specDir = findSpecDir(cwd);

  if (specDir) {
    const task = readCurrentTask(specDir) || readActiveTodo(specDir);
    if (task) {
      const truncated = task.length > 40 ? task.slice(0, 38) + "…" : task;
      parts.push(truncated);
    }

    // Project path
    const projectDir = path.dirname(specDir);
    parts.push(shortenPath(projectDir));
  } else {
    parts.push(shortenPath(cwd));
  }

  // Context usage bar
  const remaining = input?.context_window?.remaining_percentage ?? null;
  if (remaining !== null) {
    const used = 100 - remaining;
    const bar = renderBar(used);
    const label = contextLabel(used);
    parts.push(`${bar} ${label}`);

    // Write bridge file for context-monitor
    try {
      fs.writeFileSync(
        CONTEXT_BRIDGE_FILE,
        JSON.stringify({ usedPct: used, ts: Date.now() })
      );
    } catch {
      // Non-fatal
    }
  }

  return parts.join(" │ ");
}

// ─── Entry Point ──────────────────────────────────────────────────────────────

function main() {
  let input = {};

  try {
    const raw = fs.readFileSync("/dev/stdin", "utf8");
    if (raw.trim()) input = JSON.parse(raw);
  } catch {
    // No stdin or invalid JSON — use defaults
  }

  const statusline = buildStatusline(input);
  process.stdout.write(JSON.stringify({ statusline }) + "\n");
}

main();
