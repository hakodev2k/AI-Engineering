# Agent Change Scope Guard
A deterministic, repository-portable guard that prevents an AI coding agent from exceeding an approved file/line-change envelope. Use for bounded code changes; not a substitute for tests, security scanning, or code review.

## Requirements and installation
Git and Node.js 20+. Copy this package's `config/`, `scripts/`, `tests/`, `skills/`, `rules/`, `subagents/`, `workflows/`, and `hooks/` into your agent workspace preserving relative paths. Invoke commands from the repository root. Customize the allowlist and limits in `config/policy.json` before work begins. Keep reports in ignored `artifacts/`.

## Files
- `config/policy.json`: allowlist, denylist, size limits and baseline policy.
- `scripts/scope-guard.mjs`: deterministic Git diff guard and JSON report.
- `tests/scope-guard.test.mjs`: isolated Git fixture tests.
- `rules/change-boundaries.md`: enforceable operating constraints.
- `skills/controlled-edit.md`: edit procedure.
- `subagents/independent-verifier.md`: independent verification role.
- `workflows/controlled-change.md`: bounded execution and recovery.
- `hooks/lifecycle.md`: integration points.
- `examples/run.md`: example commands.

## Usage
```sh
node --test tests/scope-guard.test.mjs
node scripts/scope-guard.mjs --mode working --base HEAD --policy config/policy.json --report artifacts/scope-report.json
```
Modes: `working` compares tracked working-tree changes to base; `staged` compares index to base; `commit` compares HEAD to base. Git untracked files are **not** included in working diff: stage new files and run staged mode before approval. Rename paths are evaluated from Git numstat output; inspect rename/delete metadata manually. Binary changes are flagged for review. Never assume a clean scope report means a clean worktree.

## Approval and recovery
Human approval is required before blocked/sensitive paths, database migrations, production configuration, destructive actions, security weakening, or push. Guard failures stop the agent; two bounded repair attempts maximum, no silent policy expansion. Exit codes: 0 pass, 2 scope failure, 3 execution/config failure.

## Verification / DoD
Run unit tests, guard on staged changes, project-specific build/tests, and independent diff review. Completion requires passing evidence, approved changes only, and documented residual risks. The guard writes JSON with `pass`, `errors`, `totals`, and per-file reasons. Customize path patterns to project conventions; patterns support `*`, `?`, and `**`.
