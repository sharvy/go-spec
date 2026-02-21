#!/usr/bin/env node

/**
 * go-spec installer
 *
 * Installs go-spec commands, agents, and hooks into your AI runtime configuration.
 * Supports Claude Code and Antigravity.
 *
 * Usage:
 *   npx go-spec@latest                    # Interactive
 *   npx go-spec --claude --global         # Claude Code, global
 *   npx go-spec --claude --local          # Claude Code, project-local
 *   npx go-spec --antigravity --local     # Antigravity, project-local
 *   npx go-spec --antigravity --global    # Antigravity, global (~/.gemini/antigravity/)
 *   npx go-spec --claude --global --uninstall
 *   npx go-spec --antigravity --local --uninstall
 */

"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");

// ─── Constants ───────────────────────────────────────────────────────────────

const PKG = require("../package.json");
const TOOL_NAME = "go-spec";
const COMMAND_PREFIX = "gs";

const SOURCE_DIR = path.join(__dirname, "..");
const COMMANDS_SRC = path.join(SOURCE_DIR, "commands", "gs");
const AGENTS_SRC = path.join(SOURCE_DIR, "agents");
const HOOKS_SRC = path.join(SOURCE_DIR, "hooks");

/**
 * Runtime definitions — add new runtimes here.
 *
 * commandsSubdir: subdirectory under the base dir where commands land (default: "commands")
 * agentsSubdir:   subdirectory under the base dir where agents land  (default: "agents")
 *
 * Antigravity uses "workflows" for commands and "skills" for agents,
 * which matches the Antigravity Skills system convention.
 */
const RUNTIMES = {
  claude: {
    name: "Claude Code",
    globalDir: () => path.join(os.homedir(), ".claude"),
    localDir: () => path.join(process.cwd(), ".claude"),
    supportsAgents: true,
    supportsHooks: true,
  },
  antigravity: {
    name: "Antigravity",
    // Global: Antigravity reads from ~/.gemini/antigravity/ for user-wide skills/workflows
    globalDir: () => path.join(os.homedir(), ".gemini", "antigravity"),
    // Local: Antigravity reads from .agent/ in the workspace root
    localDir: () => path.join(process.cwd(), ".agent"),
    supportsAgents: true,
    supportsHooks: false,  // Antigravity has no hook/lifecycle event system
    commandsSubdir: "workflows", // commands → .agent/workflows/gs/
    agentsSubdir: "skills",      // agents  → .agent/skills/  (as "skills")
  },
};

// ─── Argument Parsing ─────────────────────────────────────────────────────────

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

// ─── Terminal Utilities ───────────────────────────────────────────────────────

const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

const c = (color, text) => `${colors[color]}${text}${colors.reset}`;

function log(msg = "") {
  console.log(msg);
}

function success(msg) {
  console.log(`  ${c("green", "✓")} ${msg}`);
}

function info(msg) {
  console.log(`  ${c("blue", "•")} ${msg}`);
}

function warn(msg) {
  console.log(`  ${c("yellow", "!")} ${msg}`);
}

function error(msg) {
  console.error(`  ${c("red", "✗")} ${msg}`);
}

function header(msg) {
  log();
  console.log(c("bold", msg));
}

function printBanner() {
  log();
  console.log(c("cyan", c("bold", "  go-spec")));
  console.log(c("dim", `  Specification-driven AI workflow — v${PKG.version}`));
  log();
}

// ─── Interactive Prompts ──────────────────────────────────────────────────────

function createPrompt() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

async function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function choose(rl, prompt, options) {
  const labels = options.map((o, i) => `  ${c("dim", `${i + 1}.`)} ${o.label}`);
  log(prompt);
  labels.forEach((l) => log(l));
  log();

  while (true) {
    const answer = await ask(rl, `  Enter choice (1-${options.length}): `);
    const idx = parseInt(answer.trim(), 10) - 1;
    if (idx >= 0 && idx < options.length) return options[idx].value;
    warn("Invalid choice. Try again.");
  }
}

