# Producer and Consumer Contract Rules

## Purpose
Coordinate independent producer and consumer evolution without hidden coupling.

## Scope
Producer registration, consumer expectations, reader/writer schemas, deployment order, and contract testing.

## MUST
- Producers MUST register or validate their schema before emitting production data under that contract.
- Consumers MUST declare the schema assumptions required for safe decoding and processing.
- Deployment order MUST be planned when compatibility depends on readers or writers upgrading first.
- Contract tests MUST cover representative old-reader/new-writer and new-reader/old-writer combinations when relevant.
- Ownership for resolving producer-consumer incompatibility MUST be explicit.

## MUST NOT
- MUST NOT rely on coordinated simultaneous deployment as the only safety mechanism unless explicitly approved.
- MUST NOT assume a successful producer deployment proves consumer compatibility.
- MUST NOT ship an incompatible producer while unknown consumers remain active.

## SHOULD
- Prefer evolution patterns that allow independent deployment.
- Use consumer usage telemetry or lineage to validate blast radius.

## Exceptions
Coordinated cutovers require identified consumers, rollback strategy, communication, and approval.

## Verification
Inspect contract tests, deployment plans, consumer inventory, and compatibility reports.