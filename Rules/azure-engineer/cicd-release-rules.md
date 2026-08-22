# CI/CD and Release Rules

## Purpose
Make Azure infrastructure and workload releases repeatable, auditable, and safe.

## Scope
GitHub Actions, Azure DevOps, deployment identities, environments, approvals, artifacts, rollout, and rollback.

## MUST
- Build immutable or traceable deployment artifacts from reviewed source.
- Separate deployment permissions by environment and least privilege.
- Validate infrastructure and application changes before production promotion.
- Define rollback, roll-forward, or containment for material releases.
- Require human approval for production changes when risk or governance requires it.

## MUST NOT
- Put long-lived production credentials directly in pipeline definitions.
- Bypass required checks to accelerate a routine release.
- Rebuild a different artifact during production promotion when artifact promotion is expected.
- Force push or rewrite shared release history without explicit approval.

## SHOULD
- Use workload identity federation or managed identities for pipelines where practical.
- Prefer progressive deployment for high-risk workloads.

## Exceptions
Emergency release exceptions require incident context, authorization, audit trail, and retrospective review.

## Verification
Inspect pipeline definitions, identity permissions, approvals, artifacts, checks, deployment logs, and rollback evidence.