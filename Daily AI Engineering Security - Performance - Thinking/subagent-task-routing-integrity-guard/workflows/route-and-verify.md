# Route and Verify Workflow

## Trigger
A subagent emits progress/completion/control state, a parent resumes, or a watcher reports missing/late terminal state.

## Goal
Ensure delegated evidence affects only the correct parent task and that missing terminal events do not cause indefinite waits or false completion.

## Inputs
Event envelope, canonical spawn/lineage registry, current parent state, child terminal state, and audit log.

## Baseline
Measure cross-task mismatches, orphan events, median terminal-notification delay, reconciliation count, and parent waits exceeding the configured timeout.

## Context
Active IDs are authoritative; historical task IDs are context only.

## Stages
1. **Observe** — capture the incoming event and canonical lineage.
2. **Measure baseline** — record current mismatch/orphan/wait metrics.
3. **Diagnose** — compare run, parent, worker, destination, sequence, and lifecycle state.
4. **Form hypothesis** — classify as valid route, stale historical route, unknown worker, watcher race, or lifecycle inconsistency.
5. **Implement improvement** — enforce the lineage gate at dispatch and acceptance boundaries.
6. **Measure again** — execute positive/negative fixtures and replay representative logs.
7. **Reconcile** — for missing terminal notification, query canonical child state at most twice.
8. **Verify** — independent Routing Verifier reviews evidence.

## Responsible agent
Implementation owner for stage 5; Routing Verifier for stage 8.

## Tools
Runtime logs/state APIs and `scripts/verify_route.py`.

## Outputs
Accepted/quarantined event record, reason code, reconciliation evidence, and final verification status.

## Checkpoints
Before dispatch, before parent state mutation, before waiting beyond timeout, and before parent completion.

## Metrics
100% consequential-event lineage validation; 0 accepted cross-task fixtures; 0 indefinite waits in test suite; terminal reconciliation bounded to 2 reads.

## Retry policy
Canonical-state retrieval may retry twice with bounded backoff. Event dispatch itself MUST NOT be blindly retried to another destination.

## Stop conditions
Stop on verified acceptance, deterministic rejection, or exhausted reconciliation retries.

## Failure path
Quarantine the event, preserve evidence, keep parent incomplete, and escalate. Never redirect to a guessed task.

## Verification
Run `python3 scripts/verify_route.py --registry <registry.json> --event <event.json>` plus automated tests.

## Definition of Done
Implemented: gate wired at routing boundary. Measured: baseline and post-change metrics captured. Verified: independent fixtures prove valid events pass, cross-task/unknown-worker events fail, and missing terminal events reconcile without indefinite loops.
