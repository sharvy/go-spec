# /gs:milestone-start [name] — Start a New Milestone

Archive the current milestone and begin a fresh one. Use when starting a new version
(v1.0 → v2.0) or a new major iteration of the project.

---

## Process

### Step 1: Check Readiness

Read `.spec/ROADMAP.md`. Are there incomplete phases in the current milestone?

If yes:
```
The current milestone has incomplete phases:
  Phase [N]: [name] — in progress
  Phase [M]: [name] — not started

Options:
  1. Complete remaining phases first (recommended)
  2. Archive milestone as-is (incomplete) and start new one
  3. Cancel
```

### Step 2: Archive Current Milestone

Determine current milestone name from `config.json` or ROADMAP.md.

Create archive directory: `.spec/milestones/[milestone-name]/`

Move:
- Current ROADMAP.md snapshot → `.spec/milestones/[name]/ROADMAP.md`
- Current STATE.md snapshot → `.spec/milestones/[name]/STATE.md`

Commit:
```
git add .spec/milestones/[name]/
git commit -m "go-spec: archive milestone [name]"
git tag "spec/[name]"
```

### Step 3: Initialize New Milestone

Ask:
1. "Name for the new milestone?" (e.g., "v2.0", "beta", "internal-launch")
2. "What is the goal of this milestone in one sentence?"

Update `config.json` → `"current_milestone": "[new name]"`.

Create a fresh ROADMAP.md:

```markdown
# Roadmap: [Project Name]

## Milestone: [new milestone name] — [goal]

[Empty — use /gs:add-phase or re-run /gs:init to populate]
```

### Step 4: Update STATE.md

Reset "Current Position" in STATE.md to the new milestone start.
Preserve the "Decisions" section — carry forward established patterns.

### Step 5: Commit and Print

```
git add .spec/ROADMAP.md .spec/STATE.md .spec/config.json
git commit -m "go-spec: start milestone [new name]"
```

Print:
```
Milestone [new name] started.

Previous milestone [old name] archived in .spec/milestones/[old name]/

Next:
  /gs:add-phase   — Add phases to the new milestone
  /gs:status      — View project state
```
