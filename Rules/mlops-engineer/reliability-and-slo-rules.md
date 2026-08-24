# Reliability and SLO Rules

## Purpose
Define measurable reliability expectations for ML services and pipelines and use them to govern operational risk.

## Scope
Applies to online inference, batch scoring, training pipelines, feature services, registries, and critical ML platform dependencies.

## MUST
- Critical ML capabilities MUST define service-level indicators and objectives that reflect user-visible or workflow-critical outcomes.
- Availability targets MUST be paired with latency, freshness, completion, or correctness indicators where availability alone is insufficient.
- Error budgets or equivalent risk thresholds MUST influence release pace for repeatedly unreliable systems.
- SLO measurement MUST use clearly defined event populations and windows.

## MUST NOT
- Internal component uptime MUST NOT substitute for an end-to-end reliability objective when users depend on the full path.
- Targets MUST NOT be changed retroactively to hide a breach.

## SHOULD
- SLOs SHOULD distinguish model quality from platform reliability while showing their combined impact.
- Critical batch pipelines SHOULD define completion and data-freshness objectives.

## Exceptions
Temporary target changes require documented business rationale, effective period, stakeholder approval, and preserved historical reporting.

## Verification
Review SLI queries, objective definitions, breach history, release decisions, error-budget policy, batch deadlines, and dashboards against real operational events.