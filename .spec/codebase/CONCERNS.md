# Concerns & Technical Debt

## ~~No Test Suite~~ — RESOLVED
- **Was:** Zero automated tests.
- **Fix:** `tests/` directory created with 37 unit tests covering `isNewer()`, `parseArgs()`, and context monitor threshold/cooldown logic. Run with `npm test`.

## ~~Unused Import~~ — RESOLVED
- **Was:** `execSync` from `child_process` imported but never used in `bin/install.js`.
- **Fix:** Removed.

## ~~Hardcoded Temp File Paths~~ — RESOLVED
- **Was:** Bridge and state files used `os.tmpdir()` with fixed names, causing cross-workspace state collision when multiple projects ran simultaneously.
- **Fix:** Temp file names now include a workspace hash derived from the project root directory (`go-spec-context-{hash}.json`, `go-spec-monitor-state-{hash}.json`). Both hooks compute the same hash for the same workspace.

## ~~Silent Error Swallowing~~ — RESOLVED
- **Was:** Empty `catch {}` blocks throughout all hooks with no way to debug issues.
- **Fix:** Added `debugLog()` to all hooks. Set `GO_SPEC_DEBUG=1` to have catch blocks write error context to stderr. Hooks still never throw in production.

## ~~Placeholder URLs in package.json~~ — ALREADY RESOLVED
- **Was:** `yourusername` placeholder in `homepage` and `repository.url`.
- **Status:** Already corrected to `sharvy/go-spec` before initial release.

## ~~Dual Config Structure~~ — PARTIALLY RESOLVED
- **Was:** `.claude/settings.json` committed with hardcoded absolute paths to local machine.
- **Fix:** Added `.claude/settings.json` and `.agent/settings.json` to `.gitignore`. Existing committed file should be removed from git history if needed (`git rm --cached .claude/settings.json`).

## ~~Version Marker Mismatch~~ — RESOLVED
- **Was:** `getInstalledVersion()` hardcoded `"commands"` subdir, breaking Antigravity installs that use `"workflows"`.
- **Fix:** `getInstalledVersion(runtimeBase, commandsSubdir = "commands")` now accepts the subdir as a parameter.

## Security Notes
- The tool is local-only — no data transmission to external servers (per `SECURITY.md`)
- The update checker makes a single HTTPS GET to `registry.npmjs.org` — read-only, no auth
- Hook scripts are installed as executable (chmod 755) — normal for CLI tools
- `settings.json` hook registration uses absolute paths, which is expected for global installs but creates machine-specific config

## Performance Notes
- Hooks execute on every tool use (stdin → process → stdout). They're lightweight (~150 lines each) and IO-bound
- Update checker has a 3-second timeout and 24-hour cooldown — minimal impact
- Context monitor reads from a bridge file with a 30-second staleness check — efficient
- Build validation (`scripts/build.js`) is synchronous but only runs pre-publish
