# Versioning and Compatibility Rules

## Purpose
Support independent client and server evolution without surprise outages.

## Scope
Published gRPC APIs, protobuf packages, generated SDKs, and rollout sequencing.

## MUST
- Supported compatibility windows MUST be documented.
- Every breaking change MUST use an explicit migration/versioning strategy.
- Rollouts MUST tolerate the expected period of mixed client/server versions.
- Deprecations MUST identify replacement behavior and removal criteria.
- Compatibility claims MUST be backed by tests or wire-level evidence.

## MUST NOT
- MUST NOT infer compatibility solely from matching method names.
- MUST NOT remove fields, methods, enum values, or semantics while supported consumers still depend on them.
- MUST NOT coordinate an atomic fleet-wide upgrade as the only safety mechanism unless the environment guarantees it and approval exists.

## SHOULD
- Prefer additive evolution and tolerant readers.
- Package/service versioning SHOULD be introduced only when additive evolution cannot preserve required semantics.

## Exceptions
Emergency removals require documented risk, consumer impact, rollback/mitigation, and human approval.

## Verification
Execute compatibility tooling, cross-version integration tests, consumer inventory checks, and staged rollout verification.