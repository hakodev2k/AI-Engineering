# Topic and Queue Design

## Purpose
Keep broker topology intentional, bounded, and maintainable.

## Scope
Topic, queue, partition, subscription, routing-key, and namespace design.

## MUST
- Destinations MUST have documented ownership, purpose, lifecycle, and access policy.
- Partition or queue counts MUST be justified by throughput, ordering, and scaling evidence.
- Naming MUST follow a stable convention that distinguishes environment and domain without embedding secrets.

## MUST NOT
- MUST NOT create unbounded destination proliferation.
- MUST NOT change partitioning or routing semantics without compatibility analysis.

## SHOULD
- Separate workloads with materially different retention, priority, or isolation requirements.

## Exceptions
Document reason, capacity evidence, migration impact, and approval.

## Verification
Inspect broker metadata, IaC/configuration, naming policy, capacity measurements, and topology tests.