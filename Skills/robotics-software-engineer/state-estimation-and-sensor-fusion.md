# State Estimation and Sensor Fusion

## Purpose
Build robust estimators that combine noisy, delayed, and partial sensor measurements into states usable by control, planning, and autonomy.

## When to use
Use for pose, velocity, orientation, bias, object, or system-state estimation and when fusing IMU, odometry, GNSS, vision, LiDAR, encoders, or other sensors.

## Inputs
- Sensor models and rates
- Timestamp and frame definitions
- Noise characteristics
- Motion/process model
- Ground-truth or reference datasets

## Preconditions
Timing and frame correctness must be established before estimator tuning.

## Context to inspect
Inspect measurement preprocessing, covariances, initialization, process models, update rates, outlier gates, delayed-measurement handling, and reset behavior.

## Core knowledge
Understand Bayes filtering, Kalman/EKF/UKF concepts, particle filters where appropriate, process and measurement covariance, observability, bias states, innovation tests, delayed updates, and divergence.

## Procedure
1. Define the state vector and required consumers.
2. Establish consistent timestamps and frames.
3. Specify process and measurement models.
4. Initialize state and covariance deliberately.
5. Start with physically justified noise values.
6. Add measurements one source at a time.
7. Inspect innovations, residuals, and covariance consistency.
8. Add outlier rejection without hiding systematic errors.
9. Handle stale, missing, reordered, or delayed measurements explicitly.
10. Test startup, loss, recovery, and sensor-reintroduction behavior.
11. Evaluate against independent ground truth across representative trajectories.

## Decision points
Use simpler filters when the model is near-linear and uncertainty is well behaved. Use nonlinear or sampling approaches only when justified by system dynamics and compute budgets. Do not fuse correlated sources as independent without modeling the correlation.

## Common failure patterns
- Tuning around timestamp bugs
- Unrealistically small covariance
- Double-counting correlated odometry
- No estimator-health signal
- Catastrophic reset on temporary sensor loss
- Validation only on one trajectory

## Verification
Compare error distributions against ground truth, inspect innovations and covariance consistency, inject dropouts/outliers, and verify bounded behavior during recovery.

## Expected output
A validated estimator with documented state, models, covariance assumptions, health criteria, and failure behavior.

## Stop conditions
Stop if sensor timing is untrustworthy, the required state is unobservable, measurement correlations are unknown and material, or validation lacks an independent reference.