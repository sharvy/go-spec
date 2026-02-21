# Testing

## Framework & Runner
- **No test framework installed** — zero devDependencies in `package.json`
- **No test script** in `package.json` (scripts: `install-local`, `install-global`, `uninstall-global`)
- **No test files** found anywhere in the repository

## Validation Script
- `scripts/build.js` serves as a structural validation tool (not a test suite)
- Checks that all 40+ expected files exist and are non-empty
- Run manually before publishing; exits with code 1 on failure
- Coverage: existence checks only — no behavioral or logic testing

## What's Tested
- File existence across all expected commands, agents, hooks, and templates (via `build.js`)

## What's Not Tested
- Installer logic (`bin/install.js`) — argument parsing, file copying, settings.json modification, uninstall cleanup
- Hook behavior — stdin/stdout JSON protocol, threshold logic, cooldown state management, bridge file I/O
- Update checker — semver comparison (`isNewer`), npm registry fetch, state persistence
- Statusline rendering — bar generation, path shortening, task reading from `.spec/STATE.md`
- Command markdown correctness — no validation that instructions are internally consistent
- Agent markdown correctness — no validation of frontmatter or section structure
- Multi-runtime support — no integration tests for Claude Code vs Antigravity path differences
- Edge cases — missing directories, corrupt JSON, permission errors, concurrent hook execution

## Running Validation
```bash
node scripts/build.js
```

## Test Coverage
- **0%** functional/behavioral test coverage
- **Structural coverage** via build.js: verifies all expected files exist
