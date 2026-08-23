# State Estimation and Sensor Fusion

## Purpose
Estimate robot state from noisy, delayed, and partially redundant sensors while making uncertainty and observability explicit.

## When to use
Use for pose, velocity, attitude, joint, bias, or environment-state estimation; especially when no single sensor is sufficient.

## Inputs
Sensor models, timestamps, noise characteristics, process model, frame definitions, expected motion, reference truth if available.

## Preconditions
Sensor calibration and time synchronization are validated.

## Context to inspect
Current filters, covariance tuning, update rates, dropouts, initialization logic, frame transforms, outlier handling, reset behavior.

## Core knowledge
Kalman-family filters, complementary filters, factor graphs, and observers all depend on model assumptions, observability, and trustworthy uncertainty. Fusion does not fix biased or mis-timestamped inputs.

## Procedure
1. Define the state vector and required outputs.
2. Identify process and measurement models.
3. Check which states are observable in each operating mode.
4. Quantify sensor noise, bias, latency, and update rate.
5. Choose estimator architecture appropriate to dynamics and compute budget.
6. Define initialization and reinitialization behavior.
7. Add innovation/outlier checks and stale-data handling.
8. Tune covariance from measured data, not arbitrary constants.
9. Test nominal motion, aggressive motion, dropout, and contradictory-sensor cases.
10. Compare estimates and covariance consistency against independent truth.

## Decision points
Prefer simpler filters when models are near-linear and resource constraints matter; use nonlinear or graph-based methods when coupling, delayed measurements, or loop constraints justify complexity.

## Common failure patterns
Overconfident covariance, double-counted information, ignored latency, unobservable bias states, silent divergence, and resetting without downstream coordination.

## Verification
Measure absolute/relative error, innovation statistics, covariance consistency, recovery after dropouts, and behavior during initialization.

## Expected output
Estimator configuration/model, uncertainty assumptions, validation dataset/results, and failure-handling policy.

## Stop conditions
Stop when required states are not observable, timestamps are unreliable, or estimator uncertainty cannot meet downstream safety/control needs.