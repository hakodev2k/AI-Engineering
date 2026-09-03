# Backfill and Replay Rules

## Purpose
Make historical reprocessing safe, bounded, auditable, and reproducible.

## Scope
Backfills, replays, historical corrections, recomputation, and recovery processing.

## MUST
- Define the exact time range, datasets, dependencies, expected mutations, and success criteria before execution.
- Estimate capacity, cost, downstream load, and collision risk with live processing.
- Make replay behavior deterministic or document unavoidable differences.
- Reconcile results against authoritative sources after completion.
- Require human approval before large, destructive, or production-impacting backfills.

## MUST NOT
- Run unbounded historical reprocessing in production without impact analysis.
- Overwrite trusted data without rollback, snapshot, or equivalent recovery capability when feasible.
- Mix corrected historical data with live data silently when semantics differ.

## SHOULD
- Isolate backfill compute and throttle downstream writes when practical.
- Record execution parameters and code version for reproducibility.

## Exceptions
Emergency replay requires bounded scope, accountable approval, monitoring, and post-run verification.

## Verification
Inspect run parameters, resource estimates, approval records, snapshots, reconciliation outputs, and post-run quality metrics.