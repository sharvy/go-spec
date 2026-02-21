# Todo: /gs:cancel command

Captured during /gs:init (2026-02-22)

Users have no way to safely abort a multi-step command (e.g. /gs:init) mid-flow.
Implement /gs:cancel as a first-class command that:
- Stops the current flow
- Cleans up any partially-written .spec/ files
- Confirms to the user
- Responds gracefully when nothing is in progress

Covered by REQ-003 in REQUIREMENTS.md. Planned for Phase 2.
