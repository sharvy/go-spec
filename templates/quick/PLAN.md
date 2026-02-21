# Plan: [Task description]

**Task:** [NNN] — [slug]
**Output:** .spec/quick/[NNN]-[slug]/SUMMARY.md

## Goal

[One paragraph: what this plan achieves and why. Specific enough that an executor
with no prior context could implement it correctly.

Example: "Add a dark mode toggle to the settings page. The toggle writes to
localStorage and applies a `data-theme="dark"` attribute to the root element,
which triggers CSS custom property overrides already defined in globals.css."]

## Pre-conditions

- [What must already exist or be true before this plan starts]
- [Example: "The settings page component exists at src/pages/settings.tsx"]
- [Or: "None"]

## Tasks

### Task 1: [Name]

**Files:**
- `[path/to/file.ts]` — [what changes here]

**Details:**
[Precise description. Include: function signatures for new code, field names for schema
changes, config keys for configuration, specific test cases for tests. Be specific enough
that no clarifying questions are needed.]

**Done when:** [Specific, observable condition — e.g., "Clicking the toggle in settings
switches the root element between data-theme=light and data-theme=dark"]

---

### Task 2: [Name]

**Files:**
- `[path/to/file.ts]`

**Details:**
[...]

**Done when:** [...]

---

## Success Criteria

- [ ] [Verifiable criterion — matches what was asked for]
- [ ] All existing tests pass
- [ ] [Any other observable success condition]

## Deviation Policy

**Auto-fix (no need to stop):**
- Bug in code being written → fix it, note in SUMMARY
- Missing import or small dependency → add it, note it
- Type error or minor validation gap → fix it, note it

**Stop and report:**
- Task requires architectural change not described here
- Conflict with recently committed code discovered
- Requirement is ambiguous and affects core implementation
