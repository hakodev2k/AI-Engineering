# Availability and SLO Rules

## Purpose
Protect database service availability against avoidable outages and ambiguous reliability targets.

## Scope
Production databases and their supporting control planes.

## MUST
- Define measurable availability and latency SLOs for critical database services.
- Map each SLO to explicit indicators, error budgets, and ownership.
- Evaluate planned changes against current error-budget posture.
- Escalate recurring SLO misses with corrective actions and owners.

## MUST NOT
- Do not claim a database is healthy from host uptime alone.
- Do not approve risky maintenance while reliability debt is unbounded.

## SHOULD
- Prefer customer-impacting indicators such as successful query rate and transaction latency.

## Exceptions
Exceptions require documented business impact, risk, duration, and approval.

## Verification
Review SLO definitions, dashboards, error-budget reports, incident history, and change records.