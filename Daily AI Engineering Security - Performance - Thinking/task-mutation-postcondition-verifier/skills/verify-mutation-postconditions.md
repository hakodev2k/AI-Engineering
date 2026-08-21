# Skill — Verify Mutation Postconditions

## Purpose
Determine whether a requested control-plane mutation actually produced the intended durable state.

## Trigger
Immediately after archive/delete/move/rename/close requests and before dependent actions.

## Inputs
Mutation metadata, pre-state snapshot, operation result/error, post-state observations, expected postconditions, consistency deadline.

## Preconditions
Postconditions are explicit and at least one authoritative observation source exists.

## Allowed tools
Read-only API/storage inspection, logs, filesystem metadata, database integrity/read queries, deterministic verifier script.

## Constraints
No repair or destructive mutation. Do not infer success from a missing UI row alone. Do not expose private content when metadata suffices.

## Procedure
1. Record operation result as evidence, not conclusion.
2. Capture post-state from authoritative sources.
3. Normalize facts into a JSON snapshot.
4. Run `scripts/verify_postconditions.py` against declared expectations.
5. If evidence is incomplete but the consistency deadline remains, observe again with bounded backoff.
6. Classify `verified-success`, `verified-failure`, or `indeterminate`.
7. Block dependent destructive actions unless verified-success.
8. Hand off failures with facts, violated postconditions and safe recovery options.

## Decision points
- All required postconditions true: success.
- A required postcondition is definitively false after deadline: verified-failure.
- Evidence conflicts or source unavailable: indeterminate.

## Expected output
Structured facts, postcondition results, classification, retry eligibility, risks and next safe action.

## Metrics
False-success rate, verification latency, indeterminate rate, repeated deterministic retries, blocked unsafe dependents.

## Verification
Independent agent checks snapshot provenance and classification.

## Failure handling
At most three observations inside the declared deadline. No mutation retry is triggered automatically by this skill.

## Stop conditions
Verified success/failure, deadline reached, or authoritative evidence becomes unavailable.
