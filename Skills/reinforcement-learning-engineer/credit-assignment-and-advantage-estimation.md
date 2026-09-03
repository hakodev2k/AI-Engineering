# Credit Assignment and Advantage Estimation

## Purpose
Improve learning from delayed and noisy rewards by designing return targets and advantage estimates that balance bias, variance, and temporal attribution.

## When to use
Use when long horizons, sparse rewards, or unstable policy updates indicate poor credit assignment.

## Inputs
- Reward sequence and episode semantics
- Value estimates
- Discount and trace parameters
- Rollout length and bootstrapping rules

## Preconditions
Reward timing and termination semantics must be correct before tuning estimators.

## Context to inspect
Inspect advantage distributions, return variance, critic calibration, reward delay, truncation handling, and whether long-term outcomes depend on early actions.

## Core knowledge
Monte Carlo returns have low bias and high variance; bootstrapped targets reduce variance but inherit value-function bias. Generalized advantage estimation and n-step returns provide tunable trade-offs. Incorrect handling of terminal versus truncated episodes is a common source of silent error.

## Procedure
1. Verify reward timestamps and episode boundaries.
2. Implement reference return calculations for small deterministic trajectories.
3. Compare Monte Carlo, n-step, and bootstrapped estimates.
4. Measure variance and critic bias under current settings.
5. Tune discount and trace parameters in relation to task horizon.
6. Normalize advantages only after confirming raw statistics.
7. Inspect whether early actions receive meaningful learning signal.
8. Test truncation and timeout cases explicitly.
9. Re-evaluate after reward or environment changes.

## Decision points
Prefer longer-horizon estimates when delayed consequences dominate and variance is manageable. Prefer more bootstrapping when episodes are long and value estimates are reliable.

## Common failure patterns
- Bootstrapping from terminal states.
- Treating time-limit truncation as task termination.
- Normalization hides pathological estimator scale.
- Discount factor is chosen conventionally rather than from task horizon.

## Verification
Unit-test returns on known trajectories and confirm estimator changes improve stability or sample efficiency across seeds without degrading final policy quality.

## Expected output
A validated credit-assignment configuration with tests, diagnostics, and rationale for return/advantage settings.

## Stop conditions
Stop if reward semantics remain ambiguous, critic bias dominates all candidate estimators, or delayed outcomes cannot be attributed with available observations.