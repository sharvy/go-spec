# /gs:verify [phase-number] — Goal-Backward Verification

Run goal-backward verification on a completed phase. Checks that the phase goal was
actually achieved — not just that tasks were completed.

This command is automatically called at the end of `/gs:run`. Use it standalone to
re-verify, verify after manual fixes, or check a phase that was executed without verification.

---

## What Goal-Backward Means

Traditional verification: "Did we complete the tasks?" → boxes get checked, but goal may not be met.

Goal-backward verification: "What must be TRUE for the goal to be achieved?" → derive observable proofs, then check each one.

Example:
- **Goal**: Users can register and log in
- **Proofs**: POST /auth/register exists, returns 201 with user ID; POST /auth/login returns JWT; JWT contains valid claims; protected routes reject invalid JWTs
- **Check**: Actually verify each proof against the running code

---

## Process

### Step 1: Load Context

Read:
- `.spec/ROADMAP.md` — success criteria for this phase
- `.spec/phases/NN-[phase]/` — all plan and summary files
- Any existing `NN-VERIFICATION.md`

Print:
```
Verifying Phase [N]: [Phase Name]
Success criteria: [N] criteria to verify
```

### Step 2: Run Verifier

Spawn `gs-verifier` agent with full access to:
- Phase success criteria
- All plan and summary files
- The actual codebase (Read, Grep, Glob, Bash access)

The verifier:
1. Derives 2–4 proofs per success criterion
2. Checks each proof against the actual code (and runs commands if applicable)
3. Identifies gaps

### Step 3: Handle Gaps

**If no gaps (PASS):**
```
✓ Phase [N] verification PASSED
  [N] criteria verified
  [N] proofs checked
```

**If minor gaps (PASS WITH NOTES):**
Show notes and ask if user wants to fix them or proceed.

**If critical gaps (FAIL):**
```
✗ Phase [N] verification FAILED
  [N] critical gap(s) found:

  - [Gap 1]: [description]
    Fix plan created: NN-FIX-01-PLAN.md

Options:
  1. Execute fix plans now: /gs:run [N] --plan NN-FIX-01
  2. Review gaps manually
  3. Mark as accepted and continue (not recommended)
```

### Step 4: Update Records

Write/update `.spec/phases/NN-[phase]/NN-VERIFICATION.md`.

Update `.spec/STATE.md` with verification result.

Commit:
```
git add .spec/phases/NN-[phase]/NN-VERIFICATION.md .spec/STATE.md
git commit -m "go-spec: phase [N] verification [pass/fail]"
```

---

## When to Use Standalone

- After fixing bugs discovered during manual testing
- After running a plan with `--no-verify`
- When you want a second verification pass after fix plans executed
- When you've manually edited code and want to confirm the phase goal still holds
