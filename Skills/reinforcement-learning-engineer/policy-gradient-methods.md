# Policy Gradient Methods

## Purpose
Select, train, and diagnose policy-gradient agents for stochastic or continuous-control problems while managing variance, instability, exploration, and policy-update risk.

## When to use
Use when direct policy optimization is appropriate, especially with continuous actions, large policy spaces, or actor-critic methods. Avoid when a simpler value-based or non-RL solution is superior.

## Inputs
- Environment specification
- Policy/value model architecture
- Reward and episode definitions
- Training budget and baseline metrics

## Preconditions
Environment semantics and reward design must be validated. A reproducible evaluation protocol must exist.

## Context to inspect
Inspect action distribution, reward scale, horizon, advantage estimates, entropy, gradient norms, KL divergence, value loss, and failure trajectories.

## Core knowledge
Policy gradients optimize expected return using sampled trajectories. Variance reduction, advantage estimation, trust-region-like update control, entropy regularization, clipping, and value-function quality strongly affect stability.

## Procedure
1. Establish random and heuristic baselines.
2. Choose on-policy or off-policy policy-gradient family based on data reuse and stability needs.
3. Configure policy distributions that respect action bounds.
4. Normalize observations and, when justified, advantages.
5. Validate bootstrapping and terminal handling.
6. Track policy loss, value loss, entropy, KL, explained variance, and returns.
7. Tune rollout length, batch size, learning rate, and update epochs together.
8. Inspect action saturation and collapsed exploration.
9. Evaluate multiple random seeds.
10. Compare performance against simpler algorithms.
11. Freeze a candidate only after out-of-sample scenario evaluation.

## Decision points
Use conservative update constraints when policy shifts can sharply reduce performance. Prefer on-policy methods for robustness and simpler correction; prefer off-policy methods when interactions are expensive and replay is valid.

## Common failure patterns
- Unstable value targets corrupt advantages.
- Excessive update epochs overfit rollout data.
- Entropy collapses too early.
- Action squashing is handled incorrectly.
- Single-seed gains are mistaken for real improvement.

## Verification
Require reproducible gains across seeds, stable diagnostics, constraint compliance, and evaluation on held-out scenarios. Compare implemented behavior with expected algorithm invariants.

## Expected output
A trained policy-gradient agent with documented hyperparameters, diagnostics, baselines, seed-level results, and deployment limitations.

## Stop conditions
Stop if training is numerically unstable, evaluation variance prevents conclusions, reward semantics are suspect, or safe exploration assumptions are violated.