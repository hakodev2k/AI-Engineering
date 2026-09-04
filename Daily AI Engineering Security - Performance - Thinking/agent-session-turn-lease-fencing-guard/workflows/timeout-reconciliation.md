# Workflow: Timeout Reconciliation and Safe Takeover

## Trigger
A client disconnects, request times out, UI ownership changes, worker heartbeat is lost, or async delivery is retried while a prior server turn may still be running.

## Goal
Resolve uncertain execution without creating a second mutation-capable turn.

## Inputs
Session ID, prior actor, prior epoch, operation ID, last durable event, process/checkpoint status, policy.

## Baseline
Record the time and state at which execution became uncertain.

## Stages
1. Freeze new mutation grants for the session.
2. Query durable terminal evidence and authoritative worker/process state.
3. Classify prior work as completed, cancelled, still running, or unknown.
4. If completed, record/ack the result; do not replay the same operation ID.
5. If still running, wait within the bounded recovery window or explicitly cancel through the authoritative runtime.
6. If cancelled with durable proof, advance the lease epoch before replacement work.
7. If unknown after bounded retries, keep mutation blocked and escalate.
8. Run the event checker before declaring recovery complete.

## Responsible agent
Runtime coordinator; independent verification by Session Consistency Verifier.

## Tools
Authoritative process/session API, durable event store, lease store, checker.

## Outputs
Reconciliation classification, evidence, new epoch if granted, and blocked/allowed decision.

## Checkpoints
After each authoritative status read and before any epoch advance.

## Metrics
Ambiguous states resolved, mean reconciliation time, duplicate replays prevented, escalations.

## Retry policy
Maximum two status reconciliation retries by default. Backoff is allowed; mutation retries are not.

## Stop conditions
Unknown state after retry budget, inconsistent terminal evidence, inability to fence old epoch, or accepted stale write.

## Failure path
Fail closed for mutation and escalate. Never solve uncertainty by disabling fencing or starting an additional writer.

## Verification
A timeout fixture where the server continues must not allow a new mutation lease until the old epoch is fenced or completion is acknowledged.

## Definition of Done
Uncertainty classified with evidence, no duplicate logical operation executed, old writer fenced before takeover, and verification passed.