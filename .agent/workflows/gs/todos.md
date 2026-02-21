# /gs:todos — View and Work on Captured Todos

List all pending todos and optionally convert them into quick tasks or phases.

---

## Process

### Step 1: Load Todos

Read all files in `.spec/todos/pending/`.
Also count files in `.spec/todos/done/`.

If no pending todos:
```
No pending todos.
  Completed: [N] todos
  To capture an idea: /gs:todo "description"
```

### Step 2: Display Todos

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Pending Todos ([N])
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  #001  [feature]  Add CSV export to reports    captured during Phase 3
  #002  [bug]      Login fails on Safari         captured during Phase 3
  #003  [idea]     Dark mode                     captured 3 days ago
  #004  [question] How to handle rate limits?    captured during planning
```

### Step 3: Options

Ask:
```
Options:
  1. Work on a todo now
  2. Convert todos to quick tasks
  3. Move todos to a new phase
  4. Delete or defer todos
  5. Done (just reviewing)
```

### Step 4: Work on a Todo

If option 1: Ask "Which todo? (enter number)"

For the selected todo:
- Ask if they want to work on it now via `/gs:quick` or plan it as a phase
- If quick: run through the `/gs:quick` flow
- If phase: run through the `/gs:add-phase` flow

After completing: move the todo file to `.spec/todos/done/`.

### Step 5: Batch Convert

If option 2 (convert to quick tasks):
- Select which todos to batch
- Create `.spec/quick/` directory for each
- Offer to execute them sequentially

If option 3 (convert to phase):
- Ask for a phase name and goal
- Group selected todos as requirements
- Add phase via `/gs:add-phase` flow

### Step 6: Cleanup

If option 4 (delete or defer):
- For each selected todo:
  - Delete: remove the file
  - Defer: add "[DEFERRED]" tag and add a note why

---

## Done Todos

Completed todos are kept in `.spec/todos/done/` for reference.
They are committed as a batch when the milestone is archived.
