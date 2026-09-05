# Forecast Calibration and Error Review

## Purpose
Continuously improve AI capacity forecasts by measuring prediction error, identifying bias, and updating assumptions before error compounds into shortages or chronic overprovisioning.

## When to use
Use monthly or quarterly, after major launches, after model changes, or whenever actual demand diverges materially from plan.

## Inputs
Historical forecasts, actual demand, model and product changes, launch dates, token distributions, utilization, capacity additions, forecast assumptions.

## Preconditions
Forecast versions and actual demand are stored at comparable granularity.

## Context to inspect
Workload segmentation, product forecast inputs, model-routing changes, pricing changes, retries, seasonality, one-off events, telemetry definition changes.

## Core knowledge
Forecast error must be decomposed. A miss may come from volume, token shape, model mix, launch timing, retry amplification, or faulty measurement. Senior planners distinguish random variance from systematic bias and change reserve or model structure accordingly.

## Procedure
1. Compare actual demand with baseline, expected, and high scenarios.
2. Calculate absolute and percentage error by workload and horizon.
3. Identify systematic over- or under-forecast bias.
4. Attribute major misses to business, model, workload-shape, or telemetry causes.
5. Re-estimate growth and seasonality parameters.
6. Revisit reserve margins based on observed uncertainty.
7. Update forecast assumptions and confidence ranges.
8. Record lessons for future launches and hardware commitments.
9. Back-test the revised method against historical periods.

## Decision points
Increase uncertainty bands when structural changes make history less predictive. Reduce reserve only after repeated evidence shows lower forecast variance.

## Common failure patterns
Judging forecasts only at fleet level, hiding misses through overprovisioning, changing methodology without back-testing, and treating one anomalous event as a new trend.

## Verification
The revised model reduces back-tested error or produces better-calibrated uncertainty intervals across representative workloads.

## Expected output
A forecast-error review with attribution, updated parameters, confidence bands, and planning changes.

## Stop conditions
Escalate when historical forecasts or actuals are inconsistent enough to prevent reliable calibration.