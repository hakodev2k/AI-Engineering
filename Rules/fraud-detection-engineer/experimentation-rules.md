# Experimentation Rules

## Purpose
Evaluate fraud changes causally and safely without exposing unacceptable loss or customer harm.

## Scope
A/B tests, holdouts, shadow tests, champion-challenger tests, and staged rollouts.

## MUST
- Experiments MUST define hypothesis, population, metrics, guardrails, duration logic, and stop criteria before launch.
- Fraud experiments MUST account for delayed outcomes and interference where applicable.
- High-risk variants MUST use exposure limits and active monitoring.
- Results MUST distinguish statistical uncertainty from operational significance.

## MUST NOT
- MUST NOT expose users to a known unsafe control solely to obtain cleaner experimental evidence.
- MUST NOT repeatedly inspect and stop experiments opportunistically without an appropriate statistical plan.

## SHOULD
- Shadow evaluation SHOULD precede live action when practical.
- Long-lived holdouts SHOULD be used only when their risk is justified.

## Exceptions
Require documented rationale, risk controls, and accountable approval.

## Verification
Review experiment plans, assignment logic, guardrail dashboards, outcome maturity, statistical analysis, and launch/stop records.