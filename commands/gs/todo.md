# /gs:todo — Capture an Idea for Later

Quickly save an idea, feature request, bug, or task to work on later.
Never lose a thought mid-session — capture it and get back to the current task.

---

## Usage

```
/gs:todo
/gs:todo "Add CSV export to the reports page"
/gs:todo "BUG: login fails on Safari"
/gs:todo "IDEA: dark mode"
```

---

## Process

### Step 1: Get the Todo

If a description was provided as an argument: use it.
If not: ask "What would you like to note down?"

### Step 2: Classify (Optional)

Optionally classify the todo:
- **feature** — new capability to add
- **bug** — something that's broken
- **improvement** — make existing thing better
- **idea** — explore this later
- **question** — needs discussion or research

If the description starts with "BUG:", "IDEA:", "FIX:", classify accordingly.
Otherwise, skip classification and let the user mark it if they want.

### Step 3: Write Todo File

Generate a sequential number (count files in `.spec/todos/pending/` + 1).

Write `.spec/todos/pending/[NNN]-[slug].md`:

```markdown
# [Todo description]

**Type:** [feature / bug / improvement / idea / question]
**Captured:** [timestamp]
**During:** [current phase or context from STATE.md]

## Notes
[Space for additional context — optional, can be left empty]
```

### Step 4: Confirm

Print:
```
✓ Todo saved: "[description]"
  View all todos: /gs:todos
```

Do NOT commit individual todo files — they're lightweight notes.
(Todos are committed in batches when acted on.)
