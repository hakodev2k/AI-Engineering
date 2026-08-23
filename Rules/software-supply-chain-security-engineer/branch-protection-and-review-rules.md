# Branch Protection and Review Rules

## Purpose
Prevent unauthorized or insufficiently reviewed changes from entering trusted release paths.

## Scope
Protected branches, merge policies, review requirements, status checks, and administrative bypasses.

## MUST
- Trusted release branches MUST enforce required reviews and required status checks.
- Security-sensitive paths MUST have designated qualified reviewers or owners.
- Administrative bypass capability MUST be restricted, auditable, and used only for documented exceptional cases.
- Force pushes and deletion of protected release branches MUST be disabled unless explicitly justified.
- Review requirements MUST remain effective for changes to CI, security policy, dependency configuration, and release tooling.

## MUST NOT
- MUST NOT permit authors to self-approve changes that require independent review.
- MUST NOT weaken protections temporarily without documented approval and restoration verification.
- MUST NOT rely on informal review when repository controls can enforce the requirement.

## SHOULD
- Review policy SHOULD require fresh approval after material changes.
- Critical repositories SHOULD use code ownership for privileged paths.

## Exceptions
Exceptions require reason, approver, affected changes, compensating review, and post-event verification.

## Verification
Inspect branch protection settings, merge history, review records, bypass audit logs, status checks, and ownership configuration.