# Experiment Design Rules

## Purpose
Ensure growth experiments produce trustworthy learning without avoidable customer or business harm.

## Scope
A/B tests, feature experiments, funnel experiments, and growth hypotheses.

## MUST
- Define hypothesis, target population, primary metric, guardrails, expected direction, duration or stopping rule, and decision criteria before exposure.
- Identify confounders and instrumentation dependencies before launch.
- Require explicit approval for experiments that materially affect pricing, privacy, security, contractual commitments, or regulated flows.

## MUST NOT
- Change success criteria after observing results without labeling the analysis exploratory.
- Run experiments whose downside cannot be bounded or reversed without an approved risk plan.

## SHOULD
- Prefer the smallest experiment that can resolve the decision with acceptable statistical and operational risk.

## Exceptions
Urgent operational tests may use abbreviated design when scope, risk, evidence, owner, and rollback are documented.

## Verification
Review the experiment specification, implementation diff, metric definitions, guardrails, exposure configuration, and final analysis.