# /gs:pause — Pause Work and Create a Handoff

Create a clean stopping point with a detailed handoff note. Makes it easy to resume
later — even days or weeks later — without losing context.

---

## When to Use

- At the end of a work session
- Before switching to a different project
- Before handing off to someone else
- When you've hit a blocker and need to stop

---

## Process

### Step 1: Capture Current State

Read:
- `.spec/STATE.md`
- `.spec/ROADMAP.md`
- Most recent SUMMARY.md files (last 2–3)
- Any VERIFICATION.md with status FAIL

Also check git status: are there uncommitted changes?

### Step 2: Handle Uncommitted Work

If there are uncommitted changes:
```
You have uncommitted changes:
  [list of modified files]

Options:
  1. Commit them now (recommended)
  2. Stash them
  3. Leave them (not recommended — they won't appear in handoff)
```

If committing: use a clear message like `"go-spec: work in progress — pausing"`

### Step 3: Collect Pause Notes (Optional)

Ask: "Any notes for your future self? (What you were thinking, what to do next, anything to watch out for)"

If provided, incorporate into the handoff.

### Step 4: Write Handoff

Write `.spec/PAUSE.md`:

```markdown
# Handoff — Paused [timestamp]

## Current Position
Phase [N] — [Phase Name]
[Where exactly in the phase: planning / executing / verifying]

## What Was Just Completed
- [Last thing finished]
- [Previous thing]

## What's In Progress
[If mid-execution:]
- Plan [NN-PP] — [status: in progress / blocked at task N]

## What's Next
The immediate next action is:
  [/gs:run [N] --plan [NN-PP] | /gs:plan [N+1] | /gs:verify [N] | ...]

## Blockers
[If any — what's blocking and what's needed to unblock]

## Notes
[Anything the human added in Step 3]
[Any context that would be lost without noting: a design decision made mid-session, a bug discovered, a question to answer]

## Quick Resume
Run `/gs:resume` to restore full context.
```

### Step 5: Update State

Update `.spec/STATE.md` → "Current Position" with the pause point.

Commit:
```
git add .spec/PAUSE.md .spec/STATE.md
git commit -m "go-spec: session paused — [phase N, where]"
```

Print:
```
✓ Session paused. Handoff written to .spec/PAUSE.md

To resume: /gs:resume
```
