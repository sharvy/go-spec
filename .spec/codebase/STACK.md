# Tech Stack

## Runtime & Language
- **JavaScript** (Node.js) — CommonJS modules (`require`)
- **Node.js** ≥ 18.0.0 (required via `engines` in `package.json`)
- **Markdown** — all commands, agents, and spec artifacts are `.md` files

## Frameworks
- None — go-spec is a zero-dependency CLI tool; no web framework, no bundler

## Build & Tooling
- **npm** — package manager and distribution (`npx go-spec@latest`)
- `bin/install.js` — interactive/non-interactive installer (582 lines)
- `scripts/build.js` — pre-publish validation script (checks all expected files exist and are non-empty)
- **No test framework** — see TESTING.md
- **No bundler** — source shipped directly via npm `files` field
- **No transpiler** — plain ES2020+ JavaScript, no TypeScript

## Package Info
| Field | Value |
|-------|-------|
| Name | `go-spec` |
| Version | `1.0.0` |
| License | MIT |
| Entry | `bin/install.js` |
| Published files | `bin/`, `commands/`, `agents/`, `hooks/`, `templates/`, `scripts/` |

## Key Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| *(none)* | — | Zero runtime dependencies |
| *(none)* | — | Zero devDependencies |

## Node Built-ins Used
| Module | Where |
|--------|-------|
| `fs` | All JS files — file I/O |
| `path` | All JS files — path resolution |
| `os` | `install.js`, hooks — home dir, temp dir |
| `readline` | `install.js` — interactive prompts |
| `child_process` | `install.js` — `execSync` (imported but not used in current code) |
| `https` | `gs-update-checker.js` — npm registry fetch |
