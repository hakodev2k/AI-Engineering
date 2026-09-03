# Skill: Resume Addressability Audit

## Purpose
Prove that each proposed human resume value is deterministically attributable to a pending interrupt.

## Trigger
Before resuming a durable workflow with one or more pending interrupts; mandatory for parallel branches and nested subgraphs.

## Inputs
Canonical pending interrupt list, each with stable `id`, and the proposed resume payload.

## Preconditions
Interrupt IDs have been materialized from durable runtime state rather than inferred from display order.

## Required context
Pending IDs and resume payload only; hidden reasoning is not needed.

## Allowed tools
Read-only checkpoint inspection, state normalization, `scripts/resume_gate.py`, unit tests.

## Constraints
- Multiple pending IDs MUST NOT accept an unaddressed scalar resume.
- Pending IDs MUST be unique and non-empty.
- Resume maps MUST NOT contain unknown IDs.
- Partial addressed resumes MAY be allowed when the runtime intentionally preserves unresolved interrupts.
- List/display ordering MUST NOT be used as the authorization/decision binding.

## Procedure
1. Extract all effective pending interrupts across task/subgraph nesting.
2. Normalize to stable IDs and reject duplicates/missing IDs.
3. Count unique pending IDs.
4. If one ID is pending, validate the single resume using host semantics.
5. If more than one ID is pending, require an object/map keyed by interrupt ID.
6. Reject unknown IDs and empty maps.
7. Compute resumed and remaining ID sets.
8. Compare post-resume runtime state against the predicted remaining set.
9. Record evidence and stop when deterministic correspondence is proven.

## Decision points
Scalar + multiple IDs: deny as ambiguous. Addressed known IDs: allow. Unknown/duplicate IDs: deny. Partial addressed map: allow only if policy explicitly preserves remaining interrupts.

## Expected output
Structured allow/deny result with resumed and remaining IDs.

## Metrics
Ambiguous resumes blocked, addressability coverage, nested-subgraph test coverage, post-resume remaining-set accuracy.

## Verification
Run the deterministic tests and a host-specific nested parallel interrupt reproduction.

## Failure handling
Fail closed on missing/duplicate IDs or mismatched post-resume state. Do not guess by ordering.

## Stop conditions
Maximum 2 diagnosis/implementation retries. Stop immediately if a resume value is consumed by an ID other than the one explicitly addressed.
