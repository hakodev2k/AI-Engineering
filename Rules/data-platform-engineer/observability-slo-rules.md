# Observability and SLO Rules

## Purpose
Make platform health, data timeliness, correctness signals, and consumer impact measurable enough to operate production systems responsibly.

## Scope
Applies to platform services, pipelines, datasets, queues, compute, storage, APIs, and critical dependencies.

## MUST
- Critical platform capabilities MUST define service indicators and objectives that reflect consumer-visible availability, latency, freshness, or correctness as appropriate.
- Telemetry MUST distinguish infrastructure health from workload and data-quality failures when practical.
- Alerts MUST be actionable, tied to defined impact or risk, and routed to an accountable owner.
- Logs, metrics, and traces MUST include correlation identifiers or equivalent context needed to investigate distributed failures without exposing secrets.
- SLO breaches and persistent near-saturation conditions MUST trigger review and corrective prioritization.

## MUST NOT
- MUST NOT rely on dashboard availability as evidence that critical alert paths work.
- MUST NOT page on high-volume low-actionability signals without a demonstrated operational need.
- MUST NOT log secrets or unnecessary sensitive data for diagnostic convenience.

## SHOULD
- Prefer consumer-oriented SLIs over internal component metrics alone.
- SHOULD maintain runbooks for high-severity alerts and common failure modes.

## Exceptions
Exceptions require documented observability limitation, risk, compensating evidence, remediation plan, and operational owner approval.

## Verification
Inspect SLO definitions, alert tests, telemetry coverage, incident evidence, dashboard queries, runbooks, and controlled failure exercises.