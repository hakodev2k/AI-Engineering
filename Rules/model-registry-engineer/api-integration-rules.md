# API and Integration Rules

## Purpose
Keep registry APIs and integrations stable, explicit, and safe for automated training, evaluation, and deployment systems.

## Scope
HTTP or RPC APIs, SDKs, webhooks, event streams, retries, pagination, idempotency, and external integrations.

## MUST
- Public registry operations MUST define request, response, error, and authorization contracts.
- Mutating operations that can be retried MUST be idempotent or expose duplicate-safe semantics.
- API changes MUST be compatibility-reviewed before release.
- Pagination and filtering semantics MUST be deterministic for automation.
- Integration failures MUST preserve enough diagnostic context for investigation.

## MUST NOT
- MUST NOT silently change lifecycle-state meanings or alias-resolution behavior in an existing API contract.
- MUST NOT expose internal storage paths as the only supported integration contract.
- MUST NOT retry non-idempotent mutations blindly.

## SHOULD
- Version externally consumed APIs when compatibility cannot be preserved.
- Provide machine-readable error codes for recoverable failure classes.

## Exceptions
Exceptions require consumer-impact analysis, migration guidance, and owner approval.

## Verification
Run contract tests, retry tests, pagination tests, SDK compatibility checks, and integration failure tests.