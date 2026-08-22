# Investigate Distributed Lock Safety

## Purpose
Determine whether a distributed lock protects exclusivity when work outlives a lease, processes crash, clocks differ, or contenders race.

## When to use
Use for Redis/database/advisory locks, leader election, singleton jobs, schedulers, migrations, inventory/payment coordination, or any code relying on a time-bounded distributed lease.

## Inputs
Repository root; lock backend and client; critical section entry points; TTL/renewal settings; retry policy; relevant tests/logs.

## Preconditions
Read-only investigation is allowed. Production mutation is not required.

## Allowed tools
Repository search/read, tests, local scripts, build/test runners, non-mutating telemetry queries.

## Constraints
Separate facts from hypotheses. Never infer safety from a library name alone. Never test failure modes against production.

## Procedure
1. Run `python scripts/scan-locks.py <repo> --json` and preserve output.
2. Identify every acquire, renew, release and critical-section path.
3. Record lease TTL, acquisition timeout, retry/backoff and ownership token semantics.
4. Trace what happens if holder A pauses beyond TTL while holder B acquires the same lock.
5. Determine whether stale holder A can still mutate shared state; require fencing where the resource supports it.
6. Verify release is conditional on the unique owner token and cannot delete B's lease.
7. Verify renewal checks ownership and has a bounded renewal count/lifetime.
8. Inspect cancellation, exception and process-crash paths.
9. Locate or create local tests for contention, expiry and stale-owner behavior.
10. Produce evidence with finding, file/line or test output, confidence, risk and recommended smallest safe change.

## Expected output
A structured evidence report matching `schemas/evidence.schema.json`.

## Verification
All three scenarios—contention, expiry, stale owner—must be demonstrated by tests or deterministic simulation before status can be `pass`.

## Failure handling
Tool/environment failures may retry twice. Preserve output. Permission failures do not trigger privilege escalation. Unknown backend semantics produce `blocked`, not `pass`.

## Stop conditions
Stop before production changes, backend replacement, destructive lock cleanup, or any security/availability weakening without explicit approval.
