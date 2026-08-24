# Workflow: Measure → Isolate → Optimize → Re-measure

## Trigger / Goal / Inputs / Baseline
Trigger on desktop release candidate or system-wide input-lag report. Goal: reduce input-delivery tail latency without weakening functionality/security. Inputs: threshold config and labeled traces. Baseline: app fully exited on same machine/device/session.

## Stages
1. Observe version/state and symptom.
2. Measure app-exited baseline.
3. Measure one affected state.
4. Diagnose deterministic tail metrics and A/B ratio.
5. Form one observable subsystem hypothesis.
6. Isolate by changing one variable and recollect.
7. Optimize only when evidence supports the hypothesis.
8. Measure again with identical scenario.
9. Independent verifier repeats the pair.

## Responsible agent / Tools / Outputs / Checkpoints
Performance Investigator diagnoses; implementation owner changes code/config; independent verifier validates. Tools: probe, analyzer and Windows performance counters. Outputs: JSON reports and hypothesis record. Checkpoints: after baseline, after first failing pair, after isolation and before release.

## Metrics / Retry / Stop / Failure path
Track p95/p99/max gap, >16 ms rate, A/B ratio and repeatability. Maximum 3 collection pairs per hypothesis and 2 implementation hypotheses per run. Stop on unusable desktop, invalid data after bounded recollection or security/functionality regression. Failure path: revert experiment, preserve evidence, escalate to desktop runtime owner.

## Definition of Done
Baseline captured; regression measured; root cause supported by controlled isolation; post-change pair passes; independent verification passes; no security boundary weakened.
