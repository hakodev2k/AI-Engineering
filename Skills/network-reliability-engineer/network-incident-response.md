# Network Incident Response

## Purpose
Lead structured response to network incidents, restoring service quickly while preserving evidence and controlling blast radius.

## When to use
Use for widespread connectivity loss, latency spikes, route leaks, DNS failures, firewall outages, or unexplained packet loss.

## Inputs
Incident symptoms, topology, recent changes, alerts, flow logs, routing state, DNS data, packet traces, and service impact.

## Context to inspect
Inspect scope, affected regions, common dependencies, concurrent changes, provider status, and whether control-plane access remains healthy.

## Core knowledge
Senior incident response prioritizes stabilization before deep optimization. Network incidents frequently cross team and provider boundaries, so evidence quality and ownership routing matter.

## Procedure
1. Establish incident scope and user impact.
2. Freeze unrelated network changes.
3. Form hypotheses by layer and failure domain.
4. Compare healthy and unhealthy paths.
5. Inspect recent changes and control-plane state.
6. Apply reversible mitigations that reduce impact.
7. Validate recovery with user-facing and network telemetry.
8. Preserve logs, captures, and configuration evidence.
9. Perform root-cause analysis after stabilization.
10. Create corrective actions for detection, design, and process gaps.

## Decision points
Rollback when a recent change plausibly explains the failure and rollback is safe. Fail over when alternate capacity is proven sufficient. Escalate providers once evidence crosses the ownership boundary.

## Common failure patterns
Changing multiple variables during diagnosis, relying on a single probe, ignoring reverse paths, premature root-cause claims, and restoring traffic without verifying saturation on failover paths.

## Verification
Confirm service SLO recovery, stable routing, acceptable loss/latency, and absence of secondary congestion.

## Expected output
Restored service, preserved evidence, a defensible root cause, and prioritized follow-up actions.

## Stop conditions
Escalate when mitigation risks larger outage, evidence is insufficient for safe action, or external provider control is required.