# /gs:remove-phase [phase-number] — Remove a Future Phase

Remove a planned phase from the roadmap. Only works on phases that have NOT been
executed (no SUMMARY.md files exist). Cannot remove phases with committed code.

---

## Process

### Step 1: Validate

Read `.spec/ROADMAP.md`. Find Phase [N].

Check for execution artifacts:
- Does `.spec/phases/NN-[name]/` contain any SUMMARY.md files?
- If yes: "Phase [N] has been partially or fully executed — it cannot be removed without losing work. Use git to revert commits if you want to undo execution."

If the phase is safe to remove: proceed.

### Step 2: Show Impact

```
Removing Phase [N]: [Name]
Goal: [phase goal]
Plans: [N plans if any exist, else "none"]
Directory: .spec/phases/NN-[name]/

Requirements that would be deferred:
  REQ-XXX: [requirement]
  REQ-YYY: [requirement]

Phases that depend on this:
  Phase [N+1]: [name] — "Depends on Phase N" → will be updated
```

Ask: "Remove Phase [N]? This moves it to ROADMAP.md deferred section."

### Step 3: Remove

1. Move the phase entry in `ROADMAP.md` to a "Deferred" section
2. Delete the phase directory (if no SUMMARY.md files exist)
3. Update any downstream phases that listed this as a dependency

### Step 4: Commit

```
git add .spec/ROADMAP.md
git commit -m "go-spec: remove phase [N] — [name] (deferred)"
```

Print:
```
Phase [N] removed from active roadmap and moved to Deferred.
Requirements REQ-XXX, REQ-YYY are now deferred.
```
