# Skill: Review Plan-to-Diff Traceability

## Purpose
Independently verify that the implementation diff remains justified by the frozen plan and that evidence is sufficient to claim completion.

## When to use
Use when deterministic validation returns `review-required`, for all high/critical-risk plan items, before PR handoff, and after any replan that changes fingerprints.

## Inputs
- Frozen `plan.json`
- `change-manifest.json`
- Validation output from `scripts/validate-traceability.py`
- Current repository diff and revision identifiers
- Relevant test/build/contract/security evidence

## Preconditions
- Reviewer can inspect the repository and evidence.
- For high/critical risk, reviewer identity differs from the implementing actor.

## Procedure
1. Recompute the plan fingerprint independently.
2. Confirm the manifest describes the same task, base revision, head revision, and actor.
3. Inspect every changed path, including deletes, renames, generated files, lockfiles, migrations, configuration, and snapshots.
4. For each mapping, verify the cited plan item actually authorizes the change and its path pattern.
5. Verify acceptance-criterion links describe observable behavior rather than implementation details alone.
6. Inspect `not-needed` plan items and reject unsupported status changes.
7. Check that each `implemented` item has current, relevant evidence and distinguish executed commands from verified results.
8. Inspect risk categories and confirm any approval-required change has an explicit approval reference.
9. Compare the actual diff inventory with the manifest; reject any orphan path or stale content fingerprint.
10. For high/critical risk, perform an independent verification of the most consequential acceptance criteria.
11. Produce `traceability-review.json` conforming to `schemas/traceability-review.schema.json`, binding both plan and manifest fingerprints.
12. Run `scripts/evaluate-final-gate.py` with the current plan, manifest, validation result, and review.

## Expected output
An approval/rejection review with concrete findings and a final gate result.

## Verification
A review is valid only when fingerprints match the current artifacts and reviewer independence requirements are met.

## Failure handling
Do not approve around deterministic blockers. Replan or remediate. Transient read/tool failure may be retried once; repeated failure stops the review.

## Stop conditions
Stop on stale fingerprints, diff/manifest mismatch, unsupported mapping, missing approval, high-risk self-review, unresolved blocked/pending plan item, or insufficient evidence.
