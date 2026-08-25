# Skill — Capability Context Accounting

## Purpose
Prove that a capability-context optimization reduces the whole effective context rather than merely moving tokens between accounting categories.

## Trigger
Before and after hiding/disabling tools or skills, enabling tool search/lazy loading, deduplicating catalogs, compressing schemas, changing plugins/apps/connectors, or upgrading the agent host.

## Inputs
Baseline snapshot, candidate snapshot, token budget policy, and independent task-quality results.

## Preconditions
Snapshots are taken at the same lifecycle point with comparable model/runtime configuration and capability inventory except for the intended change.

## Required context
Which capability material is expected to disappear, why it is safe to remove from eager context, and what tasks exercise the affected capabilities.

## Allowed tools
Host context inspector/token meter, provider usage metadata, read-only logs, Python 3, and the supplied reconciliation script.

## Constraints
Do not optimize only a UI bucket. Do not count prompt-cache reuse as recovered context-window capacity. Do not drop instructions required for correctness or security.

## Procedure
1. Capture baseline `total_tokens` and category token counts at a fixed lifecycle point.
2. Record expected removed tokens and total budget in policy.
3. Apply one bounded hypothesis: disable/hide, deduplicate, lazy-load, compress, or stabilize ordering.
4. Capture candidate snapshot at the same lifecycle point.
5. Run `python scripts/context_budget_reconcile.py --baseline <b.json> --candidate <c.json> --policy <p.json>`.
6. If the guard fails, inspect `ineffective-removal` and `category-displacement` evidence before changing another mechanism.
7. Measure cold-start latency, tokens/task, cache metrics, and task-quality regression where available.
8. Accept only when token guard and independent quality floor both pass.

## Decision points
- If total context drops but quality regresses, reject the optimization.
- If one category shrinks while another grows above policy, classify as displacement and investigate serialization ownership.
- If total context is stable but cache hit rate improves, report a cache optimization, not a context reduction.

## Expected output
Reconciliation JSON plus baseline/candidate snapshots, quality result, and accepted/rejected decision.

## Metrics
Total tokens, effective reduction, category deltas, cold-start latency, cache hit/read/create tokens, tokens/task, cost/task, task pass rate, regression rate.

## Verification
Run `tests/test_context_budget_reconcile.py`; integration verification must use real host snapshots and an unchanged task-quality suite.

## Failure handling
Retry at most three different optimization hypotheses. Preserve failed measurements. Restore the last verified configuration when quality/security fails.

## Stop conditions
Pass both token and quality gates; three failed hypotheses; measurement is not comparable; or a correctness/security regression is detected.
