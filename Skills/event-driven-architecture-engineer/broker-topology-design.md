# Broker Topology Design

## Purpose
Design topics, queues, subscriptions, consumer groups, routing, and retention around domain and operational boundaries.

## When to use
Use when introducing broker resources, reorganizing event flows, or scaling consumers.

## Inputs
Event domains, producers, consumers, retention, throughput, isolation, replay, security requirements.

## Context to inspect
Broker capabilities/quotas, tenancy, naming standards, partition limits, access model, and disaster-recovery setup.

## Core knowledge
Topology encodes coupling and blast radius. Topics should represent stable streams of related semantics, not individual implementation methods. Consumer groups isolate processing state. Retention must support recovery and replay objectives.

## Procedure
1. Group events by domain ownership and lifecycle.
2. Identify independent consumer applications.
3. Define topics/streams and consumer groups.
4. Select partitioning and ordering scope.
5. Set retention from recovery/replay requirements.
6. Define retry/DLQ resources without routing loops.
7. Apply least-privilege ACLs.
8. Establish naming, quotas, and ownership metadata.
9. Model failure blast radius and regional recovery.
10. Load-test topology at peak.

## Decision points
Use shared domain streams when lifecycle and security align; separate streams when retention, sensitivity, throughput, or ownership differs materially.

## Common failure patterns
Topic per consumer, topic per event without need, shared consumer groups for independent apps, retention chosen arbitrarily, and broad wildcard ACLs.

## Verification
Topology supports required throughput, isolation, replay, access control, and failure recovery without hidden consumer interference.

## Expected output
Broker topology with ownership, routing, retention, partition, security, and capacity rationale.

## Stop conditions
Stop when domain ownership or data classification is unresolved.