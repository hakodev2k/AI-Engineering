# Workflow: Measure → Stabilize → Verify

## Trigger
Low prompt-cache hit ratio or tool-loading change.

## Goal
Reduce avoidable cache misses while preserving required context and tool-selection quality.

## Inputs
Workload fixture, request snapshots, provider cache telemetry, policy, and tool catalogs.

## Baseline
Run at least 10 representative turns and record cache-read/cold tokens, latency, tool-selection result, catalog revision, and fingerprints.

## Context
Use provider-specific cache semantics; do not assume identical behavior across models.

## Stages
1. **Observe** — Cache Investigator captures request/prefix evidence.
2. **Measure baseline** — Produce metric distribution and canonical/raw fingerprints.
3. **Diagnose** — Separate semantic changes from byte-only ordering/serialization drift.
4. **Hypothesize** — Select one cause with expected measurable effect.
5. **Implement** — Stabilize ordering/serialization or isolate dynamic state; one scoped change.
6. **Measure again** — Replay the same fixture.
7. **Improved?** — Require lower cold tokens or higher hit ratio without quality regression.
8. **Verify** — Independent reviewer checks request diffs and task correctness.

## Responsible agent
Cache Investigator diagnoses; implementation owner changes code; independent verifier approves results.

## Tools
`cache_prefix_audit.py`, runtime logs, provider usage metrics, tests, benchmark harness.

## Outputs
Before/after report, mutation diff, verification status, rollback note.

## Checkpoints
Baseline captured; hypothesis linked to evidence; change scoped; quality test passes; cache metrics improve.

## Metrics
Hit ratio, cold tokens/task, prefix mutation rate, p50/p95 latency, tool-selection success.

## Retry policy
Maximum 2 distinct hypotheses. Never repeat the same unchanged optimization.

## Stop conditions
Verified improvement; quality regression; provider telemetry unavailable for a defensible conclusion; or two hypotheses fail.

## Failure path
Revert optimization, preserve evidence, document unresolved mutation source, escalate for provider/runtime review.

## Verification
Verifier reproduces fingerprint stability and workload metrics independently.

## Definition of Done
Implemented: deterministic stability change exists. Measured: baseline and post-change metrics exist. Verified: cache improvement and quality constraints both pass.
