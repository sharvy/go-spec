# /gs:help — go-spec Command Reference

Complete reference for all go-spec commands.

---

## What is go-spec?

go-spec is a specification-driven AI development workflow for Claude Code.
It eliminates context rot by deeply specifying intent upfront, then executing
in focused, atomic chunks with fresh context windows.

Philosophy: **Humans decide WHAT. Claude builds HOW.**

---

## Quick Start

### New Project
```
/gs:init          ← Start here: deep Q&A → research → requirements → roadmap
/gs:discuss 1     ← (Optional) Capture design context for Phase 1
/gs:plan 1        ← Research + plan Phase 1
/gs:run 1         ← Execute Phase 1 in parallel waves
/gs:verify 1      ← Verify Phase 1 goal was achieved (auto-runs after /gs:run)
/gs:plan 2        ← Plan Phase 2
...
```

### Existing Project
```
/gs:map           ← Analyze the codebase first
/gs:init          ← Initialize spec (uses codebase map automatically)
```

### Quick Fix / Ad-Hoc Task
```
/gs:quick "Add dark mode toggle"
/gs:quick "Fix auth bug" --full
```

---

## All Commands

### Project Lifecycle
| Command | Description |
|---------|-------------|
| `/gs:init` | Initialize new project specification |
| `/gs:map` | Analyze existing codebase structure (brownfield) |
| `/gs:canon [domain]` | Build living behavioral docs from tests + source |
| `/gs:canon --all` | Bootstrap canon/ for all detected domains in parallel |
| `/gs:canon [domain] --update` | Refresh a domain's canon after changes |
| `/gs:status` | Show project progress and what's next |

### Phase Workflow
| Command | Description |
|---------|-------------|
| `/gs:discuss [N]` | Capture design context before planning |
| `/gs:plan [N]` | Research + create + verify plans for a phase |
| `/gs:plan [N] --skip-research` | Plan without research step |
| `/gs:plan [N] --skip-check` | Plan without quality review |
| `/gs:run [N]` | Execute all plans in wave order |
| `/gs:run [N] --plan NN-PP` | Execute one specific plan |
| `/gs:run [N] --no-verify` | Execute without verification |
| `/gs:verify [N]` | Goal-backward verification of a phase |
| `/gs:phase-notes [N]` | View phase assumptions and plans |

### Session Management
| Command | Description |
|---------|-------------|
| `/gs:resume` | Resume from previous session |
| `/gs:pause` | Create handoff and stop cleanly |

### Phase Management
| Command | Description |
|---------|-------------|
| `/gs:add-phase` | Add a phase at end of roadmap |
| `/gs:insert-phase [N]` | Insert urgent phase (decimal numbering) |
| `/gs:remove-phase [N]` | Remove a future phase |

### Milestone Management
| Command | Description |
|---------|-------------|
| `/gs:milestone-start [name]` | Begin new milestone/version |
| `/gs:milestone-done` | Archive milestone and tag release |
| `/gs:milestone-audit` | Verify milestone achieved its goals |
| `/gs:gaps` | Plan work to close audit gaps |

### Utilities
| Command | Description |
|---------|-------------|
| `/gs:quick [task]` | Ad-hoc task with spec guarantees |
| `/gs:quick [task] --full` | Ad-hoc task with all workflow steps |
| `/gs:todo [description]` | Capture idea for later |
| `/gs:todos` | View and act on captured todos |
| `/gs:debug [description]` | Start systematic debug session |
| `/gs:debug resume [id]` | Resume a debug session |

### Configuration
| Command | Description |
|---------|-------------|
| `/gs:settings` | View and edit go-spec settings |
| `/gs:profile [name]` | Switch model profile (quality/balanced/budget) |
| `/gs:update` | Update go-spec to latest version |
| `/gs:health` | Validate .spec/ directory |
| `/gs:health --repair` | Validate and auto-fix issues |
| `/gs:help` | Show this reference |

---

## The .spec/ Directory

go-spec maintains all project state in `.spec/`:

```
.spec/
├── PROJECT.md          Project vision, constraints
├── REQUIREMENTS.md     Scoped requirements (REQ-IDs)
├── ROADMAP.md          Phased plan with success criteria
├── STATE.md            Session memory, decisions, position
├── config.json         go-spec settings
├── codebase/           Brownfield structure analysis (from /gs:map)
├── phases/             Per-phase planning artifacts
│   └── 01-foundation/
│       ├── 01-CONTEXT.md
│       ├── 01-RESEARCH.md
│       ├── 01-01-PLAN.md
│       ├── 01-01-SUMMARY.md
│       └── 01-VERIFICATION.md
├── quick/              Ad-hoc tasks
├── milestones/         Archived milestones
├── todos/              Captured ideas
│   ├── pending/
│   └── done/
└── debug/              Debug sessions
    └── resolved/

canon/                  Living behavioral docs (from /gs:canon)
├── _index.md           Auto-generated index with coverage summary
├── auth.md             What auth does today (capabilities, contracts, gaps)
└── billing.md          What billing does today
```

---

## Model Profiles

Switch with `/gs:profile [name]`:

| Profile | Planning | Execution | Verification |
|---------|----------|-----------|--------------|
| `quality` | Opus | Opus | Sonnet |
| `balanced` | Opus | Sonnet | Sonnet |
| `budget` | Sonnet | Sonnet | Haiku |

---

## Getting Help

- Issues: https://github.com/yourusername/go-spec/issues
- This reference: `/gs:help`
