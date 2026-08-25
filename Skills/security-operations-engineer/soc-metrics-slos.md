# SOC Metrics and SLOs

## Purpose
Measure security operations using metrics that expose detection, investigation and response effectiveness without incentivizing shallow closure behavior.

## When to use
Use for SOC health reviews, capacity planning, service objectives and improvement programs.

## Inputs
Alert/case timestamps, dispositions, severity, detection health, staffing, incident outcomes and automation data.

## Context to inspect
Understand timestamp definitions, queues, handoffs, business hours, severity policy and data-quality limitations.

## Core knowledge
MTTD/MTTR alone can mislead. Pair speed with quality, coverage, backlog age, reopen rates, precision, detection health and containment outcomes.

## Procedure
1. Define operational questions before metrics.
2. Standardize event, alert, triage, escalation and containment timestamps.
3. Segment by severity and workflow.
4. Measure queue age and service-level attainment.
5. Track alert precision and analyst disposition quality.
6. Track telemetry/detection health and validation status.
7. Measure incident containment and recurrence outcomes.
8. Review workload distribution and automation impact.
9. Investigate trends rather than rewarding raw closure counts.
10. Set SLOs tied to risk and staffing reality.

## Decision points
Use percentiles rather than averages for skewed latency. Exclude waiting states only when definitions are transparent and consistently applied.

## Common failure patterns
Gaming closure time; mixing severity classes; measuring analysts by alerts closed; hiding data gaps; reporting precision without label quality.

## Verification
Audit metric calculations from raw cases and confirm they drive actionable operational decisions.

## Expected output
A metric catalog, dashboards and SLOs with definitions, owners and review cadence.

## Stop conditions
Do not publish comparative performance metrics when data definitions are inconsistent or likely to create harmful incentives.