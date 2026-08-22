# Workflow: Bind → Correct → Verify

## Trigger
Pre-finalization or detection of completed-observation language about external/private/live information.

## Goal
Ensure final claims accurately reflect tool/backend evidence and action state.

## Inputs
Draft structured claims, evidence ledger, freshness window.

## Baseline
Count externally grounded claims, claims with evidence IDs, unsupported claims, and stale live claims.

## Stages
1. Observe and classify claims.
2. Bind retrieved/live claims to evidence IDs.
3. Diagnose missing, failed, stale, or source-mismatched evidence.
4. Correct unsupported claims to accurate attempted/unavailable/inferred wording or perform the required tool action when authorized.
5. Measure coverage again.
6. Run deterministic gate.
7. Independent Provenance Verifier reviews the corrected claim set.

## Responsible agent
Response/implementation agent performs correction; Provenance Verifier is independent.

## Tools
Evidence ledger, `claim_provenance_gate.py`, authorized retrieval tools.

## Outputs
Before/after coverage metrics, correction record, final PASS/BLOCK.

## Checkpoints
No external completion claim without evidence. No live claim with stale evidence. No second correction loop.

## Metrics
Unsupported-claim rate, evidence coverage, stale-live count, correction rate, retrieval-failure honesty rate.

## Retry policy
Maximum one correction/retrieval retry per finalization pass.

## Stop conditions
Evidence ledger unavailable, fabricated ID, source mismatch not resolvable, or corrected draft remains unsupported.

## Failure path
Remove or qualify the unsupported claim and explicitly report source unavailability. Do not fill missing evidence with plausible details.

## Definition of Done
Every evidence-required claim is supported by successful, source-matching, sufficiently fresh evidence; unsupported claims are removed/qualified; deterministic and independent verification both pass.