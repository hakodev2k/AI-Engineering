# Observability and Operability

## Purpose
Ensure Terraform-managed infrastructure can be operated, diagnosed, and owned in production.

## Scope
Monitoring resources, logs, metrics, alerts, dashboards, ownership metadata, and operational dependencies.

## MUST
- Production-critical resources MUST have sufficient telemetry and ownership to detect and investigate material failures.
- Infrastructure changes that alter service topology MUST update relevant monitoring and alert routing when required.
- Alert resources MUST identify actionable conditions and responsible ownership.
- Diagnostic logging destinations and retention MUST satisfy security and operational requirements.

## MUST NOT
- New critical infrastructure MUST NOT be considered production-ready when its health cannot be observed.
- Sensitive logs MUST NOT be routed to unauthorized destinations.
- Monitoring resources MUST NOT be removed without verifying replacement coverage or approved decommissioning.

## SHOULD
- Observability configuration SHOULD be managed alongside the infrastructure it monitors when lifecycle ownership aligns.
- Alerts SHOULD use service objectives or user impact where possible rather than noisy low-level signals alone.

## Exceptions
Temporary gaps require documented duration, risk, manual detection method, owner, and remediation date.

## Verification
Inspect plans, monitoring resources, log sinks, alert routes, dashboards, retention, ownership tags, test alerts, and post-deployment telemetry.