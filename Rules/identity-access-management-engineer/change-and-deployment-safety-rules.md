# Change and Deployment Safety Rules

## Purpose
Prevent identity changes from causing lockout, privilege escalation, or uncontrolled production impact.

## Scope
Identity-provider configuration, policy, federation, provisioning, directories, keys, application registrations, and production IAM changes.

## MUST
- Production IAM changes MUST have scoped intent, peer review, validation plan, rollback or recovery path, and required human approval.
- Changes affecting authentication or authorization MUST test both intended success and prohibited-access cases.
- High-blast-radius changes MUST use staged rollout or equivalent risk reduction where feasible.
- Post-change verification MUST confirm effective behavior rather than configuration write success alone.

## MUST NOT
- MUST NOT weaken security controls merely to unblock deployment.
- MUST NOT combine unrelated high-risk IAM changes when separation improves reversibility.
- MUST NOT force-push or rewrite shared history as part of automated IAM change handling.

## SHOULD
- Manage reproducible IAM configuration as reviewed code where platform capabilities permit.

## Exceptions
Emergency changes require incident linkage, minimal scope, explicit authorization, immediate verification, and retrospective review.

## Verification
Review diffs, approvals, tests, rollout evidence, audit events, effective-access checks, and rollback exercises.