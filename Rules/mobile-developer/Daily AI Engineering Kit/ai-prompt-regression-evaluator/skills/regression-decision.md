# Regression Decision Skill

## Purpose
Compare baseline and candidate behavior using repeated evidence instead of subjective spot-checking.

## When to use
After an eval runner has produced normalized baseline and candidate run records.

## Inputs
- Eval suite
- Baseline result set
- Candidate result set
- `config/eval-policy.json`

## Preconditions
- Both result sets refer to the same suite version and case IDs.
- Required run counts are present.

## Procedure
1. Validate suite and run records.
2. Reject incomparable data: missing cases, mismatched suite version, mixed model/config identity, or invalid run counts.
3. Run `scripts/aggregate-results.py` for baseline and candidate.
4. Compare deterministic assertion pass rate per case.
5. Compare semantic rubric scores by dimension and weighted total.
6. Compare critical-case worst-run score, not only average score.
7. Compare cost and latency budgets.
8. Classify each case as `pass`, `regressed`, `inconclusive`, or `blocked`.
9. Run `scripts/evaluate-regression.py` to compute the suite gate.
10. Send any semantic or safety-sensitive borderline cases to the Verification Reviewer.

## Expected output
A regression report matching `schemas/regression-report.schema.json` with status `verified`, `regressed`, `inconclusive`, or `blocked`.

## Verification
A report is `verified` only when deterministic validation passes, no critical case regresses, aggregate thresholds pass, and required reviewer approval exists.

## Failure handling
Transient model/tool failures may be retried once per failed run. Do not replace failed evidence silently. Persist failed attempts and stop if the same infrastructure failure repeats.

## Stop conditions
Stop on invalid suite identity, missing critical cases, repeated runner failure, missing approval, or incomparable baseline/candidate data.
