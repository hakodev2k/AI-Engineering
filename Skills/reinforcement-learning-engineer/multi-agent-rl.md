# Multi-Agent Reinforcement Learning

## Purpose
Design and evaluate RL systems where multiple learning or strategic agents interact, creating non-stationarity, coordination, competition, and credit-assignment challenges.

## When to use
Use when outcomes depend materially on other adaptive agents, teams, markets, fleets, or adversaries.

## Inputs
- Agent roles and objectives
- Shared or private observations
- Action and communication spaces
- Environment dynamics and reward structure

## Preconditions
Clarify whether agents cooperate, compete, or mix objectives. Define which information is available centrally during training and locally at execution.

## Context to inspect
Inspect agent symmetry, partial observability, opponent-policy changes, communication channels, joint action size, reward sharing, and deployment topology.

## Core knowledge
Each learning agent changes the environment experienced by others, invalidating stationary assumptions. Centralized training with decentralized execution can improve coordination while preserving runtime constraints. Self-play, population methods, opponent modeling, and value decomposition address different regimes.

## Procedure
1. Define each agent's observation, action, reward, and execution boundary.
2. Determine whether centralized training information is permissible.
3. Establish independent-learning and scripted-opponent baselines.
4. Choose coordination or competition architecture based on interaction structure.
5. Track per-agent and system-level metrics.
6. Evaluate policy robustness against multiple opponent or teammate policies.
7. Test communication failures and asymmetric information.
8. Measure exploitability, coordination failures, and emergent degeneracy.
9. Run population-level evaluation rather than one fixed matchup.
10. Document assumptions about other agents at deployment.

## Decision points
Use shared parameters for symmetric agents when beneficial. Use centralized critics when joint context improves learning and does not leak into execution. Prefer population/self-play when fixed opponents cause overfitting.

## Common failure patterns
- Training against one opponent creates brittle policies.
- Shared reward hides individual contribution problems.
- Execution requires information available only during training.
- Aggregate reward masks unfair or unstable agent behavior.

## Verification
Verify performance across agent populations, seeds, communication failures, and unseen opponent/teammate policies. Confirm execution-time information constraints are respected.

## Expected output
A multi-agent RL design with training/execution boundaries, population evaluation, coordination diagnostics, and robustness evidence.

## Stop conditions
Stop if deployment behavior of other agents is unknowable and robustness cannot be bounded, or if centralized training leaks unavailable execution information.