# AI SLO Engineering

## Purpose
Define service-level objectives for AI experiences that connect reliability engineering to user-visible outcomes.

## When to use
Use when establishing reliability targets, error budgets, release policy, or operational ownership for AI services.

## Inputs
Critical journeys, traffic, latency/error data, quality constraints, dependencies, business impact, and historical incidents.

## Context to inspect
Inspect end-to-end boundaries, streaming semantics, provider dependencies, fallback behavior, user expectations, and current SLAs/SLOs.

## Core knowledge
AI SLOs should use measurable service-level indicators. Availability and latency are usually suitable; semantic quality often requires separate evaluation governance because it is difficult to measure continuously and objectively.

## Procedure
1. Select critical user journeys and define success from the user's perspective.
2. Define availability SLIs including timeout and valid-response semantics.
3. Define latency SLIs, separating TTFT when streaming matters.
4. Choose target windows and objectives using business impact and achievable reliability.
5. Compute historical error-budget consumption.
6. Decide how provider failures and fallbacks count toward user-visible success.
7. Create burn-rate alerts with multiple windows.
8. Define operational actions when budgets burn too quickly.
9. Review SLOs after major architecture or workload changes.

## Decision points
Prefer end-to-end SLIs over component uptime. Keep semantic quality as a companion objective unless measurement is sufficiently stable and auditable.

## Common failure patterns
100% targets, provider uptime masquerading as product availability, percentile SLOs with unclear denominators, ignoring cancellations, and error budgets with no decision policy.

## Verification
Recalculate SLOs from raw events, test burn-rate alerts with synthetic breaches, and confirm incident examples are classified as intended.

## Expected output
SLI definitions, SLO targets, error-budget policy, dashboards, and burn alerts.

## Stop conditions
Stop if success semantics are unresolved or telemetry cannot measure the proposed SLI consistently.