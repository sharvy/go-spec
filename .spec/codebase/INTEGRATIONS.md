# External Integrations

## npm Registry
- **Purpose:** Update checking — fetches latest published version
- **Library:** Node built-in `https` module (no SDK)
- **Auth:** None (public registry read)
- **Usage:** `hooks/gs-update-checker.js` — `fetchLatestVersion()`
- **URL:** `https://registry.npmjs.org/go-spec/latest`
- **Timeout:** 3000ms
- **Frequency:** Once per 24 hours (state tracked in `/tmp/go-spec-update-state.json`)

## Claude Code Runtime
- **Purpose:** Primary AI runtime for executing commands/agents
- **Integration type:** File-based — commands, agents, and hooks are installed into `.claude/` directory
- **Hook protocol:**
  - Input: JSON on stdin (contains `context_window`, `model`, `workspace` data)
  - Output: JSON on stdout with optional `message` and/or `statusline` fields
  - Events: `PreToolUse` (before each tool call), `PostToolUse` (after each tool call)
- **Config:** `.claude/settings.json` — hook registration via installer

## Antigravity Runtime
- **Purpose:** Secondary AI runtime (alternative to Claude Code)
- **Integration type:** File-based — commands as "workflows" in `.agent/workflows/gs/`, agents as "skills" in `.agent/skills/`
- **Hooks:** Not supported — Antigravity has no hook/lifecycle system
- **Config:** No settings file modified

## Git
- **Purpose:** Version control for spec artifacts and code
- **Library:** Commands reference `git add` and `git commit` in their markdown instructions; `execSync` is imported in `install.js` but not currently used for git
- **Usage:** All commands instruct the AI to commit at workflow completion; executors commit per-task

## File System (Temp Files)
- `/tmp/go-spec-context.json` — bridge between statusline and context monitor hooks
- `/tmp/go-spec-monitor-state.json` — cooldown state for context warnings
- `/tmp/go-spec-update-state.json` — last-checked timestamp and version for update checker

## No Other External Services
- No databases
- No authentication providers
- No message queues
- No cloud services
- The tool explicitly does not transmit data to external servers (per `SECURITY.md`)
