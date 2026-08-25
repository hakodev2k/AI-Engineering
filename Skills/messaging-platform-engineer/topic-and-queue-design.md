# Topic and Queue Design

## Purpose
Design topics, queues, exchanges, subscriptions, and routing boundaries that remain understandable, scalable, and operable as workloads grow.

## When to use
Use when introducing a new messaging workload, decomposing overloaded destinations, or reviewing naming and routing conventions.

## Inputs
- Producer and consumer responsibilities
- Message categories and lifecycle
- Ordering, fan-out, retention, and replay needs
- Tenant boundaries
- Expected traffic and growth

## Context to inspect
Inspect existing naming conventions, destination counts, binding rules, retention policies, dead-letter handling, consumer groups, and operational dashboards.

## Core knowledge
Senior engineers should distinguish commands, events, tasks, notifications, and change streams; understand partition keys, bindings, subscriptions, queue groups, retention, compaction, and destination lifecycle management.

## Procedure
1. Identify the business meaning and ownership of each message flow.
2. Separate commands from facts/events where semantics differ.
3. Define destination boundaries around lifecycle, retention, consumers, and security.
4. Choose partitioning or routing keys based on required ordering and distribution.
5. Define naming rules that encode stable domain meaning, not deployment details.
6. Define retention, expiry, max-size, dead-letter, and replay behavior.
7. Establish ownership metadata and lifecycle rules.
8. Check destination explosion risk and broker limits.
9. Validate consumer isolation and authorization boundaries.
10. Document compatibility expectations for producers and consumers.

## Decision points
Prefer fewer stable domain destinations when consumers share semantics. Split destinations when retention, authorization, ordering, throughput, or operational ownership differ materially.

## Common failure patterns
- One topic per message type without lifecycle reasoning
- Routing keys with poor cardinality or hot partitions
- Environment names embedded into business schemas
- Permanent queues for ephemeral workloads
- No ownership or deletion process

## Verification
Validate routing with representative messages, check partition balance, inspect permissions, test retention and dead-letter behavior, and verify consumers receive only intended traffic.

## Expected output
A destination design with names, semantics, routing, retention, ownership, and operational controls.

## Stop conditions
Stop when ordering or ownership requirements are unclear, routing rules could leak data across tenants, or broker limits make the proposed design unsafe.