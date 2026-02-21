# /gs:milestone-audit — Audit Milestone Goal Achievement

Verify that the current milestone has actually achieved its stated goal.
Goes beyond individual phase verification to check the whole system.

---

## Process

### Step 1: Load Milestone State

Read:
- `.spec/ROADMAP.md` — milestone goal and all phase success criteria
- All phase VERIFICATION.md files — what was verified phase by phase
- `.spec/STATE.md` — current state and known gaps

Print:
```
Auditing Milestone: [name]
Goal: [milestone goal]
Phases: [N] complete, [N] in progress, [N] not started
```

### Step 2: Spawn Integration Checker

Spawn `gs-integration-checker` with access to:
- All phase summaries and verifications
- The full codebase
- The milestone goal

The checker:
1. Maps all cross-phase integration points
2. Verifies contracts between phases
3. Traces at least one complete end-to-end user flow
4. Identifies broken connections

### Step 3: Goal Achievement Check

Independently check: "Given everything built, is the milestone goal achieved?"

For each goal statement:
- Derive observable proofs (like gs-verifier does)
- Check each proof against the actual system

### Step 4: Present Audit Results

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Milestone Audit: [name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Goal: [milestone goal]
Result: ACHIEVED / PARTIALLY ACHIEVED / NOT ACHIEVED

Phase Results:
  Phase 1: ✓ All criteria verified
  Phase 2: ✓ All criteria verified
  Phase 3: ⚠ 1 criterion unverified

Integration:
  [N] integration points checked
  [N] CONNECTED, [N] BROKEN

Gaps Found:
  [Gap 1] — Severity: [High/Med/Low]
  [Gap 2] — Severity: [High/Med/Low]
```

### Step 5: Offer Actions

If gaps found:
```
Options:
  1. Create fix phases to close gaps: /gs:gaps
  2. Accept gaps and mark milestone done: /gs:milestone-done
  3. Continue working on current phases
```

If no gaps:
```
Milestone is fully achieved.
Next: /gs:milestone-done — Archive and tag the release
```
