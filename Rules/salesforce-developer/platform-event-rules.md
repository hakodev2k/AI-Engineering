# Platform Event Rules

## Purpose
Ensure event-driven Salesforce designs are reliable, traceable, and tolerant of duplicate or delayed delivery.

## Scope
Applies to Platform Events, Change Data Capture, event subscribers, and event-driven integrations.

## MUST
- Event contracts MUST define producer, consumer expectations, versioning strategy, and failure semantics.
- Consumers MUST tolerate duplicate delivery when business effects are not naturally idempotent.
- Event handlers MUST record enough correlation data to trace business outcomes.
- Replay and retention limitations MUST be considered in recovery design.

## MUST NOT
- MUST NOT assume strict global ordering unless the platform contract guarantees it for the chosen pattern.
- MUST NOT treat publication success as proof that every consumer completed successfully.
- MUST NOT embed secrets or unnecessary sensitive data in event payloads.

## SHOULD
- Events SHOULD represent durable business facts rather than internal implementation steps.
- Contract changes SHOULD remain backward compatible when existing consumers cannot change atomically.

## Exceptions
Exceptions require documented ordering, recovery, and compatibility assumptions.

## Verification
Use duplicate, delayed, replay, schema-compatibility, and consumer-failure tests plus trace review.