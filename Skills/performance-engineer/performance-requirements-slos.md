# Performance Requirements and SLOs

## Purpose
Turn vague expectations such as "fast" or "scalable" into measurable performance objectives that guide design, testing, capacity planning, and production decisions.

## When to use
Use before major performance work, new services, critical user journeys, migrations, or capacity changes. Do not optimize against invented targets when business requirements are unavailable.

## Inputs
User journeys, business requirements, traffic forecasts, existing telemetry, architecture, dependencies, cost constraints, and reliability objectives.

## Preconditions
Identify the system boundary and the stakeholders authorized to accept performance trade-offs.

## Context to inspect
Inspect request paths, async workflows, batch windows, concurrency, payload sizes, dependency latency, peak traffic, resource limits, and existing SLOs.

## Core knowledge
Performance is multidimensional: latency distributions, throughput, concurrency, resource efficiency, scalability, and tail behavior matter. Averages hide outliers. Targets should distinguish normal and peak conditions and define measurement boundaries.

## Procedure
1. Identify critical journeys and workloads.
2. Define the measurement boundary for each journey.
3. Capture baseline traffic, latency percentiles, throughput, and resource use.
4. Define p50/p95/p99 or other appropriate latency targets.
5. Define throughput and concurrency targets.
6. Define peak-load assumptions and growth horizon.
7. Define batch deadlines and background-processing targets where relevant.
8. Document dependency and infrastructure constraints.
9. Align targets with reliability and cost objectives.
10. Define test scenarios and production indicators that prove each target.
11. Record assumptions and obtain stakeholder agreement.

## Decision points
Use end-to-end targets for user outcomes and component budgets for diagnosis. Tighten targets only when user or business value justifies the engineering and infrastructure cost.

## Common failure patterns
Using only average latency, ignoring peak traffic, measuring the wrong boundary, setting targets without workload assumptions, and optimizing components that do not constrain the user journey.

## Verification
Every important target must have a unit, percentile or aggregation rule, workload condition, measurement location, and repeatable verification method.

## Expected output
A measurable performance objective set and verification plan.

## Stop conditions
Escalate when workload assumptions, business priorities, or acceptable cost/reliability trade-offs cannot be established.