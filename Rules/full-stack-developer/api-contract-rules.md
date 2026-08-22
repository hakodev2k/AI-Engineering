# API Contract Rules

## Purpose
Keep client-server integration explicit, stable, and evolvable.
## Scope
HTTP APIs, schemas, request/response models, and errors.
## MUST
- Specify validation, errors, nullability, pagination, authentication, and compatibility semantics.
- Treat consumed fields and behaviors as compatibility commitments.
- Provide migration strategy for breaking changes.
## MUST NOT
- Expose persistence entities accidentally.
- Break consumers without impact analysis and approval.
## SHOULD
- Use schema validation and contract tests.
## Exceptions
Coordinated breaking changes require known consumers, rollout order, rollback, and approval.
## Verification
Inspect specifications, compatibility tests, consumer tests, and release diffs.