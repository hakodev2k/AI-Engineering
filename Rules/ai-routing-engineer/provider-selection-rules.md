# Provider Selection Rules

## Purpose
Select providers using explicit reliability, security, quality, latency, and commercial constraints.

## Scope
Provider eligibility, regional endpoints, contractual constraints, service maturity, and failover order.

## MUST
- Provider eligibility MUST include security, privacy, residency, contractual, and operational requirements applicable to the request.
- Provider-specific limits and known failure modes MUST be represented in routing configuration when material.
- Production providers MUST have defined ownership, escalation, and outage handling paths.
- Provider changes affecting regulated or sensitive traffic MUST be reviewed before activation.
- Failover providers MUST be validated against the same hard requirements as primary providers.

## MUST NOT
- MUST NOT fail over to a provider that violates data-handling or residency constraints.
- MUST NOT assume equivalent model behavior across different providers without testing.
- MUST NOT embed provider credentials in routing configuration or source code.

## SHOULD
- Avoid unnecessary provider concentration for critical workloads when diversity materially improves resilience.
- Track provider-specific quality and reliability evidence.

## Exceptions
Exceptions require documented business need, risk, compensating controls, duration, and approval.

## Verification
Inspect provider policy, endpoint configuration, contract metadata, security review, failover tests, and provider performance dashboards.