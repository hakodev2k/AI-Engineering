# DNS Observability Rules

## Purpose
Make DNS health, failures, and changes diagnosable.

## Scope
Metrics, logs, traces where applicable, synthetic probes, and audit events.

## MUST
- Critical DNS services MUST expose availability, latency, error, saturation, and freshness signals.
- Monitoring MUST distinguish authoritative failures, resolver failures, validation failures, and upstream/network failures where practical.
- Administrative changes MUST be auditable to an identity and time.

## MUST NOT
- MUST NOT log secrets, authentication material, or unnecessary sensitive query data.
- MUST NOT rely solely on process-up checks for DNS availability.

## SHOULD
- External synthetic resolution SHOULD cover critical names and delegation paths.

## Exceptions
Reduced telemetry requires documented privacy/security rationale and compensating evidence.

## Verification
Inspect dashboards, alerts, logs, synthetic tests, retention controls, and incident diagnostic coverage.