# Skill: Interrupt Set Reconciliation

## Purpose
Verify that a resume action addresses the exact complete set of live pending interrupts.

## Trigger
Before every resume after human input or approval; repeat after checkpoint hydration or reconnect.

## Inputs
Pending interrupt snapshot, proposed resume payload, optional previous snapshot/version.

## Preconditions
Interrupt IDs must be stable and discoverable. Nested pending structures must be flattened without deduplicating distinct IDs.

## Required context
Current thread/run identity, pending interrupt IDs, whether the host permits scalar resume, and expected dispositions.

## Allowed tools
Read-only state inspection, `scripts/interrupt_resume_guard.py`, test runner, sanitized event traces.

## Constraints
Do not infer a response from ordering. Do not invent decisions. Do not accept stale/unknown IDs. Do not request hidden chain-of-thought.

## Procedure
1. Capture baseline pending count and IDs before any response consumption.
2. Flatten all nested task/subgraph interrupt containers.
3. Detect duplicate IDs in pending state; block if found.
4. If the proposed response is scalar, require exactly one pending ID.
5. If mapped, require response ID set to equal pending ID set exactly.
6. Validate every disposition as explicit `approved`, `rejected`, `cancelled`, or domain-specific value allowed by policy.
7. Apply the validated batch atomically in the host.
8. Re-read state and assert no addressed interrupt remains pending and no unaddressed interrupt disappeared.
9. Compare tool/result events for every approved request.
10. Permit at most one refreshed-state retry if the pending set changed concurrently; a second mismatch escalates.

## Decision points
Exact set match: continue. Missing or unknown ID: block. Scalar with cardinality >1: block. Concurrent snapshot drift: refresh once, then revalidate.

## Expected output
Resume verification record with pending count, response count, mismatch sets, and post-resume reconciliation status.

## Metrics
Mismatch rate, dropped-approved-call rate, refresh retries, verification latency.

## Verification
Included tests pass and target-runtime integration proves each approved ID reaches exactly one terminal result/disposition.

## Failure handling
Preserve the pending snapshot, do not consume any part of an invalid batch, refresh once on genuine concurrency, then escalate.

## Stop conditions
Success after exact pre- and post-resume reconciliation; failure after two total attempts or any irreversible partial consumption without recoverable evidence.