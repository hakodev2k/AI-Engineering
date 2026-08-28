# Disaster Recovery Rules

## Purpose
Ensure critical AI infrastructure can be restored after regional, control-plane, storage, or configuration disasters.

## Scope
Applies to recovery objectives, backups, replicated artifacts, configuration, infrastructure state, and restoration procedures.

## MUST
- Critical services MUST define RTO and RPO targets.
- Recovery plans MUST include infrastructure state, model artifacts, datasets where applicable, secrets references, and dependency restoration order.
- Backups and replicas MUST be tested through restoration, not assumed usable.
- Disaster recovery procedures MUST identify manual approval points for destructive or high-impact actions.

## MUST NOT
- MUST NOT count an untested backup as a verified recovery capability.
- MUST NOT store the only recovery copy in the same failure domain as the primary.
- MUST NOT execute destructive recovery steps without authorized approval.

## SHOULD
- Recovery exercises SHOULD simulate loss of an entire meaningful failure domain.
- Recovery documentation SHOULD be executable and version-controlled.

## Exceptions
Exceptions require documented exposure, compensating controls, expiry, and approval.

## Verification
Review RTO/RPO records, backup status, restore tests, replicated artifacts, dependency order, runbooks, and recovery exercise evidence.