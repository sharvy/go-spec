# Project: go-spec v1.x

## Vision
Polish and ship the v1.0.x release of go-spec: commit resolved bug fixes,
clean up git history, and add a cancel command for in-progress workflows.

## Goals
- Ship all existing fixes as a clean, committed release
- Remove machine-specific config from git history
- Give users a safe way to abort multi-step commands mid-flow

## Non-Goals (v1.x)
- New workflow commands beyond /gs:cancel
- Architectural changes
- Documentation overhaul

## Constraints
- **Stack:** Node.js ≥ 18, zero dependencies, npm distribution
- **Integrations:** npm registry (publish), Claude Code runtime
- **Hard constraints:** Must not break existing installs

## Risks
- git history rewrite (.claude/settings.json removal) may require force-push if others have cloned the repo

## Success in v1.x
All fixes committed and tagged, /gs:cancel implemented and documented,
dual config artifact purged from git history.
