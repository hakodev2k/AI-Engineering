# Production Release Rules
## Purpose
Control deployment risk and preserve recoverability.
## Scope
Production releases, configuration changes, feature rollout, and rollback.
## MUST
- Production changes MUST have verified artifacts, relevant test evidence, observability, and a rollback or forward-recovery strategy.
- High-risk production execution MUST require authorized human approval.
- Configuration and code compatibility across rollout stages MUST be assessed.
## MUST NOT
- Deploy unreviewed high-risk changes directly to production.
- Disable safeguards or monitoring merely to make a release pass.
## SHOULD
- Prefer progressive delivery for changes with uncertain production behavior.
## Exceptions
Emergency releases require explicit authorization, scoped risk, monitoring, and retrospective verification.
## Verification
Inspect deployment records, approvals, CI artifacts, health metrics, rollout configuration, and rollback evidence.