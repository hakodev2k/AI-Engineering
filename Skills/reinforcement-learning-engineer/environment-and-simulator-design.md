# Environment and Simulator Design

## Purpose
Design RL environments and simulators that expose valid observations/actions, reproduce decision-relevant dynamics, support reproducible experiments, and fail transparently when fidelity is insufficient.

## When to use
Use when building or reviewing a training simulator, wrapping an existing system as an RL environment, or investigating sim-to-real performance gaps.

## Inputs
- Process dynamics or system model
- Observation/action definitions
- Reward specification
- Historical trajectories or telemetry
- Timing, stochasticity, and reset requirements

## Preconditions
The RL task formulation must be defined. Critical production constraints and safety boundaries must be known.

## Context to inspect
Inspect data-generation mechanisms, simulator assumptions, hidden state, stochastic processes, action latency, reset behavior, randomness control, and divergence from production.

## Core knowledge
A simulator needs decision fidelity, not visual realism. Bias in transition dynamics, event timing, hidden information, reset distribution, or constraint modeling can create policies that exploit simulation artifacts. Deterministic seeding and scenario control are essential for reproducibility.

## Procedure
1. Define the environment API and step semantics.
2. Specify observation timing relative to actions and rewards.
3. Model action validation and execution delay.
4. Define termination versus truncation conditions.
5. Model stochastic dynamics and uncertainty explicitly.
6. Build reproducible random seeding and scenario configuration.
7. Validate reset-state distribution against deployment conditions.
8. Compare simulator trajectories with real or reference trajectories.
9. Add invariant checks for impossible states and illegal transitions.
10. Instrument state, action, reward, and event traces.
11. Create scenario tests for common, rare, and adversarial conditions.
12. Quantify known fidelity gaps and their expected policy impact.

## Decision points
- Prefer simpler models when additional fidelity does not change policy decisions.
- Use domain randomization for uncertain parameters when robustness matters more than exact nominal fit.
- Use learned dynamics only when data coverage and uncertainty handling are sufficient.

## Common failure patterns
- Agent observes privileged simulator state.
- Reset states are easier than production states.
- Action latency is omitted.
- Rare but consequential events never occur in training.
- Simulator bugs become exploitable strategies.

## Verification
Run invariant tests, deterministic replay tests, trajectory distribution comparisons, and policy sanity checks. Verify that known production constraints are represented and that simulator changes trigger regression evaluation.

## Expected output
A tested environment/simulator with documented semantics, fidelity evidence, known gaps, reproducibility controls, and scenario coverage.

## Stop conditions
Stop when critical dynamics cannot be modeled credibly, production data contradicts simulator behavior materially, or simulator privileges information unavailable to the deployed policy.