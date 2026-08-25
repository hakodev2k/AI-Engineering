# Protobuf Contract Rules

## Purpose
Protect long-lived Protocol Buffers contracts from accidental incompatibility.

## Scope
All `.proto` schemas, generated interfaces, and published gRPC contracts.

## MUST
- Field numbers MUST remain stable after publication.
- Removed field numbers and names MUST be reserved.
- Contract changes MUST be classified as backward-compatible, conditionally compatible, or breaking before merge.
- Enum evolution MUST account for unknown values at receivers.
- Public schemas MUST express optionality and defaults intentionally.

## MUST NOT
- MUST NOT reuse a deleted field number or silently change a field's semantic meaning.
- MUST NOT change wire types unless compatibility has been proven for every supported consumer.
- MUST NOT treat generated-code compilation as proof of wire compatibility.

## SHOULD
- Schemas SHOULD model durable domain contracts rather than internal object graphs.
- Related messages SHOULD remain cohesive and avoid unnecessary cross-package coupling.

## Exceptions
A breaking contract change requires documented consumers, migration sequencing, rollback strategy, evidence, and explicit human approval.

## Verification
Run protobuf breaking-change checks where available; inspect schema diffs; test old-client/new-server and new-client/old-server combinations; review reserved identifiers and generated artifacts.