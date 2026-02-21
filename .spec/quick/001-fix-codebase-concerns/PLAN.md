# Quick Task: Fix Codebase Concerns
**Source:** .spec/codebase/CONCERNS.md

## Tasks

1. Remove unused `execSync` import from `bin/install.js`
2. Fix `getInstalledVersion()` to accept runtime's `commandsSubdir` (not hardcoded "commands")
3. Add workspace-isolated temp file paths to hooks (prevent cross-project state collision)
4. Add `GO_SPEC_DEBUG` env var support for debug logging in silent catch blocks
5. Add `.claude/settings.json` to `.gitignore` (contains machine-specific absolute paths)
6. Create `tests/` with unit tests for `isNewer()`, `parseArgs()`, and context threshold logic

## Out of Scope
- Placeholder URLs in package.json — already fixed (`sharvy/go-spec` present, not `yourusername`)
