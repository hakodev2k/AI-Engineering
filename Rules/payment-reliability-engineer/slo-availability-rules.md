# SLO and Availability Rules

## Purpose
Define reliability objectives that reflect payment completion and financial correctness, not merely service uptime.

## Scope
Payment APIs, asynchronous processing, provider dependencies, reconciliation, and critical payment paths.

## MUST
- Service objectives MUST define user-visible success criteria, latency, and acceptable failure rates for critical payment flows.
- Availability calculations MUST distinguish internal failures from provider or dependency failures when ownership differs.
- Error budgets MUST influence release and risk decisions for critical payment services.
- Redundancy and failover assumptions MUST be tested for required failure domains.
- Capacity MUST include headroom for peak transaction periods and degraded-provider behavior.

## MUST NOT
- MUST NOT define payment reliability solely as process uptime.
- MUST NOT hide failed financial outcomes behind successful API acceptance rates.
- MUST NOT claim resilience without failover or recovery evidence.

## SHOULD
- Use separate objectives for synchronous acceptance and eventual financial completion when workflows are asynchronous.

## Exceptions
Require documented business trade-off, risk acceptance, evidence, and approval.

## Verification
Inspect SLO definitions, error-budget reports, failover tests, capacity evidence, and outcome dashboards.