# Network Incident Response

## Purpose
Contain and investigate security incidents using network controls and evidence while preserving service continuity and forensic value.

## When to use
Use for suspected compromise, command-and-control, lateral movement, exfiltration, scanning, or malicious network changes.

## Inputs
Alert/incident description, topology, logs, flow data, packet evidence, asset context, change history.

## Context to inspect
Affected segments, ingress/egress, DNS, firewalls, VPN, proxies, routing, identity, cloud networks, recent changes.

## Core knowledge
Containment trade-offs, evidence preservation, attacker infrastructure volatility, NAT attribution, timeline correlation, blast-radius analysis.

## Procedure
1. Establish incident scope and severity.
2. Preserve relevant telemetry and configurations.
3. Build a timeline and affected-flow map.
4. Identify containment options with business impact.
5. Block or isolate using the narrowest effective controls.
6. Hunt for related indicators and lateral paths.
7. Support eradication and recovery.
8. Remove emergency controls deliberately.
9. Capture lessons and permanent control improvements.

## Decision points
Isolate hosts when compromise confidence is high; use monitoring or targeted blocks when evidence is incomplete and disruption risk is high.

## Common failure patterns
Destroying evidence, broad blocks without impact analysis, relying on IP indicators alone, forgetting cloud or VPN paths, leaving emergency rules permanently.

## Verification
Confirm malicious communication stops, legitimate critical flows remain, telemetry persists, and recovery does not reintroduce the path.

## Expected output
Network incident timeline, containment actions, evidence, affected paths, recovery validation, follow-up controls.

## Stop conditions
Escalate destructive containment, legal/forensic requirements, or actions outside authorized incident scope.