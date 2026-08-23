# Skill: Context Scope Audit

## Purpose
Minimize child-agent context without losing correctness by enforcing source scope, freshness, and child-local budget.

## Trigger
Before any subagent spawn; after changing an inherited instruction/memory source; when child token cost or compaction frequency rises.

## Inputs
Child agent definition, target model/window, context-source manifest, token counts, capture timestamps, and current source metadata.

## Preconditions
Required security/user/task constraints are identified. Token estimates use the target child model when available.

## Allowed tools
Read-only filesystem metadata, tokenizer/counter, `context_contract_audit.py`, request tracing.

## Constraints
Never delete required context merely to meet budget. Never treat a cache hit as proof a source is current.

## Procedure
1. Capture baseline input tokens and task quality for representative child runs.
2. Build a manifest entry for every inherited source: `name`, `kind`, `tokens`, `required`, `opted_in`, `captured_at`, `current_mtime`.
3. Mark user/task/security/governance instructions required unless explicitly superseded.
4. Flag optional memory with `opted_in=false` for exclusion.
5. Flag required sources whose current metadata is newer than the captured snapshot for one refresh.
6. Recalculate total tokens for the actual child model/window.
7. If required sources alone exceed budget, block optimization and escalate/model-route; do not truncate silently.
8. Dispatch with the final manifest and record it with the child run.
9. Compare tokens, latency, quality, and missing-context regressions.

## Decision points
Optional + not opted in → exclude. Required + stale → refresh once. Required total > budget → block/escalate. Optional total pushes over budget → omit only declared optional sources according to host relevance policy.

## Expected output
Final source manifest, total tokens, exclusion list, refresh list, and allow/block decision.

## Metrics
Tokens/subagent, optional-context ratio, stale-source count, dispatch latency, quality/regression rate.

## Verification
Replay fixtures for undeclared memory, stale required source, over-budget required context, duplicate source names, and clean payload.

## Failure handling / Stop conditions
Maximum one refresh/re-audit cycle. Stop on unknown source provenance, invalid token count, or required context over budget.