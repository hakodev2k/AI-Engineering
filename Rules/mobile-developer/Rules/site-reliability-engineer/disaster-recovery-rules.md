# Disaster Recovery Rules

## Purpose
Ensure critical services can recover from regional, platform, data, or large-scale operational failure within agreed objectives.

## Scope
Applies to disaster recovery architecture, failover, restoration, recovery exercises, and continuity planning.

## MUST
- Critical services MUST define recovery time and recovery point objectives aligned with business impact.
- Recovery plans MUST identify required dependencies, data sources, credentials, capacity, and decision authority.
- Disaster recovery procedures MUST be exercised periodically at a scope appropriate to service criticality.
- Recovery exercises MUST verify service functionality and data integrity, not infrastructure creation alone.
- Known recovery gaps MUST have owners, risk assessment, and remediation or explicit acceptance.

## MUST NOT
- MUST NOT claim disaster recovery readiness solely from documentation that has never been exercised.
- MUST NOT assume multi-zone deployment protects against regional or control-plane failure.
- MUST NOT execute production failover tests without approved risk controls.

## SHOULD
- Prefer recovery procedures that are automated, repeatable, and independently verifiable.
- Include communication and decision checkpoints in large-scale recovery plans.

## Exceptions
Reduced exercise frequency or incomplete recovery coverage requires documented constraints, business approval, and compensating evidence.

## Verification
Review DR test reports, failover timings, restore evidence, RTO/RPO measurements, dependency readiness, and remediation tracking.