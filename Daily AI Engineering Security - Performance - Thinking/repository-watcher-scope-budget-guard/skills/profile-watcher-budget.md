# Skill — Profile Watcher Budget

## Purpose
Measure repository watcher pressure before changing limits or exclusions, identify high-noise subtrees, and produce a reproducible baseline.

## Trigger
Run before enabling a repository watcher, after an `ENOSPC` watcher error, when watcher starts increase unexpectedly, or before/after a watcher-scope optimization.

## Inputs
- Repository root.
- OS/user watch limit.
- A newline-delimited watched-path inventory or equivalent diagnostic export.
- Optional active-watcher registry keyed by canonical repository root.

## Preconditions
The inventory MUST be collected read-only. Do not modify kernel limits or repository files during baseline measurement.

## Required context
Known generated/dependency/cache directories for the project and any paths that must remain watched for correctness.

## Allowed tools
Read-only shell commands, `/proc` inspection on Linux, logs, metrics, and `scripts/watcher_budget.py`.

## Constraints
- MUST preserve source/config paths required for correctness.
- MUST NOT recommend raising OS limits as the only fix.
- MUST distinguish duplicate watcher instances from a single broad watcher.

## Procedure
1. Record `max_user_watches` and current process watch count.
2. Export watched paths if the runtime exposes them; otherwise use logs/diagnostics and count kernel watch descriptors.
3. Run `watcher_budget.py` against the path inventory.
4. Rank path groups by count using normalized categories: source, dependency, cache, generated, Git internal, submodule internal, unknown.
5. Identify duplicate canonical repository roots and watcher start frequency.
6. Form one scope hypothesis at a time, for example “excluding `.venv` removes >40% of watches.”
7. Apply the smallest policy change in a test environment.
8. Re-measure watch count and run meaningful-change detection tests.
9. Accept only changes that reduce pressure without missing required changes.

## Decision points
- Utilization < 60%: safe; continue monitoring.
- 60–80%: warn; optimize before adding large watcher scope.
- >80%: block new broad watchers until scope/reuse is corrected.
- Any `ENOSPC`: treat as failed capacity guard regardless of percentage snapshot.

Thresholds are defaults and may be customized if the platform has a measured workload-specific reserve.

## Expected output
A baseline with watch count, limit, utilization, dominant subtrees, duplicate watcher evidence, proposed exclusions, and before/after results.

## Metrics
Watch count, utilization, starts/hour, duplicate watcher count, CPU/event rate, and detection recall.

## Verification
A successful optimization MUST demonstrate lower watch count and pass tests that mutate representative source/config files and confirm events are still delivered.

## Failure handling
If watched paths cannot be enumerated, report the evidence gap and use descriptor counts plus watcher-start logs. Do not invent path attribution.

## Stop conditions
Stop after two scope-change attempts without measurable reduction or immediately if a proposed exclusion causes a required change event to be missed.
