# Schema Evolution

## Purpose
Enable safe message evolution across independently deployed systems.

## Scope
Schema registries, compatibility modes, versions, and migrations.

## MUST
- Compatibility policy MUST be defined per contract family.
- Producers MUST validate new schemas before publishing them.
- Migrations MUST account for retained historical messages and lagging consumers.

## MUST NOT
- MUST NOT disable compatibility checks merely to unblock deployment.
- MUST NOT delete schemas still required to decode retained data.

## SHOULD
- Prefer backward-compatible additive changes and staged migrations.

## Exceptions
Any incompatible evolution requires evidence, bounded exposure, coordinated rollout, rollback, and approval.

## Verification
Inspect registry settings, compatibility results, retained-data replay tests, and deployment sequencing.