# /gs:resume — Resume Work from a Previous Session

Quickly re-orient yourself after a break and determine exactly where to pick up.
go-spec maintains enough state in `.spec/` to always know where you are.

---

## Process

### Step 1: Load State

Read:
- `.spec/STATE.md` — current position, last action, open items
- `.spec/ROADMAP.md` — which phases are complete, in progress, not started
- Most recent SUMMARY.md files (last 3) to understand recent execution

### Step 2: Reconstruct Context

Build a clear picture of:
1. **What was completed** — phases, plans, and quick tasks since last session
2. **What's in progress** — any partial work (plans started but not finished)
3. **What's next** — the logical next action
4. **Open items** — blockers, todos, pending decisions

### Step 3: Check for Incomplete Work

Look for signs of incomplete work:
- PLAN.md files with no corresponding SUMMARY.md (plan created, not executed)
- SUMMARY.md files with status "PARTIAL" or "BLOCKED"
- VERIFICATION.md files with status "FAIL" and fix plans not yet run
- A PAUSE.md handoff file in `.spec/`

If incomplete work is found, surface it prominently.

### Step 4: Print Resume Briefing

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Resuming: [Project Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Since your last session:
  [Summary of what was completed]

Current position:
  [Phase N, Plan N, or "between phases"]

[If there's a PAUSE.md handoff:]
Handoff notes:
  [Contents of PAUSE.md]

What needs attention:
  [BLOCKED or PARTIAL work, if any]

Ready to continue:
  [Suggested next command]
```

### Step 5: Offer Next Action

Based on state, offer the specific next command:
- "To continue Phase [N] execution: `/gs:run [N] --plan [NN-PP]`"
- "To start planning Phase [N]: `/gs:plan [N]`"
- "To run verification on Phase [N]: `/gs:verify [N]`"

---

## Handoff Notes

If `.spec/PAUSE.md` exists (created by `/gs:pause`), display it prominently.
After the user acknowledges the handoff, archive the PAUSE.md:
```
.spec/PAUSE.md → .spec/milestones/[current]/PAUSE-[timestamp].md
```