async function confirm(rl, prompt, defaultYes = true) {
  const hint = defaultYes ? "Y/n" : "y/N";
  const answer = await ask(rl, `  ${prompt} [${hint}]: `);
  if (!answer.trim()) return defaultYes;
  return answer.trim().toLowerCase().startsWith("y");
}

// ─── File System Helpers ──────────────────────────────────────────────────────

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function removeFileIfExists(filePath) {
  if (fs.existsSync(filePath)) fs.rmSync(filePath);
}

function removeDirIfExists(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
}

function listFiles(dir, ext = null) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => !ext || f.endsWith(ext))
    .map((f) => path.join(dir, f));
}

function makeExecutable(filePath) {
  try {
    fs.chmodSync(filePath, "755");
  } catch {
    // Non-fatal on Windows
  }
}

// ─── Install Logic ────────────────────────────────────────────────────────────

/**
 * Returns the target paths for a given runtime and scope.
 * Uses the runtime's commandsSubdir/agentsSubdir overrides when present.
 */
function getTargetPaths(runtimeKey, scope) {
  const def = RUNTIMES[runtimeKey];
  const base = scope === "global" ? def.globalDir() : def.localDir();
  const commandsSubdir = def.commandsSubdir || "commands";
  const agentsSubdir = def.agentsSubdir || "agents";
  return {
    base,
    commands: path.join(base, commandsSubdir, COMMAND_PREFIX),
    agents: path.join(base, agentsSubdir),
    hooks: path.join(base, "hooks", TOOL_NAME),
  };
}

/**
 * Install commands into the target directory.
 */
function installCommands(targetDir) {
  const files = listFiles(COMMANDS_SRC, ".md");
  if (!files.length) {
    warn("No command files found in source.");
    return 0;
  }

  ensureDir(targetDir);
  for (const src of files) {
    const dest = path.join(targetDir, path.basename(src));
    copyFile(src, dest);
  }
  return files.length;
}

/**
 * Install agent definitions.
 */
function installAgents(targetDir) {
  const files = listFiles(AGENTS_SRC, ".md");
  if (!files.length) {
    warn("No agent files found in source.");
    return 0;
  }

  ensureDir(targetDir);
  for (const src of files) {
    const dest = path.join(targetDir, path.basename(src));
    copyFile(src, dest);
  }
  return files.length;
}

/**
 * Install hooks and register them in settings.json.
 */
function installHooks(targetDir, runtimeBase) {
  const files = listFiles(HOOKS_SRC, ".js");
  if (!files.length) {
    warn("No hook files found in source.");
    return 0;
  }

  ensureDir(targetDir);
  for (const src of files) {
    const dest = path.join(targetDir, path.basename(src));
    copyFile(src, dest);
    makeExecutable(dest);
  }

  registerHooksInSettings(runtimeBase, targetDir, files);
  return files.length;
}

/**
 * Register hooks in the runtime's settings.json.
 */
