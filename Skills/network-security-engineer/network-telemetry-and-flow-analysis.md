# Network Telemetry and Flow Analysis

## Purpose
Build reliable network visibility using flows, logs, packets, and metadata to support detection, troubleshooting, and capacity/security decisions.

## When to use
Use for observability design, incident investigation, traffic baselining, or blind-spot analysis.

## Inputs
Topology, telemetry sources, retention requirements, investigation needs, privacy constraints, SIEM/data-platform capabilities.

## Context to inspect
NetFlow/IPFIX, firewall logs, DNS, proxy logs, packet brokers, SPAN/TAPs, cloud flow logs, time synchronization.

## Core knowledge
Flow records vs packet capture, sampling, NAT attribution, timestamp integrity, cardinality, retention, privacy, encrypted-traffic metadata.

## Procedure
1. Define investigative questions and coverage goals.
2. Map telemetry sources to trust boundaries.
3. Ensure consistent time and asset context.
4. Configure collection with loss monitoring.
5. Normalize fields and identities.
6. Establish baselines and useful queries.
7. Protect telemetry access and retention.
8. Test reconstruction of representative incidents.

## Decision points
Use packet capture for deep short-term evidence; flows for scalable long-term behavior. Sample only when volume requires it and document detection limitations.

## Common failure patterns
Blind NAT boundaries, unsynchronized clocks, dropped collectors, unlimited retention, missing asset context, assuming sampled flow is complete.

## Verification
Generate known traffic, confirm end-to-end ingestion, validate timestamps and attribution, and measure loss/delay.

## Expected output
Telemetry coverage map, collection configuration, retention policy, validated queries and evidence.

## Stop conditions
Escalate if collection violates privacy policy, storage cannot meet requirements, or evidence integrity is uncertain.