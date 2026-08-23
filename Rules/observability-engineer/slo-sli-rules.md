# SLO and SLI Rules
## Purpose
Measure reliability from user-relevant outcomes.
## Scope
Service-level indicators, objectives, windows, and error budgets.
## MUST
- Define SLIs from observable user or consumer success criteria.
- Specify numerator, denominator, exclusions, window, and data source.
- Review SLO targets against business criticality and achievable reliability.
## MUST NOT
- Label an internal resource metric as an SLI without connecting it to service outcome.
- Alter SLO calculations to hide poor performance.
## SHOULD
- Use error budgets to inform release and reliability trade-offs.
## Exceptions
New services may begin with provisional objectives and a dated calibration plan.
## Verification
Recalculate SLI samples, inspect queries, validate exclusions, and compare incidents to SLO behavior.