# Dead-Letter and Recovery Rules

## Purpose
Make permanently failed messages visible, recoverable, and safe to investigate or replay.

## Scope
Dead-letter queues/topics, quarantine stores, poison messages, and replay workflows.

## MUST
- Dead-lettered records MUST retain the original payload or reference, failure reason, source, and attempt context required for diagnosis.
- Access to failed-message payloads MUST follow the same or stronger data protection controls as normal traffic.
- Replay MUST be deliberate, observable, and idempotency-aware.
- Dead-letter growth MUST be monitored and owned.

## MUST NOT
- MUST NOT use dead-letter storage as an unmonitored permanent sink.
- MUST NOT bulk replay into production without capacity and side-effect assessment.
- MUST NOT edit original failed evidence destructively.

## SHOULD
- Provide tooling to filter, inspect, and replay bounded cohorts.

## Exceptions
Automatic replay requires proven safety, bounded rates, and clear stop conditions.

## Verification
Inspect DLQ metadata, retention, alerts, replay controls, audit logs, and recovery tests.