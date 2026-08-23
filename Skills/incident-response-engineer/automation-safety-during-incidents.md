# Automation Safety During Incidents

## Purpose
Use scripts, orchestration, remediation bots, and automated controls during incidents without multiplying damage through incorrect scope or assumptions.

## When to use
Use before running automated remediation, bulk operational commands, auto-scaling overrides, mass restarts, repair scripts, or automated failover during an active incident.

## Inputs
Automation code/configuration, target scope, permissions, dry-run capability, rollback path, rate limits, expected state transitions, and current incident context.

## Context to inspect
Inspect environment selectors, tenant/region filters, concurrency, retries, idempotency, credentials, audit logging, destructive operations, and dependencies.

## Core knowledge
Automation increases speed and blast radius simultaneously. Incident conditions may violate assumptions under which automation was originally tested. Safe automation is bounded, observable, interruptible, and preferably idempotent.

## Procedure
1. Define the exact intended target set and desired state.
2. Review automation assumptions against current incident conditions.
3. Inspect destructive actions, loops, retries, concurrency, and permissions.
4. Use dry-run or read-only mode where available.
5. Test on the smallest representative scope.
6. Set rate, batch, and failure thresholds.
7. Ensure an immediate stop mechanism exists.
8. Execute progressively while monitoring health and audit output.
9. Halt on unexpected state transitions or error patterns.
10. Verify final state independently of the automation's success message.

## Decision points
Prefer manual action for one-off high-risk changes with uncertain automation behavior; prefer automation for repetitive bounded operations where consistency and scale improve safety.

## Common failure patterns
Wrong environment, broad wildcard targets, infinite retries, non-idempotent repair, trusting exit code alone, and running stale scripts against changed infrastructure.

## Verification
Confirm target scope, resulting state, side effects, and system health using independent telemetry or queries.

## Expected output
A safe execution record including scope, guardrails, batches, observed results, and verification evidence.

## Stop conditions
Do not run automation when target scope cannot be proven, rollback is impossible for destructive actions, permissions are excessive and uncontrolled, or dry-run results contradict expectations.