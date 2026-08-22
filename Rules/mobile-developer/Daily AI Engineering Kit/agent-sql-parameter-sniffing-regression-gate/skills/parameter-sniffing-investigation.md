# Parameter Sniffing Investigation Skill

## Purpose
Determine whether a SQL Server performance regression is caused by parameter-sensitive plan reuse rather than by general load, missing indexes, changed data volume, blocking, or unrelated query changes.

## When to use
Use when the same logical query has highly variable latency or reads for different parameter values, or when a previously fast query becomes intermittently slow after plan recompilation/deployment/data change.

## Inputs
- Query text or query identifier.
- Representative parameter classes or safe parameter samples.
- Baseline timings if available.
- Execution plans, Query Store data, or application/DB telemetry when available.

## Preconditions
- Benchmark target is non-production, or production access is read-only.
- Query and parameter handling do not expose secrets in artifacts.

## Allowed tools
Repository search, SQL client in read-only mode, Query Store reads, plan viewers, test runners, `scripts/benchmark_parameter_sets.py`.

## Constraints
No plan-cache clearing, plan forcing, query hints, index/schema changes, or production configuration changes without explicit approval.

## Process
1. Identify the application entry point and exact SQL shape, including ORM-generated SQL when applicable.
2. Establish whether query text is stable across slow and fast executions.
3. Define at least three parameter classes when possible: low, typical, and high selectivity.
4. Capture row counts, elapsed time, and plan identifiers for each class.
5. Repeat each class enough times to separate warm-up/transient effects from persistent plan sensitivity.
6. Compare plan shape, estimated vs actual rows when available, join strategies, scans/seeks, memory grants, and spills.
7. Test the hypothesis by changing only compilation context in a safe environment; do not change data and query shape simultaneously.
8. Reject the hypothesis when equivalent plans remain slow across parameter classes or another root cause explains the variance better.
9. Rank mitigations by reversibility and blast radius.
10. Handoff evidence and recommendation to the verifier.

## Expected output
A benchmark JSON matching `schemas/benchmark-result.schema.json`, plus a concise evidence ledger with facts, hypotheses, decisions, and unresolved risks.

## Verification
The conclusion must be reproducible with the same parameter classes and must not depend on a single anomalous run.

## Failure handling
Retry transient connection or timeout failures at most twice. Preserve outputs from failed runs. Stop on permission errors, unsafe environment, invalid inputs, or repeated benchmark instability.

## Stop conditions
Stop when evidence is insufficient to distinguish parameter sniffing from competing causes, or when the next diagnostic step requires a production-changing action.
