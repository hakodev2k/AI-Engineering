# Preference Training Rules

## Purpose
Ensure preference optimization improves intended behavior without reward hacking, evaluator leakage, or hidden capability regressions.

## Scope
Preference datasets, reward models, judges, DPO-like objectives, RL-based optimization, ranking, and rejection sampling.

## MUST
- Preference labels MUST have a documented rubric, source, quality process, and disagreement handling.
- Judge or reward signals MUST be validated against independent human or task-grounded evidence on important slices.
- Preference optimization MUST be evaluated for helpfulness, calibration, safety, style artifacts, and capability regressions relevant to deployment.
- Reward/judge model versions and prompts MUST be immutable in experiment records.
- Optimization strength and reference-model choices MUST be explicit and ablated when they materially affect behavior.

## MUST NOT
- MUST NOT treat reward score increase as sufficient evidence of user-value improvement.
- MUST NOT train and evaluate against the same judge without acknowledging evaluator coupling.
- MUST NOT hide systematic label disagreement behind an aggregate agreement number.

## SHOULD
- Preference data SHOULD include difficult trade-offs and representative failure cases.
- Teams SHOULD monitor for verbosity, sycophancy, refusal, formatting, or shortcut behaviors induced by the reward signal.

## Exceptions
Research-only judge experiments may use weaker validation but cannot support release claims alone.

## Verification
Review rubrics, label audits, judge validation, objective configs, ablations, independent evaluations, and behavior-regression reports.