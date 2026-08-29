# AI Evaluation Evidence Rules

## Purpose
Require decision-grade evidence that AI systems meet approved requirements before release and after material change.

## Scope
Applies to model, system, safety, reliability, fairness, security, and operational evaluations used for governance decisions.

## MUST
- Evaluation plans MUST map tests and metrics to documented requirements and material risks.
- High-risk claims MUST be supported by reproducible evidence from representative conditions.
- Evaluation datasets, prompts, scenarios, model versions, configurations, and scoring methods MUST be versioned or otherwise traceable.
- Pass/fail thresholds MUST be defined before final approval whenever practical.
- Evaluation limitations, uncertainty, blind spots, and known invalidating conditions MUST be documented.
- Material changes MUST trigger re-evaluation of affected claims.

## MUST NOT
- MUST NOT treat model-provider benchmark claims as sufficient evidence for a specific deployment.
- MUST NOT cherry-pick favorable metrics or hide materially adverse results.
- MUST NOT use test contamination, leaked labels, or production incidents as a substitute for controlled evaluation.
- MUST NOT claim safety, fairness, robustness, or compliance solely from subjective reviewer confidence.

## SHOULD
- Evaluations SHOULD include edge cases, misuse, degraded dependencies, and representative subgroups where relevant.
- Independent review SHOULD be used for high-impact decisions or contested evidence.
- Automated regression suites SHOULD cover stable critical requirements.

## Exceptions
Exceptions MUST state which evidence is missing, why, residual uncertainty, compensating controls, monitoring, expiration, and approval. Missing evidence for a critical control requires escalation rather than implicit acceptance.

## Verification
Inspect evaluation plans, datasets, run artifacts, model/configuration identifiers, thresholds, reviewer notes, and approval records. Reproduce sampled tests where feasible and confirm results correspond to the released system.