# Reinforcement Learning Problem Formulation

## Purpose
Turn an ambiguous sequential decision problem into a tractable reinforcement-learning (RL) formulation with explicit objectives, assumptions, constraints, and success criteria. A Senior RL Engineer should determine whether RL is justified before selecting an algorithm.

## When to use
Use when scoping a new RL system, reviewing an underperforming project, or translating a simulator/business process into an agent task. Do not use RL by default when supervised learning, optimization, control, or rules can solve the problem more simply and safely.

## Inputs
- Business or research objective
- Environment or process description
- Available interaction or logged data
- Action constraints and safety rules
- Latency, compute, and deployment constraints
- Candidate metrics and baselines

## Context to inspect
Inspect how decisions affect future state, whether feedback is delayed, whether the agent can explore, whether actions have irreversible consequences, and whether reliable simulation or logged trajectories exist.

## Core knowledge
RL is appropriate when actions influence future observations/rewards and the objective depends on long-term consequences. Key formulation choices are state/observation, action space, transition dynamics, reward, discounting or horizon, termination, constraints, and observability. Poor formulation can dominate algorithm choice.

## Procedure
1. Define the decision maker and the operational objective.
2. Identify decision frequency and episode/horizon boundaries.
3. Specify observations available at decision time; exclude future leakage.
4. Define legal actions and operational constraints.
5. Map how actions influence future states and outcomes.
6. Decide whether the task is better represented as an MDP, POMDP, contextual bandit, control problem, or non-RL optimization problem.
7. Define reward as a measurable proxy for the true objective, including timing and scale.
8. Identify hard constraints that must not be encoded only as penalties.
9. Specify exploration feasibility and unacceptable actions.
10. Establish non-RL and simple RL baselines.
11. Define offline and online evaluation criteria.
12. Record assumptions about stationarity, observability, simulator fidelity, and data coverage.
13. Review formulation with domain, safety, and operations stakeholders before training.

## Decision points
- Prefer contextual bandits when actions do not materially affect future state.
- Prefer classical control or optimization when dynamics and objectives are well modeled and uncertainty is limited.
- Prefer offline RL when live exploration is unsafe or expensive, but verify behavioral coverage.
- Use constrained formulations for hard safety or resource limits rather than reward shaping alone.

## Common failure patterns
- Reward proxy drives unintended behavior.
- State leaks future information.
- Action space is unnecessarily large or discontinuous.
- Episode boundaries distort incentives.
- RL is chosen where supervised learning would suffice.
- Exploration assumptions are incompatible with production risk.

## Verification
A formulation is verified when stakeholders can explain the state, actions, objective, constraints, and horizon; simple baselines are defined; no obvious information leakage exists; and offline/online metrics can falsify whether RL adds value.

## Expected output
A concise RL problem specification containing objective, formal task model, observation/action definitions, reward, constraints, horizon, baselines, risks, and evaluation plan.

## Stop conditions
Stop and escalate if the true objective cannot be measured, exploration is unsafe with no credible simulator/offline data, required observations are unavailable, or a simpler non-RL method clearly satisfies requirements.