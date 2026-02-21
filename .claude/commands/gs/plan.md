# /gs:plan [phase-number] [--skip-research] [--skip-check] — Plan a Phase

Research the implementation approach and create detailed execution plans for a phase.
Plans are the precise specifications that executor agents follow to build the code.

---

## Flags

- `--skip-research` — Skip the research step (use if research was done before or tech is well-understood)
- `--skip-check` — Skip plan quality review (faster, but plans may have issues)

---

## Process

### Step 1: Load State

Read:
- `.spec/config.json` — workflow settings
- `.spec/ROADMAP.md` — phase goal and success criteria
- `.spec/STATE.md` — established decisions and patterns
- `.spec/phases/NN-[phase]/NN-CONTEXT.md` — design decisions (if exists)

Print:
```
Planning Phase [N]: [Phase Name]
Goal: [phase goal]
```

Check: Does this phase have existing plans?
- If yes: "Plans already exist for Phase [N]. Recreate them? (This will delete existing plans.)"

### Step 2: Research (Unless --skip-research)

Check `config.json` → `workflow.research`. If false or `--skip-research` flag: skip to Step 3.

Otherwise, spawn `gs-phase-researcher` agent with:
- Phase number and name
- Phase goal and success criteria
- Contents of CONTEXT.md (if exists)
- Project tech stack from STATE.md

Wait for completion. The agent produces `.spec/phases/NN-[phase]/NN-RESEARCH.md`.

Print: "Research complete. Key findings: [top 3 findings from RESEARCH.md]"

### Step 3: Create Plans

Spawn `gs-planner` agent with access to:
- Phase goal and success criteria
- `NN-CONTEXT.md` (design decisions)
- `NN-RESEARCH.md` (technical findings, if produced)
- `.spec/STATE.md`
- The current codebase (via Glob/Grep access)

The planner produces 2–5 plan files in `.spec/phases/NN-[phase]/`.

After completion, print a plan summary:
```
Plans created:
  01-01-PLAN.md — [plan name] (Wave 1)
  01-02-PLAN.md — [plan name] (Wave 1)
  01-03-PLAN.md — [plan name] (Wave 2, depends on 01-01)
```

If `config.json` → `gates.confirm_phases` is true: Show plan summaries and ask for confirmation before quality review.

### Step 4: Quality Review (Unless --skip-check)

Check `config.json` → `workflow.plan_check`. If false or `--skip-check` flag: skip to Step 5.

Spawn `gs-plan-checker` with access to all plan files and the existing codebase.

**Review loop (max 3 iterations):**
1. Plan checker produces verdict (PASS or REVISE with specific feedback)
2. If PASS: proceed to Step 5
3. If REVISE: spawn `gs-planner` again with the feedback to fix specific issues
4. Repeat until PASS or 3 iterations exhausted

If 3 iterations exhausted without PASS:
```
⚠ Plans could not be fully verified after 3 revision cycles.
Issues found: [list issues]
Options:
  1. Proceed anyway (plans may have problems)
  2. Review plans manually and fix issues
  3. Restart planning with /gs:plan [N]
```

### Step 5: Finalize

If `config.json` → `gates.confirm_phases` is true: Present final plans and ask:
"Plans are ready for Phase [N]. Proceed, or make changes first?"

Commit all planning artifacts:
```
git add .spec/phases/NN-[phase]/
git commit -m "go-spec: phase [N] plans ready"
```

Print:
```
Phase [N] ready for execution.

Plans:
  01-01-PLAN.md — [name] (Wave 1)
  01-02-PLAN.md — [name] (Wave 1)
  01-03-PLAN.md — [name] (Wave 2)

Next:
  /gs:run [N]   — Execute the plans
```

---

## Wave Execution Preview

Explain the wave structure to the user so they understand what `/gs:run` will do:

Wave 1 plans execute in parallel. Wave 2 plans execute after all Wave 1 plans complete. And so on.

---

## When Plans Already Exist

If plans exist but haven't been executed (no SUMMARY.md files), offer:
1. View existing plans with `/gs:phase-notes [N]`
2. Recreate plans (confirm before deleting)
3. Proceed to execution with `/gs:run [N]`
