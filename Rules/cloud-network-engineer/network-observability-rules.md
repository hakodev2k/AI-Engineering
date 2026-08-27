# Network Observability Rules

## Purpose
Provide evidence for network health, failures, security events, and capacity decisions.

## Scope
Applies to flow logs, packet telemetry, DNS metrics, load balancer metrics, route changes, synthetic probes, and dashboards.

## MUST
- Critical network paths MUST have telemetry sufficient to distinguish DNS, routing, transport, firewall, and application failures.
- Flow logging MUST be enabled where security, troubleshooting, or compliance requires it.
- Monitoring MUST cover availability, latency, packet loss, saturation, and error indicators relevant to each service.
- Telemetry retention MUST support incident and audit requirements.
- Alerts MUST identify actionable conditions and ownership.

## MUST NOT
- MUST NOT claim network root cause solely from application symptoms without network evidence.
- MUST NOT log sensitive payload data unnecessarily.
- MUST NOT operate critical shared networking without health visibility.

## SHOULD
- Correlate network telemetry with application traces and infrastructure changes.
- Use synthetic probes for critical cross-boundary paths.

## Exceptions
Exceptions require documented observability gaps, risk, alternative evidence, and remediation ownership.

## Verification
Review logging configuration, dashboards, alert rules, retention, synthetic tests, and recent incident evidence.