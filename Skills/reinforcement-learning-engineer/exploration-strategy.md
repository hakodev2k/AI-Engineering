# Exploration Strategy

## Purpose
Design exploration that discovers useful behavior without violating operational risk, exhausting interaction budgets, or collapsing prematurely into a narrow policy.

## When to use
Use when an RL agent must collect data online, when learning stalls due to poor coverage, or when exploration itself creates business or safety risk.

## Inputs
- Action space and environment dynamics
- Safety constraints
- Interaction budget
- Reward sparsity and baseline policy

## Preconditions
Unsafe and irreversible actions must be identified. The environment must expose a mechanism to constrain or veto actions where needed.

## Context to inspect
Inspect visitation counts, action entropy, novelty, reward discovery, constraint violations, episode diversity, and whether exploration changes the environment for future users or agents.

## Core knowledge
Exploration balances information gain and short-term return. Epsilon-greedy, entropy regularization, parameter noise, intrinsic motivation, count-based methods, uncertainty-driven methods, and safe exploration solve different problems. Exploration should be evaluated as a data-acquisition policy, not just a hyperparameter.

## Procedure
1. Quantify where current policy coverage is weak.
2. Identify forbidden or high-cost actions.
3. Select an exploration mechanism compatible with action type and risk.
4. Define exploration budgets by environment state or time window.
5. Add action shielding or constraint checks where required.
6. Log exploratory decisions separately from exploitative ones.
7. Track coverage, entropy, reward discovery, and violation rates.
8. Compare exploration strategies using equal interaction budgets.
9. Reduce exploration only when coverage and learning evidence justify it.
10. Reassess exploration after environment or reward changes.

## Decision points
Use simple stochastic exploration when coverage is easy to measure and risk is low. Use uncertainty-driven or intrinsic methods when rewards are sparse and state spaces are large. Use safe exploration or simulation-first approaches when bad actions have material consequences.

## Common failure patterns
- Exploration decays on wall-clock time rather than learning progress.
- Random exploration produces invalid or dangerous actions.
- Intrinsic reward overwhelms task reward.
- Coverage is measured globally while critical states remain unseen.

## Verification
Confirm increased useful coverage, stable constraint compliance, and improved downstream learning relative to equal-budget baselines. Verify exploratory actions remain auditable.

## Expected output
A documented exploration policy with risk controls, budgets, diagnostics, and evidence that it improves learning coverage.

## Stop conditions
Stop when exploration cannot be made safe, action effects are irreversible without approval, or additional exploration no longer yields useful information.