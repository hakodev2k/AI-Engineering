# Steady-State Definition

## Purpose
Define measurable normal service behavior that resilience experiments should preserve or recover.

## When to use
Use before resilience experiments or whenever teams disagree about what acceptable system behavior means.

## Inputs
SLOs, SLIs, business KPIs, dashboards, traces, service metrics, user journeys, recovery objectives, and baseline traffic patterns.

## Preconditions
At least one observable signal represents the user or service outcome being protected.

## Context to inspect
Latency distributions, error rates, throughput, saturation, availability, queue depth, data correctness, dependency health, normal variance, and alert thresholds.

## Core knowledge
A steady state describes acceptable observable behavior rather than perfect component health. Favor outcome metrics over host metrics, account for natural variance, and define acceptable degradation plus recovery. Correctness signals may be required alongside availability.

## Procedure
1. Identify the capability under experiment.
2. Select a primary outcome signal and supporting diagnostics.
3. Establish a representative baseline.
4. Quantify natural variance.
5. Define acceptable degradation thresholds.
6. Define recovery thresholds and maximum recovery time.
7. Add correctness checks where stale, duplicated, or lost data is possible.
8. Confirm the signals respond to controlled test conditions.
9. Verify telemetry remains available during partial degradation.
10. Document sampling, aggregation, and comparison methods.
11. Review the definition with service owners.

## Decision points
Use SLO-derived signals when they represent the experiment scope. Add business metrics when technical health can appear normal while customer outcomes degrade.

## Common failure patterns
Using CPU or instance count as the primary steady state; thresholds tighter than normal variance; ignoring data correctness; relying on telemetry that disappears during degradation; and accepting recovery without checking recovery time.

## Verification
Validate the checks against historical incidents or controlled non-production test cases. Confirm the signals distinguish normal variance from meaningful degradation.

## Expected output
A baseline, explicit steady-state predicates, measurement windows, recovery limits, and supporting diagnostics.

## Stop conditions
Stop if no trustworthy outcome signal exists, the baseline is unstable, or telemetry gaps make results uninterpretable.