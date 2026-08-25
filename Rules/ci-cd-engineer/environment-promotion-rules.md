# Environment Promotion Rules

## Purpose
Make promotion controlled, traceable, and consistent across environments.

## Scope
Development, test, staging, production, and equivalent deployment targets.

## MUST
- Promotion MUST move the same immutable artifact between environments.
- Environment-specific configuration MUST be external to the artifact and validated before deployment.
- Production promotion MUST identify artifact, source revision, configuration revision, actor, and approval.
- Required lower-environment evidence MUST be satisfied before production unless emergency policy explicitly permits bypass.
- Environment access MUST follow least privilege.

## MUST NOT
- MUST NOT patch release artifacts manually between environments.
- MUST NOT copy production credentials into lower environments.
- MUST NOT infer successful production readiness solely from deployment success in a non-equivalent environment.

## SHOULD
- Staging SHOULD approximate production characteristics needed to validate release risk.
- Promotion SHOULD be automated and idempotent.

## Exceptions
Document environmental differences, resulting risk, compensating verification, and approval.

## Verification
Compare artifact digests, inspect configuration sources and environment ACLs, review promotion records, and test that unauthorized or unverified promotions are rejected.