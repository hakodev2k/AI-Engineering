# Skill: Checkpoint Semantic Audit

## Purpose
Determine whether a checkpoint backend preserves the behavioral facts that agent reasoning depends on.

## Trigger
Saver addition/upgrade, storage migration, resume/replay inconsistency, serializer/query change, or backend parity investigation.

## Inputs
Invariant profile, backend/version identity, representative checkpoint fixtures, sync/async observations, expected semantic outcomes.

## Preconditions
Fixtures are non-destructive and can be replayed in an isolated test database or adapter harness.

## Required context
Which metadata drives routing; how latest checkpoints are selected; whether parent/history traversal is used; ordering/cursor assumptions; sync/async usage.

## Allowed tools
Test databases, read-only production samples after sanitization, framework saver APIs, deterministic scripts, unit/integration tests.

## Constraints
Do not infer equivalence from method signatures. Do not mutate production checkpoint history for testing. Do not remove an invariant solely because one backend fails it.

## Procedure
1. List every persisted fact consumed by downstream reasoning or recovery.
2. Map each fact to a measurable invariant in `config/invariants.json`.
3. Generate identical fixtures for every candidate backend/version.
4. Exercise put/get/list/history/latest behavior plus sync/async variants where supported.
5. Normalize results into booleans for each required invariant and retain raw evidence separately.
6. Run `scripts/conformance_check.py` for eligibility.
7. Diagnose failures by query, serialization, ordering, pagination, or metadata path.
8. Remediate and rerun the identical fixture corpus; maximum two cycles.
9. Hand results to an independent verifier before enabling production resume.

## Decision points
Any failed required invariant blocks eligibility. Optional differences may be documented if no application reasoning depends on them.

## Expected output
Backend/version conformance report, failing invariant evidence, root-cause hypothesis, and eligibility decision.

## Metrics
Required-invariant pass rate, metadata fidelity, latest-selection agreement, parent/history completeness, sync/async ordering parity, regressions caught pre-production.

## Verification
Repeat the same corpus after a clean database reset and compare normalized observations. Results must be deterministic for required invariants.

## Failure handling
One rerun is allowed for harness/environment errors. Semantic failures enter remediation with at most two implementation cycles. Persistent failure keeps the backend ineligible.

## Stop conditions
Stop when independent verification passes or when retry limits are exhausted; never resume automatically on an unverified backend.
