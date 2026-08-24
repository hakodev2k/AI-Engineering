# ML Incident Response

## Purpose
Diagnose and mitigate production incidents where failures may arise from infrastructure, data, features, model behavior, rollout, or external regime change.

## When to use
Use for degraded model quality, abnormal outputs, elevated latency/errors, corrupted data, failed retraining, or harmful business impact.

## Inputs
Incident symptoms, timeline, model versions, deployment history, logs, metrics, traces, data lineage, recent changes, rollback options.

## Preconditions
An incident owner and communication path are established.

## Context to inspect
Serving and data telemetry, model registry, feature store, pipeline runs, change history, experiments, dependency status, and prior incidents.

## Core knowledge
Mitigation precedes perfect diagnosis when impact is active. Preserve evidence, compare known-good baselines, and isolate whether failure is data, code, infrastructure, configuration, or model behavior.

## Procedure
1. Define impact, scope, and severity.
2. Freeze risky changes and preserve evidence.
3. Identify affected model/version/slices.
4. Compare against known-good baseline.
5. Check infrastructure and dependency health.
6. Validate input schemas, freshness, and feature parity.
7. Inspect recent deployments, retraining, and data changes.
8. Apply safest mitigation: rollback, fallback, traffic reduction, or disablement.
9. Verify recovery with technical and outcome metrics.
10. Produce root cause and corrective actions after stabilization.

## Decision points
Rollback vs forward-fix; model disablement vs degraded fallback; preserve traffic for diagnosis only when user risk is acceptable.

## Common failure patterns
Tuning during outage, deleting evidence, blaming drift before checking pipelines, rollback to incompatible artifacts, and declaring recovery from infrastructure metrics alone.

## Verification
Confirm impact metrics recover, inputs/outputs normalize, and the mitigation remains stable over an appropriate observation window.

## Expected output
Timeline, mitigation record, root cause, evidence, corrective actions, and prevention tests.

## Stop conditions
Escalate safety/security impact immediately; stop experiments when evidence suggests harmful outputs or data corruption.