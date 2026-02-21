# /gs:debug [description] — Start a Systematic Debug Session

Open or resume a structured debug session using hypothesis-driven investigation.
Bugs are solved with the scientific method — not random code changes.

---

## Usage

```
/gs:debug
/gs:debug "User authentication fails after token refresh"
/gs:debug resume [session-id]
```

---

## Process

### Step 1: Start or Resume

**New session:**
- Generate session ID: `[date]-[slug]` (e.g., `2025-01-15-auth-token-refresh`)
- Create `.spec/debug/[session-id]/SESSION.md`
- Get the bug description if not provided as argument

**Resume session:**
- Read `.spec/debug/[session-id]/SESSION.md`
- Print investigation progress so far
- Continue from where it stopped

### Step 2: List Active Sessions

If no specific session is mentioned, check for active sessions:

```
Active debug sessions:
  2025-01-14-login-fail — hypothesis 3 of 5 (open 2 days)
  2025-01-15-auth-refresh — just started

Options:
  1. Resume: 2025-01-14-login-fail
  2. Resume: 2025-01-15-auth-refresh
  3. Start new session
```

### Step 3: Reproduction

Before any investigation, confirm the bug can be reproduced:

"What are the exact steps to trigger this bug? What's the exact error or wrong behavior?"

Once reproduction steps are defined:
- Attempt to reproduce using available tools (Bash, Read, etc.)
- If reproduced: confirm and proceed
- If not reproduced: note this in SESSION.md — intermittent bugs need different approach

### Step 4: Hand Off to gs-debugger

Spawn `gs-debugger` agent with:
- The session file contents
- Reproduction steps
- The codebase (full access)

The debugger:
1. Maintains the hypothesis log in SESSION.md
2. Investigates systematically
3. Confirms root cause before fixing
4. Implements and verifies the fix
5. Commits with clear message explaining root cause

### Step 5: Close or Continue

**If resolved:**
Move SESSION.md to `.spec/debug/resolved/[session-id].md`.

Print:
```
✓ Debug session resolved.
  Root cause: [one-line summary]
  Fix: [commit hash] — [commit message]
  Prevention: [test added / check added]
```

**If blocked or incomplete:**
SESSION.md remains in `.spec/debug/[session-id]/`.

Print:
```
Session paused. Resume with:
  /gs:debug resume [session-id]
```

---

## Debug Session Index

The `/gs:debug` command maintains a session index at `.spec/debug/INDEX.md`:
- All active sessions with current status
- All resolved sessions with root cause summary
- Patterns (multiple bugs with same root cause are flagged)
