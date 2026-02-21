# /gs:run [phase-number] [--plan NN] [--wave N] — Execute a Phase

Execute all plans for a phase using wave-based parallel execution. Each plan runs in
a fresh context window via a dedicated gs-executor agent.

---

## Flags

- `--plan NN` — Execute only a specific plan (e.g., `--plan 01-02`)
- `--wave N` — Execute only a specific wave number
- `--no-verify` — Skip goal-backward verification after execution

---

## Process

### Step 1: Load Phase Plans

Read all PLAN.md files from `.spec/phases/NN-[phase]/`.

Validate:
- Plans exist (if not: "No plans found. Run `/gs:plan [N]` first.")
- All pre-conditions are met (check referenced SUMMARY.md files from dependencies)

Build the execution order:
```
Wave 1: [01-01-PLAN.md, 01-02-PLAN.md]  ← parallel
Wave 2: [01-03-PLAN.md]                  ← waits for Wave 1
Wave 3: [01-04-PLAN.md]                  ← waits for Wave 2
```

Print the execution plan and confirm if `config.json → gates.confirm_phases` is true.

### Step 2: Git Branch (If Configured)

Check `config.json → git.branching`:
- `"phase"` → create `spec/phase-[N]-[slug]` branch
- `"milestone"` → ensure milestone branch is checked out
- `"none"` → stay on current branch

### Step 3: Execute Waves

For each wave in order:

**Execute all plans in this wave in parallel** (using Task tool):

For each plan in the wave:
1. Spawn `gs-executor` agent with:
   - The plan file contents
   - Project context (PROJECT.md, STATE.md)
   - Access to the codebase
2. The executor implements the plan, making atomic commits per task
3. The executor produces a SUMMARY.md on completion

Wait for ALL plans in the wave to complete before starting the next wave.

**After each wave:**
- Read all SUMMARY.md files from this wave
- Check for BLOCKED or PARTIAL statuses
- If any plan is blocked:
  ```
  ⚠ Plan [NN-PP] is blocked:
  [Reason from SUMMARY.md]

  Options:
    1. Fix the issue and re-run this plan: /gs:run [N] --plan [NN-PP]
    2. Skip this plan (use with caution)
    3. Abort phase execution
  ```

**Checkpoint detection:**
Some plans may produce checkpoints requiring human input. If a SUMMARY.md contains a `## Checkpoint` section, pause and show the user:
```
[Plan NN-PP] requires your input:
[Checkpoint message]
```

Wait for response before continuing.

### Step 4: Verification (Unless --no-verify)

Check `config.json → workflow.verifier`. If false or `--no-verify` flag: skip.

Spawn `gs-verifier` agent with:
- All plan files
- All SUMMARY.md files from this phase
- Phase success criteria from ROADMAP.md
- Access to the actual codebase

The verifier produces `.spec/phases/NN-[phase]/NN-VERIFICATION.md`.

**If verifier finds gaps:**
```
Verification found [N] gap(s):

Critical:
  [gap description] — Fix plan created: NN-FIX-01-PLAN.md

Options:
  1. Run fix plans now (recommended)
  2. Review gaps manually
  3. Accept as-is and continue
```

If running fix plans: execute them using the same wave process.

### Step 5: Update State

Update `.spec/STATE.md`:
- Mark phase as complete
- Record key decisions made during execution (from SUMMARY.md deviations)
- Update "Current Position"

Update `.spec/ROADMAP.md`:
- Mark phase success criteria that are now verified

Commit:
```
git add .spec/
git commit -m "go-spec: phase [N] complete"
```

### Step 6: Summary

```
Phase [N] Complete!

  Plans executed: [N]
  Tasks completed: [N]
  Deviations: [N] (see SUMMARY files for details)
  Verification: PASS / PASS WITH NOTES / GAPS FIXED

Next:
  /gs:run [N+1]       — Start next phase
  /gs:status          — See full project progress
  /gs:milestone-audit — Audit the milestone (if last phase)
```

---

## Handling Failed Plans

A plan can fail for two reasons:

1. **Executor error**: The agent encountered something it couldn't handle → check SUMMARY.md for "BLOCKED" status and specific reason
2. **Pre-condition not met**: A dependency wasn't satisfied → check that the dependent plan's SUMMARY.md exists and has status COMPLETE

In both cases, fix the issue and rerun with `--plan`:
```
/gs:run [N] --plan [NN-PP]
```
