# Service API Design Rules

## Purpose
Keep gRPC service boundaries explicit, cohesive, evolvable, and operationally safe.

## Scope
Service definitions, RPC methods, request/response models, and public behavior.

## MUST
- Each RPC MUST represent a clear capability with documented success and failure semantics.
- Request validation boundaries MUST be explicit.
- Mutating RPCs MUST define retry/idempotency behavior.
- Long-running operations MUST expose progress or asynchronous operation semantics rather than holding arbitrary connections open.
- API design MUST account for expected client diversity and deployment skew.

## MUST NOT
- MUST NOT expose storage tables or internal implementation objects as public contracts by default.
- MUST NOT create generic RPCs whose behavior is selected by opaque string commands.
- MUST NOT add network round trips that force clients into chatty workflows when a cohesive operation is appropriate.

## SHOULD
- Services SHOULD align with stable ownership boundaries.
- APIs SHOULD make invalid states difficult to represent.

## Exceptions
Departures require a documented interoperability or migration constraint, alternatives considered, and review by the API owner.

## Verification
Review proto diffs, client call sequences, validation tests, compatibility tests, and architecture ownership boundaries.