# /gs:help — go-spec Command Reference

---

## What is go-spec?

go-spec is a friction-free AI workflow for development teams. It eliminates context rot —
the quality degradation that happens when AI fills its context window during long sessions —
by running each task in a fresh, isolated context window with a specialist agent.

**Three workflows. That's it.**

1. **Daily work** — `/gs:quick` + `/gs:debug`
2. **Handoff** — `/gs:pause` + `/gs:resume`
3. **Project brain** — `/gs:map` + `/gs:canon`

---

## Commands

### Daily Work

| Command | Description |
|---------|-------------|
| `/gs:quick [task]` | Implement a feature or fix a bug — fresh context, atomic commits |
| `/gs:debug [desc]` | Start a hypothesis-driven debug session |
| `/gs:debug resume [id]` | Resume an open debug session |
| `/gs:todo [idea]` | Capture an idea or task for later |
| `/gs:todos` | Review and act on captured todos |

### Handoff

| Command | Description |
|---------|-------------|
| `/gs:pause` | Stop cleanly — writes handoff notes to `.spec/PAUSE.md` |
| `/gs:resume` | Pick up where you (or a teammate) left off |

### Project Brain

| Command | Description |
|---------|-------------|
| `/gs:map` | Analyze codebase structure — run once on main, commit `.spec/codebase/` |
| `/gs:canon [domain]` | Build or update behavioral docs for a domain from tests + source |
| `/gs:canon --all` | Bootstrap canon/ for all detected domains in parallel |
| `/gs:canon [domain] --update` | Refresh after changes to that domain |
| `/gs:status` | Show active tasks, recent completions, blockers, and team decisions |

### Utilities

| Command | Description |
|---------|-------------|
| `/gs:update` | Update go-spec to the latest version |
| `/gs:help` | Show this reference |

---

## The .spec/ Directory

go-spec stores all context in `.spec/` — commit it to git so teammates share it.

```
.spec/
├── STATE.md        Active work, recent completions, team decisions, blockers
├── config.json     go-spec settings (model profile, git behavior)
├── PAUSE.md        Handoff notes — created by /gs:pause, deleted by /gs:resume
├── codebase/       Codebase analysis (from /gs:map — run once, refresh as needed)
│   ├── STACK.md
│   ├── ARCHITECTURE.md
│   ├── CONVENTIONS.md
│   ├── INTEGRATIONS.md
│   ├── TESTING.md
│   └── CONCERNS.md
├── quick/          One directory per task
│   └── 001-user-profile-api/
│       ├── PLAN.md      — what will be done
│       └── SUMMARY.md   — what was done, commits, deviations
├── debug/          Debug sessions
│   ├── 2026-02-23-auth-refresh/
│   │   └── SESSION.md   — hypothesis log
│   └── resolved/
└── todos/
    ├── pending/
    └── done/

canon/              Living behavioral docs (from /gs:canon — grows on merge)
├── _index.md
├── auth.md
└── users.md
```

---

## Quick Start for a New Team

```
# 1. One person runs this on main (analyze existing codebase)
/gs:map

# 2. Bootstrap behavioral docs for existing domains
/gs:canon --all

# 3. Everyone installs go-spec
npx github:sharvy/go-spec --claude --global

# 4. Start working
/gs:quick "add user profile API"

# 5. End of session — push handoff
/gs:pause
git push

# 6. Teammate picks it up
git checkout feature/user-profile
/gs:resume
```

---

## Issues

https://github.com/sharvy/go-spec/issues
