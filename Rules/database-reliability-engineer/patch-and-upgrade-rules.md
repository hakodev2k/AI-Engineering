# Patch and Upgrade Rules

## Purpose
Apply database engine and platform updates without unmanaged compatibility or availability risk.

## Scope
Engine versions, extensions, drivers, managed-service upgrades, and security patches.

## MUST
- Inventory supported versions and vendor end-of-support dates.
- Test upgrades against representative schema, workload, drivers, and recovery procedures.
- Define compatibility checks, rollback or restore strategy, and success criteria before production execution.
- Prioritize security fixes according to exploitability and exposure.

## MUST NOT
- Do not execute major production upgrades without tested recovery and application compatibility evidence.
- Do not defer critical patches indefinitely without explicit risk acceptance.

## SHOULD
- Prefer staged rollout through lower-risk environments and replicas when architecture permits.

## Exceptions
Emergency patching requires documented authority, validation scope, and post-change review.

## Verification
Review version inventory, test evidence, change plans, recovery tests, and post-upgrade health checks.