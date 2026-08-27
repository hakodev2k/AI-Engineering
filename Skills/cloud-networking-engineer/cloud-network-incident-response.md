# Cloud Network Incident Response

## Purpose
Restore cloud network service quickly while preserving evidence, limiting blast radius, and producing a defensible root cause.

## When to use
Use for outages, elevated network errors, reachability loss, routing leaks, DNS failures, security-policy regressions, or severe performance degradation.

## Inputs
Incident timeline, affected services, recent changes, topology, telemetry, route/security state, provider status, and SLO impact.

## Preconditions
Establish incident command/ownership for high-severity events and preserve current evidence before broad changes.

## Context to inspect
Change history, effective routes, security policies, DNS, load balancers, NAT, transit, hybrid links, flow/firewall logs, metrics, packet captures, and provider events.

## Core knowledge
Diagnose from symptom boundaries and packet path. Separate control-plane state, data-plane behavior, application health, and external provider dependencies. Restoration may precede full root-cause proof, but risky changes require rollback discipline.

## Procedure
1. Define impact, start time, and affected paths.
2. Correlate with recent changes and provider events.
3. Establish known-good and known-bad source/destination pairs.
4. Trace DNS, route, security, translation, load-balancing, and return path.
5. Use telemetry to narrow the failure boundary.
6. Apply the lowest-risk reversible mitigation.
7. Verify restoration with user-path evidence.
8. Preserve logs/config snapshots.
9. Determine root cause and contributing factors.
10. Add regression tests, monitoring, and runbook improvements.

## Decision points
Rollback recent changes when temporal/evidence correlation is strong and rollback is safe; otherwise isolate the failing layer before changing state. Escalate to provider when evidence crosses the customer/provider boundary.

## Common failure patterns
Changing many controls simultaneously, restarting components without evidence, ignoring return paths, treating provider status as definitive, and ending investigation once service recovers.

## Verification
Confirm service-level recovery, network metrics normalization, expected/denied paths, and absence of collateral regressions.

## Expected output
Restored service, incident timeline, evidence, root cause, corrective actions, and prevention tests.

## Stop conditions
Stop autonomous changes when blast radius is unclear, privileged production access requires approval, or provider-controlled failure requires escalation.