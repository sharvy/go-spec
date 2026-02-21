# /gs:pause — Stop Cleanly and Create a Handoff

Create a handoff note so you — or a teammate — can pick up exactly where you left off.
Use it at the end of any session, when you're blocked, or before handing work to someone else.

---

## When to Use

- End of your work session
- Before handing off to a teammate
- When you hit a blocker and need to stop
- Before switching to a different branch or project

---

## Process

### Step 1: Capture Current State

Read:
- `.spec/STATE.md` — active tasks, decisions, conventions
- Most recent SUMMARY.md in `.spec/quick/` — what was just done

Check git status: are there uncommitted changes?

### Step 2: Handle Uncommitted Work

If uncommitted changes exist:
```
You have uncommitted changes:
  [list of modified files]

Options:
  1. Commit them now (recommended)
  2. Stash them
  3. Leave them (note: they won't be visible in the handoff)
```

If committing: use a message like `"wip: [what was in progress]"`

### Step 3: Collect Notes (Optional)

Ask: "Any notes for whoever picks this up? (What you were thinking, gotchas, what to try next)"

### Step 4: Write the Handoff

Write `.spec/PAUSE.md`:

```markdown
# Handoff — [timestamp]

## What Was Being Worked On
Task [NNN] — [task description]
Branch: [branch name]

## What's Done
- [Completed task or step]
- [Previous completed step]

## What's In Progress
[Exact state: "Task 2 of 4 — avatar upload. S3 presigned URL written, tests not done."]

## What's Next
[The single most important next action]
[Example: "Finish Task 2 (tests), then Task 3 (wire into the profile endpoint)"]

## Blockers
[Anything that needs to be resolved before work can continue]
[Example: "Need S3_BUCKET_NAME env var from DevOps — staging env only"]

## Notes
[Anything that would be lost without writing it down:
 - Design decision made mid-session
 - Bug discovered but not fixed
 - Something that looks weird but is intentional
 - A question to answer before continuing]

## Resume
Run `/gs:resume` to restore full context.
```

### Step 5: Commit and Push

```
git add .spec/PAUSE.md .spec/STATE.md
git commit -m "go-spec: paused — [task slug]"
git push origin [branch-name]
```

Pushing ensures a teammate can check out the branch and get the full context.

Print:
```
✓ Handoff written to .spec/PAUSE.md and pushed.

Anyone can resume with:
  git checkout [branch]
  /gs:resume
```
