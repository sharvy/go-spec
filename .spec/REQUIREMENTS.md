# Requirements

## In Scope (v1.x)

- **REQ-001:** Commit all resolved fixes (test suite, error handling, temp path isolation, version marker fix) as a clean release commit
  - AC: `npm test` passes with all 37 tests
  - AC: `git status` is clean on main after commit
  - AC: Commit messages clearly label what was fixed

- **REQ-002:** Implement `/gs:cancel` command to safely abort gs:init (and any other in-progress multi-step command)
  - AC: Running /gs:cancel during gs:init stops the flow and removes any partially-written `.spec/` files
  - AC: Running /gs:cancel when nothing is in progress responds gracefully ("Nothing to cancel.")
  - AC: Command is documented in `/gs:help`

## Dropped
- ~~Remove `.claude/settings.json` from git history~~ — not worth the effort

## Deferred (v2+)
- Extending /gs:cancel to /gs:plan, /gs:run, and other multi-step commands
- Antigravity integration tests

## Out of Scope
- New workflow features
- Architectural changes
- Documentation overhaul
