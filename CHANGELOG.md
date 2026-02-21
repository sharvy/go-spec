# Changelog

All notable changes to go-spec are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.0] - 2025-01-01

### Added
- Initial release of go-spec
- `/gs:init` — Spec-driven project initialization with deep questioning
- `/gs:discuss` — Capture design context before planning
- `/gs:plan` — Research + plan + verify for a phase
- `/gs:run` — Wave-based parallel plan execution
- `/gs:verify` — Goal-backward verification
- `/gs:quick` — Ad-hoc task with spec guarantees
- `/gs:status` — Project progress overview
- `/gs:resume` — Resume from previous session
- `/gs:pause` — Create handoff checkpoint
- `/gs:map` — Brownfield codebase analysis
- `/gs:add-phase`, `/gs:insert-phase`, `/gs:remove-phase` — Phase management
- `/gs:milestone-start`, `/gs:milestone-done`, `/gs:milestone-audit` — Milestones
- `/gs:todo`, `/gs:todos` — Idea capture and tracking
- `/gs:debug` — Scientific debugging sessions
- `/gs:settings`, `/gs:profile` — Configuration management
- `/gs:update` — Self-update capability
- `/gs:health` — Spec directory validation and repair
- 11 specialized agents for each workflow role
- 3 Claude Code hooks: statusline, context monitor, update checker
- Zero runtime dependencies
