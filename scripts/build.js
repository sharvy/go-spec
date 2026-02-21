#!/usr/bin/env node

/**
 * build.js
 *
 * Validates the go-spec project structure before publishing.
 * Checks that all expected files exist and have non-empty content.
 */

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const EXPECTED_FILES = [
  // Root
  "package.json",
  "README.md",
  "CHANGELOG.md",
  ".gitignore",

  // Installer
  "bin/install.js",

  // Hooks
  "hooks/gs-statusline.js",
  "hooks/gs-context-monitor.js",
  "hooks/gs-update-checker.js",

  // Agents
  "agents/gs-project-researcher.md",
  "agents/gs-phase-researcher.md",
  "agents/gs-synthesizer.md",
  "agents/gs-roadmapper.md",
  "agents/gs-planner.md",
  "agents/gs-plan-checker.md",
  "agents/gs-executor.md",
  "agents/gs-verifier.md",
  "agents/gs-codebase-mapper.md",
  "agents/gs-canon-builder.md",
  "agents/gs-debugger.md",
  "agents/gs-integration-checker.md",

  // Commands
  "commands/gs/init.md",
  "commands/gs/discuss.md",
  "commands/gs/plan.md",
  "commands/gs/run.md",
  "commands/gs/verify.md",
  "commands/gs/quick.md",
  "commands/gs/status.md",
  "commands/gs/resume.md",
  "commands/gs/pause.md",
  "commands/gs/map.md",
  "commands/gs/canon.md",
  "commands/gs/add-phase.md",
  "commands/gs/insert-phase.md",
  "commands/gs/remove-phase.md",
  "commands/gs/phase-notes.md",
  "commands/gs/milestone-start.md",
  "commands/gs/milestone-done.md",
  "commands/gs/milestone-audit.md",
  "commands/gs/gaps.md",
  "commands/gs/todo.md",
  "commands/gs/todos.md",
  "commands/gs/debug.md",
  "commands/gs/settings.md",
  "commands/gs/profile.md",
  "commands/gs/update.md",
  "commands/gs/health.md",
  "commands/gs/help.md",

  // Templates
  "templates/project/PROJECT.md",
  "templates/project/REQUIREMENTS.md",
  "templates/project/ROADMAP.md",
  "templates/project/STATE.md",
  "templates/project/config.json",
  "templates/phases/CONTEXT.md",
  "templates/phases/PLAN.md",
  "templates/phases/SUMMARY.md",
  "templates/phases/VERIFICATION.md",
  "templates/phases/RESEARCH.md",
];

let errors = 0;
let checked = 0;

for (const rel of EXPECTED_FILES) {
  const abs = path.join(ROOT, rel);
  checked++;

  if (!fs.existsSync(abs)) {
    console.error(`✗ MISSING: ${rel}`);
    errors++;
    continue;
  }

  const stat = fs.statSync(abs);
  if (stat.size === 0) {
    console.error(`✗ EMPTY: ${rel}`);
    errors++;
    continue;
  }

  console.log(`✓ ${rel}`);
}

console.log(`\n${checked} files checked, ${errors} error(s).`);

if (errors > 0) {
  process.exit(1);
} else {
  console.log("\n✓ Build validation passed.");
}
