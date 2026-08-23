# Messaging Disaster Recovery

## Purpose
Recover messaging service and durable data after regional, cluster or storage failure within agreed objectives.

## When to use
Use for production resilience design and recovery drills.

## Inputs
RTO, RPO, broker architecture, replication, retention, dependencies and failover capabilities.

## Context to inspect
Cluster topology, DNS/endpoints, credentials, replicated data, consumer offsets and infrastructure automation.

## Core knowledge
Broker availability and message-data recovery are separate concerns. Failover can introduce duplicates, ordering changes and offset divergence.

## Procedure
1. Define failure scenarios and RTO/RPO.
2. Inventory state required for recovery.
3. Choose replication/backup strategy.
4. Automate infrastructure restoration.
5. Define producer and consumer failover.
6. Plan offset/state reconciliation.
7. Document failback.
8. Run regular destructive drills.

## Decision points
Use active-active only when complexity is justified; active-passive is often easier to reason about.

## Common failure patterns
Untested backups, forgotten offsets/schemas, split-brain producers and manual undocumented failback.

## Verification
Execute timed recovery drills and reconcile message/business outcomes.

## Expected output
A tested DR plan with measured RTO/RPO.

## Stop conditions
Escalate when required recovery objectives exceed platform capabilities.