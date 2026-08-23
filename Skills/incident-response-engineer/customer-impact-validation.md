# Customer Impact Validation

## Purpose
Translate technical symptoms into verified customer and business impact so incident priorities and recovery decisions reflect real outcomes.

## When to use
Use when dashboards show degradation but customer effect is unclear, when support reports conflict with telemetry, or before declaring recovery.

## Inputs
Business KPIs, synthetic tests, transaction outcomes, support reports, client telemetry, API metrics, tenant/region dimensions, and product criticality.

## Context to inspect
Inspect critical journeys, partial failures, retries hidden by clients, cached behavior, customer tiers, regional routing, and asynchronous outcomes.

## Core knowledge
Infrastructure health is a proxy for customer experience. Successful HTTP status codes can still represent broken business outcomes, and client retries can hide server instability while increasing latency or duplicate side effects.

## Procedure
1. Identify critical customer journeys related to the affected system.
2. Define what success means at the business outcome level.
3. Segment results by tenant, region, client version, and operation where relevant.
4. Compare technical telemetry with synthetic and real transaction outcomes.
5. Review support signals for failure modes not visible server-side.
6. Quantify failed, delayed, duplicated, or degraded outcomes.
7. Reassess severity using verified impact.
8. Repeat validation after mitigation and during recovery observation.

## Decision points
Prioritize business-journey evidence when infrastructure metrics conflict with customer outcomes. Use representative synthetic tests when real-user telemetry is delayed or unavailable.

## Common failure patterns
Equating CPU health with customer health, counting only hard errors, ignoring latency and duplicate effects, and validating only one region or client population.

## Verification
Confirm at least one end-to-end signal demonstrates the expected customer outcome and aligns with segmented production telemetry.

## Expected output
A quantified impact statement with affected journeys, populations, symptoms, and recovery evidence.

## Stop conditions
Escalate when validating customer impact requires access to sensitive customer data outside authorized scope.