# Skill: Resume Correlation Audit

## Purpose
Turn an interrupted workflow's current pending state and a transport/UI response into a deterministic allow/block decision before framework resume.

## Trigger
Run whenever a workflow is about to resume after one or more interrupts.

## Inputs
- authoritative pending interrupt list;
- canonical resume envelope defined in `schemas/resume-envelope.schema.json`;
- workflow/thread/checkpoint identifier when available;
- previous resume audit artifact when retrying.

## Preconditions
- pending state was read from the active checkpoint/runtime, not stale model memory;
- each pending interrupt has a non-empty unique ID;
- no mutating tool or workflow resume has already been issued for this response.

## Required context
Only the current pending interrupt set and the user/system response are required. Hidden reasoning is neither requested nor used.

## Allowed tools
- checkpoint/state read APIs;
- JSON/schema validation;
- `scripts/resume_correlation_guard.py`;
- read-only logs and integration tests.

## Constraints
- MUST NOT infer correlation from list position, task order, display order, or timing;
- MUST NOT interpret an arbitrary dictionary answer as an ID map without explicit `mode: by_id`;
- MUST NOT drop unresolved interrupt IDs to make validation pass;
- MUST NOT resume on stale checkpoint state.

## Procedure
1. Read the current pending interrupt records from the authoritative runtime/checkpointer.
2. Verify IDs are unique and snapshot the exact set.
3. Parse the incoming envelope.
4. If `mode=single`, require exactly one pending ID. Treat `value` as opaque JSON.
5. If `mode=by_id`, require the response key set to equal the pending ID set exactly.
6. Reject missing, extra, duplicate, empty, or stale IDs.
7. Produce the adapter value only after validation succeeds.
8. Record decision, pending count, and violations; do not log sensitive response bodies unless policy permits.
9. Run framework integration tests for nested/parallel fixtures before rollout.

## Decision points
- One pending interrupt: `single` or exact one-key `by_id` may be accepted if policy permits.
- Multiple pending interrupts: only `by_id` with exact key-set equality is accepted.
- Pending state changed between read and resume: re-read state and revalidate once; otherwise stop.

## Expected output
Machine-readable report with `ok`, `violations`, `pending_count`, and validated `adapter_resume`.

## Metrics
- exact-set validation pass rate;
- ambiguous resumes blocked;
- stale-state revalidation count;
- integration miscorrelation failures;
- resume-related incident rate.

## Verification
A separate verifier must confirm that nested parallel fixtures route each distinct response to the intended interrupt and that object-valued single responses remain object-valued.

## Failure handling
Detection: non-unique IDs, missing/extra IDs, mode mismatch, changed pending state, or test failure.  
Retry policy: re-read authoritative pending state once and revalidate.  
Maximum retries: 1.  
Fallback: preserve the workflow in interrupted state.  
Escalation: human/operator review with IDs and non-sensitive diagnostics.  
Stop condition: any unresolved ambiguity after the retry.
