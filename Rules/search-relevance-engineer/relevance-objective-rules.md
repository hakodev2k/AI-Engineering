# Relevance Objective Rules

## Purpose
Define measurable search quality goals and prevent local optimizations from degrading user outcomes.

## Scope
Applies to search intent, ranking objectives, quality thresholds, business constraints, and release decisions.

## MUST
- Search quality objectives MUST define the user task, success criteria, and protected constraints before ranking changes are implemented.
- Material relevance changes MUST identify the primary metric and at least one guardrail metric.
- Offline and online metrics MUST be interpreted in the context of the user journey they approximate.
- Competing objectives such as relevance, freshness, diversity, revenue, and latency MUST have explicit priority or trade-off criteria.

## MUST NOT
- MUST NOT optimize a proxy metric without verifying that it correlates with the intended user outcome.
- MUST NOT silently redefine success criteria after an experiment begins.
- MUST NOT accept relevance gains that violate explicit safety, policy, privacy, or latency constraints.

## SHOULD
- Define segment-specific goals where intent or traffic characteristics differ materially.

## Exceptions
Exceptions require documented rationale, affected segments, evidence, risk, and reviewer approval.

## Verification
Review metric definitions, experiment plans, dashboards, release criteria, and decision records.