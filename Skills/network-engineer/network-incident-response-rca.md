# Network Incident Response and Root Cause Analysis

## Purpose
Restore network service quickly while preserving evidence and producing defensible root cause and prevention actions.

## When to use
Use for outages, severe degradation, routing leaks, widespread packet loss, security-related network events, or recurring unexplained failures.

## Inputs
Incident timeline, alerts, topology, logs, telemetry, configurations, change history, packet captures, provider status, and affected-service reports.

## Context to inspect
Failure scope, recent changes, redundancy state, routing/control plane, interfaces, security devices, DNS/DHCP, cloud/WAN dependencies, and monitoring gaps.

## Core knowledge
During response, prioritize safety and service restoration over perfect diagnosis. Distinguish trigger, root cause, contributing conditions, and impact amplifiers. Preserve timestamps and evidence before transient state disappears.

## Procedure
1. Establish incident commander/technical owner and timestamped timeline.
2. Define impact by service, site, region, and user population.
3. Check recent changes and correlated alerts without assuming causality.
4. Identify the smallest shared failure domain.
5. Capture volatile routing, interface, session, and device state.
6. Compare with known-good peers/baselines.
7. Form explicit hypotheses and tests.
8. Mitigate using the lowest-risk reversible action.
9. Validate service recovery from user/application perspective.
10. Monitor for recurrence during stabilization.
11. Reconstruct causal chain from evidence.
12. Assign corrective actions for design, process, automation, and observability gaps.

## Decision points
Rollback recent changes when evidence or risk strongly supports it; do not delay restoration waiting for certainty. Fail over only if the backup path is verified and has capacity.

## Common failure patterns
Random command changes, tunnel vision on recent deployments, rebooting away evidence, poor timeline discipline, declaring recovery from green device status, and blaming a component without causal proof.

## Verification
Confirm service-level recovery, stable redundancy/routing, absence of continuing errors, and RCA claims supported by logs/telemetry/config evidence.

## Expected output
Restored service, incident timeline, evidence-backed root cause, contributing factors, and prioritized prevention actions.

## Stop conditions
Escalate immediately for suspected compromise, unsafe physical conditions, provider-wide failures, unavailable recovery access, or mitigation that could broaden impact.