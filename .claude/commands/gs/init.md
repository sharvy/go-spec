# /gs:init — Initialize a New Project

Start a new spec-driven project. This command guides you through deep specification,
optional domain research, requirements scoping, and roadmap creation.

---

## What This Does

1. **Question phase** — Deep collaborative Q&A to surface intent, constraints, and decisions
2. **Research phase** (optional) — Parallel agents investigate your domain with fresh context
3. **Requirements phase** — Scope what's v1, what's later, what's out of scope entirely
4. **Roadmap phase** — Decompose requirements into phased, executable work
5. **Initialization** — Create `.spec/` directory with all artifacts

---

## Pre-conditions

- You are in (or about to create) the project directory
- You have a rough idea of what you want to build

---

## Process

### Step 1: Check for Existing Project

Check if `.spec/PROJECT.md` already exists.

If yes: Ask "A go-spec project already exists here. Do you want to (1) continue where you left off with `/gs:status`, or (2) reinitialize from scratch?"

If reinitializing: confirm with the user before overwriting anything.

### Step 2: Detect Existing Code

Check if the current directory has significant code (files beyond a README/gitignore).

If yes: Ask "This directory has existing code. Do you want to analyze it first with `/gs:map`? That will give go-spec full context before we build the specification."

If the user wants to proceed without mapping: note it and continue.

### Step 3: Deep Questioning

Enter a collaborative dialogue. DO NOT ask all questions at once — ask naturally, follow the conversation, and dig into interesting answers.

Cover these areas (in whatever order feels natural):

**Vision:**
- What are you building and who is it for?
- What problem does it solve? What's broken today?
- What does success look like in 3 months?

**Constraints:**
- What's your tech stack? (language, framework, database, hosting)
- Are there existing systems this needs to integrate with?
- What are the hard constraints? (budget, timeline, compliance, scale)

**Scope:**
- What's the ONE thing this must do well in v1?
- What are you explicitly NOT building in v1?
- What do users need on day one vs. day 30?

**Risks:**
- What's the riskiest part of this?
- What would cause this to fail?
- What assumptions are you making that might be wrong?

Keep going until you have enough to write a complete PROJECT.md. Aim for 15–30 minutes of conversation.

### Step 4: Research (Optional)

Ask: "Want me to research the domain before we finalize requirements? This spawns 4 parallel researchers with fresh context windows and takes a few minutes. Recommended for unfamiliar tech stacks or complex domains."

If yes:
- Create `.spec/research/` directory
- Spawn 4 `gs-project-researcher` agents in parallel, each with a different lens:
  - Lens 1: stack (technology choices, library ecosystem)
  - Lens 2: features (how others solve this, UX patterns)
  - Lens 3: architecture (system design, data model options)
  - Lens 4: risks (common failures, security, performance traps)
- After all 4 complete, spawn `gs-synthesizer` to produce `.spec/research/SYNTHESIS.md`
- Present key findings to the user and incorporate into requirements

### Step 5: Write PROJECT.md

Write `.spec/PROJECT.md` based on the conversation:

```markdown
# Project: [Name]

## Vision
[1-3 sentences: what it is, who it's for, what problem it solves]

## Goals
- [Specific, measurable goal 1]
- [Specific, measurable goal 2]

## Non-Goals (v1)
- [Explicitly out of scope]

## Constraints
- **Stack:** [chosen technologies]
- **Integrations:** [external systems]
- **Hard constraints:** [compliance, scale, timeline]

## Risks
- [Risk and mitigation]

## Success in v1
[How we'll know v1 is done]
```

Present it to the user and ask for confirmation before saving.

### Step 6: Write REQUIREMENTS.md

From the conversation and research, produce scoped requirements:

```markdown
# Requirements

## In Scope (v1)
- REQ-001: [Requirement with acceptance criteria]
- REQ-002: [Requirement with acceptance criteria]

## Deferred (v2+)
- [Feature]: [Why deferred]

## Out of Scope
- [Feature]: [Why excluded]
```

Each requirement should have 1–3 acceptance criteria written as observable behaviors.

Present and confirm before saving.

### Step 7: Create Roadmap

Spawn `gs-roadmapper` agent with access to REQUIREMENTS.md and research (if available).

Present the roadmap to the user:
- Explain each phase and its goal
- Explain the ordering rationale
- Ask for any changes before finalizing

### Step 8: Initialize .spec/ Directory

Create all directories and files:

```
.spec/
├── PROJECT.md       ← written in Step 5
├── REQUIREMENTS.md  ← written in Step 6
├── ROADMAP.md       ← written in Step 7
├── STATE.md         ← initialized with empty template
├── config.json      ← initialized with defaults
├── phases/          ← empty, will be populated per phase
├── research/        ← written in Step 4 (if research was done)
├── quick/
├── milestones/
│   └── v1.0/
├── todos/
│   ├── pending/
│   └── done/
└── debug/
    └── resolved/
```

Write STATE.md with initial state.

Commit everything:
```
git add .spec/
git commit -m "go-spec: initialize project specification"
```

### Step 9: Summary

Print a summary:

```
Project initialized!

  Vision: [one-line summary]
  Phases: [N] phases planned

Next steps:
  /gs:discuss 1   — Capture design decisions for Phase 1
  /gs:plan 1      — Research and plan Phase 1
  /gs:status      — See full project status
```

---

## Config

Initialize `.spec/config.json` with:

```json
{
  "version": "1.0.0",
  "mode": "interactive",
  "depth": "standard",
  "workflow": {
    "research": true,
    "plan_check": true,
    "verifier": true,
    "auto_advance": false
  },
  "parallelization": {
    "enabled": true,
    "max_concurrent_agents": 3
  },
  "gates": {
    "confirm_phases": true,
    "confirm_roadmap": true
  },
  "models": {
    "profile": "balanced"
  },
  "git": {
    "branching": "none",
    "commit_docs": true
  }
}
```
