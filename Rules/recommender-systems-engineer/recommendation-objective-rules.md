# Recommendation Objective Rules

## Purpose
Ensure recommendation systems optimize an explicit product objective without silently trading away user value, safety, or long-term system health.

## Scope
Applies to objective definition, target construction, multi-objective optimization, KPI selection, and changes to ranking utility functions.

## MUST
- Recommendation objectives MUST be tied to documented product outcomes and measurable success criteria.
- Proxy targets such as clicks, watch time, purchases, or dwell time MUST document known gaps between the proxy and the actual user or business outcome.
- Multi-objective ranking MUST define priority, constraints, and acceptable trade-offs between relevance, diversity, freshness, revenue, safety, and other objectives.
- Objective changes MUST include expected behavioral impact and an evaluation plan covering both short-term and long-term metrics.
- Guardrail metrics MUST be defined for harms that the primary objective can incentivize.

## MUST NOT
- MUST NOT optimize a convenience metric solely because it is easy to collect.
- MUST NOT introduce hidden business weighting, sponsored preference, or policy bias without explicit product authorization and review.
- MUST NOT claim an objective change is beneficial based only on offline score movement.

## SHOULD
- Objectives SHOULD separate user-value metrics from platform-value metrics when incentives can diverge.
- Long-horizon effects SHOULD be evaluated when the objective can alter user behavior or content supply.

## Exceptions
Any exception MUST document the reason, affected metrics, risk, expected duration, and reviewer approval when the change can materially affect users or revenue.

## Verification
Review the objective specification, target-generation code, metric definitions, experiment plan, and ranking configuration. Confirm guardrails exist and that online evidence is required before broad rollout.