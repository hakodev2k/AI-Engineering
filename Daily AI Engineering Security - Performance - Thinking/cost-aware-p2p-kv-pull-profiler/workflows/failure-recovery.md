# Workflow: KV Policy Failure Recovery

## Trigger
Candidate policy regresses TTFT/throughput, pull failures exceed policy, or profiler reports insufficient evidence.

## Goal
Return to a measured safe baseline and collect only the missing evidence needed for another bounded attempt.

## Inputs
Baseline metrics, candidate metrics, profiler output, deployment signature, failed-transfer logs without secrets.

## Detection
Any configured regression threshold violation, insufficient sample count, non-informative crossover, or elevated pull failures.

## Evidence
Preserve offered load, prefix distribution, model/hardware/topology, software versions, per-arm metrics and profiler output.

## Stages
1. Roll back to the known baseline routing threshold/policy.
2. Classify failure as sample insufficiency, transfer-path contention, recompute-model error, load mismatch, or connector failure.
3. Form one corrective hypothesis.
4. Collect the smallest representative additional sample set.
5. Re-run profiling and benchmark comparison once.

## Retry policy
Maximum 2 total calibration attempts for the unchanged deployment signature.

## Maximum retries
2.

## Fallback
Keep baseline policy or disable P2P pulls for the affected segment while retaining affinity routing.

## Escalation
Escalate persistent connector serialization, fabric instability, or security/isolation concerns to the serving-platform owner.

## Stop condition
Stop on exhausted retries, persistent regression, failed-pull rate above policy, or inability to reproduce comparable load.

## Definition of Done
Baseline is restored, failure evidence is retained, retries are bounded, and no performance claim is made without measurement.
