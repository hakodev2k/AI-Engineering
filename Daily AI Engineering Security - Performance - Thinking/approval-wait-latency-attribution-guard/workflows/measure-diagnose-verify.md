# Workflow: Measure → Diagnose → Verify

## Trigger
A tool or agent path is reported slow, especially when human approval is involved.

## Goal
Identify the actual latency phase and verify any optimization against a stable baseline.

## Inputs
Baseline trace JSONL, candidate after-trace JSONL, policy config, workload description.

## Baseline
Capture at least `minimum_samples` equivalent calls before changes. Record approval wait and execution time separately.

## Context
Preserve tool version, agent version, machine/environment, workload, network conditions, and approval mode.

## Stages
1. **Observe** — Performance Investigator records the reported symptom without accepting its proposed cause.
2. **Validate trace** — run the attribution script; invalid traces block diagnosis.
3. **Measure baseline** — calculate per-phase p50/p95 and total wall time.
4. **Diagnose** — identify the phase responsible for the regression.
5. **Form hypothesis** — state one measurable cause and expected metric movement.
6. **Implement** — change only the diagnosed phase; approval boundaries stay intact.
7. **Measure again** — repeat equivalent workload.
8. **Compare** — calculate execution regression/improvement independently of approval dwell.
9. **Verify** — separate reviewer checks fixtures, trace order, metric choice, and claim.

## Responsible agent
Approval-Aware Performance Investigator for stages 1–8; independent verifier for stage 9.

## Tools
`scripts/latency_attribution.py`, test runner, trace/log reader, project benchmark tooling.

## Outputs
Validated trace report, baseline metrics, hypothesis, after metrics, comparison, verification result.

## Checkpoints
- C1: lifecycle ordering valid.
- C2: baseline sample count sufficient.
- C3: hypothesis names a measured phase.
- C4: after workload equivalent.
- C5: verifier agrees with metric and result.

## Metrics
Approval wait, execution latency, postprocess latency, total wall time, p50/p95, invalid-trace rate, improvement percentage.

## Retry policy
At most 2 optimization attempts for the same hypothesis. Each retry requires new evidence or a changed implementation.

## Stop conditions
Stop on invalid instrumentation, insufficient comparable samples, two failed attempts, or a security/approval boundary conflict.

## Failure path
Restore the last verified behavior, retain traces, classify the run as unverified, and escalate the missing evidence or architectural blocker.

## Verification
Tests pass; raw timestamps support calculated durations; the optimization changes execution metrics rather than merely hiding approval time.

## Definition of Done
Implemented, Measured, and Verified are all recorded separately; no blocking trace or approval-safety issue remains.
