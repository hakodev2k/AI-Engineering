# Rollback and Recovery Rules
## Purpose
Ensure production changes have realistic and tested recovery paths.
## Scope
Application, infrastructure, configuration, data, schema, integration, and dependency changes.
## MUST
- Every material change MUST define recovery actions for credible failure scenarios.
- Rollback feasibility MUST be evaluated independently for code, schema, data, configuration, and external contracts.
- Irreversible changes MUST have a tested forward-recovery strategy and explicit approval before execution.
- Rollback triggers, decision authority, and acceptable decision delay MUST be known before high-risk rollout.
- Recovery instructions MUST identify dependencies and ordering constraints.
## MUST NOT
- A rollback plan MUST NOT assume compatibility that has not been validated.
- Destructive migrations MUST NOT be labeled reversible without demonstrated restoration or compensating recovery.
- Backup existence MUST NOT be treated as equivalent to proven recoverability.
## SHOULD
- Rehearse rollback or forward recovery for high-impact changes in a production-like environment.
- Keep recovery steps simple enough to execute under incident pressure.
## Exceptions
Where rollback is impossible, require rationale, blast-radius reduction, stronger validation, forward recovery, and human approval.
## Verification
Review procedures, test results, backup/restore evidence, compatibility checks, recovery timings, and approvals.