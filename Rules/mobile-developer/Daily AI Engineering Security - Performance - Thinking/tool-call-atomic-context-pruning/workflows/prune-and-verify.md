# Workflow — Prune and Verify Agent Context

## Trigger
The next model invocation would exceed the configured input budget, or a memory backend is about to return a bounded history window.

## Goal
Reduce context while preserving tool-call protocol integrity, current goal constraints, and representative task quality.

## Inputs
Structured history, `config/budget.json`, provider validity rules, protected context policy, representative regression tasks.

## Baseline
Capture estimated/actual input tokens, context utilization, tool-call transaction count, current provider error rate, cost/latency when available, and task-quality/verification result.

## Context
Messages with tool calls are structured protocol state. They are not independent text records.

## Stages
1. **Observe** — collect current history and budget metrics.
2. **Measure baseline** — run integrity validation and representative task(s).
3. **Diagnose** — identify token-heavy oldest complete units and any malformed history.
4. **Form hypothesis** — select oldest unprotected atomic units for removal; reserve output capacity.
5. **Implement** — run `scripts/context_pruner.py`; do not invent missing tool results.
6. **Measure again** — record token estimate, units retained/dropped, provider validity, latency/cost where available.
7. **Improved?** — if target is not met, perform at most one additional strategy iteration (for example reviewed summarization of complete units). If only protected context remains, stop with budget-unmet status.
8. **Regression verification** — run representative tasks and compare quality/verification status.
9. **Independent review** — `subagents/context-integrity-verifier.md` verifies structure and quality evidence.
10. **Complete** — mark Implemented, Measured, Verified separately.

## Responsible agent
Context optimization owner for stages 1–8; independent Context Integrity Verifier for stage 9.

## Tools
`context_pruner.py`, token counters/estimators, unit tests, provider-compatible fixtures, benchmark harness.

## Outputs
Pruned history, budget metrics, integrity report, regression comparison, stop/failure reason, verifier result.

## Checkpoints
- Input history valid before pruning.
- No atomic unit split after pruning.
- Protected current-goal/safety context retained.
- Budget and output reserve explicit.
- Quality regression checked before rollout.

## Metrics
Input tokens/estimate, cost/task, latency/task, units dropped, orphan/unanswered count, provider 4xx rate, context utilization, task-quality score, regression rate.

## Retry policy
Maximum two optimization strategies per run. A provider rejection caused by malformed history is not retried with unchanged history.

## Stop conditions
Stop if input is malformed, only protected units remain above budget, accepted quality threshold is exceeded, or further reduction would remove required correctness/security context.

## Failure path
Keep/restore the last valid history, emit exact structural/budget evidence, disable the faulty pruning path when necessary, and escalate to a larger context, retrieval-based loading, or explicit checkpoint/summarization design.

## Verification
Zero structural violations, measurable context reduction when required, no provider schema error from pruning, and representative quality within the accepted threshold.

## Definition of Done
Evidence documented; baseline captured; atomic pruning implemented; post-change budget measured; tests pass; quality comparison complete; residual risks documented; independent verification complete; no blocking issue remains.
