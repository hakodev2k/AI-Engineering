# Deployment and Compatibility Rules

## Purpose
Keep distributed components interoperable during rolling change.

## Scope
APIs, schemas, events, protocols, and multi-version deployments.

## MUST
- Deployments MUST tolerate expected periods of mixed component versions.
- Contract and schema changes MUST define backward and forward compatibility requirements.
- Breaking changes MUST use an approved migration and rollback strategy.

## MUST NOT
- MUST NOT require perfectly synchronized deployment across independent services unless explicitly engineered and approved.
- MUST NOT remove fields or behavior still consumed by supported versions.

## SHOULD
- Prefer expand-and-contract migrations for shared contracts and data.

## Exceptions
Coordinated cutovers require dependency inventory, rollback plan, validation evidence, and human approval.

## Verification
Run compatibility tests, mixed-version tests, migration dry runs, and rollback validation.