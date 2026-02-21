# /gs:phase-notes [phase-number] — View Phase Assumptions and Notes

View what go-spec knows and assumes about a phase before execution.
Useful for reviewing plans, checking assumptions, and understanding what's coming.

---

## Process

### Step 1: Load Phase Artifacts

Read all files in `.spec/phases/NN-[phase]/`:
- `NN-CONTEXT.md` — design decisions (if exists)
- `NN-RESEARCH.md` — technical findings (if exists)
- `NN-NN-PLAN.md` — all plan files (if exist)

Also read the phase entry from `.spec/ROADMAP.md`.

### Step 2: Print Summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Phase [N]: [Phase Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Goal: [from ROADMAP.md]

Requirements covered:
  [REQ-XXX]: [requirement]
  [REQ-YYY]: [requirement]

Success criteria:
  [ ] [criterion 1]
  [ ] [criterion 2]

Status: [Not started / Planned / In progress / Complete]
```

### Step 3: Plans Summary (If Plans Exist)

```
Plans:
  Wave 1 (parallel):
    [NN-01-PLAN.md] — [plan name]
      Tasks: [N]
      Files touched: [list of key files]

    [NN-02-PLAN.md] — [plan name]
      Tasks: [N]
      Files touched: [list of key files]

  Wave 2:
    [NN-03-PLAN.md] — [plan name]
      Tasks: [N]
      Depends on: 01-01, 01-02
```

### Step 4: Key Assumptions

Summarize key assumptions the plans are making:
- Technical choices (library, pattern, approach)
- File structure assumptions
- Integration assumptions (what it expects from previous phases)

### Step 5: Offer Actions

```
Options:
  /gs:discuss [N]   — Add or update design context
  /gs:plan [N]      — (Re)create plans
  /gs:run [N]       — Execute plans
```
