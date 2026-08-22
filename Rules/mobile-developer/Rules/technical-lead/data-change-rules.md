# Data Change Rules
## Purpose
Protect integrity, compatibility, and recoverability of persistent data.
## Scope
Schemas, migrations, backfills, destructive operations, and data contracts.
## MUST
- Schema changes MUST assess compatibility with deployed readers and writers.
- Destructive or irreversible changes MUST have explicit human approval, verified backups or recovery strategy, and rollout plan.
- Large backfills MUST define batching, throttling, observability, and restart behavior.
## MUST NOT
- Execute destructive production SQL solely because generated output appears correct.
- Couple deployment success to an unbounded migration without risk assessment.
## SHOULD
- Prefer expand-migrate-contract patterns for zero/low-downtime evolution.
## Exceptions
Emergency data repair requires evidence, scoped impact, authorization, and audit trail.
## Verification
Inspect migration scripts, dry runs, backups, query plans, deployment sequence, telemetry, and approvals.