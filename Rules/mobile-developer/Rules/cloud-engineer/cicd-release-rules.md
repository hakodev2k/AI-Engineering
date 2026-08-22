# CI/CD and Release Rules
## Purpose
Make cloud delivery controlled, repeatable, and reversible.
## Scope
Build, validation, deployment pipelines, promotion, approvals, rollout, and rollback.
## MUST
- Deployment artifacts MUST be immutable or uniquely identifiable across promotion stages.
- Production releases MUST pass required security, infrastructure, and workload validation gates.
- High-risk production changes MUST have rollback or forward-recovery procedures and required human approval.
## MUST NOT
- MUST NOT deploy unreviewed infrastructure or application changes directly to production as routine practice.
- MUST NOT hide failed validation by disabling gates without approved exception.
## SHOULD
- Use progressive delivery for changes with material blast radius when supported.
## Exceptions
Emergency release exceptions require incident context, authority, evidence capture, and post-change review.
## Verification
Inspect pipeline definitions, artifact identities, approvals, test results, deployment history, rollback evidence, and policy checks.