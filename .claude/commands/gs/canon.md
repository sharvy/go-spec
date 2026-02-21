# /gs:canon [domain] [--all] [--from-tests] [--update] — Build Living System Documentation

Build or update `canon/` — a directory of plain-English documents describing what each
part of your system actually does today, based on evidence in tests and source code.

Designed for brownfield codebases. Especially effective when you have an existing test
suite (RSpec, Jest, pytest, etc.) because tests are treated as the highest-trust source.

---

## Flags

- `[domain]` — Build or update canon for one specific domain (e.g., `canon auth`)
- `--all` — Bootstrap canon for all detected domains in parallel
- `--from-tests` — Prioritize test files as primary source (recommended for RSpec projects)
- `--update` — Refresh an existing canon file (re-reads code, preserves manual additions)
- `--list` — Show detected domains without building anything

---

## What Gets Created

```
canon/
├── auth.md          ← what auth does today
├── billing.md       ← what billing does today
├── notifications.md
└── _index.md        ← auto-generated index of all canon documents
```

Each file is written for AI agents to read before working in that domain. They describe
behavior, contracts, dependencies, test coverage, and known gaps — not implementation.

---

## Process

### Step 1: Check Prerequisites

Read `.spec/PROJECT.md` to understand the project context.
Read `.spec/STATE.md` for the established tech stack.

Check if `canon/` exists. If not, create it.

### Step 2: Identify Domains

**If a domain was specified:** Use it directly. Skip domain detection.

**If `--all` or no domain given:** Detect domains from the codebase structure.

Domain detection strategy (try in order, combine results):

1. **Test directory structure** — top-level subdirectories under `spec/`, `test/`, `tests/`, `__tests__/`
   ```
   spec/
   ├── models/auth/    → domain: auth
   ├── services/billing/ → domain: billing
   ```

2. **Source directory structure** — top-level subdirectories under `app/`, `src/`, `lib/`
   ```
   app/services/
   ├── auth_service.rb    → domain: auth
   ├── billing_service.rb → domain: billing
   ```

3. **Routes file** — group routes by prefix
   ```
   /auth/*   → domain: auth
   /billing/* → domain: billing
   ```

4. **Ask the user** if detection is ambiguous:
   ```
   Detected possible domains: auth, billing, users, admin, api, reporting
   Which domains should be included? (comma-separated, or 'all'):
   ```

Deduplicate and normalize domain names to lowercase-hyphenated slugs.

Print detected domains and ask for confirmation if `--all`:
```
Detected 6 domains:
  auth, billing, users, notifications, admin, reporting

Build canon for all 6? This will spawn 6 parallel agents.
```

### Step 3: Locate Files Per Domain

For each domain, build a file manifest:

**Test files** (highest trust):
```
spec/**/[domain]*.rb
spec/**/[domain]/**/*.rb
test/**/[domain]*.{js,ts,py,go}
**/__tests__/**/[domain]*.{js,ts}
```

**Source files**:
```
app/models/[domain]*.rb
app/services/[domain]*.rb
app/controllers/[domain]*.rb
src/[domain]/**/*.{ts,js,py,go}
lib/[domain]*.rb
```

**Route/contract files** (check all, filter by domain):
```
config/routes.rb
src/routes/**
routes/[domain].ts
openapi.yaml / swagger.yaml
```

**Database schema** (if present):
```
db/schema.rb
prisma/schema.prisma
migrations/ (recent ones touching domain tables)
```

Print the file manifest per domain before running agents:
```
Domain: auth
  Tests (8 files):  spec/models/user_spec.rb, spec/controllers/auth_controller_spec.rb, ...
  Source (5 files): app/models/user.rb, app/controllers/auth_controller.rb, ...
  Routes:           config/routes.rb (filtered to /auth/*)
  Schema:           db/schema.rb (users, sessions tables)
```

### Step 4: Spawn Canon Builder Agents

**Single domain:** Spawn one `gs-canon-builder` agent synchronously.

