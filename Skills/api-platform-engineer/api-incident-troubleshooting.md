# API Incident Troubleshooting

## Purpose
Diagnose and mitigate API platform incidents systematically while preserving evidence and limiting blast radius.

## When to use
Use for elevated errors, latency, routing failures, auth outages, gateway saturation, or widespread consumer impact.

## Inputs
Incident symptoms, dashboards, logs, traces, recent changes, topology, runbooks.

## Context to inspect
Inspect scope by route/consumer/region, gateway health, upstream health, identity dependencies, DNS/networking, quotas, and recent deployments.

## Core knowledge
Incident response prioritizes impact reduction before perfect root cause. Correlation is not causation; compare affected and healthy dimensions and build hypotheses from evidence.

## Procedure
1. Establish severity, scope, and incident ownership.
2. Freeze risky unrelated changes.
3. Identify first known bad time and affected dimensions.
4. Compare with deployments/configuration changes.
5. Trace representative failed and successful requests.
6. Check gateway, network, identity, and upstream saturation independently.
7. Form falsifiable hypotheses.
8. Apply the safest reversible mitigation.
9. Verify consumer recovery with telemetry.
10. Preserve timeline/evidence and perform root-cause follow-up.

## Decision points
Rollback recent changes when evidence and reversibility favor it; fail over only when alternate capacity and data semantics are understood.

## Common failure patterns
Changing multiple variables, restarting without evidence, tunnel vision on the gateway, ignoring partial-region failures, and declaring recovery from one metric.

## Verification
Confirm recovery across error rate, latency, representative consumers, regions, and dependencies for a sustained observation period.

## Expected output
Restored service plus an evidence-backed incident timeline and follow-up actions.

## Stop conditions
Escalate destructive actions, security indicators, data corruption, or mitigations beyond authorized production access.