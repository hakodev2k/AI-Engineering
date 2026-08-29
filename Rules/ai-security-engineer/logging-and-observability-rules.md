# Logging and Observability Rules

## Purpose
Provide security-relevant visibility into AI behavior without creating new leakage of sensitive data.

## Scope
Applies to inference services, agents, RAG pipelines, moderation, tool execution, administrative operations, and security detections.

## MUST
- Security-relevant events MUST record authenticated identity, action, decision outcome, target, timestamp, and correlation identifier where applicable.
- Privileged tool execution, authorization failures, policy overrides, model or prompt version changes, and administrative actions MUST be auditable.
- Telemetry MUST minimize or redact secrets, credentials, and unnecessary personal data.
- Security alerts MUST have actionable ownership and documented response expectations.
- Logs used for investigations MUST have integrity and access protections appropriate to their sensitivity.

## MUST NOT
- MUST NOT log complete sensitive prompts or model outputs by default when metadata or redacted samples are sufficient.
- MUST NOT expose security telemetry to unauthorized tenants or users.
- MUST NOT claim an incident root cause without evidence from available telemetry or equivalent sources.

## SHOULD
- Correlate model requests with retrievals, policy decisions, and tool calls.
- Monitor anomalous access, denial patterns, exfiltration indicators, and sudden policy-failure changes.

## Exceptions
Exceptions require a documented investigation or operational need, bounded retention, access controls, and privacy/security approval where sensitive content is captured.

## Verification
Inspect logging schemas, redaction tests, dashboards, alerts, retention configuration, audit permissions, and incident reconstruction exercises.