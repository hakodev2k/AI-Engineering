# Persisted Operation Security Rules

## Purpose
Reduce attack surface and operational variability by governing persisted GraphQL operations safely.

## Scope
Applies to allowlists, persisted-query registries, operation hashes, registration workflows, and production execution policy.

## MUST
- Persisted operation registries MUST validate operation text, schema compatibility, and ownership before activation.
- Production allowlists MUST fail closed when policy requires registered operations only.
- Operation hashes MUST be collision-resistant and bound to exact canonical operation content.
- Registry changes MUST be auditable and attributable.
- Emergency removal of a dangerous operation MUST have a documented response path.

## MUST NOT
- MUST NOT permit arbitrary client registration directly into production without authorization and validation.
- MUST NOT treat persisted operations as a substitute for resolver authorization or complexity controls.
- MUST NOT silently map one persisted identifier to materially different semantics.

## SHOULD
- SHOULD stage registry changes with client rollout evidence.
- SHOULD monitor unknown-operation attempts and registry misses.

## Exceptions
Temporary unrestricted execution requires explicit security approval, bounded duration, monitoring, and rollback criteria.

## Verification
Inspect registry configuration, registration tests, hash validation, audit logs, negative execution tests, and production telemetry.