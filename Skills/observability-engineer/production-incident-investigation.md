# Production Incident Investigation

## Purpose
Use telemetry systematically to establish impact, narrow hypotheses, identify causal evidence, and support safe incident response.

## When to use
Use during active production degradation or post-incident technical investigation.

## Inputs
Incident timeline, alerts, dashboards, logs, metrics, traces, deployments, topology, and recent changes.

## Context to inspect
Inspect user impact, affected scope, onset time, error budget, dependency health, saturation, deployments, configuration changes, and correlated signals.

## Core knowledge
Correlation is not causation. During incidents, prioritize restoring service while preserving evidence. Compare affected and healthy cohorts to reduce search space.

## Procedure
1. Establish impact and time window.
2. Confirm the alert with independent signals.
3. Identify affected services, regions, versions, or tenants.
4. Compare healthy and unhealthy cohorts.
5. Review recent changes and dependency behavior.
6. Follow traces into failing or slow components.
7. Inspect correlated logs and resource metrics.
8. Form falsifiable hypotheses.
9. Gather evidence before remediation claims.
10. Record timeline and unresolved questions.

## Decision points
Mitigate first when impact is severe and rollback is safe; investigate longer when mitigation risks greater damage.

## Common failure patterns
Searching logs randomly, anchoring on the first error, changing multiple variables, confusing downstream symptoms with root cause, and losing timestamps.

## Verification
Confirm recovery through user-impact metrics and validate the causal hypothesis through reproducible or strongly converging evidence.

## Expected output
An evidence-backed incident timeline, impact assessment, mitigation result, and causal findings.

## Stop conditions
Escalate destructive actions, uncertain high-risk mitigations, or incidents requiring privileges beyond the responder role.