# Value-Based Methods

## Purpose
Design and operate value-based RL systems for discrete or structured action spaces, with careful handling of bootstrapping, target estimation, exploration, replay, and overestimation bias.

## When to use
Use when action spaces are discrete and value estimation provides a practical decision rule. Avoid when actions are high-dimensional continuous controls unless discretization is defensible.

## Inputs
- Environment and reward specification
- Action space definition
- Replay data or interaction budget
- Baseline policies and evaluation metrics

## Preconditions
The environment must expose consistent transitions, rewards, and termination semantics. Offline data must include adequate action coverage if replay is used without live exploration.

## Context to inspect
Inspect reward scale, action frequency, replay distribution, target-network behavior, TD error, visitation imbalance, terminal handling, and state aliasing.

## Core knowledge
Value-based methods learn expected return estimates and derive policies through action selection. Bootstrapping creates correlated targets; replay improves reuse but can introduce stale or biased distributions. Double estimation, target networks, prioritized replay, and distributional methods address specific pathologies rather than universally improving results.

## Procedure
1. Establish random and heuristic baselines.
2. Define the value target and discount/horizon semantics.
3. Choose tabular, fitted, or deep value approximation based on state complexity.
4. Define exploration policy and decay schedule.
5. Configure replay capacity, sampling, and warm-up behavior.
6. Validate target-network synchronization or equivalent stabilization.
7. Track TD error, Q-value scale, action frequencies, returns, and loss.
8. Check for systematic Q overestimation or divergence.
9. Test terminal and truncation transitions explicitly.
10. Compare simple DQN-style baselines before adding extensions.
11. Evaluate across seeds and held-out scenarios.

## Decision points
Use double estimation when overestimation is material. Use prioritized replay only when importance corrections and sampling bias are understood. Prefer simpler replay when dataset shift or rare-event weighting makes prioritization unstable.

## Common failure patterns
- Q-values grow while policy quality declines.
- Exploration decays before useful state coverage.
- Replay overrepresents obsolete behavior.
- Truncated episodes bootstrap incorrectly.
- Action masking is missing or inconsistent.

## Verification
Confirm stable Q-value ranges, reproducible policy gains, valid action selection, and expected behavior on synthetic transitions with known targets.

## Expected output
A validated value-based RL implementation with diagnostics, baseline comparisons, and documented exploration/replay assumptions.

## Stop conditions
Stop if bootstrapped targets diverge, action coverage is inadequate, environment semantics are inconsistent, or observed gains disappear across seeds.