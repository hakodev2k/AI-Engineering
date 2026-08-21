# Workflow — Watch, Diagnose, Recover

## Trigger
A scheduled/headless agent run has a defined wall-clock SLO or uses tools that may block silently.

## Goal
Reduce wasted runtime from stalls while preserving diagnostics and preventing unsafe duplicate side effects.

## Inputs
Command, global deadline, silence threshold, grace period, retry limit, safe-to-retry classification, baseline telemetry.

## Baseline
Measure healthy total runtime and max event-silence intervals over representative runs before enabling blocking thresholds.

## Stages
1. **Measure baseline** — determine p50/p95/p99 runtime and silence.
2. **Launch** — start through `scripts/stall_watchdog.py`.
3. **Observe** — stream stdout/stderr and refresh last-activity time.
4. **Detect** — classify global deadline or silence breach.
5. **Capture** — write structured record and bounded recent output.
6. **Terminate** — graceful signal, then hard process-tree kill after grace period.
7. **Recover** — retry only if safe, bounded, and within remaining global budget.
8. **Investigate** — Stall Investigator groups signatures and proposes a bounded hypothesis test.
9. **Verify** — compare post-change metrics against baseline.

## Responsible agent
Runner owns deterministic enforcement; Stall Investigator owns analysis; workload agent does not decide whether its own hang is acceptable.

## Tools
Python watchdog, process APIs, structured logs, metric aggregation.

## Outputs
Run record, stall diagnostic, retry decision, before/after metrics.

## Checkpoints
- baseline exists;
- thresholds are explicit;
- last activity timestamp is observable;
- retry safety classification is explicit;
- diagnostics written before retry;
- global deadline never resets.

## Metrics
Total runtime, max silence, stall count, early termination savings, retries, successful recoveries, false positives, orphan processes.

## Retry policy
Default 0 retries. Permit at most one retry for known-idempotent work. Add bounded jitter when multiple workers may retry the same dependency.

## Stop conditions
Success, global timeout, non-retriable stall, retry exhaustion, or watchdog internal error.

## Failure path
Preserve diagnostics and let the platform outer timeout remain as final containment. Do not loop indefinitely or silently extend the deadline.

## Verification
Use deterministic child processes that emit output normally, then stall, then exit. Verify timing boundaries and exit codes.

## Definition of Done
Stalls are detected before the outer timeout, diagnostic records identify the silence boundary, retries are safe/bounded, process descendants are contained, and measured wasted wall time is reduced without increasing false termination beyond the accepted threshold.