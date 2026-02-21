# /gs:map — Analyze an Existing Codebase

Analyze an existing project's codebase and produce structured documentation in `.spec/codebase/`.
Run this before `/gs:init` to give go-spec full context about the code it will be working with.

---

## When to Use

- First-time setup: run once on main and commit `.spec/codebase/` so the whole team shares it
- After a major refactor that significantly changed the project's structure
- Onboarding to a codebase you didn't write

---

## Process

### Step 1: Pre-check

Check if `.spec/codebase/` already exists with content.
If yes:
```
A codebase map already exists (last generated: [date]).
Options:
  1. Regenerate (replace existing map)
  2. Update specific sections
  3. View existing map
```

### Step 2: Discover Scope

Quick inventory of the codebase:
- Count files by type (`.ts`, `.py`, `.go`, etc.)
- Identify top-level directories
- Find package managers / build files

Print:
```
Analyzing: [project path]
Found: [N] files ([breakdown by type])
Structure: [top-level dirs]
```

### Step 3: Parallel Analysis

Spawn 6 `gs-codebase-mapper` agents in parallel, each assigned a dimension:

1. **stack** → `STACK.md` — languages, frameworks, tooling, versions
2. **architecture** → `ARCHITECTURE.md` — structure, patterns, data flow
3. **conventions** → `CONVENTIONS.md` — naming, style, repeated patterns
4. **integrations** → `INTEGRATIONS.md` — external services, APIs, databases
5. **testing** → `TESTING.md` — test frameworks, coverage, what's tested
6. **concerns** → `CONCERNS.md` — debt, security, performance, inconsistencies

Each agent works independently in a fresh context. Wait for all to complete.

### Step 4: Write Index

Write `.spec/codebase/INDEX.md`:

```markdown
# Codebase Map

Generated: [timestamp]
Project: [name]

## Overview
[2-3 sentences summarizing the codebase]

## Documents
- [STACK.md](STACK.md) — Technology choices and tooling
- [ARCHITECTURE.md](ARCHITECTURE.md) — How the system is structured
- [CONVENTIONS.md](CONVENTIONS.md) — Code patterns and style
- [INTEGRATIONS.md](INTEGRATIONS.md) — External services and APIs
- [TESTING.md](TESTING.md) — Test strategy and coverage
- [CONCERNS.md](CONCERNS.md) — Technical debt and risks

## Key Facts
- **Language:** [primary language]
- **Framework:** [primary framework]
- **Database:** [if applicable]
- **Test coverage:** [rough %]
- **Notable concerns:** [1-2 sentence summary]
```

### Step 5: Commit and Suggest Next Steps

Commit:
```
git add .spec/codebase/
git commit -m "go-spec: codebase map generated"
```

Print:
```
Codebase map complete! .spec/codebase/ committed.

This is shared context — push to main so your whole team benefits.

Next steps:
  /gs:canon --all        — build behavioral docs from your test suite
  /gs:quick "[task]"     — start implementing; executor reads codebase map automatically
```

---

## Notes

- The map is a point-in-time analysis. Re-run after major refactors.
- Agents read the actual code — this may take 2–5 minutes on large codebases.
- Agents focus on structure and patterns, not line-by-line analysis.
