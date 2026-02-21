# Project State

## Active Work

| Task # | Description | Developer | Branch | Status |
|--------|-------------|-----------|--------|--------|
| — | — | — | — | — |

## Recently Completed

| Task # | Description | Developer | Date |
|--------|-------------|-----------|------|
| — | v2.0 revamp — stripped to 3 workflows | sharvy | 2026-02-23 |

## Established Decisions

### Tech Stack
- **Language:** JavaScript (Node.js ≥18)
- **Distribution:** npm package via npx
- **Commands/Agents:** Markdown files (no application logic)
- **Hooks:** JavaScript (Claude Code lifecycle hooks)
- **Tests:** Node.js built-in assert (37 tests)

### Patterns
- Commands are markdown instruction files — all logic is AI-interpreted
- Agents run in fresh context windows — all state persisted to .spec/ files
- Atomic git commits per task — one commit = one rollback unit

### Key Conventions
- Commands in commands/gs/, agents in agents/, templates in templates/
- .spec/ committed to git — shared team AI brain
- STATE.md updated by commands after every significant action

## Open Blockers

- None

## Captured Ideas

See `.spec/todos/pending/` — run `/gs:todos` to review.
