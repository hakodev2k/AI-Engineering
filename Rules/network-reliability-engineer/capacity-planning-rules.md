# Capacity Planning Rules

## Purpose
Keep network capacity aligned with demand and reliability objectives.

## Scope
Production links, shared network services, growth forecasts, headroom, and capacity changes.

## MUST
- Capacity decisions MUST use measured utilization and forecast demand.
- Critical paths MUST maintain documented headroom appropriate to expected bursts and failures.
- Saturation risk MUST be reviewed before major traffic or architecture changes.
- Capacity changes MUST define success criteria and rollback or containment steps.

## MUST NOT
- MUST NOT size solely from average utilization.
- MUST NOT claim capacity is sufficient without current evidence.
- MUST NOT remove resilience headroom without documented risk acceptance.

## SHOULD
- Review both sustained and peak demand trends.
- Prefer early remediation where provisioning lead times are long.

## Exceptions
Exceptions require business context, evidence, duration, risk, and approval.

## Verification
Review utilization history, forecasts, load evidence, headroom calculations, and change records.