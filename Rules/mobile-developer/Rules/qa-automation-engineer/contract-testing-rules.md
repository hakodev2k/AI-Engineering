# Contract Testing Rules

## Purpose
Detect incompatible changes between independently evolving consumers and providers.

## Scope
Applies to APIs, events, schemas, message payloads, and externally consumed integration contracts.

## MUST
- Contract tests MUST identify the contract owner, version or compatibility expectation, and validated boundary.
- Breaking schema or semantic changes MUST be detected before dependent systems are knowingly exposed.
- Consumer expectations MUST reflect behavior actually relied upon, not speculative fields or implementation details.
- Event/message contracts MUST cover required fields, compatibility, and relevant serialization behavior.

## MUST NOT
- MUST NOT claim compatibility from schema validation alone when semantics materially changed.
- MUST NOT couple contract tests to unrelated internal implementation.
- MUST NOT silently update expected contracts merely to make a breaking change pass.

## SHOULD
- Run contract verification in CI for both producer and consumer change paths when feasible.
- Preserve representative historical contracts during migration windows.

## Exceptions
Intentional breaking changes require coordinated migration, explicit approval, and verification of affected consumers.

## Verification
Inspect contract diffs, CI verification, consumer/provider matrices, schema evolution tests, and migration evidence.