# Skill — Build Safe Resume Bundle

## Purpose
Reduce session-resume token/cost overhead while preserving correctness-critical continuity.

## Trigger
Resume after interruption, usage/tool cap, compaction, handoff, or parked-session restore.

## Inputs
Context items as JSON records containing `id`, `section`, `content`, `critical`, `source`, and optional `freshness`; model/context budget; `config/budget.json`.

## Preconditions
Critical sections are identified. Source artifacts remain available for lazy loading. Token estimates are treated as estimates unless provider tokenizer telemetry is available.

## Required context
Active goal, acceptance criteria, unresolved risks/failures, current workspace/branch state, approvals, and security constraints.

## Allowed tools
Repository/file reads, tokenizer when available, `scripts/resume_budget.py`, provider usage telemetry, deterministic hashing.

## Constraints
Never discard a critical item solely because it is large. Never trust a stale tool-derived fact for high-impact work. Never claim cost reduction without before/after measurement.

## Procedure
1. Inventory all candidate resume context by source and section.
2. Mark critical items from policy and task semantics.
3. Normalize/hash static items and remove exact/whitespace-equivalent duplicates.
4. Mark stale or provenance-free tool facts for revalidation.
5. Estimate token load using provider tokenizer when available; otherwise record the estimator used.
6. Keep all critical items; rank noncritical items by relevance/freshness and place overflow in lazy-load manifest.
7. Enforce the per-step lazy-load and rediscovery budgets.
8. Resume on a fixture and compare result quality against full-context reference.
9. Record estimated/actual tokens, cache behavior, rediscovery calls, and critical-field coverage.

## Decision points
If critical content alone exceeds the budget, do not truncate: escalate to a larger-context model or explicit compaction with field-level verification. If a stale fact is required, revalidate it. If quality regresses, restore the missing source class and rerun once.

## Expected output
Resume bundle, lazy-load manifest, duplicate report, freshness warnings, token estimate, and verification result.

## Metrics
Input tokens/resume, cache creation/read tokens, context utilization, duplicate tokens removed, rediscovery calls, quality regression rate, critical-field recall.

## Verification
Critical-field recall must be 100% on fixtures and quality regression must not exceed configured tolerance.

## Failure handling
At most two replan attempts. Fallback is full safe context or larger context window, never silent loss of critical information.

## Stop conditions
Critical-field omission, unbounded rediscovery, exhausted retries, or unresolved high-impact stale state.
