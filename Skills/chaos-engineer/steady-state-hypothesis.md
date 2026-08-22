# Steady-State Hypothesis

## Purpose
Define measurable normal behavior so resilience experiments can determine whether users experience unacceptable degradation.

## When to use
Use before any chaos experiment and when service health is represented only by component uptime.

## Inputs
SLOs, business KPIs, request metrics, queue metrics, dependency behavior, and normal workload baselines.

## Context to inspect
Inspect user journeys, service-level indicators, dashboards, alert thresholds, seasonality, and known normal variance.

## Core knowledge
A useful steady state is externally meaningful and measurable. CPU or pod count alone rarely represents customer success. Prefer latency, success rate, throughput, freshness, correctness, and business completion signals.

## Procedure
1. Identify the user or business capability under test.
2. Choose a small set of representative signals.
3. Establish baseline ranges under comparable load.
4. Define tolerated deviation and measurement windows.
5. Separate expected transient effects from experiment failure.
6. Validate signals against known incidents.
7. Document the hypothesis in testable language.

## Decision points
Use technical signals when they directly represent the capability; otherwise pair them with user-facing or business signals. Choose tighter thresholds for irreversible operations.

## Common failure patterns
Using vague terms such as healthy, relying on averages that hide tails, selecting metrics unavailable during failure, and defining thresholds after seeing experiment results.

## Verification
Confirm signals can be queried reliably, thresholds are agreed before execution, and a known degradation would falsify the hypothesis.

## Expected output
A falsifiable steady-state hypothesis with signals, baseline, tolerances, and observation window.

## Stop conditions
Stop if meaningful service health cannot be measured or baseline behavior is already unstable.