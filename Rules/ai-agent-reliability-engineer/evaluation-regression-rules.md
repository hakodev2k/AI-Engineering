# Evaluation and Regression Rules

## Purpose
Require repeatable evidence that agent changes preserve reliability, safety, and task performance before production exposure.

## Scope
Applies to prompts, policies, models, tools, orchestration, memory, retrieval, retry behavior, and workflow changes.

## MUST
- Production agent changes MUST be evaluated against representative task-success and reliability criteria before broad rollout.
- Reliability evaluation MUST cover tool correctness, authorization boundaries, side-effect safety, retries, loop termination, timeout behavior, recovery, and degraded modes when relevant.
- Incidents and material escaped defects MUST produce regression cases unless a documented reason makes deterministic reproduction impractical.
- Changes to model, prompt, policy, tool contract, or orchestration that can affect behavior MUST run the relevant regression suite.
- Stochastic evaluation MUST use enough repeated samples or statistical evidence to avoid treating a single favorable run as proof.
- Release thresholds MUST be defined before evaluating a consequential change.

## MUST NOT
- Anecdotal examples or agent confidence MUST NOT substitute for evaluation evidence.
- Failing regression cases MUST NOT be deleted or weakened solely to make a release pass.
- A change MUST NOT be declared reliability-neutral when no relevant comparison was performed.

## SHOULD
- High-impact changes SHOULD use shadow, canary, or limited cohort evaluation before full production rollout.
- Evaluation sets SHOULD include realistic adverse conditions and long-tail operational scenarios.

## Exceptions
Exceptions require documented urgency, bounded exposure, compensating monitoring, rollback readiness, and accountable human approval.

## Verification
Inspect CI evaluation reports, baseline comparisons, statistical summaries, regression provenance, threshold configuration, and release evidence. Re-run a sample of critical cases independently when practical.