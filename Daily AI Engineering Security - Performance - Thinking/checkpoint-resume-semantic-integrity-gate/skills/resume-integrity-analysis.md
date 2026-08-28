# Skill: Resume Integrity Analysis

## Purpose
Determine whether a long-running workflow resumed from the intended observable state rather than merely loading a checkpoint artifact successfully.

## Trigger
Process/compute recreation, deployment change, manual restore, approval continuation, checkpoint-store migration or resume-related incident.

## Inputs
Checkpoint JSONL export, expected workflow signature, stable executor identities, request/approval state and runtime logs.

## Preconditions
Checkpoint IDs and parent relationships can be exported. Expected topology/identity is known or captured from the checkpoint producer.

## Required context
Workflow topology, executor IDs, pending/answered requests, iteration/superstep semantics and the intended restored checkpoint.

## Allowed tools
Read-only checkpoint inspection, `scripts/checkpoint_integrity.py`, unit tests and runtime event logs.

## Constraints
- MUST NOT infer correctness solely from successful deserialization.
- MUST NOT request hidden chain-of-thought.
- MUST use observable state and evidence.
- MUST stop before consequential actions when resume integrity is ambiguous.

## Procedure
1. Record the intended restored checkpoint and expected workflow signature.
2. Export the checkpoint chain including first checkpoint created after resume.
3. Run the deterministic integrity checker.
4. Verify parent ancestry and iteration monotonicity.
5. Compare executor identity/topology before and after resume.
6. Reconcile pending and answered request IDs.
7. Check that already-answered approvals are not reintroduced as pending.
8. Form a concrete root-cause hypothesis for each violation.
9. Apply at most 2 corrective iterations.
10. Hand artifacts to the independent Verification Agent.

## Decision points
Block resume on unknown/missing parent, ancestry break, topology/identity drift, iteration rollback, request replay, or missing evidence.

## Expected output
Facts, Evidence, Violations, Hypothesis, Decision, Risks and Verification status.

## Metrics
Resume integrity pass rate, ancestry failures, identity mismatches, replay detections, restart/rollback detections and recovery time.

## Verification
Independent rerun must reproduce the same integrity decision and confirm the workflow does not duplicate/skip observable work.

## Failure handling
Keep the workflow paused, preserve checkpoint artifacts and start a new safe session only with explicit operational approval if repair is impossible.

## Stop conditions
Stop immediately on ambiguous approval state or consequential duplicate-action risk; otherwise stop after 2 failed corrective attempts.
