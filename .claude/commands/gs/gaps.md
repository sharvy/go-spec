# /gs:gaps — Plan Work to Close Milestone Audit Gaps

After running `/gs:milestone-audit`, create phases or quick tasks to close the gaps
that were identified between the milestone goal and what was actually built.

---

## Process

### Step 1: Load Audit Results

Read `.spec/milestones/[current]/INTEGRATION.md` or the most recent audit output in STATE.md.

If no audit has been run:
"Run /gs:milestone-audit first to identify gaps."

### Step 2: Categorize Gaps

For each gap, determine:

| Category | Action |
|----------|--------|
| Small, isolated fix (1–3 files) | Create a quick task |
| Feature gap (missing entire capability) | Add a new phase |
| Integration wiring issue | Create a fix plan for relevant phase |
| Out of scope / design decision | Defer to next milestone |

Present categorization to user and confirm approach for each gap.

### Step 3: Create Fix Work

For gaps → quick tasks: Set up `.spec/quick/NNN-fix-[gap]/` directories.
For gaps → phases: Run through `/gs:add-phase` flow for each.
For deferred gaps: Note them in STATE.md "Deferred Items" section.

### Step 4: Prioritize

Ask: "In what order should we address these gaps?"
Order them and note dependencies.

### Step 5: Execute

Offer to immediately execute the fix work:
"Ready to fix [N] gaps. Start now? This will run the quick tasks and/or phase executions."

If yes: Execute in priority order, verifying each fix.

### Step 6: Re-audit

After fixes are complete: "Re-run the milestone audit to confirm gaps are closed? (`/gs:milestone-audit`)"
