# Skill: Investigate Database Connection Pool Exhaustion

## Purpose
Identify code and configuration changes that can exhaust a database connection pool or increase connection acquisition latency.

## When to use
Use for API handlers, background jobs, message consumers, EF Core repositories, raw ADO.NET code, database retry logic, connection-string changes, or incidents showing timeouts while acquiring/opening database connections.

## Inputs
- Repository root.
- Changed files or target component.
- Relevant database provider and connection lifetime configuration.
- Test/build commands.
- Incident evidence when available: pool timeout errors, active connection counts, request concurrency, DB latency.

## Preconditions
- Repository can be inspected read-only before edits.
- No production configuration or database action is performed without approval.

## Allowed tools
Repository search, diff inspection, deterministic scripts in `scripts/`, build/test tools, non-destructive observability queries.

## Constraints
- Treat scanner matches as leads, not proof.
- Separate facts, hypotheses, decisions, evidence, and open questions.
- Prefer the smallest safe code change.
- Do not increase pool size as the first fix without proving demand exceeds safe capacity and leaks/lifetime errors are absent.

## Procedure
1. Identify database entry points and DI registrations.
2. Trace connection or DbContext lifetime from request/job/consumer boundary to database call.
3. Run `python scripts/scan-pool-risk.py <repo> --json` and preserve output.
4. Inspect each high-risk finding in context.
5. Search for manual `Open/OpenAsync`, connection construction, missing `using/await using`, singleton registrations, blocking waits, broad parallel fan-out, retry loops, and long transactions.
6. Determine whether the provider owns pooling and whether application code disposes connections/contexts promptly.
7. Check that async database operations remain async and accept cancellation where supported.
8. Quantify concurrency when possible: worker count × parallel operations × retries × connections per operation.
9. Form one hypothesis per observed failure mode and attach evidence.
10. Design the smallest correction: fix lifetime/disposal, bound concurrency, shorten transaction scope, remove sync-over-async, or constrain retries.
11. Stop before any production connection-string, pool-size, database, or infrastructure change requiring approval.
12. Run targeted tests and the scanner again.
13. Produce an assessment matching `schemas/assessment.schema.json`.
14. Hand off to the independent verifier.

## Expected output
A JSON assessment containing concrete findings, evidence, confidence, risk, recommended action, scanner exit code, executed tests, diff review status, and unresolved risks.

## Verification
A successful result requires scanner exit code 0, targeted verification evidence, diff review, and independent verifier approval. A scanner exit code 0 alone is insufficient.

## Failure handling
- Tool/transient failure: retry once, preserve output, then escalate.
- Build/test failure caused by the change: fix and retest, maximum 2 cycles.
- Environment failure: record command and error; use an equivalent non-destructive check if available.
- Permission failure: stop; do not elevate privileges.
- Missing evidence: mark `blocked` rather than guessing.

## Stop conditions
Stop when verified `pass`, when approval is required, after 2 failed fix-retest cycles, or when required evidence cannot be obtained safely.
