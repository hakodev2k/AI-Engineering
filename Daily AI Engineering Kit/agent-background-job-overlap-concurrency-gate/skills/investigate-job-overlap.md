# Skill: Investigate Background Job Overlap

## Purpose
Identify whether a scheduled or queued background job can execute concurrently in a way that causes duplicate effects, stale writes, lock contention, API amplification, duplicate notifications, or corrupted progress state.

## When to use
Use after adding or changing a recurring job, worker concurrency, retry policy, schedule interval, queue routing, job duration, or distributed lock behavior; or when duplicate effects appear in production.

## Inputs
- Repository root.
- Job name or scheduler entry when known.
- Schedule/trigger definition.
- Worker concurrency configuration.
- Retry policy.
- Relevant logs, metrics, and persistence model.

## Preconditions
- Read-only investigation is allowed.
- No production scheduler or data mutation is required to investigate.

## Allowed tools
Repository search, build/test commands, local scripts, logs, scheduler metadata, read-only database/API inspection.

## Constraints
- Treat concurrency safety as unproven until evidence exists.
- Do not infer idempotency from a method name.
- Do not disable production jobs during investigation.

## Procedure
1. Locate every trigger for the job: cron/recurring registration, enqueue sites, retries, manual execution, event handlers.
2. Determine maximum plausible execution duration from code, timeout settings, telemetry, or logs.
3. Compare execution duration with trigger interval and retry timing.
4. Locate concurrency controls: scheduler mutexes, `DisableConcurrentExecution`, distributed locks, advisory locks, uniqueness keys, queue serialization, or custom leases.
5. Trace all external side effects: database writes, emails, messages, HTTP calls, files, billing, cache invalidation, and downstream jobs.
6. For each side effect, determine whether repeated execution with the same logical job input is idempotent.
7. Inspect transaction boundaries and check whether lock acquisition covers the entire critical section rather than only scheduling.
8. Check lock timeout, lease expiry, renewal, process crash behavior, and stale-lock recovery.
9. Check retries for amplification: a timed-out first attempt may still be running while a retry starts.
10. Run `python scripts/scan-job-overlap.py --root <repo>` and inspect candidates; confirm findings manually because the scanner is heuristic.
11. Build a concrete overlap scenario with timestamps showing attempt A, attempt B, lock state, and side effects.
12. Classify each issue by impact and confidence using `schemas/finding.schema.json`.
13. Preserve evidence before recommending a fix.

## Expected output
A set of structured findings with job, overlap mechanism, affected side effects, evidence, confidence, risk, and recommended mitigation.

## Verification
A finding is reproduced only when code/config/log evidence demonstrates that two executions can enter the same unsafe critical section, or a deterministic test reproduces it.

## Failure handling
If runtime duration or scheduler configuration is unavailable, mark the finding `unverified`; do not claim overlap is confirmed. If access is denied, preserve the missing evidence and stop that branch of investigation.

## Stop conditions
Stop when all triggers, concurrency controls, retries, side effects, and recovery paths are accounted for, or when missing permissions/evidence prevent a defensible conclusion.
