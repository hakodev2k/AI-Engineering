# Deadlock Investigation Skill

## Purpose
Turn an intermittent database deadlock into an evidence-backed transaction/lock-order model before editing code.

## When to use
Use when logs, database deadlock graphs, retry telemetry, or reproducible concurrency failures indicate a deadlock or cyclic lock wait.

## Inputs
- Failure timestamp/correlation IDs and sanitized deadlock graph or database diagnostics.
- Repository revision and relevant application entry points.
- Database engine/version and transaction/isolation configuration.

## Preconditions
Work against development/test data. Production is evidence-only unless a human explicitly approves an action.

## Allowed tools
Repository search, read-only database diagnostics, local/test execution, profiler/trace output, `scripts/scan-lock-order.py`.

## Constraints
Do not infer lock ownership from stack traces alone. Do not change isolation level, schema, indexes, transaction boundaries, or retry policy before root cause is evidenced.

## Process
1. Record exact victim statement, competing statements, locked resources, lock modes, transaction IDs, and timestamps.
2. Trace each statement to repository entry points and transaction boundaries.
3. Run `python scripts/scan-lock-order.py <repo>` as heuristic discovery; treat output as leads, not proof.
4. Build transaction A/B timelines including read/write order and external calls inside transactions.
5. Identify a concrete cycle such as A owns X and waits Y while B owns Y and waits X.
6. Create the smallest deterministic test harness capable of coordinating both transactions at the conflicting steps.
7. Attempt reproduction at most three times; preserve commands, logs, SQL, and outcomes for every attempt.
8. Mark `reproduced` only when the observed cycle matches the original evidence materially.
9. Form one fix hypothesis at a time: consistent resource order, shorter transaction, narrower locking query, or another evidence-supported change.
10. Hand the evidence contract to the planner.

## Expected output
A valid evidence JSON matching `schemas/evidence.schema.json`, with facts separated from root-cause hypothesis.

## Verification
The pre-fix harness must reproduce the target deadlock, not merely a timeout or unrelated exception.

## Failure handling
If three attempts cannot reproduce it, set status `blocked`, preserve evidence, list missing observability, and stop. Do not manufacture certainty.

## Stop conditions
Stop on production-write requirement, missing permissions, destructive setup requirement, or insufficient evidence to identify both sides of the cycle.
