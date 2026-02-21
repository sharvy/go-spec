# Codebase Map

Generated: 2026-02-22T02:50+01:00
Project: go-spec

## Overview
go-spec is a specification-driven AI development workflow tool distributed as an npm package. It installs markdown-based commands and agent definitions into AI runtimes (Claude Code, Antigravity), enabling a structured Specify → Research → Plan → Execute → Verify workflow. The project itself is 143 files (129 markdown, 8 JavaScript, 3 JSON) with zero runtime dependencies.

## Documents
- [STACK.md](STACK.md) — Technology choices and tooling
- [ARCHITECTURE.md](ARCHITECTURE.md) — How the system is structured
- [CONVENTIONS.md](CONVENTIONS.md) — Code patterns and style
- [INTEGRATIONS.md](INTEGRATIONS.md) — External services and APIs
- [TESTING.md](TESTING.md) — Test strategy and coverage
- [CONCERNS.md](CONCERNS.md) — Technical debt and risks

## Key Facts
- **Language:** JavaScript (Node.js ≥ 18, CommonJS)
- **Framework:** None — zero dependencies
- **Database:** None (file-based artifacts in `.spec/`)
- **Test coverage:** 0% behavioral (structural validation only via `scripts/build.js`)
- **Notable concerns:** No test suite for installer or hook logic; hardcoded temp file paths with no workspace isolation; placeholder URLs in `package.json`
