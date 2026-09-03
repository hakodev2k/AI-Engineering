# Reward Design and Specification

## Purpose
Design reward signals that align learning incentives with the real objective while minimizing reward hacking, sparse feedback, scaling pathologies, and hidden trade-offs.

## When to use
Use when creating or revising an RL objective, diagnosing agents that optimize the wrong behavior, or adding new operational constraints.

## Inputs
- Product or research objective
- Environment signals and timestamps
- Safety and resource constraints
- Existing reward implementation and trajectories
- Baseline policy behavior

## Preconditions
The underlying decision problem and business objective must be defined. Hard constraints should already be identified separately from soft preferences.

## Context to inspect
Inspect delayed outcomes, proxy metrics, termination semantics, simulator artifacts, action costs, state visitation distribution, and any differences between training and production feedback.

## Core knowledge
Rewards are optimization targets, not descriptive metrics. Agents exploit systematic loopholes. Reward magnitude, clipping, discounting, shaping, and decomposition influence optimization dynamics. Potential-based shaping can preserve optimal policies under specific assumptions; arbitrary shaping may not.

## Procedure
1. Write the true objective in domain terms before defining numeric reward.
2. Separate hard constraints from soft preferences.
3. Identify observable proxies and where they diverge from the true objective.
4. Assign reward timing at the earliest point justified by evidence, avoiding future leakage.
5. Normalize or scale components so one term does not dominate accidentally.
6. Test alternative policies, including pathological ones, against the reward function.
7. Check terminal rewards, truncation, and timeout handling.
8. Decide whether shaping is needed for exploration or credit assignment.
9. Add explicit penalties only when their semantics are stable and measurable.
10. Validate reward behavior across scenario slices and edge cases.
11. Log component-wise rewards for diagnosis.
12. Review the final reward specification with domain and safety stakeholders.

## Decision points
- Prefer sparse task-completion rewards when exploration is feasible and the objective is unambiguous.
- Use shaping when sparse rewards make learning impractical, but verify it does not redefine the task.
- Encode non-negotiable limits as environment/action constraints where possible, not merely large negative rewards.

## Common failure patterns
- Proxy reward replaces the real objective.
- Reward terms differ by orders of magnitude without intent.
- Timeouts are treated as failures or successes incorrectly.
- Penalties encourage inactivity instead of safe task completion.
- Simulator-only signals leak information unavailable in production.

## Verification
Compare the reward assigned to expert, random, conservative, adversarial, and known-bad trajectories. Confirm higher reward consistently corresponds to preferred outcomes across representative scenarios. Verify component logging and regression tests.

## Expected output
A versioned reward specification, rationale, component definitions, edge-case tests, and evidence that candidate policies are ranked as intended.

## Stop conditions
Stop when the objective cannot be translated into measurable feedback, proxy gaming remains unresolved, or stakeholders disagree on trade-offs between reward components.