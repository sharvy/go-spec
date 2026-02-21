# /gs:health [--repair] — Validate the .spec/ Directory

Check the integrity of the `.spec/` directory structure and content.
Detects corruption, missing files, inconsistencies, and common issues.

---

## Flags

- `--repair` — Automatically fix issues where safe to do so

---

## Checks Performed

### Structural Checks

- `.spec/` directory exists
- Required files exist: `PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md`, `config.json`
- All phase directories referenced in ROADMAP.md exist in `.spec/phases/`
- Phase directories have the expected naming format (`NN-slug/`)

### Content Checks

- `config.json` is valid JSON and has required keys
- ROADMAP.md contains at least one phase
- STATE.md has a "Current Position" section
- No plan file references a non-existent dependency

### Consistency Checks

- ROADMAP.md phase statuses match actual artifacts (e.g., phase marked "complete" but no SUMMARY.md exists)
- REQ-IDs referenced in ROADMAP.md exist in REQUIREMENTS.md
- All PLAN.md wave assignments form a valid DAG (no cycles)

### Artifact Checks

- Every SUMMARY.md has status (COMPLETE / PARTIAL / BLOCKED)
- VERIFICATION.md files match the plans they verify
- No orphaned quick task directories (no PLAN.md inside)

---

## Process

### Step 1: Run Checks

Run all checks above. Collect results.

### Step 2: Report

```
go-spec health check

✓ Directory structure       OK
✓ Required files            OK
⚠ Config validation         1 issue
✓ ROADMAP consistency       OK
✗ Artifact integrity        2 issues

Issues:

  [config.json] Missing key: parallelization.max_concurrent_agents
  → Default value: 3. Run with --repair to fix automatically.

  [phases/02-core/] Phase 2 marked "complete" in ROADMAP.md but no SUMMARY.md found
  → Cannot auto-repair. Check if plans were executed.
```

### Step 3: Repair (--repair flag)

For each auto-repairable issue:
- Apply the fix (add missing config keys with defaults, recreate missing directories, etc.)
- Note what was repaired

For non-repairable issues:
- Explain what's wrong and what manual action is needed

### Step 4: Final Status

```
Health: [HEALTHY / WARNINGS / ERRORS]

Auto-repaired: [N] issues
Requires manual attention: [N] issues
```

---

## Common Issues and Manual Fixes

| Issue | Fix |
|-------|-----|
| Phase marked complete but no SUMMARY.md | Re-run `/gs:run [N]` or manually create SUMMARY.md |
| Missing phase directory | Create with `mkdir .spec/phases/NN-slug/` |
| Invalid JSON in config.json | Edit manually or delete and re-run `/gs:settings` |
| REQ-ID in ROADMAP.md not in REQUIREMENTS.md | Add the requirement or correct the ID |
