# Production Incident Response

## Purpose
Diagnose and mitigate gateway incidents quickly while preserving evidence and avoiding secondary outages.

## When to use
Use for elevated 5xx/4xx, latency spikes, routing failures, auth outages, TLS failures, saturation, or bad gateway configuration.

## Inputs
Incident symptoms, dashboards, logs, traces, config revision, recent changes, upstream health.

## Context to inspect
Blast radius by route/region/client, gateway-generated versus upstream errors, saturation, certificate state, discovery state, policy failures, deployment history.

## Core knowledge
Senior response prioritizes stabilization, evidence, hypothesis testing, and reversible mitigations. Gateways amplify failures because they are shared traffic infrastructure.

## Procedure
1. Establish user impact, start time, and affected traffic classes.
2. Compare against recent config, certificate, dependency, and backend changes.
3. Separate gateway processing time from upstream time.
4. Check saturation, routing, discovery, auth dependencies, and TLS errors.
5. Apply the smallest reversible mitigation: rollback config, disable faulty optional policy, shift traffic, or reduce load.
6. Verify recovery against user-facing SLIs.
7. Preserve logs, traces, config revisions, and timeline.
8. Identify root cause and contributing controls.
9. Add regression tests, alerts, and runbook improvements.

## Decision points
Rollback before deep debugging when a recent change strongly correlates with impact and rollback is safe. Do not disable core security controls merely to restore traffic without explicit incident authority.

## Common failure patterns
Restarting everything without evidence, blaming upstreams from aggregate 502 counts, making multiple simultaneous config changes, losing the failing revision, unbounded retries during degradation.

## Verification
Mitigation restores defined SLIs and a controlled reproduction confirms the root cause.

## Expected output
Stabilized service, evidence-backed root cause, and concrete preventive actions.

## Stop conditions
Escalate immediately for suspected compromise, cross-tenant exposure, or mitigation requiring unauthorized security relaxation.