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

  #001  [feature]  Add CSV export to reports    captured 2026-02-21
  #002  [bug]      Login fails on Safari         captured 2026-02-22
  #003  [idea]     Dark mode                     captured 3 days ago
  #004  [question] How to handle rate limits?    captured 2026-02-20
```

### Step 3: Options

Ask:
```
Options:
  1. Work on a todo now
  2. Convert todos to quick tasks
  3. Delete or defer todos
  4. Done (just reviewing)
```

### Step 4: Work on a Todo

If option 1: Ask "Which todo? (enter number)"

For the selected todo:
- Run through the `/gs:quick` flow with the todo as the task description
- After completing: move the todo file to `.spec/todos/done/`

### Step 5: Batch Convert

If option 2 (convert to quick tasks):
- Select which todos to batch
- Create a `.spec/quick/` plan for each selected todo
- Offer to execute them sequentially with `/gs:quick`

### Step 6: Cleanup

If option 3 (delete or defer):
- For each selected todo:
  - Delete: remove the file
  - Defer: add a "[DEFERRED — reason]" note to the file

---

## Done Todos

Completed todos are kept in `.spec/todos/done/` for reference.
