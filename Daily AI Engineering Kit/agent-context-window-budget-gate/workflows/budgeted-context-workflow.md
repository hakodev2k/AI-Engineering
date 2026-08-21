# Budgeted Context Workflow

## Trigger
An AI engineering task needs repository/log/tool context that may approach the model context limit or run across multiple execution stages.

## Entry conditions
Task and constraints exist; repository is readable; token policy is configured.

## Inputs
Task, acceptance criteria, repository root, candidate sources.

## Stages
1. **Anchor** — workflow owner records task, constraints, approvals, and acceptance criteria.
2. **Discover** — Context Curator identifies entry points, changed files, tests/contracts, then nearby evidence.
3. **Budget** — Curator runs `scripts/context_budget.py` and produces `context-manifest.json`.
4. **Compress** — only manifest items marked `summarize` are structurally summarized with source references.
5. **Verify context** — Context Verifier runs `scripts/verify_manifest.py` and samples high-impact summaries.
6. **Execute task** — downstream agent works only after status is `ready` or accepted `warning`.
7. **Refresh checkpoint** — after meaningful edits, changed requirements, or hypothesis-changing test output, run `skills/context-refresh.md`.
8. **Final verify** — ensure current evidence, constraints, and verification inputs still fit budget.

## Checkpoints
Before execution; after context compression; after meaningful implementation changes; before final verification.

## Retry rules
Maximum two total context-reduction/refresh retries. Retry only for oversized context, stale evidence, or missing direct dependency. Preserve previous manifests and failure reason. Third failure stops and escalates.

## Approval points
Human approval is required before dropping user constraints, security rules, or acceptance criteria. Normal low-priority context exclusion requires no approval when reason and source are recorded.

## Failure paths
Missing source -> stop discovery and report path. Blocked budget -> reduce low-priority context. Invalid summary -> re-read exact source once. Tool failure -> retry once if transient, otherwise stop with command/output.

## Definition of Done
Manifest validates; usable budget is not exceeded; mandatory constraints are preserved; verifier returns `verified`; no stale evidence is treated as current; downstream task has sufficient source-linked evidence.
