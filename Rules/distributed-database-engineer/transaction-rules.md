# Distributed Transaction Rules

## Purpose
Protect invariants while minimizing coordination and partial-failure risk.

## Scope
Local transactions, distributed transactions, sagas, atomic batches, and compensating workflows.

## MUST
- Transaction boundaries MUST correspond to explicit invariants.
- Distributed transaction mechanisms MUST document coordinator failure, timeout, retry, and recovery semantics.
- Saga steps MUST be idempotent or safely deduplicated and MUST define compensation where reversal is meaningful.
- Partial completion MUST be detectable and repairable.

## MUST NOT
- MUST NOT expand transaction scope merely for implementation convenience.
- MUST NOT assume compensation restores the exact prior state when external side effects exist.
- MUST NOT retry ambiguous commits blindly.

## SHOULD
- Local atomicity plus explicit asynchronous coordination SHOULD be preferred when it safely satisfies invariants.

## Exceptions
Global coordination requires latency, availability, and operational-cost justification.

## Verification
Use integration tests, fault injection at commit boundaries, reconciliation checks, and transaction telemetry.