# Model-Based Reinforcement Learning

## Purpose
Use learned or known dynamics to improve planning and sample efficiency while controlling model bias and compounding prediction error.

## When to use
Use when interactions are expensive and environment dynamics can be modeled sufficiently for decision making.

## Inputs
- Transition data
- Candidate dynamics model
- Reward and constraint model
- Planning horizon and compute budget

## Preconditions
Data coverage and uncertainty must be characterized. The simulator or learned model must expose errors rather than silently extrapolate.

## Context to inspect
Inspect one-step and multi-step prediction error, uncertainty, state coverage, model exploitation, planning latency, and mismatch between synthetic and real rollouts.

## Core knowledge
Model-based RL trades interaction cost for modeling and planning complexity. Small one-step errors can compound over long rollouts. Short-horizon planning, ensembles, uncertainty penalties, real-data mixing, and frequent replanning can limit exploitation of model errors.

## Procedure
1. Establish model-free and non-RL baselines.
2. Define which state variables need prediction fidelity for decisions.
3. Train or calibrate the dynamics model on temporally valid splits.
4. Measure multi-step error across scenario slices.
5. Quantify uncertainty or disagreement outside familiar data.
6. Choose planning horizon based on error growth and compute budget.
7. Constrain synthetic rollouts in low-confidence regions.
8. Compare policy updates from real versus model-generated data.
9. Inspect trajectories for model exploitation.
10. Validate candidate policies in the real or authoritative environment.

## Decision points
Prefer shorter synthetic rollouts when uncertainty compounds quickly. Use known physics or rules where reliable rather than relearning them. Prefer model-free methods when modeling cost exceeds interaction savings.

## Common failure patterns
- Excellent one-step error but poor long-horizon decisions.
- Policy exploits unrealistic model behavior.
- Synthetic data overwhelms real data.
- Uncertainty estimates are uncalibrated.

## Verification
Require multi-step fidelity evidence, policy validation outside the learned model, and improvement over equal-budget baselines.

## Expected output
A model-based RL pipeline with fidelity metrics, uncertainty controls, planning configuration, and real-environment validation.

## Stop conditions
Stop when decision-relevant dynamics cannot be modeled, model exploitation persists, or planning cost exceeds practical limits.