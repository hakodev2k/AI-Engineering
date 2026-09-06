# Offline Evaluation Qualification

## Purpose
Qualify offline evaluation evidence so release decisions rely on representative, statistically defensible tests rather than convenient benchmark scores.

## When to use
Use before approving a candidate based on automated or human-scored evaluation suites.

## Inputs
Candidate and baseline outputs, evaluation datasets, metric definitions, slice taxonomy, judge configuration, confidence estimates, and acceptance criteria.

## Preconditions
The exact candidate artifact is versioned and evaluation data use is authorized.

## Context to inspect
Inspect dataset provenance, leakage risk, sampling, label quality, judge calibration, metric implementation, baseline selection, and historical production correlation.

## Core knowledge
Aggregate means hide regressions. Evaluation validity depends on representativeness, independence, scorer reliability, uncertainty, and sensitivity to material failure modes.

## Procedure
1. Map user-critical behaviors to evaluation tasks and slices.
2. Check dataset freshness, provenance, contamination, and coverage.
3. Validate metric semantics and scoring code.
4. Run candidate and baseline under equivalent settings.
5. Inspect aggregate and slice-level deltas.
6. Quantify uncertainty or repeatability for noisy metrics.
7. Manually inspect samples near thresholds and severe failures.
8. Check judge-model bias when model-based scoring is used.
9. Record known blind spots and complementary production checks.
10. Approve evidence only if it supports the claimed release conclusion.

## Decision points
Prefer human review for nuanced, high-impact behavior where automated scorers are weak. Increase sample size when decision margins are smaller than measurement noise.

## Common failure patterns
Test contamination, cherry-picked prompts, uncalibrated LLM judges, changing inference settings between candidates, ignoring tail slices, and treating statistically insignificant deltas as improvements.

## Verification
Re-run a representative subset, reproduce scores from pinned inputs, inspect failure samples, and confirm candidate identity and inference settings.

## Expected output
A qualified evaluation report stating what is proven, uncertain, regressed, and not covered.

## Stop conditions
Stop on suspected leakage, invalid scoring, irreproducible results, missing critical slices, or evidence too noisy to support a release decision.
