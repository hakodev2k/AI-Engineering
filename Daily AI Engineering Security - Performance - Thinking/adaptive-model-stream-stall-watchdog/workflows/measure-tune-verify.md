# Workflow — Measure, Tune, Verify
## Trigger
A stream stall incident or watchdog change request.
## Goal
Bound dead streams without terminating healthy long-latency work.
## Inputs
Trace JSONL, current policy, workload definition.
## Baseline
Capture completion rate, timeout rate, TTFT p50/p95/p99, mid-stream gap p95/p99, retry token overhead, and worker-slot stall minutes.
## Stages
1. **Observe** — label phases and collect traces.
2. **Measure** — run `python scripts/analyze_stalls.py TRACE --policy config/policy.json`.
3. **Diagnose** — investigator records facts/evidence and one primary hypothesis.
4. **Hypothesize** — choose a phase-specific adjustment or classification fix.
5. **Implement** — runtime owner changes only the justified control.
6. **Measure again** — replay equivalent workload or shadow traffic.
7. **Verify** — independent reviewer compares completion and stall metrics.
## Responsible agent
Performance Investigator measures; runtime owner implements; independent verifier approves.
## Tools
Analyzer, telemetry/query system, test runner.
## Outputs
Before/after JSON, policy diff, verification record.
## Checkpoints
Baseline complete; sample sufficiency; post-change metrics complete; retry-cost check.
## Metrics
Defined in `evidence/research.md`.
## Retry policy
At most 2 tuning iterations. A stalled request may auto-retry at most once under policy.
## Stop conditions
Stop on completion-rate regression, unbounded wait, retry-cost breach, or insufficient evidence.
## Failure path
Rollback to last verified policy and retain traces for escalation.
## Verification
A change is Verified only when it reduces false timeouts or bounded-stall duration with no material completion regression.
## Definition of Done
Evidence documented, baseline measured, implementation tested, after metrics captured, independent verification passed, no blocking regression.
