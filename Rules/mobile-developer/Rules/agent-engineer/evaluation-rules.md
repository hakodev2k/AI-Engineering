# Agent Evaluation Rules
## Purpose
Require evidence that agent behavior meets task and safety requirements.
## Scope
Offline evaluations, regression suites, human review, and release gates.
## MUST
- Evaluate task success, tool correctness, safety, recovery, and critical failure modes on representative cases.
- Keep regression cases for material production failures.
- Define release thresholds before interpreting results.
## MUST NOT
- Approve production readiness from anecdotal demos alone.
- Remove failing cases merely to improve reported scores.
## SHOULD
- Combine deterministic assertions, model-based grading where appropriate, and human review for subjective dimensions.
## Exceptions
Emergency releases require documented risk and post-release evaluation plan.
## Verification
Inspect datasets, graders, thresholds, run artifacts, regressions, and release evidence.