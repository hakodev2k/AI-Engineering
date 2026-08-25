# Workflow — Measure, Reconcile, Optimize

## Trigger
Any change intended to reduce tool/skill/plugin/app/connector context, startup prompt size, or capability-catalog token cost.

## Goal
Reduce effective context/cost/latency while preserving task quality and detecting token displacement between accounting categories.

## Inputs
Baseline/candidate context snapshots, budget policy, quality regression suite, capability inventory.

## Baseline
At the same lifecycle point used for candidate measurement, record total tokens, category tokens, cold-start latency, cache metrics when available, tokens/task, and quality pass rate.

## Context
Visible categories may not uniquely own serialized prompt content. Hidden capabilities can survive in system-tool or plugin metadata, and prompt-cache reuse does not recover context-window capacity.

## Stages
1. **Observe** — inventory active/inactive capabilities and capture whole-context baseline.
2. **Measure baseline** — persist `total_tokens`, category counts, latency/cache/task metrics.
3. **Diagnose** — identify the largest removable or duplicate capability contribution and its serialization paths.
4. **Form hypothesis** — choose exactly one change: hide/disable, deduplicate, lazy-load, compress, or stabilize ordering.
5. **Implement improvement** — preserve correctness/security requirements and a path to load needed capabilities.
6. **Measure again** — capture candidate at the identical lifecycle point.
7. **Reconcile** — run `scripts/context_budget_reconcile.py` against `config/budget.example.json` or project policy.
8. **Improved?** — if no, inspect displacement/ineffective-removal evidence and try a different diagnosed hypothesis; maximum three hypotheses.
9. **Quality verify** — run unchanged representative tasks and enforce the configured quality floor.
10. **Complete** — independent verifier records token result, quality result, risks, and final status.

## Responsible agent
Performance/token owner implements the change; `subagents/context-budget-verifier.md` independently verifies evidence.

## Tools
Host context inspector, usage/latency telemetry, Python 3, supplied reconciler, unchanged task-quality tests.

## Outputs
Baseline/candidate snapshots, policy, reconciliation JSON, quality result, before/after comparison, final acceptance state.

## Checkpoints
Comparable lifecycle point; one hypothesis per iteration; whole-context reconciliation; quality/security gate; independent verification.

## Metrics
Total tokens, effective reduction, category growth, cold-start latency, tokens/task, cost/task, cache hit/read/create, quality pass rate, regression rate.

## Retry policy
Maximum three distinct optimization hypotheses. A retry must follow measured failure evidence; no infinite tuning loop.

## Stop conditions
Both token and quality gates pass; three hypotheses fail; measurements become non-comparable; or correctness/security regression appears.

## Failure path
Restore the last verified configuration, preserve failed measurements, document the category/quality regression, and escalate when host serialization prevents the required reduction.

## Verification
Unit tests for the reconciler plus real baseline/candidate snapshots and an unchanged task-quality suite.

## Definition of Done
Implemented optimization; baseline and candidate measured; reconciliation passes; quality floor passes; before/after evidence preserved; risks documented; independent verification complete; no blocking regression remains.
