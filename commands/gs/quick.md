# /gs:quick [task description] — Implement a Feature or Fix a Bug

The main workhorse for daily development. Takes a task description, creates a focused
plan, and executes it in a fresh context window with atomic git commits.

Good for: new features, bug fixes, refactors, small improvements, scripts.

---

## Usage

```
/gs:quick "add dark mode toggle to settings page"
/gs:quick "fix date formatting bug in reports"
/gs:quick "write seed script for development database"
/gs:quick "add rate limiting to the API"
```

---

## Process

### Step 1: Understand the Task

If no task description was provided, ask: "What would you like to do?"

Read `.spec/STATE.md` to understand:
- Established tech stack and patterns (executors must follow these)
- Active work (avoid conflicts with someone else's in-progress task)
- Key conventions

Explore the relevant area of the codebase using Glob and Read to understand
what already exists before planning.

### Step 2: Create the Task Directory

Generate a slug from the task description (lowercase, hyphenated, max 5 words).

Find the next sequential number by counting directories in `.spec/quick/` and adding 1.
Pad to 3 digits: 001, 002, etc.

```
.spec/quick/[NNN]-[slug]/
```

### Step 3: Write the Plan

Write `.spec/quick/[NNN]-[slug]/PLAN.md`:

```markdown
# Plan: [Task description]

**Task:** [NNN] — [slug]
**Output:** .spec/quick/[NNN]-[slug]/SUMMARY.md

## Goal
[One paragraph: what this plan achieves. Specific enough that an executor
with no prior context could implement it correctly.]

## Tasks

### Task 1: [Name]
**Files:** `[path/to/file]` — [what changes]
**Details:** [Precise description of what to do]
**Done when:** [Specific, verifiable condition]

### Task 2: [Name]
...

## Success Criteria
- [ ] [Verifiable criterion]
- [ ] All existing tests pass

## Deviation Policy
**Auto-fix:** bugs in new code, missing imports, minor type errors — fix and note in SUMMARY
**Stop and report:** architectural changes not in this plan, conflicts with recent commits, ambiguous requirements
```

Keep plans focused: 2–5 tasks. If the task is larger than that, split it into two
sequential `/gs:quick` calls.

### Step 4: Execute

Spawn `gs-executor` with the plan file path.

The executor:
- Reads the plan and STATE.md for established patterns
- Implements each task in order
- Makes one atomic git commit per task
- Writes SUMMARY.md to `.spec/quick/[NNN]-[slug]/SUMMARY.md`

### Step 5: Update STATE.md and Commit

After execution, update `.spec/STATE.md`:
- Move the task to "Recently Completed" if done, or note it as in-progress if PARTIAL/BLOCKED

Commit the spec artifacts:
```
git add .spec/quick/[NNN]-[slug]/
git commit -m "go-spec: [slug]"
```

Print:
```
✓ Done: [task description]

Files: .spec/quick/[NNN]-[slug]/
Summary: [one-line outcome from SUMMARY.md]

Next: /gs:quick "..." for another task, or /gs:pause to hand off
```

If BLOCKED or PARTIAL, surface the exact blocker and suggest what to do next.
