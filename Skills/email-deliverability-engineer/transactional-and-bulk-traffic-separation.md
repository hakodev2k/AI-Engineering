# Transactional and Bulk Traffic Separation

## Purpose
Protect critical lifecycle and security messages from reputation, capacity, and operational failures caused by discretionary bulk traffic.

## When to use
Use when traffic classes share providers/domains/IPs, transactional latency degrades during campaigns, or promotional reputation affects critical delivery.

## Inputs
Message inventory, criticality/SLOs, consent models, sending volume, routing, domains/IP pools, provider accounts, queues, and suppression rules.

## Preconditions
Classify messages by user expectation and business criticality before designing separation.

## Context to inspect
Inspect queues, rate limits, domain/IP identity, provider account boundaries, authentication, failure domains, event ingestion, and fallback behavior.

## Core knowledge
Separation can occur at queue, account, provider, subdomain, IP pool, and capacity layers. Complete physical isolation is not always required, but priority and reputation boundaries must be explicit. Transactional does not mean exempt from abuse or authentication standards.

## Procedure
1. Catalog message types and assign criticality.
2. Measure traffic peaks and provider-specific capacity pressure.
3. Identify shared reputation and queueing bottlenecks.
4. Give critical traffic independent priority/capacity controls.
5. Use dedicated identity boundaries where bulk reputation poses material risk.
6. Preserve global suppression and recipient-preference semantics.
7. Define bulk throttling before transactional degradation can occur.
8. Establish separate SLOs, dashboards, and alarms.
9. Test campaign spikes and provider throttling scenarios.
10. Document failover that does not dump bulk traffic onto critical infrastructure.

## Decision points
Separate IPs only when volume can sustain them; subdomain and queue separation may be enough. Keep essential messages operational during bulk pauses while still respecting applicable recipient and security constraints.

## Common failure patterns
Shared queue starvation, bulk failover consuming transactional capacity, separate ESPs with inconsistent suppression, calling marketing messages transactional to bypass controls, and no per-class telemetry.

## Verification
Load-test prioritization, confirm independent rate controls, validate authentication/suppression for each path, and demonstrate critical SLOs during representative bulk peaks.

## Expected output
A traffic-separation design with priority, identity, capacity, and failure-isolation controls.

## Stop conditions
Stop rollout if classification is disputed, suppression semantics diverge, or separation would create an unwarmed critical path without safe migration.