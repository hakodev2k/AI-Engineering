# Network Troubleshooting

## Purpose
Diagnose network incidents systematically from user symptom to failing layer while minimizing speculative changes and recovery time.

## When to use
Use for loss of connectivity, intermittent failures, latency, packet loss, DNS symptoms, routing anomalies, or unexplained application reachability.

## Inputs
Symptoms, affected scope, timeline, topology, recent changes, source/destination, protocol, monitoring, logs, and known-good comparisons.

## Context to inspect
Inspect physical/interface state, addressing, ARP/ND, switching, routes, policy/NAT, DNS, transport behavior, load balancers, cloud controls, and application listeners.

## Core knowledge
Troubleshoot by narrowing scope and testing hypotheses. Start with impact and path, not a favorite layer. A successful ping does not prove application connectivity; a failed ping does not always prove path failure.

## Procedure
1. Define exact symptom, scope, and onset.
2. Identify recent changes and known-good paths.
3. Map the end-to-end packet path.
4. Test resolution, route, policy, and transport separately.
5. Compare working and failing cases.
6. Inspect counters/logs at likely boundaries.
7. Form one falsifiable hypothesis at a time.
8. Gather evidence before changing state.
9. Apply the smallest reversible remediation.
10. Verify user outcome and document root cause.

## Decision points
Escalate across ownership boundaries with concrete evidence. Use packet capture when counters/logs cannot localize the fault; use configuration diff when onset follows change.

## Common failure patterns
Random configuration changes, stopping after ping, ignoring return paths, conflating DNS with connectivity, clearing state before evidence collection, and declaring root cause from correlation alone.

## Verification
Reproduce successful user/application behavior, confirm telemetry recovery, test previously failing cases, and ensure remediation addresses cause rather than symptom.

## Expected output
A concise incident diagnosis with evidence, root cause, remediation, validation, and prevention actions.

## Stop conditions
Stop unsafe experimentation when blast radius is uncertain, evidence requires privileged access, or remediation crosses change-control boundaries.