**Multiple domains (`--all`):** Spawn all `gs-canon-builder` agents in parallel (respecting `config.json → parallelization.max_concurrent_agents`). Each agent:
- Receives its domain name and file manifest
- Writes to `canon/[domain].md`
- Works in a completely fresh context window (no cross-domain knowledge sharing needed)

Pass to each agent:
- Domain name
- Full file manifest with paths
- Tech stack from STATE.md (so it knows the test framework)
- The `--from-tests` flag if set (instructs agent to weight tests heavily)
- Output path: `canon/[domain].md`

### Step 5: Write Index

After all agents complete, write `canon/_index.md`:

```markdown
# Canon Index

> Living documentation of what this system does today.
> Built from test files and source code — not aspirational, not planned, just real.
> Last updated: [timestamp]

## Domains

| Domain | Confidence | Capabilities | Gaps | Last Updated |
|--------|-----------|--------------|------|--------------|
| [auth](auth.md) | High | Login, Registration, Password Reset | None | [date] |
| [billing](billing.md) | Medium | Subscriptions, Invoicing | Payment retry untested | [date] |

## Coverage Summary

- **[N] domains** documented
- **[N] capabilities** described
- **[N] gaps** identified (behaviors with no test coverage)

## How to Use This

Before working in any domain:
1. Read `canon/[domain].md` to understand current behavior
2. Check "Gaps" — untested areas need extra care
3. After your work, run `/gs:canon [domain] --update` to reflect changes
```

### Step 6: Commit

```
git add canon/
git commit -m "go-spec: build canon for [domain(s)]"
```

Print summary:
```
Canon built for [N] domain(s):

  ✓ auth          — High confidence, 12 capabilities, 0 gaps
  ✓ billing       — Medium confidence, 8 capabilities, 3 gaps
  ✓ notifications — Low confidence, 4 capabilities, 7 gaps (sparse tests)

  canon/_index.md updated

Gaps found: billing (payment retry), notifications (delivery tracking, bounce handling)
Consider adding tests for these before next /gs:plan in those domains.

Next:
  /gs:canon [domain] --update   — Refresh after making changes
  /gs:plan [N]                  — Planners will now read canon/ automatically
```

---

## Updating Canon After Changes

When `/gs:run` completes a phase that modifies a domain, the executor's PLAN.md should
include a task: "Update canon/[domain].md to reflect changes."

For manual updates:
```
/gs:canon auth --update
```

The `--update` flag:
1. Reads the existing `canon/auth.md`
2. Re-reads the relevant code and tests
3. Identifies what changed since last build
4. Updates only the sections that changed
5. Preserves any manually written content (marked with `<!-- manual -->`)

---

## Integration with the Rest of go-spec

**`/gs:init`** — If `canon/` exists when a project is initialized, agents are told to
read it. If it doesn't exist and the project has existing code, init suggests running
`/gs:canon --all` first.

**`/gs:plan`** — The `gs-planner` agent checks for `canon/[domain].md` and reads it
before creating plans. This prevents plans that contradict established behavior.

**`/gs:run`** — After a phase executes, `/gs:canon [affected domains] --update` is
suggested (or auto-run if `config.json → workflow.auto_update_canon` is true).

**`/gs:map`** — Complements canon. `/gs:map` describes HOW the code is structured
(architecture, conventions, stack). `canon/` describes WHAT the system does (behavior,
contracts, capabilities). Run `/gs:map` first, then `/gs:canon`.

---

## For 10-Year-Old Codebases

**Don't try to document everything on day one.** Start with the domain you're about to
work on. The recommended sequence:

```
1. /gs:map                   — understand the structure first
2. /gs:canon auth --from-tests  — document the domain you're touching next
3. /gs:plan [N]              — planner reads canon/auth.md automatically
4. /gs:run [N]               — executor updates canon/auth.md after changes
```

Over 6 months of normal development, canon/ fills in naturally — you document as you go,
only for domains you're actively working in.

**`--from-tests` is strongly recommended for RSpec projects.** It tells the agent to
treat your test suite as the primary source of truth, which for a mature test suite is
exactly right. Tests that have survived 10 years of production are more reliable than
any source code comment.
