# CI/CD and Release Rules
## Purpose
Make AWS releases repeatable, authorized, observable, and reversible.
## Scope
Build pipelines, deployment roles, artifacts, environments, approvals, canaries, and rollback.
## MUST
- Build deployable artifacts once and promote immutable versions through environments where practical.
- Separate deployment permissions by environment and apply least privilege.
- Define rollback or safe-forward recovery for material production changes.
- Require explicit human approval for high-risk production, security, destructive, or irreversible changes.
## MUST NOT
- Deploy unreviewed local artifacts directly to production.
- Bypass required security or verification gates merely to meet a delivery deadline.
## SHOULD
- Use progressive delivery when blast radius or uncertainty is material.
## Exceptions
Emergency release procedures require incident context, authorized approver, recorded actions, and post-change verification.
## Verification
Inspect pipeline definitions, artifact digests, IAM roles, approval records, deployment history, health gates, and rollback evidence.