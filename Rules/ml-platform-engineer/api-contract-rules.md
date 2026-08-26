# Platform API Contracts

## Purpose
Keep ML platform integrations stable, explicit, and safely evolvable.

## Scope
APIs, SDKs, CLIs, events, schemas, and platform-facing resource definitions.

## MUST
- Public platform contracts MUST define validation, errors, compatibility expectations, and lifecycle policy.
- Breaking changes MUST use versioning, migration, or coordinated deprecation with affected consumers identified.
- Asynchronous operations MUST expose durable operation state and terminal failure semantics.
- Idempotency MUST be defined for retriable mutating operations.

## MUST NOT
- Consumers MUST NOT be forced to parse undocumented error text for control flow.
- Existing contract semantics MUST NOT change silently under the same stable version.

## SHOULD
- Contracts SHOULD be machine-described and tested against representative clients.

## Exceptions
Breaking emergency changes require explicit approval, impact analysis, communication, and remediation plan.

## Verification
Run schema/contract tests, compatibility checks, SDK tests, idempotency tests, deprecation scans, and consumer impact review.