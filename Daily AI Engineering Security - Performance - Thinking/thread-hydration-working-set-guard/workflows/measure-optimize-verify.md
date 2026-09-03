# Workflow: Measure, Optimize, Verify

## Trigger
Large-thread open/resume latency, memory pressure, queue starvation, or a change to hydration/pagination behavior.

## Goal
Reduce hydration working set and latency without losing authoritative history or active task correctness.

## Inputs
`config/policy.json`, telemetry, small/medium/oversized fixtures, implementation candidate.

## Baseline
Capture at least 5 resume samples per fixture size when practical. Record p95 latency, peak RSS, loaded items, CPU time, and unrelated queue wait.

## Context
Record client/app-server versions, host resources, persistence format, pagination capability, and whether effective model context is compacted.

## Stages
1. **Observe** — reproduce the slow/high-memory path.
2. **Measure baseline** — run profiler and preserve raw telemetry.
3. **Diagnose** — Performance Investigator classifies parsing, I/O, serialization, eager hydration, renderer, or queue contention.
4. **Form hypothesis** — choose one bounded intervention: lazy resume, suffix/window loading, pagination, concurrency cap, or detached effective-context continuation.
5. **Implement improvement** — change only the selected mechanism.
6. **Measure again** — use the identical fixtures and policy.
7. **Decision** — if no material improvement, return to diagnosis; maximum 3 attempts.
8. **Verify** — test correctness, pagination compatibility, and unrelated-request responsiveness.

## Responsible agent
Performance Investigator for stages 1–4; implementation owner for stage 5; independent verifier for stages 6–8.

## Tools
Runtime profiler, process metrics, structured logs, and `scripts/hydration_profiler.py`.

## Outputs
Baseline telemetry, candidate telemetry, comparison, policy report, verification record.

## Checkpoints
- Baseline captured before code change.
- Hypothesis names expected metric changes.
- Candidate does not discard required history.
- Independent verifier reruns the required fixtures.

## Metrics
p95 resume latency, peak RSS, loaded items, peak concurrent hydration, CPU time, unrelated queue wait.

## Retry policy
Maximum 3 optimization hypotheses. Each retry MUST use new evidence or a materially different hypothesis.

## Stop conditions
Pass policy and verification, or stop after 3 unsuccessful hypotheses and escalate.

## Failure path
Revert candidate changes that regress correctness. Preserve raw telemetry and record which threshold failed.

## Verification
`python scripts/hydration_profiler.py --telemetry <candidate.jsonl> --policy config/policy.json --json` must exit 0 for required fixtures, and integration checks must prove active state remains available.

## Definition of Done
Baseline documented; root cause supported; improvement implemented; candidate metrics collected; policy passes; pagination/version behavior verified; no correctness regression; independent verification complete.
