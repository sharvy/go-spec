#!/usr/bin/env node

/**
 * gs-update-checker.js
 *
 * Claude Code PreToolUse hook that checks for go-spec updates.
 * Runs silently at most once per day. When an update is available,
 * injects a single non-blocking notification into the conversation.
 *
 * Input:  JSON from Claude Code on stdin
 * Output: JSON with optional "message" field
 */

"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const https = require("https");

// ─── Configuration ────────────────────────────────────────────────────────────

const PACKAGE_NAME = "go-spec";
const NPM_REGISTRY_URL = `https://registry.npmjs.org/${PACKAGE_NAME}/latest`;
const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
const REQUEST_TIMEOUT_MS = 3000;

const STATE_FILE = path.join(os.tmpdir(), "go-spec-update-state.json");

function debugLog(msg) {
  if (process.env.GO_SPEC_DEBUG) process.stderr.write(`[go-spec debug] ${msg}\n`);
}

// ─── Current Version ──────────────────────────────────────────────────────────

function getCurrentVersion() {
  try {
    const pkgPath = path.join(__dirname, "..", "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    return pkg.version;
  } catch (err) {
    debugLog(`getCurrentVersion: ${err.message}`);
    return null;
  }
}

// ─── State Persistence ────────────────────────────────────────────────────────

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch (err) {
    debugLog(`loadState: ${err.message}`);
    return { lastChecked: 0, latestVersion: null, notified: false };
  }
}

function saveState(state) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state));
  } catch (err) {
    debugLog(`saveState: ${err.message}`);
  }
}

// ─── Version Comparison ───────────────────────────────────────────────────────

/**
 * Returns true if `latest` is a higher semver than `current`.
 */
function isNewer(current, latest) {
  const parse = (v) => v.replace(/^v/, "").split(".").map(Number);
  const [cMaj, cMin, cPat] = parse(current);
  const [lMaj, lMin, lPat] = parse(latest);
  if (lMaj !== cMaj) return lMaj > cMaj;
  if (lMin !== cMin) return lMin > cMin;
  return lPat > cPat;
}

// ─── NPM Fetch ────────────────────────────────────────────────────────────────

/**
 * Fetch the latest published version from the npm registry.
 * Returns a Promise<string|null>.
 */
function fetchLatestVersion() {
  return new Promise((resolve) => {
    const req = https.get(NPM_REGISTRY_URL, { timeout: REQUEST_TIMEOUT_MS }, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const data = JSON.parse(body);
          resolve(data.version || null);
        } catch (err) {
          debugLog(`fetchLatestVersion parse: ${err.message}`);
          resolve(null);
        }
      });
    });

    req.on("error", () => resolve(null));
    req.on("timeout", () => {
      req.destroy();
      resolve(null);
    });
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Always output valid JSON — this hook is non-blocking
  let output = {};

  try {
    const state = loadState();
    const now = Date.now();

    // Only check if enough time has passed
    if (now - state.lastChecked < CHECK_INTERVAL_MS) {
      // Still within cooldown — notify if we already found an update
      if (state.latestVersion && !state.notified) {
        const current = getCurrentVersion();
        if (current && isNewer(current, state.latestVersion)) {
          output = {
            message: buildUpdateMessage(current, state.latestVersion),
          };
          state.notified = true;
          saveState(state);
        }
      }
      process.stdout.write(JSON.stringify(output) + "\n");
      return;
    }

    // Time to check for updates
    const latest = await fetchLatestVersion();
    state.lastChecked = now;
    state.notified = false;

    if (latest) {
      state.latestVersion = latest;
      const current = getCurrentVersion();

      if (current && isNewer(current, latest)) {
        output = { message: buildUpdateMessage(current, latest) };
        state.notified = true;
      }
    }

    saveState(state);
  } catch (err) {
    debugLog(`updateCheck: ${err.message}`);
  }

  process.stdout.write(JSON.stringify(output) + "\n");
}

function buildUpdateMessage(current, latest) {
  return [
    `[go-spec] Update available: v${current} → v${latest}`,
    `Run /gs:update or: npx go-spec@latest --claude --global`,
  ].join("\n");
}

main();
