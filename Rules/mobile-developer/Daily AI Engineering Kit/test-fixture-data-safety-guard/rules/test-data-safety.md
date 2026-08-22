# Test Data Safety Rules

## MUST
- Explicitly identify target environment before any mutating test.
- Treat unknown environment or fixture provenance as unsafe.
- Bind every run to a unique run identifier and declared isolation boundary.
- Use synthetic/generated fixtures by default.
- Record side effects and cleanup ownership.
- Scope cleanup to resources created or explicitly owned by the test run.
- Preserve preflight and post-cleanup evidence.
- Require independent review for production-like targets, approved sanitized copies, or external side effects.
- Require human approval before any production target, destructive reset, bulk delete, real messaging/payment endpoint, or permission increase.

## MUST NOT
- Infer safety from environment names such as `qa`, `dev`, or `staging` alone.
- Use real customer credentials, secrets, emails, phone numbers, payment instruments, or production identifiers in fixtures.
- Copy raw production data into tests.
- Run broad `DELETE`, `TRUNCATE`, database drop, storage wipe, queue purge, or tenant reset by default.
- Expand cleanup scope because a scoped cleanup failed.
- Disable safety checks to make tests pass.
- Let the test implementation agent be the sole verifier of data isolation.
- Claim cleanup succeeded from command exit code alone.

## SHOULD
- Prefer disposable environments, containers, transactions, per-run schemas, tenants, prefixes, or namespaces.
- Make fixture generation deterministic when reproducibility matters.
- Keep fixture builders separate from production-data importers.
- Use allowlisted fake domains/phone ranges for notification tests.
- Record resource IDs created by the run for precise cleanup.
- Make production-like test access read-only unless an approved exception exists.