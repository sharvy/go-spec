# /gs:discuss [phase-number] — Capture Phase Design Decisions

Capture design decisions, preferences, and context for a phase BEFORE planning begins.
This is an optional but valuable step — decisions made here become the CONTEXT.md that
planners and executors reference throughout the phase.

---

## When to Use This

Use `/gs:discuss` when:
- You have opinions about HOW a feature should work (not just that it should exist)
- You've seen a design you want to replicate or avoid
- You want to influence technical choices before the planner decides
- There are non-obvious constraints planners need to know

Skip it if you have no specific opinions — the planner will make reasonable choices from research.

---

## Process

### Step 1: Load Phase Context

Read:
- `.spec/ROADMAP.md` — find the phase goal and success criteria
- `.spec/STATE.md` — established patterns from previous phases
- `.spec/phases/NN-[phase]/NN-CONTEXT.md` — if it already exists (resuming discussion)

Print a brief summary of the phase:
```
Phase [N]: [Name]
Goal: [phase goal]
Status: [Not started / Planning / In progress]
```

### Step 2: Open Discussion

Start a focused dialogue about this phase. Cover:

**Design preferences:**
- "Do you have a preference for how X should look/work?"
- "Have you seen something similar done well? What did you like about it?"

**Technical decisions:**
- "The research suggests [approach A] or [approach B]. Do you have a preference?"
- "Do you want us to use [library/pattern] here, or are you open to alternatives?"

**Constraints specific to this phase:**
- "Are there any hard constraints I should know about for this phase?"
- "Is there anything from Phase [N-1] that should influence how we approach this?"

**Risks to flag:**
- "Is there anything you're worried about in this phase?"
- "Are there users or systems affected by this that we need to be careful about?"

Keep the conversation focused. 10–20 minutes is ideal. Don't try to plan — that's what `/gs:plan` does.

### Step 3: Write CONTEXT.md

When the discussion is complete, write `.spec/phases/NN-[phase]/NN-CONTEXT.md`:

```markdown
# Phase [N] Context — Design Decisions

## Discussion Summary
[2-3 sentences capturing what was discussed and decided]

## Design Decisions

### [Decision topic 1]
**Decision:** [What was decided]
**Rationale:** [Why — especially if non-obvious]
**Constraints:** [Any hard constraints on implementation]

### [Decision topic 2]
...

## Preferences
- [Preference or style guideline for this phase]
- [Reference to similar work: "Similar to how Phase N handled X"]

## Explicit Non-preferences
- [Approach to avoid and why]

## Open Questions
[Anything undecided that planners should research and decide]
```

### Step 4: Confirm and Save

Show the CONTEXT.md to the user and ask for confirmation or corrections.

Save and commit:
```
git add .spec/phases/NN-[phase]/
git commit -m "go-spec: phase [N] design context"
```

Print:
```
Design context saved for Phase [N].

Next:
  /gs:plan [N]   — Research and create execution plans
```

---

## Notes

- CONTEXT.md is optional. If it doesn't exist when `/gs:plan` runs, planners proceed without it.
- You can run `/gs:discuss` multiple times — it will update CONTEXT.md, not overwrite.
- If plans have already been created, adding CONTEXT.md won't automatically update them.
