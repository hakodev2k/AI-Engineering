# Exploration and Bandits

## Purpose
Learn user/item preferences online while controlling the opportunity cost and risk of uncertain recommendations.

## When to use
Use when static policies under-explore new or uncertain options and online feedback is timely.

## Inputs
Action space, context, reward definition, logging policy, safety constraints, and exploration budget.

## Context to inspect
Reward delay, non-stationarity, propensity logging, eligibility, interference, and rollback controls.

## Core knowledge
Explore-exploit algorithms require unbiased logging and clear reward semantics. Epsilon-greedy, UCB, Thompson sampling, and contextual bandits make different uncertainty assumptions. Off-policy evaluation depends on support and propensities.

## Procedure
1. Define action, context, reward, horizon, and constraints.
2. Establish a safe deterministic baseline.
3. Ensure action propensities and outcomes are logged.
4. Select exploration policy appropriate to uncertainty and action count.
5. Cap exploration for sensitive cohorts or low-quality actions.
6. Validate with replay/off-policy methods where support allows.
7. Ramp gradually and monitor regret proxies and guardrails.
8. Reassess under drift and delayed rewards.

## Decision points
Use simple random exploration when stakes are low; contextual methods when heterogeneous response justifies complexity; avoid bandits when reward is too delayed or safety cannot be bounded.

## Common failure patterns
Missing propensities, biased candidate set, reward hacking, premature exploitation, uncontrolled exploration, and assuming stationarity.

## Verification
Validate logging probabilities, simulated/replay behavior, online guardrails, and incremental learning value.

## Expected output
A bounded exploration policy with auditable logging and rollback criteria.

## Stop conditions
Stop on safety violations, invalid propensity logs, insufficient action support, or reward definition instability.