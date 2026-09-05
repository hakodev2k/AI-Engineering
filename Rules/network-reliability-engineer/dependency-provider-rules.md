# Dependency and Provider Rules

## Purpose
Manage reliability risks introduced by carriers, cloud networks, shared platforms, and other external network dependencies.

## Scope
Third-party connectivity, transit, managed network services, cloud providers, and cross-team shared dependencies.

## MUST
- Critical external dependencies MUST have documented ownership, escalation paths, and expected service levels.
- Provider dependencies MUST be included in failure-mode and capacity planning.
- Multi-provider designs MUST verify that supposedly independent paths do not share hidden dependencies where independence is required.
- Provider incidents MUST be correlated with internal telemetry before conclusions are drawn.

## MUST NOT
- MUST NOT assume contractual redundancy equals technical independence.
- MUST NOT depend on a single escalation contact for critical services.
- MUST NOT conceal provider limitations from availability planning.

## SHOULD
- Maintain tested escalation and failover procedures for high-impact dependencies.
- Periodically review provider performance and incident history.

## Exceptions
Single-provider dependencies require documented rationale, business impact, compensating controls, and approval.

## Verification
Review dependency inventories, contracts or SLOs, escalation records, topology evidence, failover tests, and incident data.