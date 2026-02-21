# Code Conventions

## File Naming
- Commands: `kebab-case.md` (e.g., `add-phase.md`, `milestone-start.md`)
- Agents: `gs-kebab-case.md` with `gs-` prefix (e.g., `gs-executor.md`, `gs-plan-checker.md`)
- Hooks: `gs-kebab-case.js` with `gs-` prefix (e.g., `gs-statusline.js`)
- Templates: `UPPER_CASE.md` or `lowercase.json` (e.g., `PROJECT.md`, `config.json`)

## Command File Structure
Every command file follows this pattern:
```markdown
# /gs:name — Short Description

[Brief explanation of what the command does]

---

## [When to Use / Flags / Pre-conditions]

## Process
### Step 1: [name]
### Step 2: [name]
...

## [Additional sections as needed]
```
Key patterns: steps are numbered, user confirmations at key gates, git commits at end, summary printed at end.

## Agent File Structure
Every agent uses YAML frontmatter + XML-style sections:
```markdown
---
name: gs-agent-name
description: ...
tools: Read, Write, Edit, Bash, Glob, Grep
color: [color]
---

<role>...</role>
<process>
  <step name="...">...</step>
</process>
<output_formats>...</output_formats>
<principles>...</principles>
```

## JavaScript Style
- `"use strict";` at top of every file
- CommonJS (`require` / `module.exports`)
- Section headers using `// ─── Section Name ───` with box-drawing characters
- ANSI color helpers via a `colors` object and `c(color, text)` helper
- JSDoc comments with `/** ... */` for public functions
- Arrow functions for callbacks, regular `function` for named exports
- Consistent error handling: `try { ... } catch { }` with empty catch blocks for non-fatal errors (no error variable binding)
- All hooks read from stdin and write JSON to stdout

## Error Handling Pattern
- Hooks: silently swallow errors — must never break the AI workflow
- Installer: `error()` helper prints `✗` prefix, `process.exit(1)` on fatal errors
- Agents: report "BLOCKED" status in SUMMARY.md instead of crashing
- Commands: present options to the user when something goes wrong

## Configuration Access
- `config.json` in `.spec/` — read by commands at runtime (not by JS code)
- `settings.json` in `.claude/` — hook registration, edited by installer
- Version detection via `.version` file in commands directory
- State via `STATE.md` — read by hooks for status display, updated by commands

## Git Conventions
- Commands commit to git at the end of workflows: `git add .spec/ && git commit -m "go-spec: [action]"`
- Executors commit per task: `git commit -m "plan [NN-PP] task [N]: [task name]"`
- No branching by default (`git.branching: "none"`), optional phase/milestone branches

## Naming Patterns
- Command prefix: `gs` (all commands are `/gs:*`)
- Tool name constant: `TOOL_NAME = "go-spec"`
- Agent names all start with `gs-`
- Requirement IDs: `REQ-001`, `REQ-002`, etc.
- Phase numbering: `01`, `02`, etc.
- Plan numbering: `NN-PP` (e.g., `01-01`, `01-02`)
