# Skill: Investigate Message Contract

## Purpose
Collect evidence for one event/message contract before proposing schema changes.

## When to use
Use for Kafka/RabbitMQ/Service Bus/SNS/SQS/webhook/domain-event contracts when a producer or consumer change may affect serialized data.

## Inputs
- Message/topic/event name.
- Producer module and current schema or serialized DTO.
- Known consumer modules/services.
- Proposed schema/DTO change.
- Historical/replay requirements when known.

## Preconditions
Repository access is read-only during investigation. Do not infer consumers solely from naming; search registrations, subscriptions, handlers, tests, deployment/configuration, and documentation.

## Allowed tools
Repository search/read, build/test commands, schema tools, non-production logs with secrets redacted, official broker/schema-registry documentation.

## Constraints
Do not edit production configuration, topics, subscriptions, secrets, retention, or stored messages. Do not replay messages.

## Procedure
1. Locate the producer serialization boundary and record serializer, naming policy, null/default behavior, enum representation, and message key/partition semantics.
2. Locate the authoritative current contract: JSON Schema, Avro/Proto, DTO, generated contract, or tests. If none exists, derive a candidate contract and mark it as derived evidence.
3. Enumerate consumers from code, broker subscription config, deployment manifests, integration tests, and ownership docs.
4. For each consumer, identify deserializer behavior: unknown-field handling, missing-field handling, enum handling, defaults, nullability, type coercion, and strictness.
5. Identify stored-message/replay sources: broker retention, DLQ, outbox/inbox tables, audit/event stores, snapshots, test fixtures, or reprocessing jobs.
6. Classify proposed changes: add optional field, add required field, remove/rename field, type change, enum change, semantic change, key change, envelope/version change.
7. Run `python scripts/check-message-schema.py` when JSON Schemas are available. Preserve its report as evidence; do not treat static compatibility as proof of behavioral compatibility.
8. Record facts separately from hypotheses. Any consumer not inspected remains an open question and blocks claims of full compatibility.
9. Produce a handoff containing producer, consumers, findings, historical-data exposure, and required verification.

## Expected output
Evidence-backed contract inventory plus a compatibility report or explicit gaps.

## Verification
A second agent must be able to locate every cited producer/consumer path and reproduce deterministic schema checks.

## Failure handling
- Missing authoritative schema: derive one, label it derived, and require runtime/fixture verification.
- Unknown consumer ownership: mark status blocked rather than assuming compatibility.
- Tool failure: retry at most 2 times if transient, preserving stderr/output.
- Permission failure: stop; do not broaden access.

## Stop conditions
Stop before production replay, topic/subscription changes, schema-registry compatibility-mode changes, secret changes, or consumer cutover. These require explicit human approval.
