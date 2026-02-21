# /gs:quick [task description] [--full] — Quick Ad-Hoc Task

Execute a focused, ad-hoc task with go-spec guarantees. No phase required.
Good for one-off features, hotfixes, small improvements, and experiments.

---

## Flags

- `--full` — Enable research, plan check, and verification (slower but higher quality)

---

## Default Behavior (No --full)

1. Create a plan for the task
2. Execute the plan
3. *(No research, no plan check, no verification)*

## --full Behavior

1. Research the implementation approach
2. Create and verify a plan
3. Execute the plan
4. Verify the result goal-backward

---

## Process

### Step 1: Understand the Task

If no task description was provided, ask: "What would you like to do?"

Read `.spec/STATE.md` to understand established patterns and current phase context.

Read the current codebase structure (Glob key directories) to understand what exists.

### Step 2: Derive a Slug and Path

Create a slug from the task description (lowercase, hyphenated, max 5 words).

Create the task directory:
```
.spec/quick/[NNN]-[slug]/
```

Where NNN is the next sequential number (count existing quick/ directories + 1).

### Step 3: Research (--full only)

Spawn `gs-phase-researcher` with the task description and current tech stack.
Output: `.spec/quick/[NNN]-[slug]/RESEARCH.md`

### Step 4: Create Plan

Spawn `gs-planner` in "quick mode" with:
- Task description
- Current codebase context
- RESEARCH.md (if produced)
- STATE.md patterns

Quick mode constraints for planner:
- Single plan file (not multiple waves)
- 2–6 tasks maximum
- Focused on exactly what was asked — no scope creep

Output: `.spec/quick/[NNN]-[slug]/PLAN.md`

### Step 5: Plan Check (--full only)

Spawn `gs-plan-checker` to review the plan.
If REVISE: one revision pass (no loop needed for quick tasks).

### Step 6: Execute

Spawn `gs-executor` with the plan.
Output: `.spec/quick/[NNN]-[slug]/SUMMARY.md`

### Step 7: Verify (--full only)

Spawn `gs-verifier` to check the task goal was achieved.

### Step 8: Record and Commit

Update `.spec/STATE.md` — add to "Quick Tasks" section with one-line description.

Commit:
```
git add .spec/quick/[NNN]-[slug]/
git commit -m "go-spec: quick task — [slug]"
```

Print:
```
✓ Done: [task description]

Task files: .spec/quick/[NNN]-[slug]/
Summary: [one-line outcome from SUMMARY.md]
```

---

## Quick vs. Phase: When to Use Which

| Situation | Use |
|-----------|-----|
| Focused change, 1–3 files | `/gs:quick` |
| Hotfix for a bug | `/gs:quick` |
| Adding a small, self-contained feature | `/gs:quick` |
| Work spanning 5+ files or multiple concerns | `/gs:plan` + `/gs:run` |
| Work that must coordinate with ongoing phase work | `/gs:plan` + `/gs:run` |
| Exploratory prototype | `/gs:quick` |

---

## Examples

```
/gs:quick "Add dark mode toggle to the settings page"
/gs:quick "Fix the date formatting bug in reports" --full
/gs:quick "Write a script to seed the development database"
/gs:quick "Add request rate limiting to the API" --full
```
