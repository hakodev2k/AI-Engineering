# Quantum Production Observability

## Purpose
Instrument quantum-enabled systems so operators can distinguish application failures, orchestration failures, backend queueing, calibration drift, stochastic variation, and provider incidents.

## When to use
Use when quantum workloads run repeatedly, support user-facing workflows, consume material budget, or require operational SLOs.

## Inputs
Workflow architecture, provider integration, job states, application logs, metrics platform, experiment identifiers, and cost model.

## Context to inspect
Correlation IDs, backend job IDs, queue/execution timestamps, calibration metadata, shot counts, transpilation metrics, failure taxonomy, cost records, and data-retention policy.

## Core knowledge
Observability must span classical orchestration and remote quantum execution. Raw quantum results are scientific artifacts, not ordinary logs. High-cardinality experiment metadata should be linked rather than indiscriminately embedded in telemetry.

## Procedure
1. Define operational questions and user-visible failure modes.
2. Create stable experiment, circuit, iteration, and provider-job identifiers.
3. Emit structured lifecycle events for validation, submission, queueing, execution, retrieval, and post-processing.
4. Measure queue latency, execution latency, retry rate, cancellation rate, shot volume, and cost.
5. Record circuit width, depth, and two-qubit gate count as diagnostic metadata.
6. Link calibration snapshots to hardware executions.
7. Separate provider errors from algorithm-quality metrics.
8. Alert on actionable conditions such as stuck jobs, abnormal failure rate, runaway cost, or severe result drift.
9. Preserve raw results in controlled artifact storage instead of logs.
10. Build incident dashboards that correlate application, provider, and experiment data.
11. Review telemetry for secrets and sensitive payloads.

## Decision points
Use metrics for aggregate health, traces for workflow causality, structured logs for discrete failures, and artifact stores for raw experiment data. Do not alert directly on expected statistical noise without a stable baseline.

## Common failure patterns
Polling without telemetry, missing job correlation, logging credentials or raw sensitive results, alerting on normal sampling variation, and measuring provider execution while ignoring queue time.

## Verification
Inject controlled provider and workflow failures, confirm end-to-end correlation, reconcile job counts and costs, and verify that dashboards identify the failing stage accurately.

## Expected output
An observable quantum workflow with actionable metrics, traces, structured events, protected artifacts, dashboards, and incident signals.

## Stop conditions
Stop when telemetry would expose sensitive data, provider metadata is unavailable for required diagnostics, or alert thresholds cannot be justified from observed behavior.