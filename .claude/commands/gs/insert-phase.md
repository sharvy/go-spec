# /gs:insert-phase [position] — Insert an Urgent Phase

Insert a new phase at a specific position in the roadmap. The inserted phase gets
a decimal number (e.g., inserting between Phase 2 and Phase 3 creates Phase 2.5).
This avoids renumbering existing phases and their artifacts.

---

## When to Use

- Urgent work that must happen before a planned phase
- A dependency that was discovered mid-project
- A hotfix phase that must precede existing Phase N

---

## Process

### Step 1: Load Roadmap

Show current phases and ask where to insert:
```
Where should the new phase go?
  After Phase 1 (becomes Phase 1.5)
  After Phase 2 (becomes Phase 2.5) ← current phase
  After Phase 3 (becomes Phase 3.5)
```

### Step 2: Define Phase

Ask:
1. "What is the goal of this phase?" (one sentence)
2. "Why does it need to happen before Phase [N+1]?"
3. "What are 2-4 success criteria?"

### Step 3: Assign Decimal Number

If inserting between Phase 2 and Phase 3:
- New phase number: 2.5
- Directory: `.spec/phases/02.5-[slug]/`
- File prefix: `02.5-`

If a 2.5 already exists, use 2.1, 2.2, etc.

### Step 4: Update Roadmap

Add the new phase entry in the correct position in `ROADMAP.md`.
Update the "Depends on" field of Phase [N+1] if needed.

### Step 5: Confirm and Commit

Show the updated roadmap section. Confirm with user.

```
git add .spec/ROADMAP.md .spec/phases/[N.decimal]-[slug]/
git commit -m "go-spec: insert phase [N.decimal] — [name]"
```

Print:
```
Phase [N.decimal] inserted.
Next: /gs:plan [N.decimal]
```
