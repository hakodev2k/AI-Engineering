# Distributed Data Modeling Rules

## Purpose
Ensure data models preserve correctness, scalability, locality, and operability under distribution.

## Scope
Logical and physical modeling for distributed relational, key-value, document, wide-column, graph, and multi-model databases.

## MUST
- Data models MUST identify ownership, access patterns, cardinality, retention, consistency needs, and mutation frequency before physical design.
- Partition keys MUST be selected using measured or forecast access distribution, not convenience alone.
- Entity relationships crossing partition or region boundaries MUST document latency and consistency implications.
- Data ownership MUST be explicit enough to prevent ambiguous writers.

## MUST NOT
- MUST NOT introduce cross-shard joins, fan-out reads, or globally coordinated writes without quantified justification.
- MUST NOT denormalize data without defining synchronization and repair behavior.

## SHOULD
- Models SHOULD maximize request locality and bounded fan-out.
- Frequently mutated and append-heavy data SHOULD be modeled separately when contention profiles differ materially.

## Exceptions
Exceptions require access-pattern evidence, alternatives considered, expected scale, failure impact, and a rollback or redesign path.

## Verification
Review schemas, partition maps, representative query traces, load tests, and production access-pattern telemetry.