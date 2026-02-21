# /gs:status — Project Progress Overview

Show where you are, what's done, what's next, and the overall project health.

---

## Process

### Step 1: Validate

Check that `.spec/PROJECT.md` exists. If not:
```
No go-spec project found in this directory.
Run /gs:init to start a new project, or /gs:map to analyze existing code.
```

### Step 2: Read State

Read:
- `.spec/PROJECT.md` — project name and vision
- `.spec/ROADMAP.md` — all phases and their status
- `.spec/STATE.md` — current position and blockers
- `.spec/config.json` — configuration
- Count files in `.spec/quick/`, `.spec/todos/pending/`, `.spec/debug/`

### Step 3: Render Status

Print a formatted project status report:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [Project Name]
  [One-line vision from PROJECT.md]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Milestone: [current milestone name]

Progress
  ████████░░░░░░░░  Phase 3 of 6 complete

Phases:
  ✓  Phase 1: Foundation              complete
  ✓  Phase 2: Core features           complete
  →  Phase 3: User management         in progress
     Phase 4: API                     not started
     Phase 5: Frontend                not started
     Phase 6: Polish & deploy         not started

Current Position
  [Contents of STATE.md "Current Position" section]

What's Next
  [Derived from roadmap — next action to take]

Quick Tasks: [N] completed
Todos: [N] pending
Active debug sessions: [N]

Config
  Mode: [interactive/yolo]
  Model profile: [quality/balanced/budget]
  Research: [on/off]  Plan check: [on/off]  Verify: [on/off]
```

### Step 4: Suggested Next Command

Based on current state, suggest the most logical next command:

| Current state | Suggestion |
|---------------|-----------|
| No phases planned | `/gs:plan 1` |
| Phase N planned, not executed | `/gs:run [N]` |
| Phase N in progress | `/gs:run [N] --plan [current plan]` |
| Phase N complete, next phase unplanned | `/gs:discuss [N+1]` or `/gs:plan [N+1]` |
| All phases complete | `/gs:milestone-audit` |
| Blocked (from STATE.md) | Show blocker and options |

Print:
```
Suggested next step:
  [command] — [brief explanation]
```

---

## Phase Status Symbols

| Symbol | Meaning |
|--------|---------|
| ✓ | Complete (all plans executed, verification passed) |
| → | In progress (some plans executed) |
| ◎ | Planned (plans created, not yet executed) |
| ○ | Not started (no plans yet) |
| ⚠ | Needs attention (blocked or verification failed) |
