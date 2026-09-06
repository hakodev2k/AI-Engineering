# Evaluation and Benchmark Rules

## Purpose
Use reproducible evidence to determine which routes are fit for specific workload classes.

## Scope
Offline evaluations, benchmark datasets, human review, task metrics, provider/model comparisons, and release gates.

## MUST
- Production route eligibility MUST be supported by evaluation evidence appropriate to the workload.
- Evaluation datasets MUST document source, task coverage, known limitations, and leakage risks.
- Comparisons MUST control material prompt, tool, and parameter differences or document them explicitly.
- Metrics MUST reflect task success, not only generic model scores.
- Material routing changes MUST be compared with the current baseline before rollout.

## MUST NOT
- MUST NOT cherry-pick favorable benchmark slices while hiding material regressions.
- MUST NOT treat public leaderboard position as sufficient production evidence.
- MUST NOT reuse contaminated evaluation examples as independent evidence.

## SHOULD
- Combine automated metrics with calibrated human review when correctness cannot be reliably automated.
- Maintain difficult and incident-derived regression sets.

## Exceptions
Exceptions require documented evidence limitations, compensating validation, and owner approval.

## Verification
Review dataset provenance, evaluation configuration, statistical comparisons, reviewer calibration, and release-gate results.