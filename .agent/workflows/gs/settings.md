# /gs:settings — Configure go-spec Behavior

View and modify go-spec configuration stored in `.spec/config.json`.

---

## Process

### Step 1: Load Config

Read `.spec/config.json`. If it doesn't exist, create it with defaults.

### Step 2: Show Current Config

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  go-spec Settings
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Mode
  mode: interactive          [interactive / yolo]
  depth: standard            [quick / standard / comprehensive]

Workflow Steps
  research:    on            Enable domain research before planning
  plan_check:  on            Review plans before execution
  verifier:    on            Goal-backward verification after execution
  auto_advance: off          Auto-approve human-verify checkpoints

Parallelization
  enabled: on
  max_concurrent_agents: 3

Approval Gates
  confirm_phases:   on       Ask before executing a phase
  confirm_roadmap:  on       Ask before finalizing roadmap

Models
  profile: balanced          [quality / balanced / budget]

Git
  branching: none            [none / phase / milestone]
  commit_docs: on            Commit planning docs to git
```

### Step 3: Interactive Editing

Ask: "Which setting would you like to change? (or 'done' to exit)"

For each setting the user wants to change:
1. Show current value and options
2. Get new value
3. Validate it
4. Update config

Repeat until user is done.

### Step 4: Save and Commit

Write updated `config.json`.

```
git add .spec/config.json
git commit -m "go-spec: update settings"
```

Print:
```
Settings saved.
```

---

## Settings Reference

### `mode`
- `interactive` — Asks for confirmation at key points (default)
- `yolo` — Minimal interruptions; auto-advances past most gates

### `depth`
- `quick` — Shorter research, fewer plans, faster iteration
- `standard` — Balanced depth (default)
- `comprehensive` — Thorough research, detailed plans, maximum verification

### `workflow.research`
Controls whether `gs-phase-researcher` is spawned during `/gs:plan`.
Disable for well-understood tech stacks or when speed is prioritized.

### `workflow.plan_check`
Controls whether `gs-plan-checker` reviews plans before execution.
Disable for simple phases or when you've reviewed plans manually.

### `workflow.verifier`
Controls whether `gs-verifier` runs after `/gs:run`.
Strongly recommended to keep enabled.

### `workflow.auto_advance`
When `true`, human-verify checkpoints in plans are auto-approved.
Human-action checkpoints (external auth, deployments) still pause.

### `parallelization.max_concurrent_agents`
Maximum agents to run simultaneously. Default: 3.
Reduce if you're hitting rate limits or want to reduce API costs.

### `git.branching`
- `none` — All commits go to the current branch (default)
- `phase` — Create `spec/phase-[N]-[slug]` branch per phase
- `milestone` — Create `spec/[milestone]-[slug]` branch per milestone
