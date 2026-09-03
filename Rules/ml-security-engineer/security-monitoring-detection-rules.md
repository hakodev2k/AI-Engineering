# Security Monitoring and Detection Rules

## Purpose
Detect malicious or unauthorized activity affecting ML data, models, pipelines, and inference services.

## Scope
Applies to runtime telemetry, registry activity, pipeline events, access logs, inference abuse signals, and integrity monitoring.

## MUST
- Monitor privileged model, data, and pipeline actions with attributable identities and timestamps.
- Alert on unauthorized artifact changes, unusual promotion activity, repeated failed access, and material inference abuse signals.
- Define actionable severity thresholds, owners, and response procedures for security alerts.
- Protect security telemetry from unauthorized modification and inappropriate sensitive-data exposure.

## MUST NOT
- Declare monitoring effective without testing alert paths and responder visibility.
- Collect sensitive inputs indiscriminately when metadata or privacy-preserving signals are sufficient.
- Silence recurring security alerts without root-cause analysis or approved tuning.

## SHOULD
- Correlate model-serving, IAM, registry, and pipeline signals for investigations.
- Track detection coverage against known threat scenarios.

## Exceptions
Monitoring gaps require documented duration, risk, compensating controls, and remediation ownership.

## Verification
Inspect alert rules, test events, telemetry retention, access controls, incident tickets, and detection coverage reviews.