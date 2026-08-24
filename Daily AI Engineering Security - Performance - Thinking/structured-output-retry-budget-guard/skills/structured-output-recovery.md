# Skill: Structured-Output Recovery

## Purpose
Recover machine-readable output failures without re-running already completed agent work or entering an unbounded schema-retry loop.

## Trigger
Extraction, JSON parse, or schema validation failure after substantive task execution.

## Inputs
Exact raw output, declared schema, exact validation error, attempt history, retry policy.

## Preconditions
The host MUST retain the original raw output and MUST have a local validator appropriate to the declared schema.

## Required context
Task identifier, whether substantive work completed, raw result provenance, schema version, retry counters, terminal deadline.

## Allowed tools
Local schema validator, deterministic retry guard, narrow repair model call when permitted, read-only evidence access.

## Constraints
Repair MUST operate on the captured raw artifact; it MUST NOT perform task tools, mutate external state, or invent unsupported facts. Full-task rerun is not a formatting-repair step.

## Procedure
1. Preserve raw output unchanged.
2. Classify failure as extraction, parse, or schema validation.
3. Record normalized payload/error fingerprint.
4. Run `scripts/structured_output_guard.py` against attempt history.
5. If guard blocks, terminate with explicit structured-output failure.
6. If repair is allowed, issue one narrow repair call containing raw output, schema and exact error.
7. Validate repaired output locally.
8. Record the new attempt and rerun guard before any further repair.
9. Accept only locally valid output; preserve raw and repaired artifacts separately.

## Decision points
- Underlying work incomplete: return to task workflow, not terminal repair.
- Identical invalid failure repeats at limit: stop immediately.
- Repair introduces unsupported content: reject and stop/escalate.
- Deadline or total-attempt limit reached: stop.

## Expected output
Validated structured result or explicit terminal failure record containing raw-output reference, error class, fingerprints and counters.

## Metrics
Repair attempts, identical repeats, repair success, terminal duration, tokens after substantive completion, full-task reruns avoided.

## Verification
A separate verifier checks local validation and compares repaired claims against raw evidence.

## Failure handling
Maximum repair attempts and deadlines are policy-controlled and finite. Fallback is explicit failure, never silent acceptance.

## Stop conditions
Local validation passes; any retry/deadline limit is reached; unsupported facts are introduced; or underlying task completeness is disproven.