# Workflow — Measure, Optimize, Verify Watcher Scope

## Trigger
Watcher utilization is high, `ENOSPC` occurs, a new repository watcher is introduced, or watcher churn is suspected.

## Goal
Reduce watcher resource use without missing meaningful project changes.

## Inputs
Repository root, watch inventory, OS limit, policy rules, lifecycle logs.

## Baseline
Capture watcher count, utilization, starts/hour, repo watcher multiplicity, CPU/event rate, and a representative change-detection result before modification.

## Stages
1. **Observe** — collect counts and failures; do not tune limits yet.
2. **Measure** — run the profiler and group watched paths.
3. **Diagnose** — identify high-noise subtrees and duplicate watcher instances.
4. **Hypothesize** — choose one measurable change: exclusion, watcher reuse, or lifecycle fix.
5. **Implement** — apply the smallest reversible change.
6. **Measure again** — repeat the exact baseline collection.
7. **Verify correctness** — mutate disposable files in required source/config/generated paths and ensure required events are received; verify excluded noise does not produce events when applicable.
8. **Independent review** — Watcher Verifier evaluates evidence.

## Responsible agent
Performance investigator owns stages 1–6. Watcher Verifier owns stages 7–8 for production-impacting changes.

## Tools
OS watcher diagnostics, logs, `scripts/watcher_budget.py`, repository test fixtures.

## Outputs
Before/after report, scope policy, test evidence, verifier verdict.

## Checkpoints
- Baseline captured before changes.
- Exclusion set mapped to actual repository paths.
- No required path excluded without an explicit allow rule.
- After metrics use the same measurement method.

## Metrics
Watch count, utilization, watcher instances/repo, starts/hour, event rate, CPU, detection recall.

## Retry policy
Maximum two optimization iterations. A retry MUST use new evidence or a materially different hypothesis.

## Stop conditions
Stop immediately on missed required change detection. Stop after two attempts without measurable resource improvement and escalate.

## Failure path
Restore the prior scope, retain diagnostics, document the failed hypothesis, and escalate to platform/runtime owners.

## Verification
Success requires measurable resource reduction plus passing correctness tests.

## Definition of Done
Evidence documented; baseline and after metrics captured; policy change implemented; no `ENOSPC`; required change tests pass; verifier returns `verified`; risks and rollback are documented.
