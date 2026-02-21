# /gs:milestone-done — Complete and Archive a Milestone

Mark the current milestone complete, create a release tag, and archive all milestone artifacts.
Run this when all phases are complete and the milestone goal has been achieved.

---

## Process

### Step 1: Validate Readiness

Read `.spec/ROADMAP.md`. Check all phases:

If any phases are incomplete:
```
Not all phases are complete:
  Phase [N]: in progress
  Phase [M]: not started

A milestone should be complete before archiving.
Run /gs:milestone-audit first to check if it's ready.

Proceed anyway? (type "yes" to confirm)
```

### Step 2: Run Integration Check (If Not Already Done)

Check if `.spec/milestones/[name]/INTEGRATION.md` exists.

If not: "Running integration check to verify cross-phase wiring…"
Spawn `gs-integration-checker` with access to all phase summaries and the codebase.

### Step 3: Confirm Milestone Achievement

Show the milestone goal and ask the user:
"Does this milestone achieve its stated goal: [milestone goal]?"

If no: "Please address the gaps before marking the milestone complete."

### Step 4: Archive

Create the milestone archive:
```
.spec/milestones/[name]/
├── ROADMAP.md          ← snapshot of roadmap at completion
├── STATE.md            ← snapshot of state at completion
├── INTEGRATION.md      ← integration check results
├── ACHIEVEMENTS.md     ← what was built (auto-generated)
└── phases/             ← copies of all phase summaries
    ├── 01-SUMMARY.md
    ├── 02-SUMMARY.md
    └── ...
```

Write ACHIEVEMENTS.md from phase summaries:

```markdown
# Milestone [name] — Achievements

**Completed:** [date]
**Phases:** [N]
**Quick tasks:** [N]

## What Was Built
[Synthesized from SUMMARY.md files — what the milestone delivers]

## Requirements Delivered
[List of REQ-IDs that are now complete]

## Deferred
[Requirements moved to next milestone]
```

### Step 5: Git Tag

```
git add .spec/
git commit -m "go-spec: milestone [name] complete"
git tag "v[name]" -m "Milestone [name] complete"
```

Print:
```
✓ Milestone [name] complete and archived.

Tag created: v[name]
Archive: .spec/milestones/[name]/

Next:
  /gs:milestone-start v2.0   — Start the next milestone
```
