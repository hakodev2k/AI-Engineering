# Version and Upgrade Rules

## Purpose
Upgrade graph database software without avoidable compatibility, availability, or data risk.

## Scope
Database engines, drivers, plugins, extensions, graph algorithm libraries, and major dependencies.

## MUST
- Review release notes, compatibility matrices, deprecations, storage-format changes, driver requirements, and rollback constraints.
- Test critical queries, migrations, backup/restore, security configuration, and operational tooling on the target version.
- Benchmark critical workloads when planner, runtime, indexing, or storage behavior may change.
- Require human approval for major production upgrades.
- Confirm a supported recovery path before execution.

## MUST NOT
- Perform unsupported downgrade or storage-format reversal as an assumed rollback.
- Upgrade production first to discover compatibility issues.
- Ignore plugin or driver compatibility because the core database starts successfully.

## SHOULD
- Use staged rollout and mixed-version procedures only when vendor/platform semantics support them.
- Remove deprecated features before they become upgrade blockers.

## Exceptions
Urgent security upgrades may compress normal lead time but still require compatibility checks, recovery readiness, approval, and post-upgrade validation.

## Verification
Inspect test results, compatibility evidence, benchmark comparisons, backup/restore drill, rollout plan, monitoring, and post-upgrade query and integrity checks.