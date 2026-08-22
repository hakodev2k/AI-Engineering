# Reporting and KPI Rules

## Purpose
Ensure reports and KPIs have stable business meaning and support valid decisions.
## Scope
Dashboards, management reports, operational metrics, targets, and definitions.
## MUST
- Define metric owner, business meaning, formula, source, grain, filters, time basis, and exclusions.
- Reconcile conflicting definitions before publishing authoritative metrics.
- Document changes to definitions and assess historical comparability.
## MUST NOT
- Present a metric without enough context to interpret it correctly.
- Change KPI logic silently to improve apparent performance.
## SHOULD
- Pair outcome metrics with relevant quality or risk guardrails.
## Exceptions
Exploratory metrics may remain provisional when clearly labeled.
## Verification
Inspect definitions, queries, lineage, reconciliation, change history, and stakeholder approval.