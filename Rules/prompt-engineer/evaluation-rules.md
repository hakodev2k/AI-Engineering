# Evaluation Rules

## Purpose
Require evidence that prompt behavior meets its intended contract.

## Scope
Offline evals, regression suites, rubric-based grading, model-graded checks, and human review.

## MUST
- Every production-critical prompt MUST have representative evaluation cases before release.
- Evaluations MUST cover expected success, boundary conditions, known failure modes, and adversarial cases where relevant.
- Pass criteria MUST be defined before interpreting results.
- Material prompt changes MUST be compared against an established baseline.
- Evaluation data MUST distinguish test cases from examples used directly in the prompt when leakage could bias results.

## MUST NOT
- MUST NOT approve a prompt based only on a few favorable examples.
- MUST NOT treat model confidence or anecdotal impressions as evaluation evidence.
- MUST NOT hide regressions by changing metrics after observing results without documenting the reason.

## SHOULD
- Evaluation sets SHOULD represent real production distributions and important long-tail cases.
- Human review SHOULD calibrate automated graders for high-impact behavior.

## Exceptions
Exploratory prototypes may use smaller suites if they are clearly non-production and cannot trigger high-impact actions.

## Verification
Inspect evaluation definitions, baseline comparisons, grader calibration evidence, and regression reports.