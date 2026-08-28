# Requirements and KPI Rules

## Purpose
Tie BI deliverables to explicit business questions, decisions, and measurable definitions.

## Scope
Applies to reports, dashboards, metrics, semantic models, and analytical data products.

## MUST
- Every material BI deliverable MUST identify the decision, workflow, or business question it supports.
- KPI specifications MUST define business meaning, owner, population, grain, time basis, filters, and expected freshness.
- Conflicting definitions MUST be resolved or explicitly versioned before a metric is treated as authoritative.
- Acceptance criteria MUST include representative expected results that can be validated.

## MUST NOT
- MUST NOT publish a business-critical KPI with unresolved semantic ambiguity.
- MUST NOT present an approximation as the governed metric without clearly identifying the difference.

## SHOULD
- Requirements SHOULD capture decision latency, user population, drill-down needs, and material edge cases.

## Exceptions
Exceptions require documented ambiguity, business impact, temporary interpretation guidance, owner approval, and review date.

## Verification
Inspect specifications, metric examples, stakeholder acceptance evidence, and validation results.