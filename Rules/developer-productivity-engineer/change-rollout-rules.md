# Tooling Change Rollout Rules
## Purpose
Reduce disruption when changing tools used by many engineers.
## Scope
CLI, CI, build, IDE, templates, platform APIs, and policy rollouts.
## MUST
- Material changes MUST identify affected users, compatibility risks, migration path, and rollback criteria.
- Broad rollouts MUST use staged exposure when failure blast radius is significant.
- Breaking changes MUST communicate deadlines and provide actionable migration guidance.
- Production-impacting rollout execution MUST require authorized approval where organizational policy requires it.
## MUST NOT
- MUST NOT remove a working path before adoption and rollback evidence is sufficient.
- MUST NOT infer successful adoption solely from absence of support tickets.
## SHOULD
- Rollouts SHOULD include telemetry and direct feedback channels.
## Exceptions
Emergency security fixes may compress stages with documented risk acceptance.
## Verification
Review rollout plan, cohort telemetry, compatibility tests, communications, and rollback rehearsal.