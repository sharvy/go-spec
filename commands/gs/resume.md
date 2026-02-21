# /gs:resume — Pick Up Where You Left Off

Re-orient instantly after a break, or pick up a teammate's in-progress work.
Works whether it's been 10 minutes or 10 days.

---

## Usage

```
/gs:resume
```

Run this at the start of any session, or after checking out a teammate's branch.

---

## Process

### Step 1: Load State

Read:
- `.spec/PAUSE.md` — handoff notes (if exists — created by `/gs:pause`)
- `.spec/STATE.md` — active tasks, established decisions, open blockers
- Most recent SUMMARY.md files in `.spec/quick/` (last 2–3) — recent execution results

Check git status for uncommitted changes.

### Step 2: Reconstruct Context

Build a clear picture of:
1. **What was being worked on** — active task from STATE.md or PAUSE.md
2. **What's done** — completed tasks from SUMMARY.md files
3. **What's in progress** — PLAN.md with no SUMMARY.md, or SUMMARY.md status PARTIAL/BLOCKED
4. **What's next** — the single most important next action
5. **Blockers** — anything preventing progress

### Step 3: Print Resume Briefing

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Resuming work on this branch
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[If PAUSE.md exists, show it in full here]

Active task: [NNN] — [task description]
Branch: [current branch]

What's done:
  ✓ [Completed step or task]
  ✓ [Previous completed step]

What's in progress:
  → [Current step, exact state]

What's next:
  [The single most important next action]

Blockers:
  [Any blockers from PAUSE.md or STATE.md, or "None"]
```

### Step 4: Clean Up Handoff

If `.spec/PAUSE.md` was displayed, delete it — it has been acknowledged:
```
rm .spec/PAUSE.md
```

The handoff is now in the session; no need to keep the file.

### Step 5: Suggest Next Command

Based on state, suggest exactly what to run next:

- Task in progress → `Continue with /gs:quick` or describe next step
- Task blocked → Surface the blocker and what's needed to unblock
- Task complete, no next task → `Run /gs:quick "[next thing]"`
- Debug session open → `Resume with /gs:debug resume [session-id]`
