# Verification

## Scope
This file defines how to verify the package and any host integration without relying on hidden model reasoning.

## Implemented
- Deterministic lifecycle reconciler.
- Configurable evidence precedence and staleness/wait policy.
- Rules for terminal-state monotonicity and retry execution identity.
- Skills, specialized subagents, bounded workflows, hooks, fixtures, and tests.
- Parent completion gate and resume/rehydration integrity checks.

## Measured
The package itself does not claim host performance improvement before integration. A host must record baseline and post-integration metrics:
- status/wait model turns per parent task;
- lifecycle queries per child;
- stale-active incidents;
- median/max stale-active age;
- reconciliation conflicts;
- terminal→active resurrection attempts;
- parent completion blocks caused by true unresolved dependencies;
- token/cost attributable to status/wait orchestration when available.

## Verified
Verification is complete only when all of the following hold in the target environment:
1. `python -m unittest tests/test_reconcile_lifecycle.py -v` passes.
2. A terminal child with stale running UI/cache is not treated as genuinely active.
3. A terminal child cannot become active under the same execution ID.
4. A legitimate retry with a new execution ID can become active.
5. A genuinely active child receives a bounded wait decision.
6. An active status older than policy is flagged for reconciliation.
7. Parent completion is blocked for genuinely unresolved required children.
8. Parent completion is not falsely blocked by lower-precedence stale UI state when authoritative terminal evidence exists.
9. No wait/status loop exceeds configured attempt/time bounds.
10. The independent verifier, not the implementing agent alone, approves high-impact lifecycle changes.

## Regression thresholds
Recommended initial thresholds:
- accepted same-execution terminal→active resurrection: **0**;
- unbounded wait loops: **0**;
- parent successes with unresolved required child: **0**;
- lifecycle decisions without source-labeled evidence: **0**;
- stale-active state accepted beyond configured threshold without refresh: **0**.

## Failure handling
If verification fails:
1. capture the minimal lifecycle snapshot and failing invariant;
2. stop the lifecycle-dependent action;
3. retry evidence collection/reconciliation at most once for the current decision point;
4. if still unresolved, escalate rather than loosening the invariant;
5. do not mark the package/integration verified.

## Safety
This package is read-only with respect to runtime lifecycle state. It must not cancel, restart, spawn, or mutate children automatically. Any destructive lifecycle operation remains under the host's existing authorization/approval controls.
