# Dead-Letter Handling

## Purpose
Contain poison messages without losing evidence or creating silent data loss.

## Scope
Dead-letter queues/topics, quarantine, replay, and remediation.

## MUST
- Terminally failed messages MUST retain enough metadata to diagnose origin and failure reason without exposing secrets.
- Dead-letter destinations MUST be monitored with ownership and response expectations.
- Replay MUST be controlled, idempotent, observable, and scoped.

## MUST NOT
- MUST NOT treat dead-lettering as successful business processing.
- MUST NOT bulk replay production dead letters without impact analysis and human approval.

## SHOULD
- Classify dead letters by actionable failure category.

## Exceptions
Document retention or privacy constraints and compensating evidence.

## Verification
Inspect alerts, retained metadata, replay controls, audit records, and poison-message tests.