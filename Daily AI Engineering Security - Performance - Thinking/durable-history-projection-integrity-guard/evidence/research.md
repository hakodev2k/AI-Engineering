# Research — Durable History Projection Integrity Guard

## Topic
Detect and recover from divergence between durable agent transcripts and projected/rendered conversation history.

## Category
Thinking

## Problem
Long-running AI coding sessions increasingly persist rich event streams and later materialize them into paginated/resumable UI history. Current failures can leave the durable rollout complete while projection stops early, mislabels completed turns as interrupted/in-progress, drops recent tool activity, or exposes only a recent subset. Agents and users then reason from an incomplete or contradictory history, causing repeated work, false recovery actions, missed final answers, and incorrect conclusions about task state.

## Why it matters now
Multiple August 2026 reports across Codex Desktop/CLI and Claude Code describe durable or local transcript data that remains present while the UI/resume projection is incomplete or semantically wrong. Fresh reports on 2026-08-24 and 2026-08-25 specifically implicate paginated history projection and renderer hydration.

## Affected users
Developers resuming long-running coding sessions, multi-agent users switching threads/worktrees, desktop/IDE users relying on projected history, platform builders implementing durable event logs and pagination, and support/observability teams diagnosing supposedly lost sessions.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #40342, opened 2026-08-24, reports paginated history projection stopping at a `token_count` record. Later turns and final answers remain in durable rollout, while projection cursor stalls and reopening does not repair history. https://github.com/openai/codex/issues/40342
2. OpenAI Codex issue #40452, opened 2026-08-24, reports completed paginated histories being replaced in Desktop by only an initial interrupted turn after update. https://github.com/openai/codex/issues/40452
3. OpenAI Codex issue #40563, opened 2026-08-25, reports restored threads that are objectively idle while paginated history persists the final turn as `inProgress`. https://github.com/openai/codex/issues/40563
4. OpenAI Codex issue #40601, opened 2026-08-25, reports Windows Desktop rendering only a recent subset even when durable rollout, projection, and app-server pagination are complete. https://github.com/openai/codex/issues/40601
5. OpenAI Codex issue #37577 reports completed turns reconstructed as `interrupted` on resume even though durable rollout contains subsequent assistant/tool activity and explicit completion evidence. https://github.com/openai/codex/issues/37577
6. Anthropic Claude Code issue #85065, opened 2026-08-08, reports opened agent sessions whose earlier history is effectively unreachable in the mounted terminal while transcript UI silently caps visible messages. https://github.com/anthropics/claude-code/issues/85065
7. Anthropic Claude Code issue #86277 reports session history missing from Desktop UI after data reset while transcripts remain on disk. https://github.com/anthropics/claude-code/issues/86277

### Interpretation
The recurring engineering gap is a missing integrity contract between the authoritative durable log and derived projections. Storage durability alone does not guarantee that resume/UI state is complete, ordered, terminally consistent, or safe to use as the agent's decision context.

## Existing approaches
- Append-only JSONL/event logs as durable source data.
- Pagination cursors and database projections for UI performance.
- Session resume/replay mechanisms.
- Client-side history hydration and recent-message windows.
- Manual inspection of local transcript files when UI history looks wrong.
- Generic application retries/restarts.

## Remaining limitations
- A projection can silently stop on one malformed/unsupported record while durable logging continues.
- Cursor gaps may be retried indefinitely without identifying the blocking record.
- UI state can disagree with durable terminal evidence (`task_complete`, final response, idle status).
- Renderer hydration may expose a subset even when server-side pagination is complete.
- Manual transcript inspection is slow and error-prone, especially across long multi-agent sessions.
- Generic restart/retry can reproduce the same deterministic projection failure.

## Root-cause analysis
1. Durable event schemas evolve faster than projection readers, creating incompatible record variants.
2. Projection pipelines may treat one malformed non-critical event as fatal instead of quarantining it with explicit evidence.
3. Ordinal/cursor continuity is not always independently checked against the authoritative event stream.
4. Terminal status is inferred from projected state instead of reconciled against durable completion evidence.
5. UI hydration completeness is not measured against expected history cardinality/range.
6. Recovery paths often retry the same projection without bounded diagnosis or a repairable quarantine artifact.

## Improvement opportunity
Add a deterministic source-vs-projection audit before treating resumed history as authoritative. Compare ordinal coverage, missing ranges, terminal evidence, projected terminal status, and visible range. Classify failure modes, emit a repair manifest, and stop reasoning from a corrupted projection until the host either rebuilds from durable data or explicitly enters a degraded read-only recovery mode.

## Proposed solution
This package provides a dependency-free audit script for JSONL event streams, enforceable history invariants, a diagnosis skill, an independent verifier role, a bounded rebuild/recovery workflow, a blocking post-resume hook, and regression fixtures for truncation, ordinal gaps, and terminal-state contradiction.

## Goal
Prevent agents and users from treating incomplete or contradictory projected history as authoritative state.

## Metrics
- `projection_coverage_ratio`.
- Missing ordinal count/ranges.
- `terminal_state_mismatch_count`.
- `projection_stall_record_count`.
- Rebuild success rate.
- Repeated-work incidents caused by missing history.
- Mean time to diagnose a resume/history incident.

## Trigger
After resume/reopen/migration, after a projection rebuild, after pagination errors, or whenever projected history is unexpectedly short or terminal state disagrees with runtime state.

## Inputs
Authoritative durable JSONL, projected JSONL, optional declared runtime state.

## Outputs
JSON integrity report with coverage, missing ordinals, terminal evidence, finding codes, and `healthy`/`degraded`/`invalid` status.

## Verification
Implemented means audit/rules/workflow exist. Measured means fixtures quantify coverage and mismatch conditions. Verified means tests pass and an independently produced projection of the same durable fixture is accepted while corrupted projections are rejected.

## Relevant sources
- https://github.com/openai/codex/issues/40342
- https://github.com/openai/codex/issues/40452
- https://github.com/openai/codex/issues/40563
- https://github.com/openai/codex/issues/40601
- https://github.com/openai/codex/issues/37577
- https://github.com/anthropics/claude-code/issues/85065
- https://github.com/anthropics/claude-code/issues/86277
