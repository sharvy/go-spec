# Roadmap

## Milestone: v1.x Polish

### Phase 1: Clean Release Commit
**Goal:** Verify all resolved fixes pass tests and confirm the working tree is clean and publishable.
**Requirements covered:** REQ-001

**Success criteria:**
- [x] `npm test` passes (all 37 unit tests in `tests/`) with zero failures
- [x] `git status` is clean on the main branch
- [x] Changes are ahead of origin/main and ready to push

**Wave assignments:** Wave 1

**Status:** Complete

---

### Phase 2: /gs:cancel Command
**Goal:** Give users a safe abort path for in-progress multi-step commands by implementing /gs:cancel as a first-class markdown command that cleans up partial artifacts and confirms the cancellation.
**Requirements covered:** REQ-002

**Depends on:** Phase 1

**Success criteria:**
- [x] A `commands/gs/cancel.md` file exists and is picked up by the npm package
- [x] Invoking /gs:cancel during an active /gs:init flow stops further .spec/ file creation and removes any partially-written files created in that session
- [x] After cancellation, the AI runtime prints a clear confirmation with no dangling state
- [x] Invoking /gs:cancel when no multi-step command is in progress responds gracefully ("Nothing to cancel.")
- [x] `npm test` continues to pass after the new command is added
- [x] `/gs:help` documents the command

**Wave assignments:** Wave 1

**Status:** Complete

---

## Deferred (Post-v1.x)
- Antigravity / "workflows" subdir full test coverage
- /gs:cancel support for commands beyond /gs:init
- Remove `.claude/settings.json` from git history (not worth the effort for now)
