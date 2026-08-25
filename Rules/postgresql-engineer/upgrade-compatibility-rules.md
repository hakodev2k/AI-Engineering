# Upgrade and Compatibility Rules
## Purpose
Upgrade PostgreSQL without unbounded compatibility or availability risk.
## Scope
Major/minor versions, clients, extensions, SQL behavior, and rollout.
## MUST
- Review release notes and known incompatibilities relevant to the deployed workload.
- Rehearse major upgrades with production-scale schema/data and required extensions.
- Validate application drivers, queries, backup/restore, replication, and monitoring against the target version.
- Define rollback or fallback boundaries before execution.
## MUST NOT
- Perform an irreversible production major upgrade without human approval.
- Skip supported security/minor updates indefinitely without documented risk acceptance.
## SHOULD
- Automate compatibility tests and post-upgrade validation.
## Exceptions
Emergency security upgrades may compress rehearsal but require explicit risk authority.
## Verification
Run upgrade rehearsal, regression/performance tests, catalog checks, and post-upgrade health validation.