# Change Impact Rules
## Purpose
Prevent releases and migrations from invalidating capacity assumptions.
## Scope
Application releases, dependency upgrades, migrations, feature flags, data-model changes, and topology changes.
## MUST
- Material changes MUST assess expected impact on resource efficiency and demand amplification.
- Capacity-sensitive releases MUST compare pre/post telemetry or benchmark evidence.
- Major migrations MUST include dual-run, backfill, or transition capacity where applicable.
## MUST NOT
- MUST NOT assume functional equivalence implies capacity equivalence.
- MUST NOT remove old capacity before rollback or transition requirements are satisfied.
## SHOULD
- Significant efficiency regressions SHOULD have explicit acceptance or remediation decisions.
## Exceptions
Urgent fixes require post-change capacity validation.
## Verification
Inspect release diffs, benchmarks, telemetry, migration plans, and rollback readiness.