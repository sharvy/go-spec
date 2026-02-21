# Architecture

## Structure Overview

go-spec is a **command + agent framework** that ships as an npm package. It installs markdown-based instruction files into AI runtime configurations (Claude Code or Antigravity), where they are interpreted by the AI at runtime. The project itself contains no application logic beyond the installer and hooks — the "code" is the markdown specifications.

```
┌──────────────────────────────────────────────┐
│  npm package (go-spec)                       │
│                                              │
│  commands/gs/*.md   → slash commands         │
│  agents/*.md        → spawnable agents       │
│  hooks/*.js         → lifecycle hooks        │
│  templates/**       → spec file templates    │
│  bin/install.js     → installer CLI          │
│  scripts/build.js   → pre-publish validator  │
└──────────────────────────────────────────────┘
        │
        ▼  npx go-spec / install.js
┌──────────────────────────────────────────────┐
│  Target AI Runtime                           │
│                                              │
│  Claude Code:                                │
│    .claude/commands/gs/*.md                  │
│    .claude/agents/*.md                       │
│    .claude/hooks/go-spec/*.js                │
│    .claude/settings.json  (hook registration)│
│                                              │
│  Antigravity:                                │
│    .agent/workflows/gs/*.md                  │
│    .agent/skills/*.md                        │
│    (no hooks — not supported)                │
└──────────────────────────────────────────────┘
```

## Directory Map

| Directory | Contents |
|-----------|----------|
| `bin/` | `install.js` — the npm `bin` entrypoint, interactive CLI installer |
| `commands/gs/` | 27 slash command definitions (`.md`), each defining a `/gs:*` command |
| `agents/` | 12 agent definitions (`.md`), each a spawnable specialist |
| `hooks/` | 3 Claude Code lifecycle hooks (`.js`) — statusline, context monitor, update checker |
| `templates/project/` | 5 template files for `.spec/` initialization (`PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md`, `config.json`) |
| `templates/phases/` | 5 per-phase template files (`CONTEXT.md`, `PLAN.md`, `RESEARCH.md`, `SUMMARY.md`, `VERIFICATION.md`) |
| `scripts/` | `build.js` — pre-publish validation |
| `docs/` | Empty (reserved) |
| `.claude/` | Local Claude Code config: `settings.json` + nested `commands/`, `agents/`, `hooks/` |
| `.agent/` | Local Antigravity config: `workflows/` (27 items) + `skills/` (12 items) |
| `.github/` | GitHub workflows |

## Data Flow

### Install Flow
```
User runs `npx go-spec@latest`
  → bin/install.js parses args
  → Interactive: prompt for runtime (Claude/Antigravity) + scope (global/local)
  → Non-interactive: use --claude/--antigravity + --global/--local flags
  → Copy commands/*.md → target commands dir
  → Copy agents/*.md → target agents dir
  → Copy hooks/*.js → target hooks dir (Claude Code only)
  → Register hooks in settings.json (Claude Code only)
  → Write .version marker
```

### Runtime Flow (when user invokes a command)
```
User types "/gs:init" in AI runtime
  → Runtime loads commands/gs/init.md
  → AI follows step-by-step instructions in the markdown
  → Agents are spawned as sub-processes (e.g., gs-project-researcher)
  → Artifacts written to .spec/ in the user's project
  → Hooks fire on each tool use (Claude Code only):
      • PreToolUse:  gs-statusline.js renders status bar
      • PostToolUse: gs-context-monitor.js checks context usage
```

### Hook Communication
```
gs-statusline.js (PreToolUse)
  → Reads .spec/STATE.md for current task
  → Reads context_window from stdin
  → Writes bridge file to /tmp/go-spec-context.json
  → Outputs { statusline: "..." }

gs-context-monitor.js (PostToolUse)
  → Reads context from stdin or bridge file
  → Checks thresholds (60%, 80%, 90%)
  → Outputs { message: "..." } when threshold exceeded

gs-update-checker.js (PreToolUse)
  → Checks npm registry once per 24h
  → Compares semver with local version
  → Outputs { message: "..." } when update available
```

## Module Boundaries

- **Installer** (`bin/install.js`) is self-contained — no shared code with hooks
- **Hooks** are independent of each other, communicate only via a bridge file (`/tmp/go-spec-context.json`)
- **Commands** and **agents** are pure markdown — they share no code, only conventions
- **Templates** are passive files copied verbatim by commands at runtime
- The project supports two runtimes defined in `RUNTIMES` object in `install.js`, using different dir naming (`commands`⇔`workflows`, `agents`⇔`skills`)
