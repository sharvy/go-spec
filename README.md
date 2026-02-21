# go-spec

[![GitHub](https://img.shields.io/badge/GitHub-go--spec-blue?logo=github)](https://github.com/sharvy/go-spec)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?logo=node.js)](https://nodejs.org/)

> **Friction-free AI workflow for development teams.**
> Build features. Fix bugs. Hand off work. Zero re-explaining.

```
┌─────────────────────────────────────────────────────────────────┐
│  WITHOUT go-spec              │  WITH go-spec                   │
│                               │                                 │
│  Session gets long            │  Every task = fresh AI context  │
│  → AI forgets decisions       │  → Quality never degrades       │
│  → Code quality drops         │                                 │
│  → You re-explain everything  │  Branch contains full context   │
│                               │  → Teammate picks up in 10 sec  │
│  "What were we doing again?"  │  → /gs:resume answers that      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Table of Contents

1. [How It Works](#how-it-works)
2. [Installation](#installation)
3. [Team Setup (One Time)](#team-setup-one-time)
4. [Workflow 1 — Build a Feature](#workflow-1--build-a-feature)
5. [Workflow 2 — Fix a Bug](#workflow-2--fix-a-bug)
6. [Workflow 3 — Pause and Hand Off to a Teammate](#workflow-3--pause-and-hand-off-to-a-teammate)
7. [Workflow 4 — Pick Up Someone Else's Work](#workflow-4--pick-up-someone-elses-work)
8. [Building Project Context Over Time](#building-project-context-over-time)
9. [Command Reference](#command-reference)
10. [What Lives in .spec/](#what-lives-in-spec)
11. [Configuration](#configuration)

---

## How It Works

go-spec runs each task in a **dedicated, fresh AI context window**. The AI doesn't carry
baggage from previous tasks. It reads the plan, reads your codebase conventions, and
implements — then writes a summary so the next person (or next session) knows exactly
what was done.

```
  You type one command
       │
       ▼
  go-spec creates a PLAN.md
  (what will be done, step by step)
       │
       ▼
  gs-executor agent spawns
  in a FRESH 200k-token context
       │
       ├─ reads PLAN.md
       ├─ reads .spec/STATE.md  (your team's conventions)
       ├─ reads canon/          (behavioral docs, if they exist)
       │
       ▼
  implements each task
  → one atomic git commit per task
       │
       ▼
  writes SUMMARY.md
  (what was done, commits, deviations, blockers)
       │
       ▼
  You have working code + a written record
  your teammate can read without asking you anything
```

---

## Installation

### Prerequisites

| Requirement | Version | Link |
|-------------|---------|------|
| Node.js | 18 or newer | [nodejs.org](https://nodejs.org/) |
| Claude Code | any | already installed if you're reading this |

### Install go-spec (globally — recommended)

Open your terminal and run:

```bash
npx github:sharvy/go-spec --claude --global
```

This installs go-spec's commands and agents into `~/.claude/` so they work in
**every project** on your machine.

### Verify it worked

Open Claude Code in any project and type:

```
/gs:help
```

You should see the command reference. That's it — you're installed.

### Other install options

```bash
# Install only for the current project (into .claude/ in this folder)
npx github:sharvy/go-spec --claude --local

# Uninstall
npx github:sharvy/go-spec --claude --global --uninstall

# Update to latest version (run inside Claude Code)
/gs:update
```

---

## Team Setup (One Time)

Do this **once** on your `main` branch. One person does it, commits, and pushes.
Everyone else benefits immediately.

```
STEP 1 — Analyze the codebase
──────────────────────────────
  In Claude Code, on main branch:

  /gs:map

  What happens:
  ┌──────────────────────────────────────────────────────────┐
  │  go-spec spawns 6 agents in parallel, each reads a       │
  │  different dimension of your codebase:                   │
  │                                                          │
  │  Agent 1 → .spec/codebase/STACK.md         (languages,  │
  │                                              frameworks) │
  │  Agent 2 → .spec/codebase/ARCHITECTURE.md  (structure,  │
  │                                              data flow)  │
  │  Agent 3 → .spec/codebase/CONVENTIONS.md   (naming,     │
  │                                              patterns)   │
  │  Agent 4 → .spec/codebase/INTEGRATIONS.md  (APIs, DBs,  │
  │                                              services)   │
  │  Agent 5 → .spec/codebase/TESTING.md       (framework,  │
  │                                              coverage)   │
  │  Agent 6 → .spec/codebase/CONCERNS.md      (debt,       │
  │                                              risks)      │
  └──────────────────────────────────────────────────────────┘

  Takes 2–5 minutes on a large codebase.


STEP 2 — Bootstrap behavioral docs (optional but powerful)
──────────────────────────────────────────────────────────
  /gs:canon --all

  What happens:
  ┌──────────────────────────────────────────────────────────┐
  │  go-spec detects your domains from test structure        │
  │  and source directories, then spawns one agent per       │
  │  domain. Each agent reads your tests (highest trust)     │
  │  and source to produce a plain-English behavioral doc.   │
  │                                                          │
  │  canon/auth.md     ← what auth does today               │
  │  canon/users.md    ← what users domain does today        │
  │  canon/payments.md ← what payments does today            │
  │  canon/_index.md   ← coverage summary                   │
  │                                                          │
  │  Every future /gs:quick reads these automatically.       │
  └──────────────────────────────────────────────────────────┘


STEP 3 — Commit and push
─────────────────────────
  git add .spec/ canon/
  git commit -m "chore: add go-spec context"
  git push


STEP 4 — Everyone installs go-spec
────────────────────────────────────
  Each teammate runs once:
  npx github:sharvy/go-spec --claude --global

  Done. They pull main, they have the full context.
```

---

## Workflow 1 — Build a Feature

This is what you do every time you start a new piece of work.

```
┌─────────────────────────────────────────────────────────────────┐
│  BUILDING A FEATURE — Step by Step                              │
└─────────────────────────────────────────────────────────────────┘

  STEP 1 — Create your branch (normal git, nothing special)
  ──────────────────────────────────────────────────────────
  git checkout -b feature/user-profile-api


  STEP 2 — Describe the task to go-spec
  ──────────────────────────────────────
  /gs:quick "add user profile API — GET and PATCH endpoints,
             avatar upload to S3, unit tests"

  ┌──────────────────────────────────────────────────────────┐
  │  go-spec reads your STATE.md to learn:                   │
  │  • What tech stack you're using                          │
  │  • What patterns the team follows                        │
  │  • What conventions are established                      │
  │                                                          │
  │  Then it explores the relevant area of your codebase     │
  │  to understand what already exists.                      │
  │                                                          │
  │  Then it writes a PLAN.md for you to review.             │
  └──────────────────────────────────────────────────────────┘


  STEP 3 — go-spec shows you the plan
  ─────────────────────────────────────
  ┌──────────────────────────────────────────────────────────┐
  │  .spec/quick/001-user-profile-api/PLAN.md                │
  │                                                          │
  │  Goal: Add user profile GET/PATCH API with S3 avatars    │
  │                                                          │
  │  Task 1: GET /api/users/:id                              │
  │    Files: src/routes/users.ts, src/services/users.ts     │
  │    Done when: returns 200 with user object               │
  │                                                          │
  │  Task 2: PATCH /api/users/:id (name, bio fields)         │
  │    Files: src/routes/users.ts, src/services/users.ts     │
  │    Done when: updates DB and returns updated user         │
  │                                                          │
  │  Task 3: POST /api/users/:id/avatar (S3 upload)          │
  │    Files: src/services/upload.ts, src/routes/users.ts    │
  │    Done when: stores in S3, saves URL to user record     │
  │                                                          │
  │  Task 4: Unit tests for all three endpoints              │
  │    Files: src/__tests__/users.test.ts                    │
  │    Done when: all tests pass                             │
  └──────────────────────────────────────────────────────────┘


  STEP 4 — go-spec executes the plan
  ────────────────────────────────────
  A fresh AI agent spawns with only this plan and your codebase.
  No baggage from previous conversations. No context rot.

  It works through tasks one by one:

  Task 1 → implements → git commit → next task
  Task 2 → implements → git commit → next task
  Task 3 → implements → git commit → next task
  Task 4 → implements → git commit → done

  Your git log looks like:
  ┌──────────────────────────────────────────────────────────┐
  │  abc1234  GET /api/users/:id endpoint                    │
  │  def5678  PATCH /api/users/:id endpoint                  │
  │  ghi9012  POST /api/users/:id/avatar — S3 upload         │
  │  jkl3456  unit tests for user profile API                │
  │  mno7890  go-spec: user-profile-api                      │
  └──────────────────────────────────────────────────────────┘


  STEP 5 — go-spec writes a summary
  ──────────────────────────────────
  ┌──────────────────────────────────────────────────────────┐
  │  .spec/quick/001-user-profile-api/SUMMARY.md             │
  │                                                          │
  │  Status: COMPLETE                                        │
  │                                                          │
  │  What was built:                                         │
  │  User profile API with GET, PATCH, and avatar upload.    │
  │  Avatar stored in S3 via presigned URL. All endpoints    │
  │  covered by unit tests using mocked S3 client.           │
  │                                                          │
  │  Tasks: 4/4 complete                                     │
  │  Deviations: none                                        │
  │  Integration: export UserService from services/users.ts  │
  └──────────────────────────────────────────────────────────┘


  STEP 6 — Open a PR as normal
  ─────────────────────────────
  git push origin feature/user-profile-api
  # open PR — reviewer reads SUMMARY.md before touching the diff
  # they immediately understand what was built and why
```

**What does the SUMMARY.md give your reviewer?**

Instead of reading 300 lines of diff and guessing intent, your reviewer reads:
- What was built (2–4 sentences)
- Which tasks completed
- Every git commit with its purpose
- Any places where implementation differed from the plan
- What other code now depends on this

That's a better PR description than most humans write by hand.

---

## Workflow 2 — Fix a Bug

Two paths depending on how complex the bug is.

```
┌─────────────────────────────────────────────────────────────────┐
│  IS IT A SIMPLE BUG OR A COMPLEX BUG?                           │
│                                                                 │
│  Simple bug — you know roughly what's wrong:                    │
│    "date formatting shows wrong timezone in reports"            │
│    "email validation accepts spaces"                            │
│    "404 page is missing from the router"                        │
│                         │                                       │
│                         └──→  use /gs:quick                     │
│                                                                 │
│  Complex bug — you don't know why it's happening:               │
│    "users randomly get logged out"                              │
│    "payment webhook sometimes fires twice"                      │
│    "app crashes on iOS Safari but not Chrome"                   │
│                         │                                       │
│                         └──→  use /gs:debug                     │
└─────────────────────────────────────────────────────────────────┘
```

### Path A — Simple Bug with `/gs:quick`

```
  /gs:quick "fix: date formatting shows UTC instead of user
             timezone in the reports page"

  go-spec:
  1. Explores the reports codebase area
  2. Finds the date formatting code
  3. Creates a focused plan (likely 1–2 tasks)
  4. Executes: fixes the bug + adds a regression test
  5. Writes SUMMARY.md explaining root cause and fix

  Your commit:  "fix date formatting — use user timezone from profile"
  Time spent:   3–7 minutes
```

### Path B — Complex Bug with `/gs:debug`

```
  /gs:debug "users randomly get logged out after ~1 hour"

  ┌──────────────────────────────────────────────────────────┐
  │  go-spec creates a debug session:                        │
  │  .spec/debug/2026-02-23-random-logout/SESSION.md         │
  └──────────────────────────────────────────────────────────┘

  STEP 1 — Reproduction
  ──────────────────────
  go-spec asks: "What are the exact steps to trigger this?"

  You describe: "Login → use the app for 60+ minutes →
                next API call gets a 401"


  STEP 2 — Hypothesis-driven investigation
  ──────────────────────────────────────────
  The gs-debugger agent works through hypotheses, one at a time.
  It NEVER modifies code just to try something. It investigates first.

  ┌──────────────────────────────────────────────────────────┐
  │  SESSION.md (grows as investigation proceeds)            │
  │                                                          │
  │  Hypothesis 1: Access token TTL = 60min, not refreshing  │
  │  Test: Read auth middleware, check refresh logic         │
  │  Result: Refresh interceptor exists and runs             │
  │  Conclusion: REFUTED — interceptor works                 │
  │                                                          │
  │  Hypothesis 2: Refresh token itself expired              │
  │  Test: Check token TTL in auth config                    │
  │  Result: Refresh token TTL = 30 days                     │
  │  Conclusion: REFUTED                                     │
  │                                                          │
  │  Hypothesis 3: Race condition — two parallel requests    │
  │  both try to refresh at the same time, second one        │
  │  fails because first one already rotated the token       │
  │  Test: Read refresh endpoint, check for mutex/lock       │
  │  Result: No lock. Two concurrent refreshes = second      │
  │          one always gets 401 with rotated token          │
  │  Conclusion: CONFIRMED ← root cause found                │
  └──────────────────────────────────────────────────────────┘


  STEP 3 — Fix
  ─────────────
  Only after root cause is confirmed does the agent write code.

  Fix: Add mutex lock around refresh logic
  Test: Add test for concurrent refresh scenario
  Commit: "fix: prevent race condition in token refresh
           — add mutex lock around refresh endpoint"


  STEP 4 — Session closed
  ────────────────────────
  SESSION.md moves to .spec/debug/resolved/
  .spec/debug/INDEX.md updated with root cause summary

  ┌──────────────────────────────────────────────────────────┐
  │  If you need to stop mid-investigation and come back:    │
  │                                                          │
  │  /gs:debug resume 2026-02-23-random-logout               │
  │                                                          │
  │  → loads SESSION.md                                      │
  │  → shows hypothesis log so far                           │
  │  → continues from where it stopped                       │
  │                                                          │
  │  Teammate can also resume it on the same branch.         │
  └──────────────────────────────────────────────────────────┘
```

---

## Workflow 3 — Pause and Hand Off to a Teammate

This is the workflow that eliminates "wait, what were you working on?" forever.

```
┌─────────────────────────────────────────────────────────────────┐
│  SCENARIO                                                       │
│                                                                 │
│  You're mid-feature. You need to stop — end of day, blocker,   │
│  or you're handing it to a teammate to finish.                  │
│                                                                 │
│  Without go-spec: Slack message, call, context dump, confusion  │
│  With go-spec:    /gs:pause + git push = everything they need   │
└─────────────────────────────────────────────────────────────────┘


  YOUR SIDE (Developer A)
  ═══════════════════════

  STEP 1 — Pause cleanly
  ───────────────────────
  /gs:pause

  go-spec asks: "Any notes for whoever picks this up?"
  You type:     "S3 bucket name for staging needed from DevOps.
                 Use multipart upload for files > 5MB — see AWS
                 docs link in upload.ts. Task 3 is half done."

  ┌──────────────────────────────────────────────────────────┐
  │  go-spec reads your current state and writes             │
  │  .spec/PAUSE.md:                                         │
  │                                                          │
  │  # Handoff — 2026-02-23 17:43                            │
  │                                                          │
  │  ## What Was Being Worked On                             │
  │  Task 001 — user-profile-api                             │
  │  Branch: feature/user-profile-api                        │
  │                                                          │
  │  ## What's Done                                          │
  │  ✓ Task 1: GET /api/users/:id                            │
  │  ✓ Task 2: PATCH /api/users/:id                          │
  │                                                          │
  │  ## What's In Progress                                   │
  │  Task 3 of 4 — S3 avatar upload. Presigned URL logic     │
  │  written in src/services/upload.ts. Not yet wired to     │
  │  the PATCH endpoint. Tests not written.                  │
  │                                                          │
  │  ## What's Next                                          │
  │  Wire upload.ts to PATCH /api/users/:id/avatar.          │
  │  Then Task 4: write tests.                               │
  │                                                          │
  │  ## Blockers                                             │
  │  Need S3_BUCKET_NAME env var for staging — ask DevOps    │
  │                                                          │
  │  ## Notes                                                │
  │  Use multipart upload for files > 5MB. See AWS docs      │
  │  link in upload.ts line 12. Task 3 is half done.         │
  └──────────────────────────────────────────────────────────┘


  STEP 2 — Commit and push
  ─────────────────────────
  go-spec automatically commits STATE.md + PAUSE.md.

  Then you push:
  git push origin feature/user-profile-api

  ┌──────────────────────────────────────────────────────────┐
  │  The branch now contains:                                │
  │                                                          │
  │  ✓ All completed code (Tasks 1 + 2)                      │
  │  ✓ In-progress code (Task 3, partial)                    │
  │  ✓ .spec/quick/001-user-profile-api/PLAN.md              │
  │  ✓ .spec/quick/001-user-profile-api/SUMMARY.md           │
  │  ✓ .spec/PAUSE.md  ← the handoff                        │
  │  ✓ .spec/STATE.md  ← updated                            │
  └──────────────────────────────────────────────────────────┘


  STEP 3 — Tell your teammate
  ────────────────────────────
  Slack: "hey can you finish feature/user-profile-api?
          just do /gs:resume after checking out the branch"

  That's literally all you need to say.
```

---

## Workflow 4 — Pick Up Someone Else's Work

```
  TEAMMATE'S SIDE (Developer B)
  ══════════════════════════════

  STEP 1 — Check out the branch
  ───────────────────────────────
  git fetch origin
  git checkout feature/user-profile-api


  STEP 2 — Resume
  ─────────────────
  /gs:resume

  ┌──────────────────────────────────────────────────────────┐
  │  go-spec reads PAUSE.md + SUMMARY.md + STATE.md          │
  │  and prints:                                             │
  │                                                          │
  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
  │    Resuming work on feature/user-profile-api             │
  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
  │                                                          │
  │  Handoff from Developer A:                               │
  │  [shows PAUSE.md in full]                                │
  │                                                          │
  │  Active task: 001 — user-profile-api                     │
  │                                                          │
  │  What's done:                                            │
  │    ✓ Task 1: GET /api/users/:id                          │
  │    ✓ Task 2: PATCH /api/users/:id                        │
  │                                                          │
  │  What's in progress:                                     │
  │    → Task 3: S3 avatar upload (half done)                │
  │      upload.ts written, not wired to endpoint yet        │
  │                                                          │
  │  What's next:                                            │
  │    Wire upload.ts to PATCH endpoint, then write tests    │
  │                                                          │
  │  Blockers:                                               │
  │    Need S3_BUCKET_NAME from DevOps (staging env)         │
  │                                                          │
  │  Note: multipart upload for > 5MB — see upload.ts:12    │
  └──────────────────────────────────────────────────────────┘


  STEP 3 — Continue the work
  ───────────────────────────
  Developer B now has full context. They continue exactly where
  Developer A left off — no Slack thread, no call, no guessing.

  If there are no blockers:
  /gs:quick "wire upload.ts to PATCH endpoint and add tests"
  → go-spec picks up from where Task 3 was left off

  If the blocker needs resolving first:
  → Get S3_BUCKET_NAME from DevOps → add to .env.staging
  → Then continue


  WHAT IF YOU NEED TO HAND BACK?
  ────────────────────────────────
  Developer B can also pause and push back:

  /gs:pause
  git push

  Developer A (or anyone else) does /gs:resume again.
  The chain never breaks.
```

---

## Building Project Context Over Time

You don't need to do anything special. Context builds naturally as you work.

```
┌─────────────────────────────────────────────────────────────────┐
│  HOW CONTEXT ACCUMULATES                                        │
└─────────────────────────────────────────────────────────────────┘

  Week 1
  ───────
  main ──●────────────────────────────────
          │
          feature/auth-refresh ──●── merged to main
                                  │
                                  └─→ run: /gs:canon auth
                                      → creates canon/auth.md

  Week 2
  ───────
  main ──●──────────────────●────────────
                             │
          feature/user-api ──● merged
                                  │
                                  └─→ /gs:canon users
                                      → creates canon/users.md
                                      → updates canon/_index.md

  Week 4
  ───────
  canon/
  ├── auth.md      "Google OAuth + JWT refresh, 12 capabilities,
  │                 race condition in token refresh (see debug log)"
  ├── users.md     "Profile API, avatar upload, soft delete"
  ├── payments.md  "Stripe webhooks, subscription management"
  └── _index.md    "What this system does — readable in 5 minutes"

  Month 3
  ────────
  Every /gs:quick automatically reads relevant canon/ docs.
  New teammate reads canon/ → productive on day 1, not week 3.


  HOW TO RUN IT AFTER MERGING
  ────────────────────────────
  # Your branch touched the auth domain:
  /gs:canon auth --update

  # Your branch touched users and payments:
  /gs:canon users --update
  /gs:canon payments --update

  # Not sure which domains were affected?
  /gs:canon --all
  (re-reads everything, only updates what changed)


  TIP: AUTOMATION
  ────────────────
  Add to your post-merge CI or git hook:

  # .github/workflows/update-canon.yml or post-merge hook
  CHANGED=$(git diff HEAD~1 --name-only)
  echo "$CHANGED" | grep -q "src/auth"     && claude /gs:canon auth --update
  echo "$CHANGED" | grep -q "src/users"    && claude /gs:canon users --update
  echo "$CHANGED" | grep -q "src/payments" && claude /gs:canon payments --update
```

---

## Command Reference

### Daily Work

| Command | When to use | What it does |
|---------|-------------|--------------|
| `/gs:quick "task description"` | Building any feature or fixing a known bug | Creates a plan, executes in fresh AI context, atomic commits, writes SUMMARY.md |
| `/gs:debug "bug description"` | Bug where you don't know the root cause | Opens a hypothesis-driven debug session with persistent log |
| `/gs:debug resume [session-id]` | Coming back to an open debug session | Loads investigation log, continues from where it stopped |
| `/gs:todo "idea"` | Thought of something but can't work on it now | Saves to `.spec/todos/pending/` |
| `/gs:todos` | Ready to act on captured ideas | Lists pending todos, lets you convert to quick tasks |

### Handoff

| Command | When to use | What it does |
|---------|-------------|--------------|
| `/gs:pause` | Stopping work or handing to teammate | Writes `.spec/PAUSE.md` with full context, commits, ready to push |
| `/gs:resume` | Starting a session or picking up someone's branch | Reads PAUSE.md + SUMMARY.md, prints full briefing, suggests next command |

### Project Brain

| Command | When to use | What it does |
|---------|-------------|--------------|
| `/gs:map` | Once on main (first time setup) | 6 parallel agents analyze codebase → `.spec/codebase/` |
| `/gs:canon --all` | First time, or after major changes | Builds behavioral docs for all domains from tests + source |
| `/gs:canon [domain]` | Starting work in a domain for the first time | Builds `canon/[domain].md` for that specific domain |
| `/gs:canon [domain] --update` | After merging a branch that touched that domain | Refreshes that domain's behavioral doc |
| `/gs:status` | Want a quick overview | Shows active tasks, recent completions, blockers, decisions |

### Utilities

| Command | When to use | What it does |
|---------|-------------|--------------|
| `/gs:update` | go-spec has a new release | Updates commands, agents, and hooks |
| `/gs:help` | Need a quick reminder | Prints command reference |

---

## What Lives in `.spec/`

**Commit `.spec/` to git.** It is your team's shared AI brain. Every developer and every
AI agent reads from it. It's how go-spec knows your conventions, tracks active work, and
enables zero-friction handoffs.

```
your-project/
│
├── .spec/                         ← commit this, it's the team brain
│   │
│   ├── STATE.md                   ← WHO is working on WHAT right now
│   │                                 + team decisions, stack, conventions
│   │
│   ├── config.json                ← go-spec settings (3 fields)
│   │
│   ├── PAUSE.md                   ← handoff file (on feature branches)
│   │                                 created by /gs:pause
│   │                                 deleted by /gs:resume
│   │
│   ├── codebase/                  ← from /gs:map (run once on main)
│   │   ├── STACK.md               ← languages, frameworks, tooling
│   │   ├── ARCHITECTURE.md        ← module structure, data flow
│   │   ├── CONVENTIONS.md         ← naming, patterns, code style
│   │   ├── INTEGRATIONS.md        ← external APIs, DBs, services
│   │   ├── TESTING.md             ← test framework, what's covered
│   │   └── CONCERNS.md            ← tech debt, security, risks
│   │
│   ├── quick/                     ← one directory per task
│   │   ├── 001-user-profile-api/
│   │   │   ├── PLAN.md            ← what will be done (tasks + success criteria)
│   │   │   └── SUMMARY.md        ← what was done, commits, deviations, blockers
│   │   ├── 002-fix-date-format/
│   │   │   ├── PLAN.md
│   │   │   └── SUMMARY.md
│   │   └── ...
│   │
│   ├── debug/                     ← debug sessions
│   │   ├── 2026-02-23-auth-refresh/
│   │   │   └── SESSION.md        ← bug report + hypothesis log + fix
│   │   └── resolved/             ← closed sessions archived here
│   │
│   └── todos/
│       ├── pending/              ← ideas captured with /gs:todo
│       └── done/                 ← completed todos
│
└── canon/                         ← behavioral docs (from /gs:canon)
    ├── _index.md                  ← "what this system does" — readable in 5 min
    ├── auth.md                    ← capabilities, contracts, test coverage, gaps
    ├── users.md
    └── payments.md
```

---

## Configuration

`.spec/config.json` — three settings. That's the whole config.

```json
{
  "version": "2.0.0",
  "models": {
    "profile": "balanced"
  },
  "git": {
    "commit_docs": true
  }
}
```

### Model Profiles

Change `profile` to control cost vs. quality:

```
"quality"   → Opus for planning + Opus for execution
              Best output. Use for critical features.

"balanced"  → Opus for planning + Sonnet for execution   ← default
              Great output at reasonable cost.
              Use this for day-to-day work.

"budget"    → Sonnet for planning + Sonnet for execution
              Fast and cheap. Use for internal tools,
              scripts, and low-stakes tasks.
```

To change: edit `.spec/config.json` → change `"profile"` → commit.

---

## Contributing

Issues and pull requests welcome: [github.com/sharvy/go-spec](https://github.com/sharvy/go-spec)

## License

[MIT](https://github.com/sharvy/go-spec/blob/main/LICENSE)
