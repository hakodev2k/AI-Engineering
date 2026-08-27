# Production Safety
## Purpose
Control high-risk actions on live streaming systems.
## Scope
Deployments, resets, replays, offset changes, scaling, configuration, and destructive operations.
## MUST
- Operators MUST distinguish analyze, recommend, prepare, and execute authority.
- Destructive state/offset changes, production replays, data deletion, and breaking contract changes MUST require explicit human approval.
- High-risk actions MUST define blast radius, rollback or recovery, validation, and responsible owner.
## MUST NOT
- Forceful recovery MUST NOT discard state or skip data merely to restore green health indicators.
- Production changes MUST NOT be executed outside granted authority.
## SHOULD
- Prefer reversible, incremental actions with observable checkpoints.
## Exceptions
Emergency actions require incident authority and contemporaneous evidence capture.
## Verification
Review audit logs, change records, approvals, diffs, and post-action correctness checks.