# NAT and Egress Reliability

## Purpose
Design and troubleshoot NAT and outbound connectivity so translation capacity, source identity, routing, and failover remain predictable.

## When to use
Use for SNAT exhaustion, egress migration, allow-list failures, asymmetric return traffic, or multi-zone outbound design.

## Inputs
NAT rules, port-allocation metrics, egress IPs, route tables, connection volumes, provider quotas, and destination allow lists.

## Context to inspect
Inspect translation state, ephemeral port use, connection reuse, per-destination fan-out, HA behavior, egress routing, and firewall interactions.

## Core knowledge
Large connection fan-out can exhaust NAT state or ephemeral ports long before bandwidth saturates. Egress IP stability may be a contractual dependency for external systems.

## Procedure
1. Map outbound flows and source translations.
2. Measure concurrent connections and port consumption.
3. Identify high-fan-out destinations and short-lived connection patterns.
4. Validate egress path redundancy and source-IP behavior during failover.
5. Check provider limits and timeouts.
6. Reduce unnecessary connection churn where possible.
7. Add translation capacity or distribute egress when justified.
8. Coordinate allow-list changes before source-IP migration.
9. Monitor port utilization and failed translations.

## Decision points
Prefer connection reuse before adding NAT capacity when application behavior is the cause. Use centralized egress for control; use distributed egress to reduce bottlenecks and blast radius.

## Common failure patterns
Port exhaustion, failover to unapproved source IPs, hidden single egress gateways, stale NAT state, and ignoring IPv6 alternatives.

## Verification
Run representative connection load, confirm translated addresses, failover behavior, and headroom under peak concurrency.

## Expected output
A verified egress design or remediation with capacity and source-identity behavior understood.

## Stop conditions
Escalate when external allow-list ownership or provider quota changes are outside operational control.