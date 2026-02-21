# Phase 2 Research: /gs:cancel Command

## Context Summary

Phase 2 adds a `commands/gs/cancel.md` markdown prompt file that gives users a safe
abort path during an in-progress /gs:init flow. Because the tool has no runtime process
or daemon, "cancel" means: inspect the filesystem for partial .spec/ artifacts that
/gs:init would have created, remove any that are present, and confirm the result.

---

## Technical Findings

### Auto-discovery: Does cancel.md get picked up automatically?

**Yes.** `bin/install.js` `installCommands()` reads every `.md` file from `commands/gs/`
using `listFiles(dir, '.md')` and copies each one to the target directory. There is no
allowlist. The `package.json` `files` field includes `"commands/"` as a directory glob,
so the new file ships in the npm package automatically. No registration step needed.

---

### File inventory: What does /gs:init write and at which steps?

| Step in init.md | Artifact(s) created |
|---|---|
| Step 4 (Research, optional) | `.spec/research/` directory + `SYNTHESIS.md` |
| Step 5 (Write PROJECT.md) | `.spec/PROJECT.md` |
| Step 6 (Write REQUIREMENTS.md) | `.spec/REQUIREMENTS.md` |
| Step 7 (Create Roadmap) | `.spec/ROADMAP.md` |
| Step 8 (Initialize .spec/) | `.spec/STATE.md`, `.spec/config.json`, `.spec/phases/`, `.spec/quick/`, `.spec/milestones/v1.0/`, `.spec/todos/pending/`, `.spec/todos/done/`, `.spec/debug/resolved/` |

**Key invariant:** Steps 5–7 each require user confirmation before writing. A user who
abandons mid-flow may have PROJECT.md but not REQUIREMENTS.md, etc. `STATE.md` is always
the last meaningful file written by a complete init run (end of Step 8). Its absence
while `PROJECT.md` is present is the strongest signal that init was abandoned.

---

### "Nothing to cancel" detection heuristic

Use filesystem state only (no runtime state exists):

1. **Init incomplete:** `.spec/PROJECT.md` exists AND `.spec/STATE.md` does NOT → partial init, offer cleanup
2. **No .spec/:** Directory doesn't exist → nothing to cancel
3. **Init complete:** Both `PROJECT.md` AND `STATE.md` exist → "Nothing to cancel. /gs:init completed. Use /gs:status."

Scope: init only. Do not attempt to detect in-progress plan/run flows (out of scope for v1.x per STATE.md decisions log).

---

### Artifacts to clean up from a partial init

Remove individually (do NOT `rm -rf .spec/`):
- `.spec/PROJECT.md`
- `.spec/REQUIREMENTS.md` (if present)
- `.spec/ROADMAP.md` (if present)
- `.spec/research/` (if present — from optional Step 4)
- Scaffolding directories from Step 8 if they are empty: `.spec/phases/`, `.spec/quick/`, `.spec/milestones/`, `.spec/todos/`, `.spec/debug/`
- `.spec/config.json` (if present)

Do NOT remove `.spec/` itself — user may have pre-existing content (e.g., from /gs:map).
No git operations needed — a cancelled init never reaches the commit at the end of Step 8.

---

### Command file structure

Follow `pause.md` / `resume.md` as the closest structural analogs (session-management commands). Key style rules:
- `##` for top-level sections, `###` for numbered steps
- Instructions as direct imperatives: "Read:", "Check:", "Print:"
- User output in fenced code blocks
- Conditional branches: "If X: [action]"
- Final step prints a clear confirmation summary
- Ask for confirmation before deleting anything

---

### help.md integration

Add one row to the "Session Management" table in `commands/gs/help.md`:

```markdown
| `/gs:cancel` | Abort an in-progress /gs:init and remove partial artifacts |
```

No other sections need changes.

---

### Test impact

Zero. The three test files test pure JS functions and do not enumerate `commands/gs/` or
validate command file contents. Adding `cancel.md` is invisible to the test suite.

---

## What to Avoid

- Removing `.spec/` entirely — too destructive
- Detecting in-progress /gs:plan or /gs:run — out of scope for v1.x
- Writing a lock file or session marker — the project has no runtime state by design
- Calling git to undo anything — a mid-flight cancel means no commit was made
- Using `.spec/` existence alone as the "in progress" signal — it may exist from a completed prior init
