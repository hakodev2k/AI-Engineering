# Training Objective Rules

## Purpose
Ensure model training optimizes an explicit, measurable objective rather than an ambiguous notion of improvement.

## Scope
Applies to pretraining, continued pretraining, supervised fine-tuning, preference optimization, and other weight-changing training runs.

## MUST
- Training MUST begin with documented target capabilities, protected capabilities, acceptance metrics, and known non-goals.
- The objective MUST identify the intended data distribution and deployment context.
- Success criteria MUST include baseline values and decision thresholds before the run begins.
- Conflicting objectives MUST have an explicit prioritization or Pareto trade-off plan.
- Any change to objective, loss composition, or acceptance criteria during a run MUST be recorded with rationale and expected effect.

## MUST NOT
- MUST NOT declare success from training loss alone when downstream behavior is the actual goal.
- MUST NOT move evaluation thresholds after seeing results without labeling the analysis exploratory.
- MUST NOT optimize a proxy known to create material safety, quality, or distributional regressions.

## SHOULD
- Objectives SHOULD separate capability, robustness, safety, efficiency, and calibration dimensions.
- Teams SHOULD prefer metrics tied to real deployment failure modes over convenient offline proxies.

## Exceptions
Exceptions require the reason, unavailable evidence, risk, alternative considered, and an owner-approved follow-up evaluation.

## Verification
Review the experiment specification, loss configuration, baseline report, evaluation plan, and run metadata. Confirm acceptance thresholds predate final results and that objective changes are traceable.