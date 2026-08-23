# Schema Safety Rules

## MUST
- Capture baseline and candidate schema evidence before declaring a migration safe.
- Tie every schema difference to an explicit requirement or mark it unintended/unresolved.
- Require human approval for drops, destructive renames, type narrowing, required-nullability changes, primary-key changes, irreversible migrations, and production execution.
- Re-run the deterministic gate after any migration/model fix.
- Preserve generated SQL or equivalent migration evidence for high-risk changes.
- Use non-production or read-only metadata access during investigation.
- Invalidate prior approval if the approved schema diff materially changes.
- Stop on permission failure rather than increasing privileges.

## MUST NOT
- Execute destructive SQL or production migrations automatically.
- Treat drop+add as a rename without evidence.
- Delete or rewrite applied migration history to make drift disappear.
- Accept a generated migration merely because the ORM produced it.
- Hide unrelated schema changes inside a requested migration.
- Add secrets, credentials, or production connection strings to reports/configuration.
- Force-push or rewrite Git history to resolve migration conflicts.
- Allow the implementing agent to be the sole verifier of a high-risk change.

## SHOULD
- Prefer the smallest migration that satisfies the requirement.
- Compare normalized logical schema rather than formatting/order noise.
- Add regression tests for discovered convention/provider surprises.
- Record database provider and tool versions with evidence.
- Prefer expand/contract migration patterns for breaking changes.
- Review query/index impact separately when schema shape changes performance characteristics.
