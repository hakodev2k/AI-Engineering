# Platform Debugging

## Purpose
Diagnose failures that cross developer tooling, control planes, cloud services, networks, identity, and workloads.

## When to use
Use for platform errors, inconsistent provisioning, failed deployments, or unexplained environment behavior.

## Inputs
Failure report, timestamps, request IDs, logs, traces, configuration, recent changes, and architecture.

## Context to inspect
Client request, platform API, queues, controllers, provider APIs, identity decisions, network paths, and resource state.

## Core knowledge
Distributed platform failures require evidence-driven narrowing across boundaries. Correlation and state transitions are often more useful than isolated stack traces.

## Procedure
1. Define exact expected and observed behavior.
2. Reproduce safely when possible.
3. Establish a timestamped request or resource identity.
4. Trace the operation across boundaries.
5. Compare desired, observed, and provider state.
6. Check recent changes and dependency health.
7. Form one falsifiable hypothesis at a time.
8. Apply the smallest safe fix.
9. Add regression detection and missing telemetry.

## Decision points
Prefer rollback for correlated recent regressions; repair state only when invariants and side effects are understood.

## Common failure patterns
Random retries, changing multiple variables, trusting stale state, debugging only the client, and deleting resources to hide root cause.

## Verification
Reproduction fails before the fix and passes after it; telemetry confirms the corrected state transition.

## Expected output
Root cause, evidence, remediation, regression protection, and operational follow-up.

## Stop conditions
Escalate destructive recovery, suspected compromise, or provider behavior lacking sufficient evidence.