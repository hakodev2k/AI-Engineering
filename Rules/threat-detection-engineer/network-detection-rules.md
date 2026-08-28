# Network Detection Rules

## Purpose
Define reliable detection of malicious network behavior and command-and-control patterns.

## Scope
Applies to DNS, proxy, firewall, flow, IDS, load-balancer, VPN, and packet-derived telemetry.

## MUST
- Network detections MUST define traffic direction, protocol assumptions, address scope, and required fields.
- Detection logic MUST account for NAT, proxies, shared egress, and service infrastructure where relevant.
- High-severity network detections MUST correlate destination reputation or behavior with asset and identity context when available.
- DNS detections MUST distinguish resolver behavior from endpoint-originated queries where the telemetry permits it.

## MUST NOT
- MUST NOT treat any single uncommon destination as malicious without supporting evidence.
- MUST NOT assume source IP uniquely identifies a user or host in translated environments.
- MUST NOT ignore encrypted traffic simply because payload inspection is unavailable.

## SHOULD
- Detections SHOULD use metadata such as SNI, certificate, JA4/JA3-like fingerprints, flow timing, and DNS context when validated.
- Rules SHOULD be tested across normal high-volume services.

## Exceptions
Exceptions require topology rationale, affected coverage, compensating signals, owner, and review date.

## Verification
Inspect topology assumptions, replay traffic samples, validate directionality, test NAT/proxy scenarios, and review false-positive clusters.