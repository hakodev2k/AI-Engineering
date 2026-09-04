# Telemetry and Observability Rules

## Purpose
Provide trustworthy evidence for access decisions, policy behavior, anomalous activity, and Zero Trust control effectiveness.

## Scope
Applies to authentication, authorization, device, workload, network, data-access, policy, administrative, and control-plane telemetry.

## MUST
- Security-relevant access events MUST record sufficient context to identify subject, resource, action, outcome, timestamp, and authoritative decision or enforcement source.
- Logs and events from identity, device, workload, policy, network, and resource layers MUST be correlatable through stable identifiers or timestamps appropriate to the environment.
- Telemetry used for security decisions MUST have defined source ownership, integrity expectations, freshness, availability, and retention.
- Privileged actions, policy changes, entitlement changes, failed high-risk access, and emergency access MUST be observable.
- Time synchronization MUST be sufficient for incident reconstruction across participating systems.
- Sensitive telemetry MUST be access-controlled and protected against unauthorized modification or deletion.
- Monitoring coverage gaps affecting critical assets MUST be treated as explicit risk, not silently ignored.

## MUST NOT
- Logs MUST NOT contain secrets, authentication tokens, private keys, or unnecessary sensitive payloads.
- Security conclusions MUST NOT rely on telemetry known to be incomplete without stating the limitation.
- Audit logging for critical controls MUST NOT be disabled merely to reduce cost or noise without approved alternative evidence.
- High-cardinality or noisy signals MUST NOT be discarded blindly when doing so removes required forensic attribution.

## SHOULD
- Telemetry SHOULD support end-to-end tracing of an access request from authentication through authorization and resource action.
- Retention SHOULD be risk-based and aligned with incident-detection and investigation needs.
- Dashboards SHOULD emphasize control outcomes, denial anomalies, privilege usage, and signal health rather than raw event volume alone.

## Exceptions
Exceptions require documented coverage gap, affected assets, reason, risk, compensating evidence, owner, remediation or expiry date, and approval for critical systems.

## Verification
Inspect logging configuration, sample events, correlation fields, retention, access controls, clock synchronization, dashboards, alert inputs, and incident replay exercises. Verify privileged and denied actions produce usable evidence.