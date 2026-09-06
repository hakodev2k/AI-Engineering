# Routing Integrity Analysis Skill

## Purpose
Detect and prevent delegated-agent progress, completion, or control messages from being accepted by the wrong parent task.

## Trigger
Use before dispatching a child event, after reconnect/resume, after watcher registration, and before a parent declares delegated work complete.

## Inputs
- `run_id`
- `parent_task_id`
- `worker_task_id`
- `destination_task_id`
- event type and sequence number
- canonical active-child registry
- terminal child state when available

## Preconditions
Canonical task/worker identifiers MUST be available from runtime state rather than inferred from prose.

## Required context
Current parent-child lineage, active/terminal status, subscription state, and any historical task references present in the session.

## Allowed tools
Read-only task-state APIs, event logs, lineage registry, and `scripts/verify_route.py`.

## Constraints
- MUST NOT infer identity from human-readable progress text.
- MUST NOT rewrite lineage to make a rejected event pass.
- MUST distinguish historical references from active routing destinations.
- MUST fail closed for consequential state transitions when canonical lineage is unavailable.

## Procedure
1. Capture the immutable lineage tuple for the child at spawn time.
2. Compare the event's run, parent, worker, and destination IDs to canonical state.
3. Confirm the worker is registered under the claimed parent.
4. Confirm the destination equals the active parent unless an explicit routing policy permits another target.
5. Validate monotonically increasing sequence numbers when present.
6. For terminal events, reconcile the event with canonical worker state.
7. If a terminal notification is missing, query canonical worker state once and synthesize only a machine-labeled reconciliation event.
8. Record accepted/rejected evidence and reason code.

## Decision points
- Exact lineage match: accept.
- Destination mismatch: reject and quarantine.
- Worker unknown: reject and request reconciliation.
- Worker terminal but notification absent: reconcile once from canonical state.
- Parent no longer active: route to recovery queue, not another arbitrary task.

## Expected output
A structured verdict containing `accepted`, `reason`, `lineage`, and `verification_status`.

## Metrics
Cross-task rejection count, orphan event count, terminal-reconciliation count, parent wait time, false completion count, and routing-verification coverage.

## Verification
Run deterministic positive and negative fixtures through `scripts/verify_route.py`; an independent verifier must confirm rejected cross-task and unknown-worker cases.

## Failure handling
Retry canonical-state reads at most 2 times. If lineage remains unavailable, block state mutation and escalate to the host/runtime operator.

## Stop conditions
Stop after a deterministic accept/reject verdict or after 2 failed canonical-state retrieval attempts.
