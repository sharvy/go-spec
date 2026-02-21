# /gs:add-phase — Append a Phase to the Roadmap

Add a new phase at the end of the current milestone's roadmap. Use when new requirements
emerge that weren't anticipated during initialization.

---

## Process

### Step 1: Load Roadmap

Read `.spec/ROADMAP.md` and `.spec/REQUIREMENTS.md`.

Show current phases:
```
Current roadmap (Milestone: [name]):
  Phase 1: [name] — ✓ complete
  Phase 2: [name] — ✓ complete
  Phase 3: [name] — in progress
  Phase 4: [name] — not started
```

### Step 2: Define New Phase

Ask:
1. "What is the goal of this new phase?" (one sentence)
2. "What requirements does it cover?" (list or describe)
3. "Does it depend on any existing phases completing first?"
4. "What are 3-5 success criteria for this phase?"

### Step 3: Write Phase Entry

Add to `ROADMAP.md`:

```markdown
### Phase [N]: [Name]
**Goal:** [one sentence]
**Depends on:** Phase [N-1] (if applicable)
**Requirements covered:** [REQ-XXX, ...]

**Success criteria:**
- [ ] [criterion 1]
- [ ] [criterion 2]
- [ ] [criterion 3]

**Status:** Not started
```

Also add to `REQUIREMENTS.md` if new requirements were surfaced.

### Step 4: Create Phase Directory

Create `.spec/phases/NN-[slug]/` directory.

### Step 5: Confirm and Commit

Show the new phase entry. Ask for confirmation.

```
git add .spec/ROADMAP.md .spec/REQUIREMENTS.md .spec/phases/NN-[slug]/
git commit -m "go-spec: add phase [N] — [name]"
```

Print:
```
Phase [N] added to roadmap.
Next: /gs:discuss [N]   — Capture design context
      /gs:plan [N]      — Start planning
```
