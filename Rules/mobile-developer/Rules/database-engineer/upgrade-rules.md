# Database Upgrade Rules
## Purpose
Upgrade database engines and major dependencies without uncontrolled compatibility or recovery risk.
## Scope
Engine versions, compatibility levels, extensions, drivers, and major platform migrations.
## MUST
- Review breaking changes, deprecated behavior, driver compatibility, extensions, backup compatibility, and rollback constraints before upgrade.
- Rehearse material upgrades with representative schema, data, workload, and recovery procedures.
- Establish rollback or forward-recovery criteria and explicit production approval.
## MUST NOT
- Perform a major production upgrade solely because a version is newer.
- Assume application compatibility from successful database startup alone.
## SHOULD
- Use staged rollout or replica-based migration where it reduces risk.
## Exceptions
Urgent security upgrades may compress timelines but still require risk, recovery, and verification evidence.
## Verification
Review compatibility tests, workload benchmarks, restore tests, upgrade logs, rollback rehearsal, and post-upgrade telemetry.