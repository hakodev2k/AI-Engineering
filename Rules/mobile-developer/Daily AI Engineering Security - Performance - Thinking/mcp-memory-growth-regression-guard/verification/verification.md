# Verification

## Verification model
Status is tracked separately:

- **Implemented:** package files, policy, scripts, rules, workflows, and tests exist.
- **Measured:** the target MCP workload has produced baseline/candidate metric artifacts.
- **Verified:** the target application passes memory, correctness, and service-level gates under the same workload.

This repository package itself is **Implemented**. It does not claim a specific downstream MCP application is Measured or Verified until that application runs the harness.

## Required evidence for downstream verification
1. Runtime and SDK versions recorded.
2. Warm-up excluded from scored samples.
3. At least `minimum_samples` post-warm-up samples.
4. Explicit-GC measurement when policy requires it.
5. Baseline and candidate use identical workload/concurrency.
6. Retained MB / 1k operations is at or below policy threshold.
7. Total post-GC growth is at or below policy threshold.
8. No OOM/crash marker.
9. Correctness tests pass.
10. p95 latency and throughput regressions remain within policy.
11. Validator changes do not create stale-schema acceptance/rejection.
12. Server lifecycle changes preserve request/session isolation under concurrency.
13. Independent verifier signs off.

## Failure detection and recovery
**Detection:** non-zero slope-check exit, OOM/crash, stale validator behavior, transport/session cross-talk, or service-level regression.

**Evidence:** preserve sample JSONL, report JSON, runtime metadata, heap snapshots when used, and hypothesis log.

**Retry policy:** environmental noise may be rerun up to two times. Reproducible threshold failures are not retried away.

**Fallback:** revert candidate; use operational restart/recycle only as temporary containment if production availability requires it.

**Escalation:** if two bounded hypotheses fail, escalate to source/heap-snapshot investigation or upstream SDK issue with reproduction.

**Stop condition:** verified pass, blocking correctness regression, or hypothesis budget exhausted.

## Definition of Done
- Current public evidence is documented.
- Existing approaches and limitations are documented.
- Policy thresholds are explicit.
- Baseline procedure is executable.
- Deterministic slope checker exists and returns meaningful exit codes.
- Schema fingerprint probe exists.
- Skills, rules, subagents, workflows, hooks, and regression cases are complete.
- Candidate fix is tested using the same workload as baseline.
- Memory thresholds pass.
- Correctness remains intact.
- Latency/throughput remain within policy.
- Risks and temporary containment are distinguished from a verified fix.
