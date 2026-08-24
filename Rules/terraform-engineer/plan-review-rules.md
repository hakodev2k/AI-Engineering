# Plan Review

## Purpose
Treat the Terraform plan as required change evidence, not a ceremonial artifact.

## Scope
Plans produced for pull requests, releases, drift correction, imports, and production changes.

## MUST
- Every infrastructure change MUST produce a plan against the intended state and configuration before apply.
- Reviewers MUST inspect creates, updates, replacements, destroys, sensitive lifecycle changes, and unexpected dependencies.
- Production plans MUST be generated from the exact reviewed revision and relevant variables/configuration.
- Materially changed plans MUST be reviewed again.

## MUST NOT
- A plan with unexplained destructive actions MUST NOT be applied.
- Human review MUST NOT rely only on resource counts when semantics matter.
- Stale plans MUST NOT be treated as valid evidence after relevant state or configuration changes.

## SHOULD
- CI SHOULD make plans easy to inspect and retain as change evidence.
- High-risk resources SHOULD receive explicit reviewer attention.

## Exceptions
Automated low-risk applies require pre-approved policy, deterministic guardrails, scoped authority, and auditability.

## Verification
Compare source revision, plan metadata, variables, backend/workspace, policy checks, reviewer approvals, and apply logs. Confirm the applied plan matches the reviewed artifact when saved plans are used.