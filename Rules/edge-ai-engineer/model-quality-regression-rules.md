# Model Quality Regression Rules

## Purpose
Prevent edge-specific optimization and deployment changes from degrading required model behavior.

## Scope
Accuracy, ranking, detection, generation, confidence, task metrics, and critical evaluation slices.

## MUST
- Releases MUST define measurable acceptance criteria for model quality.
- Candidate artifacts MUST be compared with the approved baseline using reproducible evaluation data.
- Critical slices MUST be evaluated separately when aggregate metrics can hide material failures.
- Quality regressions beyond approved thresholds MUST block release.

## MUST NOT
- MUST NOT claim equivalent behavior from aggregate averages alone when critical segments differ.
- MUST NOT change evaluation thresholds to make a failing candidate pass without documented rationale.

## SHOULD
- Track quality by device execution path when precision or operator placement differs.

## Exceptions
Accepted regressions require quantified impact, rationale, mitigation, owner, and approval.

## Verification
Inspect evaluation reports, slice metrics, threshold history, release gates, and artifact identity.