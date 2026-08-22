# Production Safety Rules
## Purpose
Prevent performance work from creating production outages or irreversible risk.
## Scope
Production tests, tuning, configuration, deployments, and mitigations.
## MUST
- Require explicit human approval before disruptive production load tests, risky configuration changes, or irreversible actions.
- Define rollback or recovery before high-risk tuning is executed.
- Bound blast radius and monitor impact during production experiments.
## MUST NOT
- Disable security, durability, or correctness controls merely to improve performance.
- Execute destructive actions beyond granted authority.
## SHOULD
- Prefer canaries, feature flags, staged rollout, and reversible changes.
## Exceptions
Emergency actions require incident authority and retrospective documentation.
## Verification
Review approvals, change records, rollback plans, telemetry, and post-change validation.