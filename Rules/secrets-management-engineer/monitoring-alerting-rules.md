# Monitoring and Alerting Rules

## Purpose
Detect secret-management failures and suspicious behavior early enough to limit operational and security impact.

## Scope
Secret stores, issuers, rotation jobs, access patterns, expiry, policy drift, and service health.

## MUST
- Monitoring MUST cover availability, authentication failures, authorization denials, abnormal reads, rotation failures, impending expiry, and administrative changes appropriate to risk.
- Alerts MUST have an owner, severity, response expectation, and actionable context that excludes secret values.
- High-impact alert paths MUST be tested periodically.
- Monitoring gaps affecting critical credentials MUST be tracked as risk.

## MUST NOT
- Alerts MUST NOT contain secret values.
- Persistent noisy alerts MUST NOT simply be disabled without correcting thresholds, routing, or root cause.
- Dashboard health MUST NOT substitute for testing actual credential issuance and retrieval paths.

## SHOULD
- Baseline normal access patterns and detect meaningful deviations.
- Correlate secret events with workload, identity, deployment, and incident telemetry.

## Exceptions
Monitoring exclusions require rationale, risk, alternate evidence, owner, and expiry.

## Verification
Review alert definitions, ownership, recent firings, synthetic tests, rotation telemetry, expiry reports, monitoring coverage, and unresolved blind spots.