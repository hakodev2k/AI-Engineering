# Dependency and Application Coordination

## Purpose
Prevent database migration from breaking dependent applications and integrations.

## Scope
Covers services, jobs, reports, ETL, BI, caches, connectors, and operational tooling.

## MUST
- Migration planning MUST inventory known read/write dependencies and owners for affected objects or endpoints.
- Application deployment sequencing MUST tolerate realistic rollout overlap and rollback states.
- Connection, driver, query, and feature compatibility with the target MUST be tested for critical consumers.

## MUST NOT
- MUST NOT infer dependency absence from one code repository search.
- MUST NOT break unmanaged consumers without an approved communication and compatibility plan.

## SHOULD
- Use runtime query telemetry, catalog dependencies, and owner confirmation to complement static search.
- Provide deprecation windows for externally consumed database contracts.

## Exceptions
Unknown-consumer risk may be accepted only with documented discovery effort, monitoring, rollback capability, and approval.

## Verification
Inspect dependency inventories, telemetry, contract tests, deployment plans, consumer sign-offs, and rollback compatibility.