function registerHooksInSettings(runtimeBase, hooksDir, hookFiles) {
  const settingsPath = path.join(runtimeBase, "settings.json");
  let settings = {};

  if (fs.existsSync(settingsPath)) {
    try {
      settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    } catch {
      warn("Could not parse existing settings.json — will create fresh.");
    }
  }

  if (!settings.hooks) settings.hooks = {};

  // Statusline hook
  const statuslineFile = hookFiles.find((f) => f.includes("statusline"));
  if (statuslineFile) {
    const dest = path.join(hooksDir, path.basename(statuslineFile));
    settings.hooks.PreToolUse = settings.hooks.PreToolUse || [];
    const entry = {
      matcher: "",
      hooks: [{ type: "command", command: `node "${dest}"` }],
    };
    // Avoid duplicates
    const existing = settings.hooks.PreToolUse.some((h) =>
      h.hooks?.some((hk) => hk.command?.includes(TOOL_NAME))
    );
    if (!existing) settings.hooks.PreToolUse.push(entry);
  }

  // PostToolUse hooks (context monitor)
  const monitorFile = hookFiles.find((f) => f.includes("context-monitor"));
  if (monitorFile) {
    const dest = path.join(hooksDir, path.basename(monitorFile));
    settings.hooks.PostToolUse = settings.hooks.PostToolUse || [];
    const entry = {
      matcher: "",
      hooks: [{ type: "command", command: `node "${dest}"` }],
    };
    const existing = settings.hooks.PostToolUse.some((h) =>
      h.hooks?.some((hk) => hk.command?.includes(TOOL_NAME))
    );
    if (!existing) settings.hooks.PostToolUse.push(entry);
  }

  ensureDir(path.dirname(settingsPath));
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

/**
 * Remove all go-spec files from a target.
 * Only removes our own files — never touches other tools' config.
 */
function uninstallFromTarget(paths, runtimeKey) {
  const runtime = RUNTIMES[runtimeKey];

  // Remove commands directory (entire gs/ subdirectory is ours)
  removeDirIfExists(paths.commands);
  info(`Removed commands from ${paths.commands}`);

  // Remove only our agents/skills (files prefixed with "gs-")
  // This is safe for both Claude Code (agents/) and Antigravity (skills/)
  if (fs.existsSync(paths.agents)) {
    const ourFiles = fs
      .readdirSync(paths.agents)
      .filter((f) => f.startsWith("gs-"));
    for (const file of ourFiles) {
      removeFileIfExists(path.join(paths.agents, file));
    }
    const label = runtime.agentsSubdir === "skills" ? "skill(s)" : "agent(s)";
    info(`Removed ${ourFiles.length} ${label}`);
  }

  // Hooks only exist for runtimes that support them
  if (runtime.supportsHooks) {
    removeDirIfExists(paths.hooks);
    info(`Removed hooks from ${paths.hooks}`);
    cleanHooksFromSettings(paths.base);
  }
}

/**
 * Remove our hooks from settings.json without touching anything else.
 */
function cleanHooksFromSettings(runtimeBase) {
  const settingsPath = path.join(runtimeBase, "settings.json");
  if (!fs.existsSync(settingsPath)) return;

  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    if (!settings.hooks) return;

    for (const event of ["PreToolUse", "PostToolUse"]) {
      if (!settings.hooks[event]) continue;
      settings.hooks[event] = settings.hooks[event].filter(
        (h) => !h.hooks?.some((hk) => hk.command?.includes(TOOL_NAME))
      );
      if (!settings.hooks[event].length) delete settings.hooks[event];
    }

    if (!Object.keys(settings.hooks).length) delete settings.hooks;
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    info("Cleaned hooks from settings.json");
  } catch {
    warn("Could not clean hooks from settings.json");
  }
}

// ─── Version Detection ────────────────────────────────────────────────────────

function getInstalledVersion(runtimeBase, commandsSubdir = "commands") {
  const versionFile = path.join(runtimeBase, commandsSubdir, COMMAND_PREFIX, ".version");
  if (!fs.existsSync(versionFile)) return null;
  try {
    return fs.readFileSync(versionFile, "utf8").trim();
  } catch {
    return null;
  }
}

function writeVersionMarker(commandsDir) {
  fs.writeFileSync(path.join(commandsDir, ".version"), PKG.version);
}

// ─── Main Flow ────────────────────────────────────────────────────────────────

async function runInteractive(args) {
  const rl = createPrompt();

  try {
    printBanner();

    // Choose runtime
    const runtimeKey = await choose(rl, c("bold", "Which AI runtime?"), [
      { label: "Claude Code", value: "claude" },
      { label: "Antigravity", value: "antigravity" },
    ]);

    const runtime = RUNTIMES[runtimeKey];

    // Show scope options with runtime-specific paths
    const scope = await choose(rl, c("bold", "\nInstall where?"), [
      {
        label: `Global (all projects)  ${runtime.globalDir()}`,
        value: "global",
      },
      {
        label: `Local (this project)   ${runtime.localDir()}`,
        value: "local",
      },
    ]);

    const base = scope === "global" ? runtime.globalDir() : runtime.localDir();
    const targets = getTargetPaths(runtimeKey, scope);

    header("Installation summary");
    info(`Runtime:  ${runtime.name}`);
    info(`Scope:    ${scope}`);
    info(`Location: ${base}`);
    if (!runtime.supportsHooks) {
      info(`Hooks:    not installed (${runtime.name} has no hook system)`);
    }
    log();

    const proceed = await confirm(rl, "Install go-spec?");
    if (!proceed) {
      log("\n  Cancelled.");
      return;
    }

    log();
    runInstall(runtimeKey, targets, base);

    log();
    success(c("bold", `go-spec v${PKG.version} installed for ${runtime.name}!`));
    log();
    printPostInstallInstructions(runtimeKey);
  } finally {
    rl.close();
  }
}

