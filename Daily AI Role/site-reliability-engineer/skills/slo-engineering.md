# Skill: SLO Engineering

## Purpose
Turn reliability expectations into measurable service objectives that guide operations and delivery.

## Trigger
New service, missing SLO, unreliable alerting, recurring incidents, or unclear reliability target.

## Inputs
User journeys, architecture, telemetry, business criticality, dependency model, historical availability/latency, support expectations.

## Preconditions
A service owner exists and at least one user-visible capability can be identified.

## Procedure
1. Identify critical user journeys and define what a successful request/event means.
2. Select SLIs that approximate user experience: availability, latency, correctness, freshness, durability, or throughput as applicable.
3. Define exact numerator/denominator, exclusions, sampling, aggregation, and measurement source.
4. Establish an initial SLO using historical data and business need; record uncertainty when telemetry is weak.
5. Calculate error budget for the window and define consequences for excessive burn.
6. Design multi-window burn-rate alerts with actionable routing.
7. Validate the SLI against known failure cases so it does not report healthy when users are failing.
8. Review with service/product owner when SLO changes business commitments or release policy.

## Decision Rules
- Prefer user-facing indicators over host-level proxies.
- If the SLI cannot be independently verified, label the SLO provisional.
- If success criteria vary by traffic class, define separate objectives rather than averaging away critical failures.

## Outputs
SLO specification, SLI query/contract, error-budget policy, alert policy, known gaps.

## Quality Gate
Formula is reproducible; measurement source exists; exclusions are explicit; alerts map to operator action; ownership is named.

## Verification
Recompute from raw/independent telemetry for a sample period and compare with dashboard value.

## Failure Handling
If telemetry is insufficient, create a measurement gap with owner and deadline instead of inventing precision.

## Stop Conditions
Stop when the objective is measurable, reviewed, alertable, and tied to a decision policy.