# Dependency Recovery

## Purpose
Prevent recovery failure caused by missing or incorrectly ordered dependencies.

## Scope
Identity, DNS, networking, certificates, secrets, databases, queues, storage, configuration, external services, and application dependencies.

## MUST
- Critical recovery plans MUST identify dependencies and required recovery order.
- Dependencies needed to access backups or bootstrap recovery MUST themselves have a survivable recovery path.
- Cross-service consistency requirements MUST be documented where independent restore points can create invalid state.
- External dependencies MUST have documented assumptions and fallback/escalation paths.

## MUST NOT
- MUST NOT treat an application backup as sufficient when required identity, configuration, or infrastructure state cannot be reconstructed.
- MUST NOT restore dependent services to incompatible states without reconciliation.
- MUST NOT hide unresolved dependency risks behind aggregate RTO reporting.

## SHOULD
- Dependency maps SHOULD be validated during exercises and updated after architectural changes.

## Exceptions
Unprotected dependencies require explicit risk acceptance, workaround, owner, and review date.

## Verification
Inspect dependency maps, bootstrap procedures, infrastructure/configuration protection, exercise observations, consistency tests, and unresolved external assumptions.