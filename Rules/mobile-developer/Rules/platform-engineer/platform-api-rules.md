# Platform API Rules

## Purpose
Define safe, stable contracts for platform capabilities exposed to engineering teams.

## Scope
Applies to platform APIs, CLIs, SDKs, portals, controllers, and automation interfaces.

## MUST
- Public platform contracts MUST be versioned or evolved compatibly.
- Inputs MUST be validated before provisioning or mutation begins.
- Long-running operations MUST expose clear status and failure states.
- Idempotency MUST be provided for retry-prone create/update workflows where duplicate execution can cause harm.
- Authorization MUST be enforced at the platform boundary.

## MUST NOT
- MUST NOT silently change defaults that alter production behavior.
- MUST NOT expose provider-specific implementation details unless they are intentional contract surface.
- MUST NOT return success before required durable state is committed.

## SHOULD
- Prefer declarative interfaces over imperative multi-step procedures.
- Prefer machine-readable error contracts with remediation guidance.

## Exceptions
Breaking changes require documented migration, blast-radius analysis, compatibility plan, and approval.

## Verification
Use contract tests, schema diffing, integration tests, authorization tests, retry tests, and release review.