# Telemetry and Observability Rules

## Purpose
Provide trustworthy evidence for access decisions, policy effectiveness, investigations, and control failures.

## Scope
Applies to identity, device, network, workload, policy, administrative, and data-access telemetry.

## MUST
- Security-relevant access decisions MUST produce attributable audit evidence appropriate to risk.
- Telemetry MUST include enough context to distinguish actor, resource, action, decision, and outcome.
- Logging pipelines for high-value controls MUST be monitored for loss, delay, tampering, and parsing failure.
- Sensitive telemetry MUST have access and retention controls.

## MUST NOT
- MUST NOT log secrets, complete authentication tokens, or unnecessary sensitive payloads.
- MUST NOT claim control effectiveness when relevant telemetry is missing or materially incomplete.
- MUST NOT rely on client-generated security events without validation for critical evidence.

## SHOULD
- Logs SHOULD use stable correlation identifiers across policy and resource layers.
- High-value telemetry SHOULD support detection engineering and forensic reconstruction.

## Exceptions
Reduced logging requires documented privacy, cost, or platform constraint plus alternate evidence, owner, approval, and review date.

## Verification
Inspect schemas, sampled events, retention, access controls, ingestion health, end-to-end correlation, and failure tests that deliberately interrupt telemetry pipelines.