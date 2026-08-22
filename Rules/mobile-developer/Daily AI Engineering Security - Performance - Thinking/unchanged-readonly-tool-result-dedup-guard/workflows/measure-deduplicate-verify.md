# Workflow — Measure, Deduplicate, Verify

## Trigger
Repeated read-only tool payloads appear in traces or token/context cost rises with repeated repository/tool reads.

## Goal
Lower redundant input tokens while preserving result freshness and task quality.

## Inputs
Representative traces, tool definitions, token metrics, resource metadata, regression fixtures.

## Baseline
Measure total tool-result bytes, duplicate-by-digest bytes, input tokens/task, compactions/task, latency, and task pass rate with dedup disabled.

## Stages
1. Observe — collect representative workload without suppression.
2. Measure — calculate duplicate ratios by resource identity + digest.
3. Diagnose — identify which tools provide trustworthy freshness evidence.
4. Hypothesize — state expected savings and bypass conditions.
5. Implement — add observe-only decisions, then enable references for proven-safe tools.
6. Measure again — run identical workload and collect the same metrics.
7. Verify — run changed-resource, volatile-resource, ambiguous-identity, exact-byte, and failure fixtures.
8. Complete — only after independent review confirms no hidden context loss.

## Responsible agent
Context Efficiency Analyst measures/diagnoses. Implementation owner changes runtime. Independent verifier runs regressions.

## Tools
Trace parser, `scripts/result_dedup_guard.py`, token accounting, test runner.

## Outputs
Baseline report, policy decision log, before/after metrics, regression evidence.

## Checkpoints
Baseline exists; eligible list has freshness proof; observe-only run matches expectation; changed-content fixture always emits full content; quality does not regress.

## Metrics
Input tokens/task, duplicate bytes avoided, context utilization, compactions, latency, false-dedup count, task pass rate.

## Retry policy
Maximum 2 implementation iterations after baseline. Each retry MUST change a hypothesis, policy, or implementation based on evidence.

## Stop conditions
Stop and revert suppression if false dedup occurs, quality regresses, freshness cannot be proven, or savings are negligible relative to complexity.

## Failure path
Disable suppression, retain observe-only telemetry, preserve full results, document failing fixture, escalate to a human/runtime owner.

## Verification
Independent reviewer reruns fixed fixtures and at least one real workload.

## Definition of Done
Implemented: deterministic guard integrated. Measured: before/after metrics collected. Verified: zero false dedup and no task-quality regression.