# Lifecycle Hooks

Hooks are deterministic checkpoints, not hidden automation.

## before-task
Validate service, environment, owner, desired outcome, deadline, risk, and available evidence. Reject ambiguous production-write requests.

## after-planning
Check dependencies, parallel work, approval boundaries, verification method, stop conditions, and rollback/abort behavior.

## before-production-action
Confirm exact target, current state, credentials scope, expected effect, rollback, timeout, approver if required, and active incident/change reference.

## after-production-action
Capture timestamp, result, telemetry delta, unexpected side effects, and whether rollback criteria fired.

## before-close
Require independent recovery/readiness evidence and unresolved-risk ownership.

## on-failure
Classify failure; preserve evidence; prevent blind retry; escalate when retry budget or safety boundary is reached.

## Idempotency
Read-only hooks may repeat safely. Write hooks must use operation identifiers or precondition checks to prevent duplicate side effects.