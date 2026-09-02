# Ingestion Framework Rules

## Purpose
Ensure shared ingestion mechanisms move data predictably, replay safely, and expose failures instead of silently corrupting downstream state.

## Scope
Applies to connectors, landing pipelines, CDC, file ingestion, API ingestion, event intake, and reusable ingestion frameworks.

## MUST
- Ingestion paths MUST define source ownership, checkpoint semantics, deduplication strategy, retry policy, backpressure behavior, and failure destinations.
- Reprocessing MUST be idempotent or MUST use an explicit deterministic strategy that prevents unintended duplicate effects.
- Source offsets, checkpoints, or equivalent progress markers MUST be durable enough to recover from worker or platform failure.
- Malformed or contract-invalid records MUST be observable and isolated according to an explicit failure policy.
- Credentials and sensitive connection material MUST use approved secret-management mechanisms.

## MUST NOT
- MUST NOT advance a checkpoint past unprocessed data unless loss is an explicit approved behavior.
- MUST NOT retry indefinitely without bounded attempts, backoff, or operator visibility.
- MUST NOT silently discard rejected records or hide partial ingestion failures.
- MUST NOT couple ingestion correctness to worker-local ephemeral state.

## SHOULD
- Prefer reusable connectors with standardized telemetry, throttling, and error handling.
- SHOULD expose source lag, ingestion rate, failure rate, and replay status.

## Exceptions
Any deviation affecting delivery guarantees or recoverability requires documented risk, evidence, containment, and approval from the platform and source owners.

## Verification
Run replay tests, duplicate-delivery tests, failure injection, checkpoint recovery tests, schema validation, and inspect ingestion metrics and rejected-record handling.