# Summary: Fix Codebase Concerns

All 6 actionable concerns from `.spec/codebase/CONCERNS.md` resolved.

## Changes Made

### 1. Unused Import Removed (`bin/install.js`)
Removed `const { execSync } = require("child_process")` — it was imported but never used.

### 2. Version Marker Mismatch Fixed (`bin/install.js`)
`getInstalledVersion(runtimeBase, commandsSubdir = "commands")` now accepts the runtime's
`commandsSubdir` as a parameter, so it works correctly for Antigravity installs that use
`"workflows"` instead of `"commands"`.

### 3. Workspace-Isolated Temp Paths (`hooks/gs-context-monitor.js`, `hooks/gs-statusline.js`)
Added `findProjectRoot()` and `workspaceHash()` helpers. Temp file names now include an 8-char
hash of the project root: `go-spec-context-{hash}.json`, `go-spec-monitor-state-{hash}.json`.
Both hooks compute the same hash for the same workspace — the bridge file contract is preserved.
The update checker state file remains global (one update check per machine per day is correct).

### 4. Debug Logging for Silent Catch Blocks (all hooks)
Added `debugLog(msg)` to all hooks. When `GO_SPEC_DEBUG=1` is set in the environment, catch
blocks write context to stderr instead of swallowing silently. Hooks still never throw — the
pattern is unchanged for production use.

### 5. `.claude/settings.json` Added to `.gitignore`
The settings file contains machine-specific absolute paths written by the installer and should
not be committed. Also added `.agent/settings.json` for Antigravity installs.

### 6. Test Suite Created (`tests/`)
37 unit tests across 3 files using Node's built-in `assert` module (no test dependencies):
- `tests/isNewer.test.js` — 10 tests for semver comparison edge cases
- `tests/parseArgs.test.js` — 14 tests for CLI argument parsing
- `tests/contextMonitor.test.js` — 13 tests for threshold/cooldown logic

All 37 tests pass. `npm test` runs the suite.

## Skipped
- Placeholder URLs — `package.json` already had `sharvy/go-spec` (concern was pre-publish).
