# /gs:status — What's Currently In Flight

Show active work, recent completions, open blockers, and team decisions at a glance.

---

## Process

### Step 1: Check for .spec/

If `.spec/STATE.md` does not exist:
```
No go-spec setup found in this directory.

To get started:
  /gs:map    — analyze existing codebase (run once on main, commit .spec/)
  /gs:quick  — start a task without any setup
```

### Step 2: Read State

Read:
- `.spec/STATE.md` — active tasks, decisions, blockers
- `.spec/config.json` — model profile
- Count directories in `.spec/quick/` (total tasks)
- Count files in `.spec/todos/pending/`
- Count directories in `.spec/debug/` excluding `resolved/`

Also scan `.spec/quick/` for any PLAN.md without a corresponding SUMMARY.md
(these are tasks started but not finished).

### Step 3: Render Status

Print a formatted status report:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  go-spec status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Active Work:
  → [NNN] — [task description]  ([developer / branch if known])
  → [NNN] — [task description]  (in progress)

  (from .spec/STATE.md "Active Work" table)

Recently Completed:
  ✓ [NNN] — [task description]   [date]
  ✓ [NNN] — [task description]   [date]

Incomplete (started, not finished):
  ⚠ [NNN] — PLAN.md exists, no SUMMARY.md yet

Open Debug Sessions: [N]
Pending Todos: [N]

Established Decisions:
  [Tech stack summary from STATE.md]
  [Key patterns]

Open Blockers:
  [From STATE.md, or "None"]

Model: [profile from config.json]
```

### Step 4: Suggest Next Action

Based on what's found:

| State | Suggestion |
|-------|-----------|
| No active tasks | `/gs:quick "[task]"` — start something |
| Task in progress (no SUMMARY.md) | `/gs:resume` — pick up the active task |
| Open blockers | Surface each blocker explicitly |
| Open debug sessions | `/gs:debug resume [session-id]` |
| Pending todos | `/gs:todos` — review and act on them |

Print:
```
Suggested next:
  [command] — [reason]
```