/**
 * Print runtime-specific post-install instructions.
 */
function printPostInstallInstructions(runtimeKey) {
  if (runtimeKey === "antigravity") {
    log(c("dim", "  Start a new project: /gs:init  (in Antigravity Agent Manager)"));
    log(c("dim", "  Map existing code:   /gs:map"));
    log(c("dim", "  Full reference:      /gs:help"));
    log();
    log(c("dim", "  Note: Hooks are not installed — Antigravity has no hook system."));
    log(c("dim", "  Context monitoring and statusline are unavailable in Antigravity."));
  } else {
    log(c("dim", "  Start a new project: /gs:init"));
    log(c("dim", "  Map existing code:   /gs:map"));
    log(c("dim", "  Full reference:      /gs:help"));
  }
  log();
}

function runNonInteractive(args) {
  const { runtime: runtimeKey, scope, uninstall } = args;

  if (!runtimeKey || !scope) {
    error("Non-interactive mode requires a runtime flag (--claude, --antigravity) and --global or --local");
    process.exit(1);
  }

  if (!RUNTIMES[runtimeKey]) {
    error(`Unknown runtime: --${runtimeKey}. Supported: ${Object.keys(RUNTIMES).map(k => `--${k}`).join(", ")}`);
    process.exit(1);
  }

  const runtime = RUNTIMES[runtimeKey];
  const base = scope === "global" ? runtime.globalDir() : runtime.localDir();
  const targets = getTargetPaths(runtimeKey, scope);

  printBanner();

  if (uninstall) {
    header(`Uninstalling go-spec from ${runtime.name}…`);
    uninstallFromTarget(targets, runtimeKey);
    log();
    success("go-spec removed.");
    return;
  }

  runInstall(runtimeKey, targets, base);
  log();
  success(`go-spec v${PKG.version} installed for ${runtime.name}!`);
  log();
  printPostInstallInstructions(runtimeKey);
}

function runInstall(runtimeKey, targets, base) {
  header("Installing…");

  const cmdCount = installCommands(targets.commands);
  writeVersionMarker(targets.commands);
  success(`${cmdCount} commands → ${targets.commands}`);

  const runtime = RUNTIMES[runtimeKey];

  if (runtime.supportsAgents) {
    const agentCount = installAgents(targets.agents);
    success(`${agentCount} agents → ${targets.agents}`);
  }

  if (runtime.supportsHooks) {
    const hookCount = installHooks(targets.hooks, base);
    success(`${hookCount} hooks → ${targets.hooks}`);
  }
}

// ─── Entry Point ──────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv);

  if (args.version) {
    console.log(PKG.version);
    return;
  }

  if (args.help) {
    printBanner();
    log("Usage:");
    log("  npx go-spec@latest                              Interactive setup");
    log("  npx go-spec --claude --global                   Claude Code, global");
    log("  npx go-spec --claude --local                    Claude Code, local");
    log("  npx go-spec --antigravity --local               Antigravity, project-local (.agent/)");
    log("  npx go-spec --antigravity --global              Antigravity, global (~/.gemini/antigravity/)");
    log("  npx go-spec --claude --global --uninstall       Uninstall Claude Code");
    log("  npx go-spec --antigravity --local --uninstall   Uninstall Antigravity");
    log();
    log("Runtimes:");
    log("  --claude        Claude Code — installs commands, agents, and hooks");
    log("  --antigravity   Antigravity — installs workflows and skills (no hooks)");
    log();
    return;
  }

  const isNonInteractive = args.runtime && args.scope;

  if (isNonInteractive || args.uninstall) {
    runNonInteractive(args);
  } else {
    await runInteractive(args);
  }
}

main().catch((err) => {
  console.error(`\n  Fatal error: ${err.message}`);
  process.exit(1);
});
