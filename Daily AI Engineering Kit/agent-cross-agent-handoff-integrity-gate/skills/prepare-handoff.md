# Prepare Cross-Agent Handoff

## Purpose
Produce a bounded, evidence-backed handoff that another agent can consume without reconstructing hidden reasoning or guessing repository state.

## When to use
Use before transferring work between explorer, planner, implementation, review, QA, security, database, or verification agents.

## Inputs
- Task identifier and acceptance criteria.
- Producer and intended consumer roles.
- Repository paths, logs, commands, APIs, or other evidence used.
- Current task status and risk tags.
- Produced artifacts and their SHA-256 digests when applicable.

## Preconditions
- Relevant context has been inspected.
- Facts can be separated from hypotheses.
- No secret value will be copied into the handoff.

## Allowed tools
Repository read/search, build/test output, log inspection, deterministic hashing, schema validation, and read-only API/database inspection appropriate to the task.

## Constraints
- A `ready` handoff requires evidence.
- Every confirmed fact in a `ready` or `verified` handoff references evidence IDs.
- High-risk work must not claim independent verification by the producer.
- Do not represent planned work as completed work.

## Procedure
1. Assign a stable `handoff_id`.
2. State producer, consumer, task, current status, and risk tags.
3. Record confirmed facts with confidence and evidence references.
4. Record unresolved hypotheses separately; keep unsupported hypotheses to three or fewer.
5. Record decisions and why they were made; mark approval-required decisions.
6. Record evidence with stable IDs, source locations, concise summaries, and digest when useful.
7. Record unresolved questions that block safe continuation.
8. Record artifacts using repository/file/URL paths and SHA-256 digests.
9. Record verification status and concrete checks already run.
10. Run `python scripts/handoff_gate.py <handoff.json>`.
11. If validation fails, correct the handoff rather than weakening the gate.
12. Hand the validated envelope to the named consumer.

## Expected output
A JSON envelope conforming to `schemas/handoff-envelope.schema.json` and the deterministic gate.

## Verification
The gate exits `0`; evidence references resolve; artifact digests match when `--verify-files` is used; status matches actual verification state.

## Failure handling
For missing evidence, downgrade unsupported statements to hypotheses or mark the handoff `blocked`. For stale artifacts, recompute evidence from current files. For tool or permission failure, preserve the failure as evidence and stop rather than inventing results.

## Stop conditions
Stop when required evidence is unavailable, a required approval has not been granted, artifact integrity cannot be established, or the consumer cannot be identified unambiguously.
