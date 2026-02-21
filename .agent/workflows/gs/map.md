# /gs:map — Analyze an Existing Codebase

Analyze an existing project's codebase and produce structured documentation in `.spec/codebase/`.
Run this before `/gs:init` to give go-spec full context about the code it will be working with.

---

## When to Use

- Starting go-spec on an existing project (brownfield)
- The project's structure has changed significantly since the last map
- Onboarding go-spec to code you didn't write

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

### Step 5: Integrate with go-spec

If `.spec/PROJECT.md` already exists: Update STATE.md to reference the codebase map.

If `.spec/PROJECT.md` doesn't exist yet: Print:
```
Codebase map complete!
Next: /gs:init — Initialize the project specification
      go-spec will automatically use the codebase map during initialization.
```

Commit:
```
git add .spec/codebase/
git commit -m "go-spec: codebase map generated"
```

---

## Notes

- The map is a point-in-time analysis. Re-run after major refactors.
- Agents read the actual code — this may take 2–5 minutes on large codebases.
- Agents focus on structure and patterns, not line-by-line analysis.
