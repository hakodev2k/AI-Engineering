# Trace Log Metric Correlation Rules

## Purpose
Enable reliable movement from symptoms to traces, logs, metrics, and back without creating conflicting identifiers.

## Scope
Applies to trace IDs in logs, exemplars, metric links, resource identity, deployment metadata, and incident workflows.

## MUST
- Logs emitted inside traced operations MUST include approved trace correlation fields where technically feasible.
- Resource identity used by traces, logs, and metrics MUST be consistent enough to correlate the same service instance and deployment.
- Trace-derived conclusions MUST be cross-checked against independent metrics or logs when root cause remains uncertain.
- Correlation fields MUST preserve their canonical format across pipelines.

## MUST NOT
- MUST NOT create separate ad hoc correlation IDs when trace IDs already satisfy the use case without documenting the distinction.
- MUST NOT treat absence of a sampled trace as proof that an event did not occur.
- MUST NOT expose internal trace identifiers to customers unless there is an intentional support contract.

## SHOULD
- Use exemplars or equivalent links from metrics to traces for high-value latency and error signals.
- Include deployment/version metadata in correlated telemetry.

## Exceptions
Exceptions require platform limitation, alternative correlation mechanism, and verification that incident navigation remains effective.

## Verification
Exercise metric-to-trace and log-to-trace workflows, verify IDs and resource fields, and validate correlation across deploys, replicas, and sampled traces.
