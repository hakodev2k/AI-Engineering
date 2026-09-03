# Skill: Resume Contract Analysis

## Purpose
Prevent ambiguous or stale human/workflow responses from being applied to the wrong pending interrupt in stateful agent graphs.

## Trigger
Before programmatic resume when pending interrupts may be parallel, nested, persisted, or externally surfaced.

## Inputs
Pending interrupt records, thread/checkpoint identifier, `config/policy.json`, and a discriminated resume envelope.

## Preconditions
The caller can retrieve the current pending interrupt set from the authoritative runtime/checkpoint state immediately before resume.

## Required context
Current thread/checkpoint identity, all pending interrupt IDs, their namespaces/presentation metadata when available, and whether the application intends a complete or partial resume.

## Allowed tools
Read-only graph/checkpoint inspection, UI adapter inspection, `scripts/resume_guard.py`, and unit/integration tests.

## Constraints
- MUST NOT infer response target from prompt text or array order when durable IDs exist.
- MUST NOT treat a dictionary payload as an ID map without the explicit `kind=by_id` discriminator.
- MUST NOT expose hidden chain-of-thought; evidence is limited to observable state and decisions.
- MUST NOT continue when pending-ID inventory is stale or incomplete.

## Procedure
1. Fetch the authoritative pending interrupt set immediately before resume.
2. Flatten every pending interrupt into a durable ID record; preserve namespace/source metadata separately.
3. Reject duplicate IDs and cardinality beyond the configured maximum.
4. Parse the discriminated envelope.
5. For `scalar`, require exactly one pending interrupt under the default policy.
6. For `by_id`, reject unknown IDs and, when configured, require coverage of every pending ID.
7. Emit the normalized payload that the framework adapter may pass to `Command(resume=...)`.
8. Invoke the graph only after preflight allows.
9. Fetch post-resume state and compare addressed IDs with actually resolved IDs.
10. Record Facts, Assumptions, Evidence, Decision, Risks, and Verification status.

## Decision points
- Pending set changed between UI render and resume -> block and refresh.
- More than one pending + scalar -> block.
- Dictionary application value inside `kind=scalar` + one pending -> allow; do not reinterpret as map.
- Unknown ID -> block.
- Partial ID map under require-all policy -> block.

## Expected output
Preflight result, normalized payload, addressed IDs, unresolved IDs, and evidence for post-resume verification.

## Metrics
Ambiguous resumes blocked, unknown IDs blocked, duplicate IDs detected, multi-interrupt explicit-mapping rate, and resolved-ID coverage.

## Verification
An independent verifier confirms that the post-resume pending set changed exactly as expected and that the addressed branch received the intended value in integration tests.

## Failure handling
Refresh authoritative state once and rerun preflight. If ambiguity remains, stop and request a new externally supplied response rather than guessing.

## Stop conditions
Verified association; one refresh still leaves stale/ambiguous state; or policy violation requires human/application remediation.
